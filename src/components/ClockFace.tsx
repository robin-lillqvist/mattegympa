type Props = {
  hours: number;
  minutes: number;
  /** Pixel size of the SVG */
  size?: number;
  /** Dark theme variant */
  dark?: boolean;
};

export function ClockFace({ hours, minutes, size = 200, dark = false }: Props) {
  const cx = 100;
  const cy = 100;
  const r = 92;

  // Hand angles (12 = up, clockwise)
  const minuteAngle = (minutes / 60) * 360;
  const hourAngle = (((hours % 12) + minutes / 60) / 12) * 360;

  const face = dark ? "#0f172a" : "#fffaf0";
  const ring = dark ? "#475569" : "#b45309";
  const tickMajor = dark ? "#cbd5e1" : "#7c2d12";
  const tickMinor = dark ? "#475569" : "#fbbf24";
  const numberColor = dark ? "#e2e8f0" : "#7c2d12";
  const hourHand = dark ? "#f8fafc" : "#7c2d12";
  const minuteHand = dark ? "#f472b6" : "#dc2626";
  const center = dark ? "#f8fafc" : "#7c2d12";

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label={`Klocka som visar ${hours}:${String(minutes).padStart(2, "0")}`}
    >
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r + 4} fill={ring} />
      <circle cx={cx} cy={cy} r={r} fill={face} />

      {/* Minute ticks */}
      {Array.from({ length: 60 }, (_, i) => {
        const isMajor = i % 5 === 0;
        const a = (i / 60) * 2 * Math.PI - Math.PI / 2;
        const r1 = isMajor ? r - 10 : r - 5;
        const r2 = r - 2;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * r1}
            y1={cy + Math.sin(a) * r1}
            x2={cx + Math.cos(a) * r2}
            y2={cy + Math.sin(a) * r2}
            stroke={isMajor ? tickMajor : tickMinor}
            strokeWidth={isMajor ? 2.5 : 1}
            strokeLinecap="round"
          />
        );
      })}

      {/* Hour numbers */}
      {Array.from({ length: 12 }, (_, i) => {
        const num = i + 1;
        const a = (num / 12) * 2 * Math.PI - Math.PI / 2;
        const tx = cx + Math.cos(a) * (r - 22);
        const ty = cy + Math.sin(a) * (r - 22);
        return (
          <text
            key={num}
            x={tx}
            y={ty}
            fontSize="16"
            fontWeight="700"
            fontFamily="var(--font-display), serif"
            fill={numberColor}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {num}
          </text>
        );
      })}

      {/* Hour hand */}
      <g transform={`rotate(${hourAngle} ${cx} ${cy})`}>
        <line
          x1={cx}
          y1={cy + 8}
          x2={cx}
          y2={cy - 48}
          stroke={hourHand}
          strokeWidth={6}
          strokeLinecap="round"
        />
      </g>

      {/* Minute hand */}
      <g transform={`rotate(${minuteAngle} ${cx} ${cy})`}>
        <line
          x1={cx}
          y1={cy + 12}
          x2={cx}
          y2={cy - 72}
          stroke={minuteHand}
          strokeWidth={4}
          strokeLinecap="round"
        />
      </g>

      {/* Center pin */}
      <circle cx={cx} cy={cy} r={5} fill={center} />
    </svg>
  );
}
