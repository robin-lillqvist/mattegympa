type Bar = { label: string; value: number };

type Props = {
  bars: Bar[];
  title?: string;
  unit?: string;
  dark?: boolean;
};

const BAR_COLORS = [
  "#f59e0b", // amber
  "#f43f5e", // rose
  "#0ea5e9", // sky
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#22c55e", // green
];

export function BarChart({ bars, title, unit, dark = false }: Props) {
  const W = 360;
  const H = 220;
  const padL = 40;
  const padR = 16;
  const padT = title ? 32 : 16;
  const padB = 40;

  const maxV = Math.max(...bars.map((b) => b.value));
  // Y-axel: avrundat upp till närmaste "nice" tal
  const tickStep = niceStep(maxV);
  const yMax = Math.ceil(maxV / tickStep) * tickStep;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const axis = dark ? "#64748b" : "#334155";
  const grid = dark ? "rgba(148,163,184,0.15)" : "rgba(15,23,42,0.08)";
  const text = dark ? "#e2e8f0" : "#1f2937";
  const titleColor = dark ? "#f8fafc" : "#0f172a";

  const yTicks: number[] = [];
  for (let v = 0; v <= yMax; v += tickStep) yTicks.push(v);

  const barW = innerW / bars.length;
  const barInner = barW * 0.65;
  const barGap = (barW - barInner) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }} role="img" aria-label={title ?? "Stapeldiagram"}>
      {title && (
        <text
          x={W / 2}
          y={20}
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill={titleColor}
        >
          {title}
        </text>
      )}

      {/* Gridlines + Y-axis labels */}
      {yTicks.map((t) => {
        const y = padT + innerH - (t / yMax) * innerH;
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke={grid} strokeWidth={1} />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="10" fill={text}>
              {t}
            </text>
          </g>
        );
      })}

      {/* Y-axis */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} stroke={axis} strokeWidth={1.5} />
      {/* X-axis */}
      <line
        x1={padL}
        y1={padT + innerH}
        x2={W - padR}
        y2={padT + innerH}
        stroke={axis}
        strokeWidth={1.5}
      />

      {/* Y-axis unit */}
      {unit && (
        <text
          x={padL - 6}
          y={padT - 6}
          textAnchor="end"
          fontSize="10"
          fontWeight="600"
          fill={text}
        >
          {unit}
        </text>
      )}

      {/* Bars */}
      {bars.map((b, i) => {
        const h = (b.value / yMax) * innerH;
        const x = padL + i * barW + barGap;
        const y = padT + innerH - h;
        const color = BAR_COLORS[i % BAR_COLORS.length];
        return (
          <g key={`${b.label}-${i}`}>
            <rect
              x={x}
              y={y}
              width={barInner}
              height={h}
              fill={color}
              rx={3}
            />
            <text
              x={x + barInner / 2}
              y={y - 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={text}
            >
              {b.value}
            </text>
            <text
              x={x + barInner / 2}
              y={padT + innerH + 14}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill={text}
            >
              {b.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Pick a "nice" tick step for the given max value (1, 2, 5 × 10^n). */
function niceStep(max: number): number {
  if (max <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(max)));
  const norm = max / mag;
  let step: number;
  if (norm <= 2) step = 0.5;
  else if (norm <= 5) step = 1;
  else step = 2;
  return step * mag;
}
