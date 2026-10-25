import React from "react";
import Link from "next/link";
import { Sparkles, Shield, Cpu, Lock, Heart } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/lib/navigation";

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Promise */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Work<span className="text-blue-500">Pulse</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-400 max-w-md font-medium">
              A lightning-fast, distraction-free productivity workstation engineered for modern knowledge workers, developers, and remote teams. Runs 100% in your browser using client-side localStorage and native Web Audio APIs.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-300">
                <Cpu className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Zero Server Dependencies</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-300">
                <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Private Client Storage</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-300">
                <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Core Web Vitals 95+</span>
              </div>
            </div>
          </div>

          {/* Col 2: Productivity Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Productivity Tools
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {NAVIGATION_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-700 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Legal & Standards */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Compliance & Legal
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="#faq-section"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Architecture & Security FAQs
                </a>
              </li>
              <li>
                <Link
                  href="/sitemap.xml"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  XML Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-slate-200 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-4">
          <p>© {currentYear} WorkPulse. All rights reserved. Free & open browser tools.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 inline" /> for distraction-free deep work.
          </p>
        </div>
      </div>
    </footer>
  );
}
