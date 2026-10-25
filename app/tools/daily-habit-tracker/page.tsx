import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, CheckCircle2 } from "lucide-react";
import { getToolMetadata, generateWebApplicationJsonLd } from "@/lib/seo";
import HabitTrackerWidget from "@/components/tools/HabitTrackerWidget";
import SeoContentSection from "@/components/SeoContentSection";


const SLUG = "daily-habit-tracker";

export function generateMetadata(): Metadata {
  return getToolMetadata(SLUG);
}

export default function DailyHabitTrackerPage() {
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
            Daily Habit & Hydration Tracker
          </span>
        </nav>



        {/* Hero Title */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Client-Side Discipline & Routine System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Daily Habit & Hydration Micro-Tracker
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            Track daily hydration, deep work, and healthy routines. Features automatic midnight resets, streak counters, and zero-telemetry local storage.
          </p>
        </div>

        {/* Main Interactive Tool Component */}
        <section aria-label="Interactive Habit Tracker">
          <HabitTrackerWidget />
        </section>



        {/* Rich Structured Semantic Content */}
        <SeoContentSection slug={SLUG} />
      </div>
    </>
  );
}
