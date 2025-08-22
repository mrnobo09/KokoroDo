

export type GPU = {
  vendor: "NVIDIA" | "AMD" | "Intel";
  name: string;
  driver: string;
  vram_total_gb: number | null;
  vram_used_gb: number | null;
  vram_free_gb: number | null;
  utilization_percent: number | null;
  temperature_c: number | null;
};

export type CPU = {
  model: string;
  cores: number;
  threads: number;
  usage_percent: number;
  frequency_mhz: number | null;
};

export type RAM = {
  total_gb: number;
  used_gb: number;
  available_gb: number;
  usage_percent: number;
};

export type Disk = {
  total_gb: number;
  used_gb: number;
  free_gb: number;
  usage_percent: number;
};

export type Worker = {
  host_name: string;
  ip_address: string;
  os: string;
  os_version: string;
  python_version: string;
  cpu: CPU;
  ram: RAM;
  disk: Disk;
  gpus: GPU[];
};

export type Workers = Worker[];
