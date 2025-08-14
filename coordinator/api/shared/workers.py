# This module contains shared state and data structures for the workers

workers = {}

def add_worker(worker_info):
    worker_id = worker_info["host_name"]
    workers[worker_id] = worker_info

def remove_worker(worker_id):
    if worker_id in workers:
        del workers[worker_id]

def get_workers():
    """Returns a list of all registered workers."""
    return workers