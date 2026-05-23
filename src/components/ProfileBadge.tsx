"use client";

import { useEffect, useState } from "react";
import { loadProgress, saveProgress, type ProgressState } from "@/lib/progress";

export function ProfileBadge() {
  const [state, setState] = useState<ProgressState | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const s = loadProgress();
    setState(s);
    setName(s.name);
  }, []);

  if (!state) {
    return <div className="text-sm text-slate-500">Laddar…</div>;
  }

  const save = () => {
    const next = { ...state, name: name.trim() };
    setState(next);
    saveProgress(next);
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex items-center gap-3 text-sm">
        <Badge label="XP" value={state.xp} icon="⭐" />
        <Badge label="Streak" value={`${state.streak.count}d`} icon="🔥" />
      </div>
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") setEditing(false);
            }}
            placeholder="Ditt namn"
            className="bg-white border border-zinc-300 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <button onClick={save} className="text-xs font-semibold text-rose-600">
            Spara
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 bg-white border border-zinc-200 rounded-full pl-1 pr-3 py-1 text-sm font-medium hover:shadow-md transition-shadow"
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-white text-xs font-bold">
            {(state.name || "?").slice(0, 1).toUpperCase()}
          </span>
          {state.name || "Lägg till namn"}
        </button>
      )}
    </div>
  );
}

function Badge({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-full px-3 py-1">
      <span aria-hidden>{icon}</span>
      <span className="font-bold">{value}</span>
      <span className="text-slate-500 text-xs">{label}</span>
    </div>
  );
}
