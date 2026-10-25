export interface ToolSeoConfig {
  slug: string;
  name: string;
  tagline: string;
  title: string; // Under 60 characters
  description: string; // Under 160 characters
  keywords: string[];
  category: string;
  iconName: string;
  path: string;
}

export const SITE_CONFIG = {
  name: "WorkPulse",
  tagline: "Free Client-Side Productivity Suite & Multi-Tool Live Desk",
  description:
    "Zero-friction, distraction-free client-side productivity tools: Ambient Sound Mixer, Markdown Scratchpad, Freelance Billable Timer, Timezone Clock, and Habit Tracker.",
  url: "https://workpulse.app",
  author: "WorkPulse Studio",
};

export const TOOLS_CONFIG: Record<string, ToolSeoConfig> = {
  "ambient-sound-mixer": {
    slug: "ambient-sound-mixer",
    name: "Ambient Sound Mixer & Pomodoro",
    tagline: "Custom background focus noise with integrated interval timer",
    title: "Ambient Sound Mixer & Pomodoro Timer | WorkPulse",
    description:
      "Boost deep work with free procedural ambient sounds (rain, cafe, campfire, waves) and an integrated 25/5 Pomodoro interval timer.",
    keywords: [
      "ambient sound generator",
      "pomodoro timer online",
      "white noise for work",
      "rain sounds focus",
      "study timer with sound",
      "binaural white noise",
    ],
    category: "ProductivityApplication",
    iconName: "Volume2",
    path: "/tools/ambient-sound-mixer",
  },
  "markdown-scratchpad": {
    slug: "markdown-scratchpad",
    name: "Ephemeral Markdown Scratchpad",
    tagline: "Instant distraction-free notes with auto-save & live metrics",
    title: "Fast Markdown Scratchpad & Note Editor | WorkPulse",
    description:
      "Instant, distraction-free Markdown notepad. Auto-saves offline to localStorage, offers word count, reading time, and export options.",
    keywords: [
      "online markdown editor",
      "scratchpad auto save",
      "minimalist notepad",
      "browser text editor offline",
      "live word counter tool",
      "ephemeral notes",
    ],
    category: "BusinessApplication",
    iconName: "FileEdit",
    path: "/tools/markdown-scratchpad",
  },
  "freelance-billable-timer": {
    slug: "freelance-billable-timer",
    name: "Freelance Billable Time Tracker",
    tagline: "Live accrual stopwatch, currency conversion & CSV invoice export",
    title: "Freelance Billable Time Tracker & Earnings Stopwatch",
    description:
      "Track billable hours and live earnings in real time with custom hourly rates, multiple currencies (USD, EUR, GBP, INR), and CSV invoice export.",
    keywords: [
      "freelance time tracker",
      "billable hours calculator",
      "hourly rate stopwatch",
      "freelance invoice export csv",
      "client billing timer",
      "consultant time tracker",
    ],
    category: "FinanceApplication",
    iconName: "DollarSign",
    path: "/tools/freelance-billable-timer",
  },
  "team-timezone-clock": {
    slug: "team-timezone-clock",
    name: "Team Multi-Timezone Clock & Scrubber",
    tagline: "Visual overlap scrubber across global zones with working hours",
    title: "Global Team Timezone Clock & Meeting Scrubber",
    description:
      "Compare time zones side-by-side with an interactive meeting time scrubber, visual work/night hour indicators, and instant UTC/EST/GMT/IST conversion.",
    keywords: [
      "team timezone converter",
      "meeting time planner global",
      "timezone visual slider",
      "utc gmt ist est converter",
      "remote team work hours",
      "world clock meeting",
    ],
    category: "UtilitiesApplication",
    iconName: "Globe",
    path: "/tools/team-timezone-clock",
  },
  "daily-habit-tracker": {
    slug: "daily-habit-tracker",
    name: "Daily Habit & Hydration Tracker",
    tagline: "Distraction-free daily micro-habits, streaks & midnight reset",
    title: "Daily Habit & Hydration Tracker Online | WorkPulse",
    description:
      "Build consistent daily routines: track hydration, deep work, and wellness habits with streak counters and automatic midnight resets.",
    keywords: [
      "daily habit tracker online",
      "hydration water tracker",
      "client side habit streak",
      "daily routine checklist",
      "free micro habits app",
      "minimalist habit tracker",
    ],
    category: "HealthApplication",
    iconName: "CheckCircle2",
    path: "/tools/daily-habit-tracker",
  },
};

export function getToolMetadata(slug: string) {
  const tool = TOOLS_CONFIG[slug];
  if (!tool) {
    return {
      title: "Tool Not Found | WorkPulse",
      description: "The requested productivity tool could not be found.",
    };
  }

  const url = `${SITE_CONFIG.url}${tool.path}`;

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    authors: [{ name: SITE_CONFIG.author }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url,
      siteName: SITE_CONFIG.name,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${SITE_CONFIG.url}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${tool.name} - WorkPulse Productivity Suite`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.description,
      creator: "@workpulse",
    },
  };
}

export function generateWebApplicationJsonLd(slug: string) {
  const tool = TOOLS_CONFIG[slug];
  if (!tool) return null;

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    alternateName: tool.title,
    url: `${SITE_CONFIG.url}${tool.path}`,
    description: tool.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    browserRequirements: "Requires HTML5 and JavaScript compatible modern browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    creator: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    softwareVersion: "1.0.0",
    inLanguage: "en",
  };
}
