"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FileEdit,
  Eye,
  Download,
  Copy,
  Trash2,
  Check,
  BookOpen,
  Heading1,
  Heading2,
  Pilcrow,
  Bold,
  Italic,
  Highlighter,
  CheckSquare,
  List,
  Quote,
  Palette,
  Type,
  Maximize2,
  Sparkles,
} from "lucide-react";

export type PaperTheme = "legal" | "ivory" | "sage" | "grid" | "dark";
export type FontFamily = "serif" | "handwriting" | "sans" | "mono";
export type FontSize = "sm" | "base" | "lg";

const DEFAULT_SCRATCHPAD_NOTE = `# Daily Engineering & Strategy Pad ⚡

## 🎯 Top 3 High-Leverage Tasks Today
- [x] Optimize audio synthesizer with distinct rain, birdsong & hearth crackles
- [ ] Refine scratchpad into authentic tactile paper notebook with font controls
- [ ] Test eye-comfort warm light mode across all workstation widgets

---

## 💡 Architecture & Meeting Notes
==Important Insight:== Keeping all computation and state in \`localStorage\` guarantees **100% data privacy** and zero ongoing server hosting costs.

> *"Simplicity is prerequisite for reliability."* — Edsger W. Dijkstra

You can change paper colors (Yellow Legal Pad, Warm Ivory, Calming Sage, Dot Grid) and switch between Serif, Handwriting, Sans, and Typewriter fonts using the top ribbon.
`;

const PAPER_CONFIG: Record<
  PaperTheme,
  {
    name: string;
    bgClass: string;
    textColor: string;
    lineColor: string;
    marginColor: string;
    headerColor: string;
    accent: string;
    sampleColor: string;
  }
> = {
  legal: {
    name: "Yellow Legal Pad",
    bgClass: "bg-[#fef9c3] text-slate-900",
    textColor: "text-slate-900",
    lineColor: "rgba(59, 130, 246, 0.22)", // faint legal blue lines
    marginColor: "rgba(239, 68, 68, 0.4)", // classic red margin
    headerColor: "bg-amber-600 border-amber-700 text-amber-50",
    accent: "text-amber-700",
    sampleColor: "#fef08a",
  },
  ivory: {
    name: "Warm Ivory Linen",
    bgClass: "bg-[#fbf7ee] text-stone-900",
    textColor: "text-stone-900",
    lineColor: "rgba(168, 162, 158, 0.22)", // warm pencil lines
    marginColor: "rgba(180, 83, 9, 0.3)",
    headerColor: "bg-stone-700 border-stone-800 text-stone-100",
    accent: "text-stone-700",
    sampleColor: "#faf8f5",
  },
  sage: {
    name: "Soothing Sage Mint",
    bgClass: "bg-[#edf7f1] text-emerald-950",
    textColor: "text-emerald-950",
    lineColor: "rgba(16, 185, 129, 0.2)", // restful soft green lines
    marginColor: "rgba(5, 150, 105, 0.35)",
    headerColor: "bg-emerald-800 border-emerald-900 text-emerald-50",
    accent: "text-emerald-800",
    sampleColor: "#d1fae5",
  },
  grid: {
    name: "Engineering Grid",
    bgClass: "bg-white text-slate-900",
    textColor: "text-slate-900",
    lineColor: "transparent",
    marginColor: "rgba(59, 130, 246, 0.3)",
    headerColor: "bg-slate-800 border-slate-900 text-slate-100",
    accent: "text-blue-700",
    sampleColor: "#ffffff",
  },
  dark: {
    name: "Midnight Obsidian",
    bgClass: "bg-[#111827] text-slate-100",
    textColor: "text-slate-100",
    lineColor: "rgba(71, 85, 105, 0.3)", // faint cyan/slate lines
    marginColor: "rgba(56, 189, 248, 0.3)",
    headerColor: "bg-slate-950 border-slate-900 text-cyan-400",
    accent: "text-cyan-400",
    sampleColor: "#111827",
  },
};

export default function ScratchpadWidget({ isCompact = false }: { isCompact?: boolean }) {
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string>("");

  // Real Pad customizer states
  const [paperTheme, setPaperTheme] = useState<PaperTheme>("legal");
  const [fontFamily, setFontFamily] = useState<FontFamily>("serif");
  const [fontSize, setFontSize] = useState<FontSize>("base");
  const [showMargin, setShowMargin] = useState<boolean>(true);
  const [showRuledLines, setShowRuledLines] = useState<boolean>(true);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("workpulse_scratchpad");
      if (saved !== null) {
        setContent(saved);
      } else {
        setContent(DEFAULT_SCRATCHPAD_NOTE);
      }

      const savedTheme = localStorage.getItem("workpulse_pad_theme") as PaperTheme | null;
      if (savedTheme && PAPER_CONFIG[savedTheme]) setPaperTheme(savedTheme);

      const savedFont = localStorage.getItem("workpulse_pad_font") as FontFamily | null;
      if (savedFont) setFontFamily(savedFont);

      const savedSize = localStorage.getItem("workpulse_pad_size") as FontSize | null;
      if (savedSize) setFontSize(savedSize);

      setLastSaved(new Date().toLocaleTimeString());
    } catch {}
  }, []);

  // Handle typing & auto-save
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    try {
      localStorage.setItem("workpulse_scratchpad", text);
      setLastSaved(new Date().toLocaleTimeString());
    } catch {}
  };

  const handleThemeChange = (newTheme: PaperTheme) => {
    setPaperTheme(newTheme);
    try {
      localStorage.setItem("workpulse_pad_theme", newTheme);
    } catch {}
  };

  const handleFontChange = (newFont: FontFamily) => {
    setFontFamily(newFont);
    try {
      localStorage.setItem("workpulse_pad_font", newFont);
    } catch {}
  };

  const handleSizeChange = (newSize: FontSize) => {
    setFontSize(newSize);
    try {
      localStorage.setItem("workpulse_pad_size", newSize);
    } catch {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      showToast("Copied notes to clipboard!");
    } catch {
      showToast("Failed to copy automatically.");
    }
  };

  const downloadFile = (extension: "md" | "txt") => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `workpulse-scratchpad-${new Date().toISOString().slice(0, 10)}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded as .${extension}`);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your scratchpad?")) {
      setContent("");
      try {
        localStorage.removeItem("workpulse_scratchpad");
      } catch {}
      showToast("Scratchpad cleared.");
    }
  };

  // Quick formatting insert helper
  const insertFormat = (prefix: string, suffix: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = selectedText
      ? `${prefix}${selectedText}${suffix}`
      : `${prefix}${placeholder}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    try {
      localStorage.setItem("workpulse_scratchpad", newContent);
      setLastSaved(new Date().toLocaleTimeString());
    } catch {}

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + replacement.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  // Metrics
  const metrics = useMemo(() => {
    const trimmed = content.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = content.length;
    const lines = content ? content.split("\n").length : 0;
    const readTimeMinutes = Math.ceil(words / 200);
    return { words, characters, lines, readTimeMinutes };
  }, [content]);

  // Font CSS resolution
  const getFontFamilyStyle = () => {
    switch (fontFamily) {
      case "serif":
        return { fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif' };
      case "handwriting":
        return { fontFamily: '"Comic Sans MS", "Caveat", "Segoe Print", "Bradley Hand", cursive, sans-serif' };
      case "mono":
        return { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace' };
      case "sans":
      default:
        return { fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' };
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case "sm":
        return "text-sm leading-7";
      case "lg":
        return "text-lg leading-9";
      case "base":
      default:
        return "text-base leading-8";
    }
  };

  const activePaper = PAPER_CONFIG[paperTheme];

  // Markdown renderer for realistic pad
  const renderPadMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Highlight parser helper
      const parseHighlights = (str: string) => {
        const parts = str.split(/(==[^=]+==)/g);
        return parts.map((part, pIdx) => {
          if (part.startsWith("==") && part.endsWith("==")) {
            const inner = part.slice(2, -2);
            return (
              <mark
                key={pIdx}
                className="bg-amber-300/80 dark:bg-amber-400/50 text-slate-900 px-1.5 py-0.5 rounded font-semibold"
              >
                {inner}
              </mark>
            );
          }
          return part;
        });
      };

      if (line.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-lg font-bold mt-4 mb-1.5 opacity-90">
            {parseHighlights(line.replace("### ", ""))}
          </h3>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-xl font-bold mt-5 mb-2 border-b border-black/10 dark:border-white/10 pb-1">
            {parseHighlights(line.replace("## ", ""))}
          </h2>
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h1 key={idx} className="text-2xl sm:text-3xl font-extrabold mt-2 mb-3 tracking-tight">
            {parseHighlights(line.replace("# ", ""))}
          </h1>
        );
      }
      if (line.trim() === "---") {
        return <hr key={idx} className="my-4 border-black/15 dark:border-white/15" />;
      }
      if (line.startsWith("> ")) {
        return (
          <blockquote key={idx} className="border-l-4 border-blue-500/80 pl-3 italic opacity-85 my-2">
            {parseHighlights(line.replace("> ", ""))}
          </blockquote>
        );
      }
      // Checklists
      if (line.startsWith("- [x] ")) {
        return (
          <div key={idx} className="flex items-center gap-2.5 my-1 line-through opacity-60">
            <span className="h-4 w-4 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
            <span>{parseHighlights(line.replace("- [x] ", ""))}</span>
          </div>
        );
      }
      if (line.startsWith("- [ ] ")) {
        return (
          <div key={idx} className="flex items-center gap-2.5 my-1">
            <span className="h-4 w-4 rounded border-2 border-slate-700 dark:border-slate-300 inline-block" />
            <span>{parseHighlights(line.replace("- [ ] ", ""))}</span>
          </div>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li key={idx} className="ml-5 list-disc my-1">
            {parseHighlights(line.replace("- ", ""))}
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-3" />;
      }
      return (
        <p key={idx} className="my-1 leading-relaxed">
          {parseHighlights(line)}
        </p>
      );
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold animate-bounce border border-slate-700">
          <Check className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Real Pad Control Center */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-4 space-y-3.5">
        {/* Top Row: Paper Colors & Font Styles */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          {/* Paper Theme Swatches */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mr-1">
              <Palette className="h-4 w-4 text-amber-500" />
              <span>Paper Theme:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {(Object.keys(PAPER_CONFIG) as PaperTheme[]).map((themeKey) => {
                const conf = PAPER_CONFIG[themeKey];
                const isSelected = paperTheme === themeKey;
                return (
                  <button
                    key={themeKey}
                    onClick={() => handleThemeChange(themeKey)}
                    title={conf.name}
                    className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-500/30 scale-105 shadow-xs"
                        : "border-slate-300 dark:border-slate-700 hover:border-slate-400"
                    }`}
                    style={{ backgroundColor: conf.sampleColor }}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full border border-black/20 ${
                        themeKey === "dark" ? "bg-cyan-400" : "bg-slate-700"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-bold ${
                        themeKey === "dark" ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {conf.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <Type className="h-3.5 w-3.5 text-slate-500 ml-1" />
              {(
                [
                  { id: "serif", label: "Serif (Book)" },
                  { id: "handwriting", label: "Casual (Pad)" },
                  { id: "sans", label: "Sans" },
                  { id: "mono", label: "Typewriter" },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleFontChange(f.id)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                    fontFamily === f.id
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Font Size Toggle */}
            <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              {(["sm", "base", "lg"] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => handleSizeChange(sz)}
                  className={`px-2 py-0.5 rounded-lg uppercase ${
                    fontSize === sz
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Quick Formatting Ribbon (H1, H2, Paragraph, Bold, Highlight, Checklist, etc.) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mr-1 hidden sm:inline">
              Format:
            </span>

            {/* H1 Title */}
            <button
              onClick={() => insertFormat("# ", "", "Title")}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Insert Major Title (# Title)"
            >
              <Heading1 className="h-3.5 w-3.5 text-blue-600" />
              <span>Title</span>
            </button>

            {/* H2 Subtitle */}
            <button
              onClick={() => insertFormat("## ", "", "Subtitle")}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Insert Subtitle (## Subtitle)"
            >
              <Heading2 className="h-3.5 w-3.5 text-indigo-600" />
              <span>Subtitle</span>
            </button>

            {/* Paragraph */}
            <button
              onClick={() => insertFormat("\n\n", "", "Start typing paragraph here...")}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100"
              title="Paragraph Break"
            >
              <Pilcrow className="h-3.5 w-3.5 text-slate-600" />
              <span className="hidden sm:inline">Para</span>
            </button>

            {/* Bold */}
            <button
              onClick={() => insertFormat("**", "**", "bold text")}
              className="p-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100"
              title="Bold (**text**)"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>

            {/* Italic */}
            <button
              onClick={() => insertFormat("*", "*", "italic text")}
              className="p-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100"
              title="Italic (*text*)"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>

            {/* Highlighter */}
            <button
              onClick={() => insertFormat("==", "==", "highlighted note")}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-amber-300 bg-amber-100 text-amber-950 hover:bg-amber-200"
              title="Highlight (==note==)"
            >
              <Highlighter className="h-3.5 w-3.5 text-amber-700" />
              <span>Highlight</span>
            </button>

            {/* Checklist */}
            <button
              onClick={() => insertFormat("- [ ] ", "", "New task to complete")}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100"
              title="Checklist Task (- [ ] )"
            >
              <CheckSquare className="h-3.5 w-3.5 text-emerald-600" />
              <span>Checklist</span>
            </button>

            {/* Bullet List */}
            <button
              onClick={() => insertFormat("- ", "", "List item")}
              className="p-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100"
              title="Bullet List (- )"
            >
              <List className="h-3.5 w-3.5" />
            </button>

            {/* Quote */}
            <button
              onClick={() => insertFormat("> ", "", "Notable quote or insight")}
              className="p-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100"
              title="Blockquote (> )"
            >
              <Quote className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mode Switch & File Utilities */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isPreview
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{isPreview ? "Edit Pad" : "Read Mode"}</span>
            </button>

            <button
              onClick={copyToClipboard}
              className="p-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100"
              title="Copy to Clipboard"
            >
              <Copy className="h-4 w-4" />
            </button>

            <button
              onClick={() => downloadFile("md")}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100"
              title="Download Markdown"
            >
              <Download className="h-3.5 w-3.5" />
              <span>.md</span>
            </button>

            <button
              onClick={handleClear}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-200 hover:bg-rose-50"
              title="Clear Scratchpad"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* REAL SCRATCHPAD PHYSICAL BOARD */}
      <div className="relative rounded-3xl shadow-xl overflow-hidden border border-black/10 dark:border-slate-800 transition-all">
        {/* Top Notebook Binding Header (Perforated Legal Tape / Leather Strip) */}
        <div
          className={`h-9 px-6 flex items-center justify-between border-b ${activePaper.headerColor} shadow-inner select-none`}
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white/40 inline-block" />
            <span className="h-2 w-2 rounded-full bg-white/40 inline-block" />
            <span className="h-2 w-2 rounded-full bg-white/40 inline-block" />
            <span className="text-[11px] font-bold uppercase tracking-widest opacity-90 ml-1">
              WorkPulse Pad • {activePaper.name}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] opacity-85">
            <span className="font-mono">Auto-saved {lastSaved}</span>
            <span className="hidden sm:inline font-bold">|</span>
            <span className="hidden sm:inline">100% Client-Side Sandbox</span>
          </div>
        </div>

        {/* Perforation Dotted Tear Line */}
        <div className="h-1 w-full border-b border-dashed border-black/20 dark:border-white/20 bg-black/5" />

        {/* Pad Body with Authentic Ruled Lines and Red Left Margin */}
        <div
          className={`relative p-6 sm:p-8 transition-colors ${activePaper.bgClass} ${
            paperTheme === "grid" ? "pad-grid-dots" : showRuledLines ? "pad-ruled-lines" : ""
          } ${isCompact ? "min-h-[340px]" : "min-h-[520px]"}`}
          style={getFontFamilyStyle()}
        >
          {/* Classic Red Margin Line on the Left */}
          {showMargin && paperTheme !== "grid" && (
            <div
              className="absolute top-0 bottom-0 left-10 sm:left-14 pointer-events-none"
              style={{
                width: "2px",
                backgroundColor: activePaper.marginColor,
              }}
            />
          )}

          {/* Editor or Preview Mode */}
          <div className={showMargin && paperTheme !== "grid" ? "pl-8 sm:pl-10" : ""}>
            {isPreview ? (
              <div className={`overflow-y-auto ${getFontSizeClass()} select-text`}>
                {renderPadMarkdown(content)}
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleChange}
                placeholder="Start typing your title, tasks, or notes on your pad..."
                className={`w-full bg-transparent focus:outline-none resize-none border-none ${getFontSizeClass()} ${activePaper.textColor} font-inherit`}
                style={{
                  minHeight: isCompact ? "320px" : "480px",
                  lineHeight: "32px",
                }}
                aria-label="Real Scratchpad text editor"
              />
            )}
          </div>
        </div>

        {/* Bottom Pad Summary Bar */}
        <div
          className={`border-t border-black/10 dark:border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between text-xs font-bold ${
            paperTheme === "dark" ? "bg-slate-900 text-slate-300" : "bg-white/80 text-slate-800"
          } backdrop-blur-xs gap-3`}
        >
          <div className="flex items-center gap-5">
            <span>
              <strong className="font-black text-slate-900 dark:text-white">{metrics.words}</strong> words
            </span>
            <span>
              <strong className="font-black text-slate-900 dark:text-white">{metrics.characters}</strong> chars
            </span>
            <span>
              <strong className="font-black text-slate-900 dark:text-white">{metrics.lines}</strong> lines
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>~{metrics.readTimeMinutes} min read</span>
            </div>

            <button
              onClick={() => setShowMargin(!showMargin)}
              className="text-[11px] underline opacity-75 hover:opacity-100"
            >
              {showMargin ? "Hide Margin" : "Show Margin"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
