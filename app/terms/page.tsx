import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft, CheckCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service | WorkPulse",
  description:
    "Review the terms and conditions governing the use of WorkPulse's free client-side productivity applications.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Live Desk</span>
      </Link>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
          <FileText className="h-3.5 w-3.5" />
          <span>User Agreement & Terms</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500">
          Effective Date: October 25, 2026 • WorkPulse Open Productivity Suite
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the WorkPulse website, individual tools, or services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should discontinue using the suite.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            2. Nature of Service & &quot;As-Is&quot; License
          </h2>
          <p>
            WorkPulse provides client-side computational productivity utilities (including time trackers, sound synthesizers, scratchpads, timezone converters, and habit checklists) on a free-to-use &quot;AS-IS&quot; and &quot;AS-AVAILABLE&quot; basis.
          </p>
          <p>
            While we strive for high precision, WorkPulse does not guarantee that calculations (such as billable hours or timezone meeting schedules) are completely error-free or uninterrupted. You remain solely responsible for validating your invoices and meeting schedules.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            3. User Data Responsibility
          </h2>
          <p>
            Because all notes and session data are stored locally in your browser&apos;s <code>localStorage</code>, WorkPulse cannot recover lost data if you clear your browser caches, reset site data, or experience hardware corruption. Users are encouraged to regularly export their scratchpad notes and billing CSV files.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            4. Permitted Use & Intellectual Property
          </h2>
          <p>
            You are granted a worldwide, royalty-free license to use the tools for personal, commercial, and professional business purposes. You agree not to reverse engineer with malicious intent, execute denial-of-service attacks, or abuse the services in violation of applicable laws.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            5. Modifications to Service
          </h2>
          <p>
            WorkPulse reserves the right to modify or discontinue any tool or feature at any time without notice. Updates to these terms will be posted directly to this page.
          </p>
        </section>
      </div>
    </div>
  );
}
