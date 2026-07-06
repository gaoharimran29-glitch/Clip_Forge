from typing import TypedDict

class GraphState(TypedDict, total=False):
    success: bool
    job_id: str
    url: str
    title: str
    video_path: str
    audio_path: str
    transcript: list
    analysis: list
    clips: list
    clips_path: list