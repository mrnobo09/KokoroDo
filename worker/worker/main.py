from fastapi import FastAPI
from routes.coord_client import coord_client_handler

app = FastAPI()
uri = "ws://localhost:8000/ws/worker"
@app.on_event("startup")
async def startup_event():
    #connects to the coordinator server via websocket
    await coord_client_handler()

@app.get("/ping")
def ping():
    return {"Message": "Ping"}
