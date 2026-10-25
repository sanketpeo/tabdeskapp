"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Volume2,
  FileEdit,
  Clock,
  Globe,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  LayoutGrid,
  Maximize2,
  Cpu,
} from "lucide-react";
import AmbientSoundWidget from "@/components/tools/AmbientSoundWidget";
import ScratchpadWidget from "@/components/tools/ScratchpadWidget";
import BillableTimerWidget from "@/components/tools/BillableTimerWidget";
import TimezoneClockWidget from "@/components/tools/TimezoneClockWidget";
import HabitTrackerWidget from "@/components/tools/HabitTrackerWidget";

import { NAVIGATION_ITEMS } from "@/lib/navigation";

const TOOL_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "ambient-sound-mixer": Volume2,
  "markdown-scratchpad": FileEdit,
  "freelance-billable-timer": Clock,
  "team-timezone-clock": Globe,
  "daily-habit-tracker": CheckCircle2,
};

export default function HomePage() {
  const [activeWidgetTab, setActiveWidgetTab] = useState<string>("all");

  const widgetFilters = [
    { id: "all", label: "All-in-One Desk", icon: LayoutGrid },
    { id: "ambient", label: "Sound & Pomodoro", icon: Volume2 },
    { id: "scratchpad", label: "Scratchpad", icon: FileEdit },
    { id: "billable", label: "Billable Timer", icon: Clock },
    { id: "timezone", label: "Timezones", icon: Globe },
    { id: "habits", label: "Habits", icon: CheckCircle2 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Live Station Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/20 p-6 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100/70 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>WorkPulse Station • 100% Client-Side Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Your Distraction-Free{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              All-in-One Live Desk
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            Zero signups. Zero cloud trackers. Zero latency. Instant access to your ambient sound mixer, ephemeral markdown notes, freelance billable timer, team timezone scrubber, and daily habit micro-tracker.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Offline-First (localStorage)</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>Sub-millisecond State Sync</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Cpu className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Procedural Web Audio Engine</span>
            </div>
          </div>
        </div>

        {/* Floating background decorative blur */}
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-blue-400/10 dark:bg-blue-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Widget Quick Filter / View Modes */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {widgetFilters.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeWidgetTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveWidgetTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Workstation Widgets Grid */}
      <div className="space-y-12">
        {/* Widget 1: Ambient Sound Mixer & Pomodoro */}
        {(activeWidgetTab === "all" || activeWidgetTab === "ambient") && (
          <section id="ambient-widget" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Ambient Sound Mixer & Pomodoro Timer
                </h2>
              </div>
              <Link
                href="/tools/ambient-sound-mixer"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Full Tool Page</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <AmbientSoundWidget isCompact={activeWidgetTab === "all"} />
          </section>
        )}


        {/* Widget 2: Scratchpad & Live Notes */}
        {(activeWidgetTab === "all" || activeWidgetTab === "scratchpad") && (
          <section id="scratchpad-widget" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileEdit className="h-5 w-5 text-indigo-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Ephemeral Markdown Scratchpad
                </h2>
              </div>
              <Link
                href="/tools/markdown-scratchpad"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Full Tool Page</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <ScratchpadWidget isCompact={activeWidgetTab === "all"} />
          </section>
        )}

        {/* Widget 3: Live Billable Time Tracker */}
        {(activeWidgetTab === "all" || activeWidgetTab === "billable") && (
          <section id="billable-widget" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Live Billable Freelance Stopwatch
                </h2>
              </div>
              <Link
                href="/tools/freelance-billable-timer"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Full Tool Page</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <BillableTimerWidget isCompact={activeWidgetTab === "all"} />
          </section>
        )}

        {/* Widget 4: Multi-Timezone Clock */}
        {(activeWidgetTab === "all" || activeWidgetTab === "timezone") && (
          <section id="timezone-widget" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-cyan-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Team Multi-Timezone Clock & Scrubber
                </h2>
              </div>
              <Link
                href="/tools/team-timezone-clock"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Full Tool Page</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <TimezoneClockWidget isCompact={activeWidgetTab === "all"} />
          </section>
        )}

        {/* Widget 5: Daily Habit & Hydration Tracker */}
        {(activeWidgetTab === "all" || activeWidgetTab === "habits") && (
          <section id="habits-widget" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-purple-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Daily Habit & Hydration Micro-Tracker
                </h2>
              </div>
              <Link
                href="/tools/daily-habit-tracker"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Full Tool Page</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <HabitTrackerWidget isCompact={activeWidgetTab === "all"} />
          </section>
        )}
      </div>

      {/* Directory of Dedicated Tool Pages */}
      <section className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Explore Dedicated Standalone Tool Suites
          </h2>
          <p className="text-xs text-slate-500">
            Prefer a laser-focused workspace for an individual utility? Each tool has its own dedicated SEO-optimized route with zero distractions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NAVIGATION_ITEMS.filter((item) => item.href !== "/").map((tool) => {
            const Icon = TOOL_ICON_MAP[tool.slug] || Sparkles;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-blue-500/80 dark:hover:border-blue-500/80 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Maximize2 className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Dedicated route • Distraction-free • Instant URL bookmark
                </p>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}
