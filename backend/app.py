import os
import json
import uuid
import asyncio

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from graph_runner import run_graph
from job_manager import create_job, get_job

app = FastAPI(title="ClipForge API", version="1.0.0")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost",
    "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    url: str

@app.get("/")
async def home():
    return {"message": "Welcome to ClipForge API"}

@app.post("/generate")
async def generate(request: GenerateRequest):
    job_id = str(uuid.uuid4())
    create_job(job_id)
    asyncio.create_task(run_graph(job_id, request.url))
    return {"job_id": job_id}

@app.get("/stream/{job_id}")
async def stream_job(job_id: str):
    job = get_job(job_id)

    if not job:
        return {"error": "Invalid job_id"}

    async def event_generator():
        queue = job["queue"]

        initial_payload = {
            "status": job["status"],
            "progress": job["progress"],
            "step": job["step"],
        }
        yield f"data: {json.dumps(initial_payload)}\n\n"

        while True:
            update = await queue.get()
            yield f"data: {json.dumps(update)}\n\n"

            if update["status"] in ("completed", "failed"):
                break

    return StreamingResponse(event_generator(), media_type="text/event-stream")

os.makedirs("outputs", exist_ok=True)
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")