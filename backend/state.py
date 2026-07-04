from typing import TypedDict

class GraphState(TypedDict, total=False):
    success: bool
    job_id: str
    url: str
    title: str
    video_path: str
    audio_path: str
    transcript: list
    transcript_path: str
    analysis: list
    analysis_path: str
    clips: list
    clips_path: list
    filename: list
    error: str