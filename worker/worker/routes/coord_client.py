import asyncio
import json
import websockets

async def coord_client_handler(uri="ws://localhost:8000/ws/worker"):
    async with websockets.connect(uri) as websocket:
        await websocket.send("Hello, server!")
        response = await websocket.recv()
        print(f"Response from server: {response}")
