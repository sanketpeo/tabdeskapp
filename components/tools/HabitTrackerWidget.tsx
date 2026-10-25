"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Droplets,
  Brain,
  Activity,
  BookOpen,
  UserCheck,
  Moon,
  Plus,
  Trash2,
  Flame,
  Sparkles,
  Trophy,
} from "lucide-react";

interface HabitItem {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  category: "hydration" | "focus" | "health" | "learning" | "posture" | "rest" | "custom";
  iconName: string;
}

const DEFAULT_HABITS: HabitItem[] = [
  {
    id: "water",
    name: "Hydration (8 Glasses of Water)",
    description: "Optimal cellular hydration for sustained focus",
    completed: false,
    category: "hydration",
    iconName: "Droplets",
  },
  {
    id: "deep-work",
    name: "90-Minute Deep Work Sprint",
    description: "Undivided focus on singular high-leverage objective",
    completed: false,
    category: "focus",
    iconName: "Brain",
  },
  {
    id: "exercise",
    name: "30-Min Physical Movement",
    description: "Cardio, weight training, walk, or yoga session",
    completed: false,
    category: "health",
    iconName: "Activity",
  },
  {
    id: "reading",
    name: "Read 20 Pages of Non-Fiction",
    description: "Expand engineering or domain knowledge",
    completed: false,
    category: "learning",
    iconName: "BookOpen",
  },
  {
    id: "posture",
    name: "Ergonomic & Eye Check",
    description: "20-20-20 screen rule, spinal alignment & stretches",
    completed: false,
    category: "posture",
    iconName: "UserCheck",
  },
  {
    id: "screen-break",
    name: "Screen Break & Digital Wind-Down",
    description: "No blue light 45 minutes prior to sleep",
    completed: false,
    category: "rest",
    iconName: "Moon",
  },
];

export default function HabitTrackerWidget({ isCompact = false }: { isCompact?: boolean }) {
  const [habits, setHabits] = useState<HabitItem[]>(DEFAULT_HABITS);
  const [waterGlasses, setWaterGlasses] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(1);
  const [lastActiveDate, setLastActiveDate] = useState<string>("");
  const [newHabitText, setNewHabitText] = useState("");

  const getTodayDateString = () => {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  };

  // Check midnight reset on mount & load state
  useEffect(() => {
    try {
      const today = getTodayDateString();
      const savedDate = localStorage.getItem("workpulse_habit_date");
      const savedHabits = localStorage.getItem("workpulse_habits");
      const savedWater = localStorage.getItem("workpulse_water_count");
      const savedStreak = localStorage.getItem("workpulse_habit_streak");

      let currentStreak = savedStreak ? parseInt(savedStreak, 10) : 1;

      if (savedDate && savedDate !== today) {
        // Midnight reset trigger!
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);

        // Check if yesterday had good completion to maintain streak
        if (savedDate !== yesterdayStr) {
          // Missed more than a day - reset streak to 1
          currentStreak = 1;
        }

        // Reset checkmarks for new day
        if (savedHabits) {
          const parsed = JSON.parse(savedHabits);
          const resetList = parsed.map((h: HabitItem) => ({ ...h, completed: false }));
          setHabits(resetList);
          localStorage.setItem("workpulse_habits", JSON.stringify(resetList));
        }
        setWaterGlasses(0);
        localStorage.setItem("workpulse_water_count", "0");
      } else {
        // Same day: load current state
        if (savedHabits) {
          setHabits(JSON.parse(savedHabits));
        }
        if (savedWater) {
          setWaterGlasses(parseInt(savedWater, 10));
        }
      }

      setStreakDays(currentStreak);
      setLastActiveDate(today);
      localStorage.setItem("workpulse_habit_date", today);
      localStorage.setItem("workpulse_habit_streak", currentStreak.toString());
    } catch {}
  }, []);

  const toggleHabit = (id: string) => {
    setHabits((prev) => {
      const updated = prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h));
      try {
        localStorage.setItem("workpulse_habits", JSON.stringify(updated));
      } catch {}

      // If all completed, increment streak if not already done today
      const allDone = updated.every((h) => h.completed);
      if (allDone) {
        const newStreak = streakDays + 1;
        setStreakDays(newStreak);
        try {
          localStorage.setItem("workpulse_habit_streak", newStreak.toString());
        } catch {}
      }

      return updated;
    });
  };

  const handleWaterChange = (delta: number) => {
    const nextVal = Math.max(0, Math.min(12, waterGlasses + delta));
    setWaterGlasses(nextVal);
    try {
      localStorage.setItem("workpulse_water_count", nextVal.toString());
    } catch {}

    // Auto-complete water habit if >= 8 glasses
    if (nextVal >= 8) {
      setHabits((prev) => {
        const updated = prev.map((h) => (h.id === "water" ? { ...h, completed: true } : h));
        try {
          localStorage.setItem("workpulse_habits", JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  };

  const addCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitText.trim()) return;

    const newHabit: HabitItem = {
      id: "custom-" + Date.now(),
      name: newHabitText.trim(),
      description: "Custom user daily routine",
      completed: false,
      category: "custom",
      iconName: "Sparkles",
    };

    const updated = [...habits, newHabit];
    setHabits(updated);
    try {
      localStorage.setItem("workpulse_habits", JSON.stringify(updated));
    } catch {}
    setNewHabitText("");
  };

  const deleteHabit = (id: string) => {
    const updated = habits.filter((h) => h.id !== id);
    setHabits(updated);
    try {
      localStorage.setItem("workpulse_habits", JSON.stringify(updated));
    } catch {}
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const progressPercent = Math.round((completedCount / (habits.length || 1)) * 100);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "hydration":
        return <Droplets className="h-4 w-4 text-cyan-500" />;
      case "focus":
        return <Brain className="h-4 w-4 text-purple-500" />;
      case "health":
        return <Activity className="h-4 w-4 text-rose-500" />;
      case "learning":
        return <BookOpen className="h-4 w-4 text-amber-500" />;
      case "posture":
        return <UserCheck className="h-4 w-4 text-emerald-500" />;
      case "rest":
        return <Moon className="h-4 w-4 text-indigo-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Streak Highlights */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Daily Habits & Hydration</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Automatic Midnight Client Reset • Consecutive Streak Persistence
            </p>
          </div>
        </div>

        {/* Streak Flame Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-bounce" />
            <span className="text-xs font-black tracking-tight">
              {streakDays} Day Streak
            </span>
          </div>
        </div>
      </div>

      {/* Progress & Quick Hydration Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Progress Bar (Col 8) */}
        <div className="md:col-span-8 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Today&apos;s Discipline Meter
              </span>
            </div>
            <span className="text-sm font-black font-mono text-emerald-700 dark:text-emerald-400">
              {completedCount} / {habits.length} ({progressPercent}%)
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="mt-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {progressPercent === 100
              ? "🎉 Perfect score! All habits achieved today."
              : "Complete all daily rituals to build your consecutive discipline streak."}
          </p>
        </div>

        {/* Quick Hydration Counter (Col 4) */}
        <div className="md:col-span-4 p-5 rounded-2xl border border-cyan-300 dark:border-cyan-900/60 bg-cyan-50/70 dark:bg-cyan-950/20 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-950 dark:text-cyan-200 flex items-center gap-1.5">
              <Droplets className="h-4 w-4 text-cyan-600 dark:text-cyan-400 fill-cyan-500" />
              <span>Hydration Tracker</span>
            </span>
            <span className="font-mono text-sm font-black text-cyan-800 dark:text-cyan-300">
              {waterGlasses} / 8 Glasses
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 my-2">
            <button
              onClick={() => handleWaterChange(-1)}
              className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100"
            >
              -
            </button>
            <div className="flex gap-1 overflow-x-auto py-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-6 w-3 rounded-sm transition-colors ${
                    i < waterGlasses ? "bg-cyan-500" : "bg-cyan-200 dark:bg-cyan-950/80"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => handleWaterChange(1)}
              className="h-8 w-8 rounded-lg bg-cyan-600 text-white font-bold hover:bg-cyan-500"
            >
              +
            </button>
          </div>

          <span className="text-[11px] font-semibold text-cyan-800 dark:text-cyan-300">
            {waterGlasses >= 8 ? "✓ Daily hydration goal hit!" : "Keep fresh water at your desk."}
          </span>
        </div>
      </div>

      {/* Habits Checklist */}
      <div className="space-y-2.5">
        {habits.map((habit) => (
          <div
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className={`group cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all select-none ${
              habit.completed
                ? "border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-6 w-6 rounded-lg flex items-center justify-center border transition-all ${
                  habit.completed
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800"
                }`}
              >
                {habit.completed && <CheckCircle2 className="h-4 w-4" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  {getCategoryIcon(habit.category)}
                  <span
                    className={`text-sm font-bold transition-colors ${
                      habit.completed
                        ? "line-through text-slate-500 dark:text-slate-500"
                        : "text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {habit.name}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {habit.description}
                </p>
              </div>
            </div>

            {habit.category === "custom" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteHabit(habit.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Custom Habit Form */}
      <form onSubmit={addCustomHabit} className="flex gap-2">
        <input
          type="text"
          placeholder="Add a new custom daily habit (e.g. 10m Meditation)..."
          value={newHabitText}
          onChange={(e) => setNewHabitText(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!newHabitText.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Habit</span>
        </button>
      </form>
    </div>
  );
}
