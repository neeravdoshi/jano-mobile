import { useId } from 'react';

import type { DataPoint } from '../types';

const VW = 300;
const VH = 92;
const PAD = { l: 6, r: 6, t: 8, b: 20 };
const CW = VW - PAD.l - PAD.r;
const CH = VH - PAD.t - PAD.b;

function formatAxisDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
}

type Props = {
  dataPoints: DataPoint[];
  referenceRange: { low: number; high: number };
};

export function MiniLineChart({ dataPoints, referenceRange }: Props) {
  const gradientId = useId().replace(/:/g, '');
  const values = dataPoints.map((d) => d.value);
  const rawMin = Math.min(...values, referenceRange.low);
  const rawMax = Math.max(...values, referenceRange.high);
  const spread = Math.max(rawMax - rawMin, 0.5);
  const vMin = Math.max(0, rawMin - spread * 0.18);
  const vMax = rawMax + spread * 0.18;
  const n = dataPoints.length;
  const slotWidth = CW / n;
  const barWidth = Math.min(26, slotWidth * 0.48);
  const latestValue = dataPoints[n - 1].value;
  const latestOutOfRange =
    latestValue < referenceRange.low || latestValue > referenceRange.high;

  const xAt = (i: number) => PAD.l + slotWidth * i + slotWidth / 2;
  const yAt = (v: number) =>
    PAD.t + CH - ((v - vMin) / (vMax - vMin)) * CH;

  const bandTop = yAt(Math.min(referenceRange.high, vMax));
  const bandBot = yAt(Math.max(referenceRange.low, vMin));

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      width="100%"
      style={{ height: 94, display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${gradientId}-bar-active`} x1="0" x2="0" y1="0" y2="1">
          <stop
            offset="0%"
            stopColor={
              latestOutOfRange
                ? 'rgba(229, 75, 75, 0.78)'
                : 'rgba(18, 176, 95, 0.78)'
            }
          />
          <stop
            offset="100%"
            stopColor={
              latestOutOfRange
                ? 'var(--color-danger-strong)'
                : 'var(--color-accent-strong)'
            }
          />
        </linearGradient>
      </defs>

      {bandBot > bandTop && (
        <rect
          x={PAD.l}
          y={bandTop}
          width={CW}
          height={bandBot - bandTop}
          rx="12"
          fill="rgba(18, 176, 95, 0.08)"
        />
      )}

      {dataPoints.map((d, i) => {
        const cx = xAt(i);
        const barTop = yAt(d.value);
        const barHeight = Math.max(14, PAD.t + CH - barTop);
        const isLatest = i === n - 1;

        return (
          <rect
            key={d.date}
            x={cx - barWidth / 2}
            y={PAD.t + CH - barHeight}
            width={barWidth}
            height={barHeight}
            rx={barWidth / 2}
            fill={
              isLatest
                ? `url(#${gradientId}-bar-active)`
                : 'rgba(212, 216, 219, 0.9)'
            }
          />
        );
      })}

      <line
        x1={PAD.l}
        y1={PAD.t + CH}
        x2={PAD.l + CW}
        y2={PAD.t + CH}
        stroke="rgba(212, 216, 219, 0.78)"
        strokeWidth="1"
      />

      {dataPoints.map((d, i) => (
        <text
          key={`lbl-${d.date}`}
          x={xAt(i)}
          y={VH - 3}
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-muted)"
          fontFamily="var(--font-support)"
        >
          {formatAxisDate(d.date)}
        </text>
      ))}
    </svg>
  );
}
