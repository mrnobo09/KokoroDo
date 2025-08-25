import webview
import threading
import uvicorn
from worker.main import app

# Starts fastapi backend in worker.main
def start_backend():
    uvicorn.run(app, host="127.0.0.1", port=5032)

if __name__ == '__main__':

    # Starts fastapi backend on seperate thread
    threading.Thread(target=start_backend,daemon=True).start()

    # Using pywebview to run react + vite app as desktop application
    webview.create_window(
        title="KokoroDo - Worker",
        url = "http://localhost:5173", 
    )

    webview.start(gui="qt")


