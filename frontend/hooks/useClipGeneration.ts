"use client";

import { useEffect, useRef, useState } from "react";
import { backendUrl } from "@/lib/backend";
import { getYouTubeId } from "@/lib/youtube";
import type { Clip } from "@/types/clip";
import type { JobUpdate, StartJobResponse } from "@/types/job";

export function useClipGeneration() {
  const [url, setUrl] = useState("");
  const [ytVideoId, setYtVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [clips, setClips] = useState<Clip[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Keep the embedded source-video preview in sync with the URL input.
  useEffect(() => {
    setYtVideoId(url ? getYouTubeId(url) : null);
  }, [url]);

  // Scroll to results once clips arrive.
  useEffect(() => {
    if (clips && clips.length > 0) {
      const t = setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
      return () => clearTimeout(t);
    }
  }, [clips]);

  const generateClips = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setClips(null);
    setProgress(0);
    setStep("Starting...");

    try {
      const response = await fetch(backendUrl("/generate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to start clip generation.");
      }

      const data: StartJobResponse = await response.json();
      const { job_id: jobId, job_token: jobToken } = data;

      if (!jobId) {
        throw new Error("No job ID returned from backend.");
      }

      const eventSource = new EventSource(
        backendUrl(`/stream/${jobId}?token=${encodeURIComponent(jobToken)}`),
      );

      eventSource.onmessage = (event) => {
        try {
          const update: JobUpdate = JSON.parse(event.data);

          if (update.progress !== undefined) {
            setProgress(update.progress);
          }

          if (update.step) {
            setStep(update.step);
          }

          if (update.status === "completed") {
            const result = update.result;
            const resolvedClips =
              result?.clips ?? result?.clip_generator?.clips;

            if (resolvedClips) {
              setClips(resolvedClips);
            } else {
              setError("Job completed but no clips were returned.");
            }

            setLoading(false);
            eventSource.close();
          }

          if (update.status === "failed") {
            setError(update.error || "Clip generation failed.");
            setLoading(false);
            eventSource.close();
          }
        } catch (err) {
          console.error("Failed to parse SSE update:", err);
          setError("Invalid update received from server.");
          setLoading(false);
          eventSource.close();
        }
      };

      eventSource.onerror = () => {
        setError("Lost connection to progress stream.");
        setLoading(false);
        eventSource.close();
      };
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      setLoading(false);
    }
  };

  const handleVideoPlay = (currentIndex: number) => {
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentIndex) {
        video.pause();
      }
    });
  };

  const downloadAllClips = async () => {
    if (!clips) return;
    for (const clip of clips) {
      const res = await fetch(backendUrl(clip.download_url));
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = clip.filename || `clip-${clip.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
      await new Promise((r) => setTimeout(r, 400));
    }
  };

  return {
    url,
    setUrl,
    ytVideoId,
    loading,
    clips,
    error,
    progress,
    step,
    videoRefs,
    resultsRef,
    generateClips,
    handleVideoPlay,
    downloadAllClips,
  };
}
