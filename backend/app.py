import json
import uuid
import asyncio
import os

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi import HTTPException
from fastapi.responses import FileResponse
from fastapi import Query
from pathlib import Path

from graph_runner import run_graph
from job_manager import create_job, get_job

app = FastAPI(title="ClipForge API", version="1.0.0")

raw_cors = os.getenv("CORS_ORIGIN")

if not raw_cors:
    raise RuntimeError("CORS_ORIGIN environment variable is not set.")

CORS_ORIGIN = raw_cors.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGIN,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    url: str

def verify_job_access(job: dict, token: str | None):
    if not token or token != job.get("job_token"):
        raise HTTPException(status_code=403, detail="Forbidden")

@app.get("/")
async def home():
    return {"message": "Welcome to ClipForge API"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/generate")
async def generate(request: GenerateRequest):
    job_id = str(uuid.uuid4())
    job_token = create_job(job_id)
    asyncio.create_task(run_graph(job_id, request.url))
    return {
        "job_id": job_id,
        "job_token": job_token
        }

@app.get("/stream/{job_id}")
async def stream_job(job_id: str , token: str = Query(None)):
    job = get_job(job_id)

    if not job:
        return {"error": "Invalid job_id"}
    
    verify_job_access(job , token)

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

@app.get("/jobs/{job_id}/clips/{clip_name}")
async def get_clip(job_id: str, clip_name: str , token: str = Query(None)):
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    verify_job_access(job,token)
    
    result = job.get("result") or {}
    clips = result.get("clips", [])

    allowed_filenames = {clip.get("filename") for clip in clips}
    if clip_name not in allowed_filenames:
        raise HTTPException(status_code=404, detail="Clip not found for this job")

    clip_path = Path("outputs") / "best_clips" / job_id / clip_name
    if not clip_path.exists():
        raise HTTPException(status_code=404, detail="Clip file missing")

    return FileResponse(str(clip_path), media_type="video/mp4", filename=clip_name)