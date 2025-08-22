# This module contains shared state and data structures for the workers

workers = [] 


def add_worker(worker_info):
    """Add a worker (replace if same host_name already exists)."""
    global workers
    
    workers = [w for w in workers if w["host_name"] != worker_info["host_name"]]
    workers.append(worker_info)


def remove_worker(worker_id):
    """Remove a worker by host_name."""
    global workers
    workers = [w for w in workers if w["host_name"] != worker_id]


def get_workers():
    """Returns a list of all registered workers."""
    return workers
