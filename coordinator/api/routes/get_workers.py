# This file is responsible for getting worker state and sending it to the client via WebSocket



from fastapi import APIRouter, WebSocket
import json
from shared.workers import get_workers
import asyncio
import copy

router = APIRouter()

@router.websocket("/ws/get_workers")
async def get_workers_websocket(websocket: WebSocket):
    await websocket.accept()

    last_workers = None
    try:
        while True:
            # Get workers list 
            workers = get_workers()
            if workers != last_workers:
                # Send workers list to the client
                await websocket.send_text(json.dumps(workers))
                #print(f"Sent workers list: {workers}")
                last_workers = copy.deepcopy(workers)

            await asyncio.sleep(1)  # Adjust the frequency of updates as needed
            
    except Exception as e:
        print(f"Error in get_workers_websocket: {e}")
        await websocket.close()