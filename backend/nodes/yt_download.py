from yt_dlp import YoutubeDL
from state import GraphState
import os
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from langgraph.types import Command
from langgraph.graph import END
from typing import Literal
from exceptions import NodeExecutionError

MAX_VIDEO_DURATION = 600 # 10 minutes ( 600 seconds )
MIN_VIDEO_DURATION = 150 # 150 seconds

def download_video(url: str , video_opts):
    """Helper function to download the video"""
    with YoutubeDL(video_opts) as ydl:
        video_info = ydl.extract_info(url, download=True)
        video_path = ydl.prepare_filename(video_info)

    return video_info , video_path

def download_audio(url: str , audio_opts):
    """Helper function to download the audio """

    with YoutubeDL(audio_opts) as ydl:
        audio_info = ydl.extract_info(url, download=True)
        audio_path = ydl.prepare_filename(audio_info)
        audio_path = str(Path(audio_path).with_suffix(".mp3"))

    return audio_path

def youtube_download(state: GraphState) -> Command[Literal["transcribe_audio", "__end__"]]:
    """Downloads the youtube video and audio and returns the metadata"""
    os.makedirs("outputs/videos", exist_ok=True)
    os.makedirs("outputs/audios", exist_ok=True)

    video_opts = {
    "format": "bestvideo[ext=mp4]/bestvideo/best",
    "outtmpl": f"outputs/videos/{state['job_id']}.%(ext)s",
    }

    audio_opts = {
    "format": "bestaudio",
    "outtmpl": f"outputs/audios/{state['job_id']}.%(ext)s",
    "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "128",
            }
        ],
    }

    with ThreadPoolExecutor(max_workers=2) as executor:
        with YoutubeDL({"quiet": True}) as ydl:
            video_info = ydl.extract_info(state['url'] , download=False)
            if video_info.get("duration" , 0) > MAX_VIDEO_DURATION or video_info.get("duration" , 0) < MIN_VIDEO_DURATION:
                raise NodeExecutionError("youtube_download" , f"Videos greater than {MAX_VIDEO_DURATION // 60} and less than {MIN_VIDEO_DURATION // 60} are not supported.")
                
        video_future = executor.submit(download_video, state['url'], video_opts)
        audio_future = executor.submit(download_audio, state['url'], audio_opts)

        video_info, video_path = video_future.result()
        audio_path = audio_future.result()

        return Command(update={
            "success": True,
            "title": video_info["title"],
            "video_path": video_path,
            "audio_path": audio_path,
        } , goto="transcribe_audio")