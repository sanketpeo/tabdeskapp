import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, ArrowLeft, Trash2, Mail } from "lucide-react";
import { SITE_CONFIG } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy | WorkPulse",
  description:
    "Learn about WorkPulse's client-side privacy model, zero-server data storage, and zero-telemetry local data policies.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Live Desk</span>
      </Link>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/80">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Strict Client-Side Privacy Policy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">
          Effective Date: October 25, 2026 • 100% Client-Side Architecture
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-400" />
            <span>1. Zero Server Storage & Client-Side Architecture</span>
          </h2>
          <p>
            WorkPulse is designed from the ground up as a <strong>100% client-side web application</strong>. All user productivity inputs—including scratchpad notes, billable client names, hourly billing rates, tracked time sessions, sound volume preferences, and habit checklist states—are processed and retained exclusively within your web browser’s local storage (<code>localStorage</code>) and device memory.
          </p>
          <p>
            At no point does WorkPulse transmit, sync, or persist your private notes or billing financial logs to external servers, cloud databases, or third-party analytical scrapers. You retain 100% ownership and physical custody of your data on your personal computing device.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-400" />
            <span>2. Web Audio API and Native Browser Capabilities</span>
          </h2>
          <p>
            Our Ambient Sound Mixer utilizes the HTML5 Web Audio API to procedurally generate sound waves (such as rain, brown noise, waves, and fireplace) locally using mathematical oscillator nodes. WorkPulse does not record audio from your microphone or access your webcam.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-amber-400" />
            <span>3. User Rights, Data Erasure, and Control</span>
          </h2>
          <p>
            Because all state resides locally on your browser, you have absolute control over data erasure. You can purge all saved notes, billing logs, and habits at any time by clearing your browser&apos;s site data or by utilizing the explicit &quot;Clear&quot; and &quot;Reset&quot; buttons built into each utility.
          </p>
        </section>

      </div>
    </div>
  );
}
