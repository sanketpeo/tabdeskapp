import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, Volume2 } from "lucide-react";
import { getToolMetadata, generateWebApplicationJsonLd } from "@/lib/seo";
import AmbientSoundWidget from "@/components/tools/AmbientSoundWidget";
import SeoContentSection from "@/components/SeoContentSection";


const SLUG = "ambient-sound-mixer";

export function generateMetadata(): Metadata {
  return getToolMetadata(SLUG);
}

export default function AmbientSoundMixerPage() {
  const jsonLd = generateWebApplicationJsonLd(SLUG);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-500">
          <Link href="/" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-slate-400" />
          <span className="text-slate-400">Tools</span>
          <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-slate-400" />
          <span className="font-semibold text-slate-900 dark:text-white">
            Ambient Sound Mixer & Pomodoro
          </span>
        </nav>



        {/* Hero Title */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
            <Volume2 className="h-3.5 w-3.5" />
            <span>Procedural Focus Audio Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Ambient Sound Mixer & Pomodoro Timer
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            Mix customized background sounds to drown out noise and trigger deep cognitive flow. Paired with a calibrated 25/5 interval timer.
          </p>
        </div>

        {/* Main Interactive Tool Component */}
        <section aria-label="Interactive Sound Mixer">
          <AmbientSoundWidget />
        </section>



        {/* Rich Structured Semantic Content for SEO & Search Quality */}
        <SeoContentSection slug={SLUG} />
      </div>
    </>
  );
}
