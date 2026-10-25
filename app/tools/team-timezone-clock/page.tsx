import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, Globe } from "lucide-react";
import { getToolMetadata, generateWebApplicationJsonLd } from "@/lib/seo";
import TimezoneClockWidget from "@/components/tools/TimezoneClockWidget";
import SeoContentSection from "@/components/SeoContentSection";


const SLUG = "team-timezone-clock";

export function generateMetadata(): Metadata {
  return getToolMetadata(SLUG);
}

export default function TeamTimezoneClockPage() {
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
            Team Timezone Clock & Scrubber
          </span>
        </nav>



        {/* Hero Title */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/60">
            <Globe className="h-3.5 w-3.5" />
            <span>Global Remote Team Collaboration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Team Multi-Timezone Clock & Meeting Scrubber
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            Simultaneously view and compare worldwide timezones with an interactive meeting scrubber slider. Visual indicators highlight working hours and night schedules.
          </p>
        </div>

        {/* Main Interactive Tool Component */}
        <section aria-label="Interactive Timezone Clock">
          <TimezoneClockWidget />
        </section>



        {/* Rich Structured Semantic Content */}
        <SeoContentSection slug={SLUG} />
      </div>
    </>
  );
}
