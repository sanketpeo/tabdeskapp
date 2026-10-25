"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  PlusCircle,
  Download,
  Trash2,
  DollarSign,
  Briefcase,
  TrendingUp,
} from "lucide-react";

interface BillableSession {
  id: string;
  client: string;
  task: string;
  rate: number;
  currency: string;
  durationSeconds: number;
  earnings: number;
  date: string;
}

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "USD ($)" },
  { code: "EUR", symbol: "€", name: "EUR (€)" },
  { code: "GBP", symbol: "£", name: "GBP (£)" },
  { code: "INR", symbol: "₹", name: "INR (₹)" },
];

export default function BillableTimerWidget({ isCompact = false }: { isCompact?: boolean }) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hourlyRate, setHourlyRate] = useState<number>(75);
  const [currency, setCurrency] = useState("USD");
  const [clientName, setClientName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [sessions, setSessions] = useState<BillableSession[]>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved sessions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("workpulse_billable_sessions");
      if (saved) {
        setSessions(JSON.parse(saved));
      }
      const savedRate = localStorage.getItem("workpulse_billable_rate");
      if (savedRate) {
        setHourlyRate(Number(savedRate));
      }
      const savedCurrency = localStorage.getItem("workpulse_billable_curr");
      if (savedCurrency) {
        setCurrency(savedCurrency);
      }
    } catch {}
  }, []);

  // Timer interval
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const activeSymbol = CURRENCIES.find((c) => c.code === currency)?.symbol || "$";
  const accruedEarnings = (elapsedSeconds / 3600) * hourlyRate;

  const handleRateChange = (rate: number) => {
    setHourlyRate(rate);
    try {
      localStorage.setItem("workpulse_billable_rate", rate.toString());
    } catch {}
  };

  const handleCurrencyChange = (curr: string) => {
    setCurrency(curr);
    try {
      localStorage.setItem("workpulse_billable_curr", curr);
    } catch {}
  };

  const saveCurrentSession = () => {
    if (elapsedSeconds < 5) {
      alert("Session is too short to log (minimum 5 seconds).");
      return;
    }

    const newSession: BillableSession = {
      id: Date.now().toString(),
      client: clientName.trim() || "General Client",
      task: taskDescription.trim() || "Consulting & Development",
      rate: hourlyRate,
      currency,
      durationSeconds: elapsedSeconds,
      earnings: accruedEarnings,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    try {
      localStorage.setItem("workpulse_billable_sessions", JSON.stringify(updated));
    } catch {}

    // Reset current active session
    setIsRunning(false);
    setElapsedSeconds(0);
    setTaskDescription("");
  };

  const resetCurrentTimer = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
  };

  const deleteSession = (id: string) => {
    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered);
    try {
      localStorage.setItem("workpulse_billable_sessions", JSON.stringify(filtered));
    } catch {}
  };

  const clearAllSessions = () => {
    if (confirm("Clear all billable session logs?")) {
      setSessions([]);
      try {
        localStorage.removeItem("workpulse_billable_sessions");
      } catch {}
    }
  };

  const exportCSV = () => {
    if (sessions.length === 0) {
      alert("No sessions recorded yet.");
      return;
    }

    const headers = ["ID", "Date", "Client", "Task", "Currency", "Hourly Rate", "Duration (Seconds)", "Duration (Formatted)", "Invoice Total"];
    const rows = sessions.map((s) => [
      s.id,
      `"${s.date}"`,
      `"${s.client}"`,
      `"${s.task}"`,
      s.currency,
      s.rate.toFixed(2),
      s.durationSeconds,
      formatDuration(s.durationSeconds),
      s.earnings.toFixed(2),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `workpulse-invoices-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDuration = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalHistoricalEarnings = sessions.reduce((acc, curr) => acc + curr.earnings, 0);
  const totalHistoricalHours = (sessions.reduce((acc, curr) => acc + curr.durationSeconds, 0) / 3600).toFixed(1);

  return (
    <div className="w-full space-y-6">
      {/* Rate & Client Configuration Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
            Hourly Rate
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-500 dark:text-slate-400">
              {activeSymbol}
            </span>
            <input
              type="number"
              min="0"
              step="5"
              value={hourlyRate}
              onChange={(e) => handleRateChange(Math.max(0, Number(e.target.value)))}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
            Currency
          </label>
          <select
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
            Client / Project
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="e.g. Acme Studio"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
            Task Scope
          </label>
          <input
            type="text"
            placeholder="e.g. Architecture Optimization"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Stopwatch & Accrual Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
          {/* Elapsed Clock */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Time Elapsed
            </span>
            <div className="font-mono text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
              {formatDuration(elapsedSeconds)}
            </div>
          </div>

          <div className="hidden sm:block h-16 w-px bg-slate-200 dark:border-slate-800" />

          {/* Accrued Money */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Accrued Earnings</span>
            </span>
            <div className="font-mono text-4xl sm:text-6xl font-black tracking-tight text-emerald-700 dark:text-emerald-400">
              {activeSymbol}
              {accruedEarnings.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Stopwatch Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-all ${
              isRunning
                ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 hover:scale-[1.02]"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause Stopwatch</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>Start Billable Timer</span>
              </>
            )}
          </button>

          <button
            onClick={saveCurrentSession}
            disabled={elapsedSeconds < 5}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 disabled:opacity-40 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Save to Log</span>
          </button>

          <button
            onClick={resetCurrentTimer}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset active clock"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Historical Session Ledger */}
      {!isCompact && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Invoice Ledger & Session History
              </h3>
              <p className="text-xs text-slate-500">
                Total Logged: <strong>{activeSymbol}{totalHistoricalEarnings.toFixed(2)}</strong> across{" "}
                <strong>{totalHistoricalHours} billable hours</strong> ({sessions.length} sessions)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                disabled={sessions.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={clearAllSessions}
                disabled={sessions.length === 0}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 border border-transparent hover:border-rose-200 dark:hover:border-rose-800 transition-colors"
                title="Clear all sessions"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {sessions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No billable sessions saved yet. Run the timer and click &quot;Save to Log&quot; to build your invoice ledger.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Task Scope</th>
                    <th className="py-3 px-4">Rate</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sessions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{s.date}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {s.client}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{s.task}</td>
                      <td className="py-3 px-4 text-slate-500">
                        {activeSymbol}{s.rate}/hr
                      </td>
                      <td className="py-3 px-4 font-mono">{formatDuration(s.durationSeconds)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {activeSymbol}{s.earnings.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => deleteSession(s.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
