import asyncio
import json
import websockets
from services.system_info import get_system_info


# Connecting and sending system info to coordinator
async def coord_client_handler(uri="ws://localhost:8000/ws/worker"):
    while True:
        try:
            async with websockets.connect(uri) as websocket:
                print("Connected to coordinator.")


                while True:
                    system_info = get_system_info()
                    await websocket.send(json.dumps(system_info, indent=2))
                    print(f"Sent system info:\n{json.dumps(system_info, indent=2)}")

                
                    try:
                        message = await asyncio.wait_for(websocket.recv(), timeout=2)
                        #print(f"Received message: {message}")
                    except asyncio.TimeoutError:
                
                        pass

                    await asyncio.sleep(1) # Adjust the frequency as needed but 1 seconds works the best for me rnw

        except (websockets.ConnectionClosed, ConnectionRefusedError) as e:
            print(f"Connection error: {e}. Retrying in 5 seconds...")
            await asyncio.sleep(5)
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            break
