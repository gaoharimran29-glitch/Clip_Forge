from pathlib import Path
from state import GraphState
from langgraph.types import Command
from langgraph.graph import END
from typing import Literal

def cleanup(state: GraphState) -> Command[Literal["__end__"]]:
    """Delete temporary files."""
    print("Removing Temporary files...")

    for path in [state["audio_path"], state["video_path"]]:
        Path(path).unlink(missing_ok=True)
        print(f"Path deleted: {str(path)}")

    return Command(update={
        "success": True,
    }, goto=END)