export interface NavItem {
  name: string;
  href: string;
  short: string;
  slug: string;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    name: "Live Desk",
    href: "/",
    short: "Dashboard",
    slug: "home",
  },
  {
    name: "Ambient & Pomodoro",
    href: "/tools/ambient-sound-mixer",
    short: "Sound Mixer",
    slug: "ambient-sound-mixer",
  },
  {
    name: "Scratchpad",
    href: "/tools/markdown-scratchpad",
    short: "Scratchpad",
    slug: "markdown-scratchpad",
  },
  {
    name: "Billable Timer",
    href: "/tools/freelance-billable-timer",
    short: "Billable Timer",
    slug: "freelance-billable-timer",
  },
  {
    name: "Timezone Clock",
    href: "/tools/team-timezone-clock",
    short: "Timezones",
    slug: "team-timezone-clock",
  },
  {
    name: "Habit Tracker",
    href: "/tools/daily-habit-tracker",
    short: "Habits",
    slug: "daily-habit-tracker",
  },
];
