import React from "react";
import { Check, HelpCircle, Lightbulb, Zap, ShieldCheck } from "lucide-react";

export interface SeoSectionData {
  title: string;
  tagline: string;
  howItWorks: { step: string; title: string; description: string }[];
  benefits: { title: string; description: string }[];
  tips: string[];
  faqs: { question: string; answer: string }[];
}

export const TOOL_SEO_CONTENT: Record<string, SeoSectionData> = {
  "ambient-sound-mixer": {
    title: "Why Ambient Sound & Pomodoro Supercharge Deep Focus",
    tagline: "Science-backed acoustic masking paired with the proven 25-minute Pomodoro rhythm.",
    howItWorks: [
      {
        step: "01",
        title: "Blend Your Acoustic Space",
        description:
          "Dial in individual volume channels for rain, waves, cafe chatter, and crackling campfire to mask irregular conversational distractions in your environment.",
      },
      {
        step: "02",
        title: "Ignite the 25-Minute Work Sprint",
        description:
          "Hit start on the calibrated Pomodoro timer. Work with singular focus on one high-leverage objective until the crystal Tibetan chime rings.",
      },
      {
        step: "03",
        title: "Recharge on Scheduled 5-Minute Breaks",
        description:
          "Rest your eyes, hydrate, and stretch. The session tracker monitors your cumulative flow intervals throughout the day.",
      },
    ],
    benefits: [
      {
        title: "100% Offline Procedural Sound",
        description:
          "Generated algorithmically via the browser's Web Audio API with zero audio file downloads, buffering, or ads interrupting your flow.",
      },
      {
        title: "Acoustic Distraction Shielding",
        description:
          "Stochastic pink and brown noise curves mask unpredictable office or coffee-shop speech frequencies proven to trigger cognitive context-switching.",
      },
      {
        title: "Zero Account Signups",
        description:
          "Your custom volume presets, session logs, and timer states persist locally in your browser's encrypted localStorage sandbox.",
      },
      {
        title: "Auditory Pavlovian Trigger",
        description:
          "Associating a specific ambient soundscape with your work desk trains your neurobiology to enter deep work in seconds.",
      },
    ],
    tips: [
      "Keep rain volume around 40% and blend in 15% cafe murmur for a cozy library vibe.",
      "Never check social media or email during the 5-minute break; look out a window to reset dopamine.",
      "Wear open-back or noise-canceling headphones to maximize spatial immersion.",
    ],
    faqs: [
      {
        question: "Does the sound mixer use my mobile data or bandwidth?",
        answer:
          "No. All audio signals are generated directly inside your device's browser using native Web Audio math algorithms. No audio files or streaming servers are utilized.",
      },
      {
        question: "Will the timer sound if I switch browser tabs?",
        answer:
          "Yes. The Tibetan notification bell chime executes in the background and the document tab title dynamically displays remaining sprint minutes.",
      },
      {
        question: "Is there any cost or subscription fee?",
        answer:
          "WorkPulse is 100% free and open-access. No paywalls, no email capture, and no subscription tiers.",
      },
    ],
  },

  "markdown-scratchpad": {
    title: "Distraction-Free Ephemeral Markdown Notepad",
    tagline: "The fastest place to dump meeting notes, drafts, code snippets, and temporary brainstorms.",
    howItWorks: [
      {
        step: "01",
        title: "Instant Typing with Zero Friction",
        description:
          "No new document dialogs, no cloud sync lag. As soon as you land on the page, the cursor is ready and waiting for your thoughts.",
      },
      {
        step: "02",
        title: "Live Keystroke Auto-Save",
        description:
          "Every single character is instantaneously committed to localStorage. Even if your browser crashes or battery dies, your text remains safe.",
      },
      {
        step: "03",
        title: "Toggle Preview & Export Seamlessly",
        description:
          "Preview formatted markdown headers, lists, and code blocks with a click, then export as raw .md, .txt, or copy directly to your clipboard.",
      },
    ],
    benefits: [
      {
        title: "Live Document Metrics",
        description:
          "Monitor words, characters, line counts, and estimated reading time calculated in real-time as you write.",
      },
      {
        title: "Absolute Privacy & Security",
        description:
          "Your text never leaves your device. It is never sent to third-party servers, AI scrapers, or remote databases.",
      },
      {
        title: "Clean Formatting Engine",
        description:
          "Supports standard Markdown syntax including bold, italics, blockquotes, code fences, numbered checklists, and tables.",
      },
      {
        title: "Instant Keyboard Shortcuts",
        description:
          "Supports Ctrl/Cmd+S for immediate download and standard editor accessibility conventions.",
      },
    ],
    tips: [
      "Use this as your staging area before pasting drafts into Slack, Jira, or email.",
      "Toggle the Markdown Preview mode when writing README documentation or technical memos.",
      "Export to .md at the end of each work session to archive into your permanent Obsidian or Notion vault.",
    ],
    faqs: [
      {
        question: "Where is my scratchpad text stored?",
        answer:
          "Your writing is stored strictly inside your browser's client-side localStorage. It remains completely private on your physical device.",
      },
      {
        question: "Can I use this offline without an active internet connection?",
        answer:
          "Yes. Once loaded, the scratchpad functions completely offline in airplane mode or spotty Wi-Fi environments.",
      },
      {
        question: "How do I clear or reset the pad?",
        answer:
          "Click the 'Clear Pad' button in the toolbar. A confirmation prompt prevents accidental deletion.",
      },
    ],
  },

  "freelance-billable-timer": {
    title: "Transparent Real-Time Freelance Billable Stopwatch",
    tagline: "Calculate exact accrued client earnings and export instant CSV audit logs.",
    howItWorks: [
      {
        step: "01",
        title: "Configure Hourly Rate & Currency",
        description:
          "Set your target contract rate in USD ($), EUR (€), GBP (£), or INR (₹) and specify the active client or project name.",
      },
      {
        step: "02",
        title: "Start the Accrual Stopwatch",
        description:
          "Watch your total earnings increase second by second as you work, providing instant motivation and precise second-level precision.",
      },
      {
        step: "03",
        title: "Log Session & Export Invoice CSV",
        description:
          "Save the completed interval to your historical ledger, review cumulative totals, and export clean CSV reports ready for client invoicing.",
      },
    ],
    benefits: [
      {
        title: "Second-by-Second Financial Feedback",
        description:
          "Seeing exact dollar amounts accrue in real time reinforces the economic value of your deep focus hours.",
      },
      {
        title: "Multi-Currency Financial Precision",
        description:
          "Easily switch between world currencies without calculating exchange rates manually.",
      },
      {
        title: "One-Click CSV Invoice Data",
        description:
          "Export date, client, start/end timestamps, elapsed seconds, hourly rate, and invoice totals formatted for Excel or Google Sheets.",
      },
      {
        title: "Zero Subscription Overhead",
        description:
          "Replaces expensive monthly subscription time tracking SaaS apps with a lightweight, client-side alternative.",
      },
    ],
    tips: [
      "Enter a descriptive task name like 'Client X: API Refactor' before starting your session.",
      "Export your CSV at the end of each billing cycle to attach directly to client invoices.",
      "Pause the timer whenever you take a phone call or non-billable lunch break for honest accounting.",
    ],
    faqs: [
      {
        question: "What happens if I accidentally close the tab while the timer is running?",
        answer:
          "WorkPulse persists the start timestamp in localStorage. When you reopen the page, the timer calculates elapsed duration continuously without missing a second.",
      },
      {
        question: "Is my client and financial billing data secure?",
        answer:
          "Yes, 100%. No financial records or client names ever leave your machine. They are stored only in your private browser memory.",
      },
      {
        question: "Can I export logs into QuickBooks or FreshBooks?",
        answer:
          "Yes, the CSV format uses standardized column headers (Date, Client, Duration, Hourly Rate, Total) supported by all accounting software.",
      },
    ],
  },

  "team-timezone-clock": {
    title: "Global Remote Team Timezone Converter & Scrubber",
    tagline: "Eliminate timezone mental math and find harmonious meeting windows across distributed teams.",
    howItWorks: [
      {
        step: "01",
        title: "Review Simultaneous Global Clocks",
        description:
          "Inspect your local time alongside UTC, New York (EST), London (GMT), India (IST), and Tokyo (JST) in a synchronized dashboard.",
      },
      {
        step: "02",
        title: "Scrub the Interactive Time Slider",
        description:
          "Slide forwards or backwards across 24 hours to dynamically simulate future meeting times and see exact clock hands across all zones in real-time.",
      },
      {
        step: "03",
        title: "Identify Working Hour Overlaps",
        description:
          "Intuitive color badges instantly differentiate between daytime business hours (9 AM - 6 PM), evening relaxation, and late night sleeping hours.",
      },
    ],
    benefits: [
      {
        title: "Eliminate Costly Scheduling Blunders",
        description:
          "Never accidentally book a meeting with overseas teammates at 3:00 AM their local time.",
      },
      {
        title: "Dynamic Meeting Scrubber Bar",
        description:
          "Scrub through future hours with instantaneous updates across every timezone card.",
      },
      {
        title: "Custom City Expansion",
        description:
          "Add and delete custom global cities like Sydney, Berlin, Dubai, Singapore, or San Francisco with a single click.",
      },
      {
        title: "Respectful Remote Collaboration",
        description:
          "Visual badges reinforce asynchronous empathy by highlighting colleagues' sleep and personal rest hours.",
      },
    ],
    tips: [
      "Use the 'Reset to Current Time' button whenever you finish exploring prospective meeting times.",
      "Target the golden 2-hour window where US East Coast and European morning hours overlap.",
      "Toggle between 12-hour AM/PM and military 24-hour display modes based on team convention.",
    ],
    faqs: [
      {
        question: "How are daylight saving time (DST) shifts handled?",
        answer:
          "WorkPulse leverages the native browser Intl.DateTimeFormat API and IANA timezone database, which automatically adjusts for international Daylight Saving Time shifts.",
      },
      {
        question: "Can I add timezones that are not in the default list?",
        answer:
          "Yes. Use the 'Add Timezone' selector to pick from major metropolitan financial and tech centers worldwide.",
      },
      {
        question: "Does the scrubber change my computer's system clock?",
        answer:
          "No. The interactive slider is an ephemeral simulation tool designed solely for meeting planning.",
      },
    ],
  },

  "daily-habit-tracker": {
    title: "Minimalist Daily Habit & Hydration Micro-Tracker",
    tagline: "Build unshakeable daily consistency with zero friction, streak counters, and automatic midnight resets.",
    howItWorks: [
      {
        step: "01",
        title: "Track 6 Foundational Habits",
        description:
          "Check off essential high-impact rituals: 8 Glasses of Water, 90-Minute Deep Work, Daily Exercise, 20-Page Reading, Posture Calibration, and Screen Breaks.",
      },
      {
        step: "02",
        title: "Watch Your Daily Completion Meter Rise",
        description:
          "Receive visual progress bar feedback as you move closer to 100% daily discipline and maintain your active streak.",
      },
      {
        step: "03",
        title: "Automatic Midnight Reset",
        description:
          "The calendar engine automatically clears daily checkmarks at midnight while permanently preserving your consecutive day streak.",
      },
    ],
    benefits: [
      {
        title: "Instant Hydration Counter",
        description:
          "Log water glasses with simple tap increments to ensure optimal cognitive hydration and energy levels.",
      },
      {
        title: "Zero Clutter Micro-Interface",
        description:
          "Eliminates the complexity and bloated notifications of typical habit tracking applications.",
      },
      {
        title: "Client-Side Streak Integrity",
        description:
          "Streak mathematics are calculated strictly against local date stamps with automated consistency safeguards.",
      },
      {
        title: "Custom Habit Flexibility",
        description:
          "Add personalized habits like meditation, journaling, or language practice to fit your personal workflow.",
      },
    ],
    tips: [
      "Keep this tab pinned to your browser so checking off habits is always one click away.",
      "Pair your deep work habit with the 25-minute Pomodoro timer for maximum focus.",
      "Log your water glasses immediately after drinking to keep your hydration streak accurate.",
    ],
    faqs: [
      {
        question: "Will my habit streaks be lost if I clear my browser history?",
        answer:
          "Habits are stored in localStorage. Standard history clearing leaves localStorage intact on most modern browsers, though 'Clear Site Data' will reset it.",
      },
      {
        question: "How does the midnight reset work?",
        answer:
          "When you load the app, WorkPulse checks the current calendar date against the last logged date. If a new day has arrived, checkmarks reset while incrementing streaks.",
      },
      {
        question: "Can I customize the habit list?",
        answer:
          "Yes! You can add your own custom daily rituals and delete existing ones to build your ideal daily protocol.",
      },
    ],
  },
};

export default function SeoContentSection({ slug }: { slug: string }) {
  const data = TOOL_SEO_CONTENT[slug];
  if (!data) return null;

  return (
    <section className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800/80 space-y-16">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
          <Zap className="h-3.5 w-3.5" />
          <span>Productivity Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {data.title}
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400">
          {data.tagline}
        </p>
      </div>

      {/* How it Works 3-Step Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span>How It Works in 3 Simple Steps</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.howItWorks.map((step) => (
            <div
              key={step.step}
              className="relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
            >
              <div className="text-3xl font-black text-blue-600/40 dark:text-blue-400/20 mb-2 font-mono">
                {step.step}
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h4>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Core Architectural Benefits</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.benefits.map((b) => (
            <div
              key={b.title}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
            >
              <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400">
                <Check className="h-4 w-4 stroke-[3]" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {b.title}
                </h4>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Tips Section */}
      <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/20 p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-4 text-blue-700 dark:text-blue-400">
          <Lightbulb className="h-5 w-5" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Pro Workflow Tips & Deep Work Hacks
          </h3>
        </div>
        <ul className="space-y-2.5">
          {data.tips.map((tip, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium"
            >
              <span className="flex-shrink-0 h-1.5 w-1.5 mt-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* FAQs Section */}
      <div id="faq-section" className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
          <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xl font-extrabold">Frequently Asked Questions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
            >
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                {faq.question}
              </h4>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
