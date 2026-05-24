type Slice = { label: string; value: number };

type Props = {
  slices: Slice[];
  title?: string;
  dark?: boolean;
};

const SLICE_COLORS = [
  "#f59e0b",
  "#f43f5e",
  "#0ea5e9",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
  "#22c55e",
];

export function PieChart({ slices, title, dark = false }: Props) {
  const cx = 110;
  const cy = 120;
  const r = 80;

  const total = slices.reduce((s, x) => s + x.value, 0);
  const text = dark ? "#e2e8f0" : "#1f2937";
  const titleColor = dark ? "#f8fafc" : "#0f172a";

  // Beräkna kumulativ summa innan render så vi inte muterar i en map-callback.
  const cumulative: number[] = slices.reduce<number[]>((arr, s, i) => {
    arr.push((arr[i - 1] ?? 0) + s.value);
    return arr;
  }, []);
  const paths = slices.map((s, i) => {
    const prev = cumulative[i] - s.value;
    const start = (prev / total) * 2 * Math.PI - Math.PI / 2;
    const end = (cumulative[i] / total) * 2 * Math.PI - Math.PI / 2;
    const large = s.value / total > 0.5 ? 1 : 0;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    const mid = (start + end) / 2;
    const lx = cx + r * 0.6 * Math.cos(mid);
    const ly = cy + r * 0.6 * Math.sin(mid);
    return {
      path,
      label: s.label,
      value: s.value,
      labelPos: { x: lx, y: ly },
      color: SLICE_COLORS[i % SLICE_COLORS.length],
      pct: Math.round((s.value / total) * 100),
    };
  });

  return (
    <svg viewBox="0 0 360 250" width="100%" style={{ maxWidth: 460 }} role="img" aria-label={title ?? "Cirkeldiagram"}>
      {title && (
        <text x={180} y={20} textAnchor="middle" fontSize="14" fontWeight="700" fill={titleColor}>
          {title}
        </text>
      )}
      {paths.map((p, i) => (
        <g key={`${p.label}-${i}`}>
          <path d={p.path} fill={p.color} stroke="#ffffff" strokeWidth={2} />
          {p.pct >= 8 && (
            <text
              x={p.labelPos.x}
              y={p.labelPos.y}
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill="#ffffff"
            >
              {p.pct}%
            </text>
          )}
        </g>
      ))}
      {/* Legend */}
      {paths.map((p, i) => (
        <g key={`legend-${i}`} transform={`translate(220, ${50 + i * 22})`}>
          <rect width="14" height="14" rx="3" fill={p.color} />
          <text x={20} y={11} fontSize="12" fontWeight="600" fill={text}>
            {p.label} ({p.value})
          </text>
        </g>
      ))}
    </svg>
  );
}
