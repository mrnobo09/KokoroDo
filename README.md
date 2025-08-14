# KokoroDo

> **Dynamic AI inference across your local network**  
> Route requests to the smallest capable model first, escalate when needed.

KokoroDo is a LAN-first, plug-and-play system for **dynamic AI inference** across multiple machines. It routes requests to the **smallest capable model first** and escalates to larger models only when needed, balancing speed, cost, and accuracy. The system is designed to be **extensible** (adapters for different models/frameworks), **self-hostable**, and friendly to hobbyist hardware.

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