import asyncio
from typing import Any

jobs: dict[str, dict[str, Any]] = {}


def create_job(job_id: str):
    jobs[job_id] = {
        "status": "running",
        "progress": 0,
        "step": "Starting...",
        "result": None,
        "error": None,
        "queue": asyncio.Queue(),
    }


def get_job(job_id: str):
    return jobs.get(job_id)


async def update_job(job_id: str, *, progress: int, step: str, node_name: str | None = None):
    job = jobs[job_id]

    job["progress"] = progress
    job["step"] = step

    await job["queue"].put({
        "status": "running",
        "progress": progress,
        "step": step,
        "node_name": node_name,
    })


async def complete_job(job_id: str, result):
    job = jobs[job_id]
    job["status"] = "completed"
    job["progress"] = 100
    job["step"] = "Completed"
    job["result"] = result

    await job["queue"].put({
        "status": "completed",
        "progress": 100,
        "step": "Completed",
        "result": result,
    })


async def fail_job(job_id: str, error: str):
    job = jobs[job_id]
    job["status"] = "failed"
    job["error"] = error

    await job["queue"].put({
        "status": "failed",
        "error": error,
    })