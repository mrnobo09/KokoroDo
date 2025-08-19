from fastapi import FastAPI
from routes.worker_conn import router
from routes.get_workers import router as get_workers_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(router)
app.include_router(get_workers_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}

