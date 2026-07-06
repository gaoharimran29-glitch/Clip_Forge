"use client";
export const dynamic = "force-dynamic";

import { AmbientBackground } from "@/components/AmbientBackground";
import { Hero } from "@/components/Hero";
import { ResultsSection } from "@/components/ResultsSection";
import { SiteHeader } from "@/components/SiteHeader";
import { SourceVideoEmbed } from "@/components/SourceVideoEmbed";
import { UrlInputCard } from "@/components/UrlInputCard";
import { useClipGeneration } from "@/hooks/useClipGeneration";

export default function Home() {
  const {
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
  } = useClipGeneration();

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#050507] text-white antialiased selection:bg-[#7C5CFC]/30 selection:text-white">
      <AmbientBackground loading={loading} />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-32 pt-10 md:px-10">
        <SiteHeader />
        <Hero />

        <UrlInputCard
          url={url}
          onUrlChange={setUrl}
          loading={loading}
          progress={progress}
          step={step}
          error={error}
          onGenerate={generateClips}
        />

        <SourceVideoEmbed videoId={ytVideoId} />

        <ResultsSection
          ref={resultsRef}
          clips={clips}
          videoRefs={videoRefs}
          onVideoPlay={handleVideoPlay}
          onDownloadAll={downloadAllClips}
        />
      </div>
    </main>
  );
}
