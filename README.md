<p align="center">
  <img src="ReadMeAssets/KokoroDo.png" alt="KokoroDo Logo" width="200"/>
</p>

<h1 align="center">KokoroDo</h1>

<p align="center">
  <em>Dynamic AI inference across your local network</em><br>
  Route requests to the smallest capable model first, escalate when needed.
</p>

<p align="center">
  KokoroDo is a LAN-first, plug-and-play system for <strong>dynamic AI inference</strong> across multiple machines.  
  It routes requests to the <strong>smallest capable model first</strong> and escalates to larger models only when needed, balancing speed, cost, and accuracy.  
  The system is designed to be <strong>extensible</strong> (adapters for different models/frameworks), <strong>self-hostable</strong>, and friendly to hobbyist hardware.
</p>

---

## 🏗️ Architecture

```
KokoroDo/
├─ coordinator/           # Central orchestration server
│  ├─ api/               # FastAPI backend - job routing, health checks, metrics
│  └─ dashboard/         # React+Vite web interface - visualize workers & queues
├─ worker/               # Distributed inference agents  
│  ├─ worker/            # FastAPI backend - inference endpoints, stats reporting
│  ├─ ui/                # React+Vite desktop interface - local configuration
│  └─ app.py             # PyWebView desktop launcher (GTK on Linux)
└─ README.md
```

### 🎯 How It Works

1. **Worker Registration**: Worker starts, launches FastAPI in background thread, registers with Coordinator (capabilities + heartbeat)
2. **Smart Routing**: Coordinator maintains registry of workers and models, routes to cheapest/fastest viable model first
3. **Intelligent Escalation**: If confidence/heuristics indicate low quality, escalates to larger model or different worker
4. **Real-time Dashboard**: Monitor online workers, queue depth, latency, errors, and model usage

---

## 🚀 Quick Start

### Coordinator (Server)

#### Backend API
```bash
cd coordinator/api
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Dashboard (React + Vite)
```bash
cd coordinator/dashboard
npm install
npm run dev
```

### Worker Application (Desktop)



The worker runs as a desktop application using PyWebView, combining both FastAPI backend and React frontend.


#### GPU Monitoring Dependencies (Worker Machines Only)

Workers require GPU monitoring utilities to report hardware capabilities and usage. Install the appropriate package for your GPU vendor:

**Ubuntu/Debian:**
```bash
# NVIDIA
sudo apt update && sudo apt install -y nvidia-utils-535   # version may vary

# AMD
sudo apt install -y rocm-smi

# Intel
sudo apt install -y intel-gpu-tools
```

**Arch Linux/Manjaro:**
```bash
# NVIDIA
sudo pacman -S nvidia-utils

# AMD
sudo pacman -S rocm-smi-lib      # or AUR: yay -S rocm-smi

# Intel
sudo pacman -S intel-gpu-tools
```

**Fedora/RHEL:**
```bash
# NVIDIA
sudo dnf install -y nvidia-driver nvidia-utils

# AMD
sudo dnf install -y rocm-smi

# Intel
sudo dnf install -y intel-gpu-tools
```

> **Note**: The Coordinator does not require GPU monitoring packages - these are only needed on Worker machines for hardware detection and performance monitoring.


```bash
cd worker
pip install -r requirements.txt
python app.py
```

**What happens automatically:**
- FastAPI server starts in separate thread
- PyWebView opens with GTK backend (Linux)
- Worker registers with coordinator
- Desktop UI available for configuration (coordinator IP, model settings, logs)

### Development Workflow

#### Making UI Changes
After modifying the worker UI, you must build before running:
```bash
cd worker/ui
npm install                # Install dependencies
npm run build              # Build React+Vite to static assets
python ../app.py          # Launch PyWebView with updated UI
```

#### Separate Environments
- **Coordinator**: Has separate `.venv/` and `requirements.txt`
- **Worker**: Has separate `.venv/` and `requirements.txt`
- **Purpose**: Avoid dependency conflicts between components

---

## 💡 Core Concept

**Treat your local network as a small inference cluster.**

- **Efficiency**: Most requests don't need the biggest model - escalation saves time and compute
- **Accessibility**: Works with mixed hardware (old GPUs/CPUs), lets teams pool resources
- **Extensibility**: Adapter interface for different ML frameworks

---

## ✨ Key Features

### Current Implementation
- **Worker discovery and registration** (LAN-based)
- **Load reporting**
- **Policy-based routing** (smallest-first, failover, escalation)
- **Basic metrics** (latency, throughput, error rates, per-model usage)
- **Desktop UI** for configuration without terminal

### Planned Features
- **Confidence estimators** for smart escalation (entropy, self-rating, task heuristics)
- **Model-aware scheduling** (context length, VRAM needs, quantization)
- **Token streaming** and WebSocket endpoints
- **Adapter SDK** for third-party/community models

---

## 🎯 Why KokoroDo?

- **LAN-First**: Optimized for local network reliability and low latency
- **Self-Hostable**: Complete control over your inference infrastructure  
- **Hardware Agnostic**: Efficient use of mixed/older hardware
- **User Friendly**: Desktop apps, no complex terminal commands
- **Dynamic**: Automatic failover and intelligent request routing

---

## 📍 Current Status

**Early stage** - foundational architecture being built. This is the initial release and will be continuously updated with additional features and improvements as the project evolves.

---

<div align="center">
  <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXhiZHA0c2NweDgzMzRyaTgxdDJreWhsODBoeXR1eWIydzNpM29iayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sthmCnCpfr8M8jtTQy/giphy.gif" width="200" alt="Bongo Cat playful"/>
</div>


