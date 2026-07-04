import json
import os
from pathlib import Path
from pydantic import BaseModel, Field
from langchain_groq import ChatGroq
from state import GraphState
from langsmith import traceable
from langchain_core.messages import HumanMessage, SystemMessage
from model.prompts import SYSTEM_PROMPT
from model.llm import llm

class ClipScore(BaseModel):
    id: int = Field(description="The index of this chunk from the input transcript list")
    score: int = Field(ge=1, le=10, description="Score from 1 to 10 on viral potential")
    reason: str = Field(description="Reason should be one sentence explaining WHY this part is suitable for a short.")
    caption: str = Field(description="Powerful Caption with hashtags to upload on different social media")

class AnalysisResponse(BaseModel):
    clips: list[ClipScore]

@traceable(name="llm_analyze")
async def llm_analyze(state: GraphState) -> dict:
    """LLM layer to analyze and score each transcript chunk."""
    print("LLM Analysis Started... ")
    analysis_path = Path("outputs/analysis") / f"{state['job_id']}.json"
    analysis_path.parent.mkdir(parents=True, exist_ok=True)

    structured_model = llm.with_structured_output(AnalysisResponse)

    # Tag each transcript chunk with its index so the LLM can reference it by id
    indexed_transcript = [
        {"id": i, **chunk} for i, chunk in enumerate(state["transcript"])
    ]

    transcript_input = f"""
        Below are transcript chunks extracted from a YouTube video, each tagged with an "id".
        Choose ONLY the best 3 clips.
        Return ONLY the id, score, reason and caption for each chosen clip.
        Do NOT return start, end, or text — I already have that data.
        Transcript:
        {json.dumps(indexed_transcript, ensure_ascii=False, indent=2)}
        """

    messages = [SystemMessage(SYSTEM_PROMPT), HumanMessage(transcript_input)]

    try:
        response = await structured_model.ainvoke(messages)

        analysis = []
        for clip_score in response.clips:
            original_chunk = state["transcript"][clip_score.id]
            analysis.append({
                "start": original_chunk["start"],
                "end": original_chunk["end"],
                "text": original_chunk["text"],
                "score": clip_score.score,
                "reason": clip_score.reason,
                "caption": clip_score.caption
            })

        analysis = sorted(analysis, key=lambda x: x["score"], reverse=True)[:3]

    except Exception as e:
        return {"success": False, "error": f"LLM or Parsing Error: {str(e)}"}

    with open(analysis_path, "w", encoding="utf-8") as file:
        json.dump(analysis, file, indent=4, ensure_ascii=False)

    return {
        "success": True,
        "analysis": analysis,
        "analysis_path": str(analysis_path)
    }