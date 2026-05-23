"use client";

import { useEffect, useState } from "react";

const COLORS = ["#f43f5e", "#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#ec4899"];

export function Confetti({ trigger }: { trigger: number }) {
  const [pieces, setPieces] = useState<Array<{ id: number; left: number; color: string; delay: number; duration: number }>>(
    [],
  );

  useEffect(() => {
    if (trigger === 0) return;
    const next = Array.from({ length: 80 }, (_, i) => ({
      id: trigger * 1000 + i,
      left: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 200,
      duration: 2200 + Math.random() * 1200,
    }));
    setPieces(next);
    const tm = window.setTimeout(() => setPieces([]), 3500);
    return () => window.clearTimeout(tm);
  }, [trigger]);

  if (pieces.length === 0) return null;
  return (
    <>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}ms`,
            animationDuration: `${p.duration}ms`,
          }}
        />
      ))}
    </>
  );
}
