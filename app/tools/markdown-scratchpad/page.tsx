import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, FileEdit } from "lucide-react";
import { getToolMetadata, generateWebApplicationJsonLd } from "@/lib/seo";
import ScratchpadWidget from "@/components/tools/ScratchpadWidget";
import SeoContentSection from "@/components/SeoContentSection";


const SLUG = "markdown-scratchpad";

export function generateMetadata(): Metadata {
  return getToolMetadata(SLUG);
}

export default function MarkdownScratchpadPage() {
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
            Ephemeral Markdown Scratchpad
          </span>
        </nav>



        {/* Hero Title */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
            <FileEdit className="h-3.5 w-3.5" />
            <span>Distraction-Free Ephemeral Note Taking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Ephemeral Auto-Saving Markdown Scratchpad
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            Type drafts, meeting notes, code snippets, and checklists. Instant keystroke auto-save to local storage, live word counts, and one-click markdown export.
          </p>
        </div>

        {/* Main Interactive Tool Component */}
        <section aria-label="Interactive Markdown Scratchpad">
          <ScratchpadWidget />
        </section>



        {/* Rich Structured Semantic Content */}
        <SeoContentSection slug={SLUG} />
      </div>
    </>
  );
}
