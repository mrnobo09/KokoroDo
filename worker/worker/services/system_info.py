import platform
import psutil
import cpuinfo
import shutil
import subprocess
import socket

# NVIDIA
try:
    import pynvml
    pynvml.nvmlInit()
    NVIDIA_AVAILABLE = True
except Exception:
    NVIDIA_AVAILABLE = False


def get_nvidia_gpus():
    gpus = []
    if not NVIDIA_AVAILABLE:
        return gpus
    try:
        count = pynvml.nvmlDeviceGetCount()
        for i in range(count):
            handle = pynvml.nvmlDeviceGetHandleByIndex(i)
            mem = pynvml.nvmlDeviceGetMemoryInfo(handle)
            util = pynvml.nvmlDeviceGetUtilizationRates(handle)
            temp = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)

            gpus.append({
                "vendor": "NVIDIA",
                "name": pynvml.nvmlDeviceGetName(handle).decode(),
                "driver": pynvml.nvmlSystemGetDriverVersion().decode(),
                "vram_total_gb": round(mem.total / (1024**3), 2),
                "vram_used_gb": round(mem.used / (1024**3), 2),
                "vram_free_gb": round(mem.free / (1024**3), 2),
                "utilization_percent": util.gpu,
                "temperature_c": temp,
            })
    except Exception:
        pass
    return gpus


def get_amd_gpus():
    gpus = []
    try:
        result = subprocess.run(
            ["rocm-smi", "--showproductname", "--showdriverversion",
             "--showuse", "--showtemp", "--showmemuse", "--json"],
            capture_output=True, text=True
        )
        if result.returncode == 0 and result.stdout:
            import json
            data = json.loads(result.stdout)
            for gpu_id, gpu_info in data.items():
                gpus.append({
                    "vendor": "AMD",
                    "name": gpu_info.get("Card series", "AMD GPU"),
                    "driver": gpu_info.get("Driver version", "Unknown"),
                    "vram_total_gb": round(float(gpu_info.get("VRAM Total Memory (B)", 0)) / (1024**3), 2),
                    "vram_used_gb": round(float(gpu_info.get("VRAM Used Memory (B)", 0)) / (1024**3), 2),
                    "vram_free_gb": None,  # rocm-smi may not report directly
                    "utilization_percent": float(gpu_info.get("GPU use (%)", 0)),
                    "temperature_c": float(gpu_info.get("Temperature (Sensor edge) (C)", 0)),
                })
    except FileNotFoundError:
        pass
    return gpus


def get_intel_gpus():
    gpus = []
    try:
        result = subprocess.run(
            ["intel_gpu_top", "-J", "-s", "100"],
            capture_output=True, text=True, timeout=2
        )
        if result.returncode == 0 and result.stdout:
            import json
            data = json.loads(result.stdout)
            engines = data.get("engines", {})
            utilization = sum(e.get("busy", 0) for e in engines.values())
            gpus.append({
                "vendor": "Intel",
                "name": "Intel Integrated GPU",
                "driver": "i915",
                "vram_total_gb": None,  # Integrated shares system RAM
                "vram_used_gb": None,
                "vram_free_gb": None,
                "utilization_percent": utilization,
                "temperature_c": None,  # could parse via 'sensors'
            })
    except FileNotFoundError:
        pass
    except subprocess.TimeoutExpired:
        pass
    return gpus


def get_system_info():
    info = {}

    # --- Host / Network ---
    host_name = socket.gethostname()
    try:
        ip_address = socket.gethostbyname(host_name)
    except Exception:
        ip_address = "127.0.0.1"

    info["host_name"] = host_name
    info["ip_address"] = ip_address

    # --- OS / Environment ---
    info["os"] = platform.system()
    info["os_version"] = platform.version()
    info["python_version"] = platform.python_version()

    # --- CPU ---
    cpu = cpuinfo.get_cpu_info()
    info["cpu"] = {
        "model": cpu.get("brand_raw", "Unknown"),
        "cores": psutil.cpu_count(logical=False),
        "threads": psutil.cpu_count(logical=True),
        "usage_percent": psutil.cpu_percent(interval=1),
        "frequency_mhz": psutil.cpu_freq().current if psutil.cpu_freq() else None,
    }

    # --- RAM ---
    svmem = psutil.virtual_memory()
    info["ram"] = {
        "total_gb": round(svmem.total / (1024**3), 2),
        "used_gb": round(svmem.used / (1024**3), 2),
        "available_gb": round(svmem.available / (1024**3), 2),
        "usage_percent": svmem.percent,
    }

    # --- Disk ---
    total, used, free = shutil.disk_usage("/")
    info["disk"] = {
        "total_gb": round(total / (1024**3), 2),
        "used_gb": round(used / (1024**3), 2),
        "free_gb": round(free / (1024**3), 2),
        "usage_percent": round(used / total * 100, 2),
    }

    # --- GPUs ---
    info["gpus"] = []
    info["gpus"].extend(get_nvidia_gpus())
    info["gpus"].extend(get_amd_gpus())
    info["gpus"].extend(get_intel_gpus())

    return info
