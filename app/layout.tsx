import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SITE_CONFIG } from "@/lib/seo";

export const viewport: Viewport = {
  themeColor: "#090d16",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "WorkPulse - Distraction-Free Multi-Tool Productivity Suite",
    template: "%s | WorkPulse",
  },
  description: SITE_CONFIG.description,
  keywords: [
    "productivity suite",
    "client-side tools",
    "ambient sound mixer",
    "pomodoro timer",
    "markdown scratchpad",
    "freelance billable timer",
    "timezone converter",
    "habit tracker",
    "privacy-first productivity",
  ],
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.author,
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: "WorkPulse - Distraction-Free Multi-Tool Productivity Suite",
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "WorkPulse - Multi-Tool Productivity Suite",
    description: SITE_CONFIG.description,
    creator: "@workpulse",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    inLanguage: "en-US",
  };

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* Anti-Flicker Script: Permanently lock to Dark Mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  localStorage.setItem('workpulse_theme', 'dark');
                } catch(e) {}
              })();
            `,
          }}
        />
        {/* Global Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-blue-500 selection:text-white">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
