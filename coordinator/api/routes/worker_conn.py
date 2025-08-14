from fastapi import APIRouter, WebSocket
import json
from shared.workers import add_worker, remove_worker, get_workers

router = APIRouter()

@router.websocket("/ws/worker")
async def worker_websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    worker_id = None

    try:
        while True:
            data = await websocket.receive_text()
            worker_info = json.loads(data)
            worker_id = worker_info["host_name"]
            add_worker(worker_info)
            workers = get_workers()
            
            print(f"Current workers: {workers}")
    except Exception:
        if worker_id:
            remove_worker(worker_id)
        await websocket.close()