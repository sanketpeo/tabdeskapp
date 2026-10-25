import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, DollarSign } from "lucide-react";
import { getToolMetadata, generateWebApplicationJsonLd } from "@/lib/seo";
import BillableTimerWidget from "@/components/tools/BillableTimerWidget";
import SeoContentSection from "@/components/SeoContentSection";


const SLUG = "freelance-billable-timer";

export function generateMetadata(): Metadata {
  return getToolMetadata(SLUG);
}

export default function FreelanceBillableTimerPage() {
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
            Freelance Billable Time Tracker
          </span>
        </nav>



        {/* Hero Title */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <DollarSign className="h-3.5 w-3.5" />
            <span>Real-Time Earnings Stopwatch</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Live Billable Stopwatch & Invoice Logger
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            Watch client earnings accumulate second by second. Track billable sessions, customize hourly rates, and export clean CSV reports for stress-free invoicing.
          </p>
        </div>

        {/* Main Interactive Tool Component */}
        <section aria-label="Interactive Billable Time Tracker">
          <BillableTimerWidget />
        </section>



        {/* Rich Structured Semantic Content */}
        <SeoContentSection slug={SLUG} />
      </div>
    </>
  );
}
