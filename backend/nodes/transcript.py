import json
from pathlib import Path
from state import GraphState
from langsmith import traceable
from groq import AsyncGroq

MAX_CHUNK_DURATION = 30 # 30s
client = AsyncGroq()

@traceable(name="transcribe_audio")
async def transcribe_audio(state: GraphState) -> dict:
    """Generate the transcription for audio of youtube video and save in the json file"""
    print("Transcription Started... ")
    transcript_path = Path("outputs/transcripts") / f"{state['job_id']}.json"
    transcript_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        with open(state['audio_path'], "rb") as file:
            transcription = await client.audio.transcriptions.create(
            file=file,
            model="whisper-large-v3-turbo",
            response_format="verbose_json",
            timestamp_granularities = ["segment"],
            temperature=0.0
            )

        transcript = []

        current_chunk = {
        "start": None,
        "end": None,
        "text": ""
        }

        for segment in transcription.segments:
    
            if current_chunk["start"] is None:
                current_chunk["start"] = segment["start"]

            # Add text
            current_chunk["text"] += " " + segment["text"].strip()

            # Update end time
            current_chunk["end"] = segment["end"]

            # If chunk reaches 30 seconds, save it
            if current_chunk["end"] - current_chunk["start"] >= MAX_CHUNK_DURATION:

                transcript.append({
                    "start": current_chunk["start"],
                    "end": current_chunk["end"],
                    "text": current_chunk["text"].strip()
                })

                # Reset for the next chunk
                current_chunk = {
                    "start": None,
                    "end": None,
                    "text": ""
                }

        # Save the final chunk if it contains any text
        if current_chunk["start"] is not None:
            transcript.append({
                "start": current_chunk["start"],
                "end": current_chunk["end"],
                "text": current_chunk["text"].strip()
            })
        
        with open(transcript_path, "w+", encoding="utf-8") as file:
            json.dump(transcript, file, indent=4, ensure_ascii=False)

        return {
            "success":True ,
            "transcript": transcript ,
            "transcript_path": str(transcript_path)
        }

    except Exception as e:
        return {
        "success":False ,
        "error": str(e) , 
    }