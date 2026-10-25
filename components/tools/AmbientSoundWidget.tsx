"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CloudRain,
  Radio,
  Coffee,
  Trees,
  Flame,
  Waves,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Clock,
  Sparkles,
  Headphones,
} from "lucide-react";
import { soundEngine, SoundChannelId, ChannelState } from "@/lib/soundSynthesizer";

const INITIAL_CHANNELS: (ChannelState & { tag: string })[] = [
  {
    id: "rain",
    name: "Rain & Droplets",
    icon: "CloudRain",
    volume: 50,
    isPlaying: false,
    description: "Steady rain wash with natural stochastic droplet patter",
    tag: "Individual Drops",
  },
  {
    id: "whitenoise",
    name: "Cozy Brown Noise",
    icon: "Radio",
    volume: 45,
    isPlaying: false,
    description: "Warm, velvety deep rumble (airplane cabin / soft fan)",
    tag: "Deep Sub-Bass",
  },
  {
    id: "cafe",
    name: "Artisan Cafe",
    icon: "Coffee",
    volume: 40,
    isPlaying: false,
    description: "Warm multi-voice murmur with occasional cup/spoon clinks",
    tag: "Murmur + Clinks",
  },
  {
    id: "forest",
    name: "Forest & Birdsong",
    icon: "Trees",
    volume: 45,
    isPlaying: false,
    description: "Gentle pine breeze with procedural wild bird chirps",
    tag: "Real Birdsong",
  },
  {
    id: "campfire",
    name: "Crackling Hearth",
    icon: "Flame",
    volume: 55,
    isPlaying: false,
    description: "Comforting fireplace glow with dry pine pops & crackles",
    tag: "Wood Pops & Snaps",
  },
  {
    id: "waves",
    name: "Ocean Surf",
    icon: "Waves",
    volume: 50,
    isPlaying: false,
    description: "Rhythmic 9-second harmonic tidal surge & foam recession",
    tag: "Rhythmic Swell",
  },
];

export default function AmbientSoundWidget({ isCompact = false }: { isCompact?: boolean }) {
  // Sound channels state
  const [channels, setChannels] = useState(INITIAL_CHANNELS);
  const [isMuted, setIsMuted] = useState(false);
  const [masterVolume, setMasterVolume] = useState(80);

  // Pomodoro state
  const [timerMode, setTimerMode] = useState<"work" | "shortBreak" | "longBreak">("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [chimeEnabled, setChimeEnabled] = useState(true);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const savedVol = localStorage.getItem("workpulse_ambient_vols");
      if (savedVol) {
        const parsed = JSON.parse(savedVol);
        setChannels((prev) =>
          prev.map((c) => ({
            ...c,
            volume: parsed[c.id] !== undefined ? parsed[c.id] : c.volume,
          }))
        );
      }
      const savedStats = localStorage.getItem("workpulse_pomodoro_stats");
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setCompletedSessions(parsed.sessions || 0);
        setTotalFocusMinutes(parsed.minutes || 0);
      }
    } catch {}
  }, []);

  // Cleanup sounds on unmount
  useEffect(() => {
    return () => {
      soundEngine.stopAll();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Pomodoro countdown effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer completed!
            if (chimeEnabled) {
              soundEngine.playChime();
            }

            if (timerMode === "work") {
              const newSessions = completedSessions + 1;
              const newMins = totalFocusMinutes + 25;
              setCompletedSessions(newSessions);
              setTotalFocusMinutes(newMins);
              try {
                localStorage.setItem(
                  "workpulse_pomodoro_stats",
                  JSON.stringify({ sessions: newSessions, minutes: newMins })
                );
              } catch {}

              const nextMode = newSessions % 4 === 0 ? "longBreak" : "shortBreak";
              setTimerMode(nextMode);
              setIsTimerRunning(false);
              return nextMode === "longBreak" ? 15 * 60 : 5 * 60;
            } else {
              setTimerMode("work");
              setIsTimerRunning(false);
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timerMode, chimeEnabled, completedSessions, totalFocusMinutes]);

  // Update browser document title with remaining time
  useEffect(() => {
    if (isTimerRunning) {
      const mins = Math.floor(timeLeft / 60);
      const secs = (timeLeft % 60).toString().padStart(2, "0");
      document.title = `(${mins}:${secs}) Focus Sprint • WorkPulse`;
    } else {
      document.title = "Ambient Sound Mixer & Pomodoro Timer | WorkPulse";
    }
  }, [timeLeft, isTimerRunning]);

  const toggleChannel = (id: SoundChannelId) => {
    setChannels((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextPlaying = !c.isPlaying;
          if (nextPlaying) {
            soundEngine.playChannel(id, c.volume);
          } else {
            soundEngine.stopChannel(id);
          }
          return { ...c, isPlaying: nextPlaying };
        }
        return c;
      })
    );
  };

  const handleVolumeChange = (id: SoundChannelId, newVolume: number) => {
    setChannels((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, volume: newVolume } : c));
      try {
        const volMap: Record<string, number> = {};
        updated.forEach((c) => {
          volMap[c.id] = c.volume;
        });
        localStorage.setItem("workpulse_ambient_vols", JSON.stringify(volMap));
      } catch {}
      return updated;
    });
    soundEngine.setChannelVolume(id, newVolume);
  };

  const handleMasterVolume = (val: number) => {
    setMasterVolume(val);
    soundEngine.setMasterVolume(val / 100);
  };

  const toggleMasterMute = () => {
    const muted = soundEngine.toggleMasterMute();
    setIsMuted(muted);
  };

  const resetTimer = (mode: "work" | "shortBreak" | "longBreak") => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    if (mode === "work") setTimeLeft(25 * 60);
    if (mode === "shortBreak") setTimeLeft(5 * 60);
    if (mode === "longBreak") setTimeLeft(15 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getChannelIcon = (id: SoundChannelId) => {
    switch (id) {
      case "rain":
        return <CloudRain className="h-5 w-5" />;
      case "whitenoise":
        return <Radio className="h-5 w-5" />;
      case "cafe":
        return <Coffee className="h-5 w-5" />;
      case "forest":
        return <Trees className="h-5 w-5" />;
      case "campfire":
        return <Flame className="h-5 w-5" />;
      case "waves":
        return <Waves className="h-5 w-5" />;
    }
  };

  const activeChannelsCount = channels.filter((c) => c.isPlaying).length;

  return (
    <div className="w-full space-y-6">
      {/* Top Banner / Master Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
            <Headphones className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Acoustic Focus Studio</span>
              {activeChannelsCount > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  {activeChannelsCount} Active
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Procedural Web Audio • Completely Distinct Natural Soundscapes
            </p>
          </div>
        </div>

        {/* Master Audio Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMasterMute}
              aria-label={isMuted ? "Unmute master volume" : "Mute master volume"}
              className={`p-2.5 rounded-xl border font-semibold transition-colors ${
                isMuted
                  ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-900"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-200"
              }`}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Master</span>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : masterVolume}
                onChange={(e) => handleMasterVolume(Number(e.target.value))}
                className="w-24 accent-blue-600 h-2 rounded-lg bg-slate-200 dark:bg-slate-700"
                aria-label="Master volume slider"
              />
            </div>
          </div>

          <button
            onClick={() => {
              channels.forEach((c) => {
                if (c.isPlaying) soundEngine.stopChannel(c.id);
              });
              setChannels((prev) => prev.map((c) => ({ ...c, isPlaying: false })));
            }}
            disabled={activeChannelsCount === 0}
            className="text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            Stop All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: 6 Distinct Sound Channels */}
        <div className={`space-y-4 ${isCompact ? "lg:col-span-7" : "lg:col-span-7"}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className={`p-4 rounded-2xl border transition-all ${
                  channel.isPlaying
                    ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 ring-1 ring-blue-500/40 shadow-sm"
                    : "border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                        channel.isPlaying
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700"
                      }`}
                    >
                      {getChannelIcon(channel.id)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {channel.name}
                        </h3>
                      </div>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mt-0.5 border border-slate-200 dark:border-slate-700">
                        {channel.tag}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleChannel(channel.id)}
                    aria-label={`${channel.isPlaying ? "Pause" : "Play"} ${channel.name}`}
                    className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold transition-all ${
                      channel.isPlaying
                        ? "bg-blue-600 text-white shadow-sm scale-105"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {channel.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5 fill-current" />}
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mb-2.5">
                  {channel.description}
                </p>

                {/* Slider */}
                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={channel.volume}
                    onChange={(e) => handleVolumeChange(channel.id, Number(e.target.value))}
                    className="w-full h-2 accent-blue-600 rounded-lg bg-slate-200 dark:bg-slate-700"
                    aria-label={`${channel.name} volume slider`}
                  />
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 w-8 text-right">
                    {channel.volume}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Pomodoro Timer & Session Insights */}
        <div className={`space-y-4 ${isCompact ? "lg:col-span-5" : "lg:col-span-5"}`}>
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            {/* Timer Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Pomodoro Timer
                </span>
              </div>
              <button
                onClick={() => setChimeEnabled(!chimeEnabled)}
                aria-label="Toggle bell chime"
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  chimeEnabled
                    ? "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800"
                    : "text-slate-500 border-slate-200 dark:border-slate-700"
                }`}
              >
                {chimeEnabled ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
                <span className="text-[11px]">Chime</span>
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 mb-6 border border-slate-200/80 dark:border-slate-700">
              {(
                [
                  { id: "work", label: "Focus (25m)" },
                  { id: "shortBreak", label: "Break (5m)" },
                  { id: "longBreak", label: "Long (15m)" },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => resetTimer(mode.id)}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    timerMode === mode.id
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Big Countdown Clock */}
            <div className="text-center py-2">
              <div className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
                {formatTime(timeLeft)}
              </div>
              <p className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                {timerMode === "work" ? "Deep Work Focus Sprint" : "Rest & Recharge Interval"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm shadow-md transition-all ${
                  isTimerRunning
                    ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 hover:scale-[1.02]"
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" />
                    <span>Start Sprint</span>
                  </>
                )}
              </button>

              <button
                onClick={() => resetTimer(timerMode)}
                aria-label="Reset timer"
                className="p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Session Stats */}
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="block text-xl font-black text-slate-900 dark:text-white">
                  {completedSessions}
                </span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-bold">
                  Sprints Done
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="block text-xl font-black text-blue-600 dark:text-blue-400">
                  {totalFocusMinutes}m
                </span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-bold">
                  Focus Logged
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
