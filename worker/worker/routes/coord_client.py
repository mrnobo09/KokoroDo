import asyncio
import json
import socket
import websockets


# Getting System Info to send that information to coordinator.
def get_system_info():
    host_name = socket.gethostname()
    ip_address = socket.gethostbyname(host_name)
    return {"host_name": host_name, "ip_address": ip_address}


# Connecting and sending system info to coordinator
async def coord_client_handler(uri="ws://localhost:8000/ws/worker"):
    while True:
        try:
            async with websockets.connect(uri) as websocket:
                system_info = get_system_info()
                await websocket.send(json.dumps(system_info))
                print(f"Sent system info: {system_info}")

                while True:
                    message = await websocket.recv()
                    print(f"Received message: {message}")
                    # Here you can process the message as needed
                    # For example, you could send a response back
                    await websocket.send(f"Echo: {message}")

        except (websockets.ConnectionClosed, ConnectionRefusedError) as e:
            print(f"Connection error: {e}. Retrying in 5 seconds...")
            await asyncio.sleep(5)
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            break
