"use client";

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

      <div className="relative mx-auto w-full max-w-[1400px] px-8 pb-32 pt-10 lg:px-12">
        <SiteHeader />

        {/* Hero + Video */}
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[3fr_2fr]">
          <div>
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
          </div>

          <div className="flex justify-end">
            <SourceVideoEmbed videoId={ytVideoId} />
          </div>
        </div>

        {/* Results */}
        <div className="mt-24 flex justify-center">
          <ResultsSection
            ref={resultsRef}
            clips={clips}
            videoRefs={videoRefs}
            onVideoPlay={handleVideoPlay}
            onDownloadAll={downloadAllClips}
          />
        </div>
      </div>
    </main>
  );
}
