from graph import graph
from job_manager import update_job, complete_job, fail_job

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
        async for event in graph.astream({"url": url , "job_id":job_id}, stream_mode="updates", version="v2"):
            for node_name, node_output in event.items():
                final_state[node_name] = node_output

                if node_name in NODE_PROGRESS:
                    progress, message = NODE_PROGRESS[node_name]
                    await update_job(job_id, progress=progress, step=message, node_name=node_name)

        await complete_job(job_id, final_state)

    except Exception as e:
        await fail_job(job_id, str(e))