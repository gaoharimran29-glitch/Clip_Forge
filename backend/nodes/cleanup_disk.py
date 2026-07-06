from pathlib import Path
from langsmith import traceable
from state import GraphState
from langgraph.types import Command
from langgraph.graph import END
from typing import Literal

@traceable(name="cleanup")
def cleanup(state: GraphState) -> Command[Literal["__end__"]]:
    """Delete temporary files."""
    print("Removing Temporary files...")

    for path in [state["audio_path"], state["video_path"], state["transcript_path"]]:
        Path(path).unlink(missing_ok=True)
        print(f"Path deleted: {str(path)}")

    return Command(update={
        "success": True,
    }, goto=END)