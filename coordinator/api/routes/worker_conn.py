from fastapi import APIRouter, WebSocket

router = APIRouter()

@router.websocket("/ws/worker")
async def worker_websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # Process the received data here
            await websocket.send_text(f"Message received: {data}")
    except Exception:
        await websocket.close()