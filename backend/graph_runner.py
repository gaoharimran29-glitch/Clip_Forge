from graph import graph
from job_manager import update_job, complete_job, fail_job
from exceptions import NodeExecutionError

NODE_PROGRESS = {
    "youtube_download": (20, "Downloading YouTube video..."),
    "transcribe_audio": (45, "Generating transcript..."),
    "llm_analyze": (70, "Finding viral moments..."),
    "clip_generator": (95, "Generating clips..."),
    "cleanup": (100, "Cleaning temporary files..."),
}

async def run_graph(job_id: str, url: str):
    final_state = {}

    try:
        async for event in graph.astream({"url": url, "job_id": job_id}, stream_mode="updates", version="v2"):
            data = event.get("data", {})
            for node_name, node_output in data.items():
                final_state[node_name] = node_output

                if node_name in NODE_PROGRESS:
                    progress, message = NODE_PROGRESS[node_name]
                    await update_job(job_id, progress=progress, step=message,)

        clips = final_state.get("clip_generator", {}).get("clips", [])
        await complete_job(job_id, {"clips": clips, "final_state": final_state})

    except NodeExecutionError as e:
        await fail_job(job_id, error=e.message , node=e.node)

    except Exception as e:
        await fail_job(job_id, error=e.message)