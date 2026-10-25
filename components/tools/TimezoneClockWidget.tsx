"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  Plus,
  Trash2,
  RotateCcw,
  Sun,
  Moon,
  Clock,
  Briefcase,
  Sliders,
} from "lucide-react";

interface TimezoneItem {
  id: string;
  name: string;
  ianaZone: string;
  city: string;
}

const DEFAULT_TIMEZONES: TimezoneItem[] = [
  { id: "local", name: "Your Local Time", ianaZone: "", city: "Current Device" },
  { id: "utc", name: "UTC / GMT", ianaZone: "UTC", city: "London (Base)" },
  { id: "est", name: "New York (ET)", ianaZone: "America/New_York", city: "United States" },
  { id: "gmt", name: "London (GMT/BST)", ianaZone: "Europe/London", city: "United Kingdom" },
  { id: "ist", name: "India (IST)", ianaZone: "Asia/Kolkata", city: "New Delhi / Mumbai" },
  { id: "jst", name: "Tokyo (JST)", ianaZone: "Asia/Tokyo", city: "Japan" },
];

const AVAILABLE_EXTRA_ZONES = [
  { id: "pst", name: "San Francisco (PT)", ianaZone: "America/Los_Angeles", city: "California" },
  { id: "cet", name: "Berlin / Paris (CET)", ianaZone: "Europe/Berlin", city: "Germany" },
  { id: "sgt", name: "Singapore (SGT)", ianaZone: "Asia/Singapore", city: "Singapore" },
  { id: "aest", name: "Sydney (AEST)", ianaZone: "Australia/Sydney", city: "Australia" },
  { id: "gst", name: "Dubai (GST)", ianaZone: "Asia/Dubai", city: "United Arab Emirates" },
];

export default function TimezoneClockWidget({ isCompact = false }: { isCompact?: boolean }) {
  const [zones, setZones] = useState<TimezoneItem[]>(DEFAULT_TIMEZONES);
  const [hourOffset, setHourOffset] = useState<number>(0); // -12 to +12 hours scrubber
  const [baseTime, setBaseTime] = useState<Date | null>(null);
  const [is24Hour, setIs24Hour] = useState<boolean>(false);
  const [selectedExtraZone, setSelectedExtraZone] = useState("");

  // Keep live time ticking every second, initialize client-side
  useEffect(() => {
    setBaseTime(new Date());
    const timer = setInterval(() => {
      setBaseTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute simulated date with scrubber offset
  const simulatedTime = baseTime
    ? new Date(baseTime.getTime() + hourOffset * 60 * 60 * 1000)
    : null;

  const addTimezone = () => {
    if (!selectedExtraZone) return;
    const found = AVAILABLE_EXTRA_ZONES.find((z) => z.id === selectedExtraZone);
    if (found && !zones.some((z) => z.id === found.id)) {
      setZones([...zones, found]);
    }
    setSelectedExtraZone("");
  };

  const removeTimezone = (id: string) => {
    if (id === "local") return; // keep local
    setZones(zones.filter((z) => z.id !== id));
  };

  const getTimeInfo = (ianaZone: string) => {
    if (!simulatedTime) {
      return {
        formatted: "--:--:-- --",
        hour24: 12,
        isWorkingHours: true,
        isSleepHours: false,
      };
    }
    try {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: ianaZone || undefined,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: !is24Hour,
        weekday: "short",
        month: "short",
        day: "numeric",
      };

      const formatter = new Intl.DateTimeFormat("en-US", options);
      const hour24Formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: ianaZone || undefined,
        hour: "numeric",
        hour12: false,
      });
      const hour24 = parseInt(hour24Formatter.format(simulatedTime), 10);
      const isWorkingHours = hour24 >= 9 && hour24 < 18;
      const isSleepHours = hour24 >= 22 || hour24 < 7;

      return {
        formatted: formatter.format(simulatedTime),
        hour24,
        isWorkingHours,
        isSleepHours,
      };
    } catch {
      return {
        formatted: simulatedTime.toLocaleTimeString(),
        hour24: simulatedTime.getHours(),
        isWorkingHours: true,
        isSleepHours: false,
      };
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Controls & Time Scrubber Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-600/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Multi-Timezone Clock & Scrubber</span>
                {hourOffset !== 0 && (
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    Scrubbed {hourOffset > 0 ? `+${hourOffset}` : hourOffset}h
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">
                Synchronized Global Time Simulator • Work/Sleep Overlap
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIs24Hour(!is24Hour)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {is24Hour ? "24h Mode" : "12h AM/PM"}
            </button>

            <button
              onClick={() => setHourOffset(0)}
              disabled={hourOffset === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset to Now</span>
            </button>
          </div>
        </div>

        {/* Interactive Scrubbing Slider */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Interactive Meeting Scrubber</span>
            </span>
            <span className="font-mono text-blue-700 dark:text-blue-300 font-black">
              {hourOffset === 0 ? "Live System Time" : `${hourOffset > 0 ? "+" : ""}${hourOffset} Hours Offset`}
            </span>
          </div>

          <input
            type="range"
            min="-12"
            max="12"
            step="0.5"
            value={hourOffset}
            onChange={(e) => setHourOffset(Number(e.target.value))}
            className="w-full accent-blue-600 h-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 cursor-pointer"
            aria-label="Time scrubber slider"
          />

          <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 font-bold font-mono">
            <span>-12h</span>
            <span>-6h</span>
            <span className="text-slate-900 dark:text-white font-black underline">Current Time</span>
            <span>+6h</span>
            <span>+12h</span>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((zone) => {
          const info = getTimeInfo(zone.ianaZone);
          return (
            <div
              key={zone.id}
              className={`p-5 rounded-2xl border transition-all ${
                info.isWorkingHours
                  ? "border-emerald-400 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm"
                  : info.isSleepHours
                  ? "border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {zone.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{zone.city}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Status badge */}
                  {info.isWorkingHours ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      <Briefcase className="h-3 w-3" />
                      <span>Work Hours</span>
                    </span>
                  ) : info.isSleepHours ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-900 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                      <Moon className="h-3 w-3" />
                      <span>Night</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      <Sun className="h-3 w-3" />
                      <span>Off Hours</span>
                    </span>
                  )}

                  {zone.id !== "local" && (
                    <button
                      onClick={() => removeTimezone(zone.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                      title="Remove zone"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Time Display */}
              <div className="pt-2">
                <div className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  {info.formatted}
                </div>
              </div>

              {/* Day Visual Indicator Bar (24h progress) */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                  {/* 0-9: Night */}
                  <div className="w-[37.5%] bg-slate-400/60" title="Night/Morning (12 AM - 9 AM)" />
                  {/* 9-18: Working hours */}
                  <div className="w-[37.5%] bg-emerald-500" title="Working Hours (9 AM - 6 PM)" />
                  {/* 18-24: Evening */}
                  <div className="w-[25%] bg-indigo-500/70" title="Evening (6 PM - 12 AM)" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-bold font-mono mt-1">
                  <span>12 AM</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-black">9 AM - 6 PM</span>
                  <span>12 AM</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Timezone Drawer */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Add Another Timezone:
        </span>
        <select
          value={selectedExtraZone}
          onChange={(e) => setSelectedExtraZone(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
        >
          <option value="">Select a city / timezone...</option>
          {AVAILABLE_EXTRA_ZONES.filter(
            (ez) => !zones.some((z) => z.id === ez.id)
          ).map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.name} ({zone.city})
            </option>
          ))}
        </select>
        <button
          onClick={addTimezone}
          disabled={!selectedExtraZone}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Zone</span>
        </button>
      </div>
    </div>
  );
}
