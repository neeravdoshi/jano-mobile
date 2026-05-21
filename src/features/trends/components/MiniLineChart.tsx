import { useId } from 'react';

import type { DataPoint } from '../types';

const VW = 320;
const VH = 142;
const PAD = { l: 10, r: 10, t: 12, b: 34 };
const CW = VW - PAD.l - PAD.r;
const CH = VH - PAD.t - PAD.b;

function formatAxisMonth(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
}

function formatAxisDay(iso: string): string {
  return new Date(iso).getDate().toString();
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
  const latestValue = dataPoints[n - 1].value;
  const latestOutOfRange =
    latestValue < referenceRange.low || latestValue > referenceRange.high;

  const xAt = (i: number) => PAD.l + (n === 1 ? CW / 2 : (CW / (n - 1)) * i);
  const yAt = (v: number) =>
    PAD.t + CH - ((v - vMin) / (vMax - vMin)) * CH;

  const bandTop = yAt(Math.min(referenceRange.high, vMax));
  const bandBot = yAt(Math.max(referenceRange.low, vMin));
  const linePath = dataPoints
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(2)} ${yAt(d.value).toFixed(2)}`)
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      width="100%"
      style={{ height: 150, display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${gradientId}-band`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="rgba(18, 176, 95, 0.06)" />
          <stop offset="100%" stopColor="rgba(18, 176, 95, 0.12)" />
        </linearGradient>
        <linearGradient id={`${gradientId}-line`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="rgba(107, 117, 118, 0.72)" />
          <stop
            offset="100%"
            stopColor={
              latestOutOfRange
                ? 'rgba(229, 75, 75, 0.88)'
                : 'rgba(18, 176, 95, 0.86)'
            }
          />
        </linearGradient>
      </defs>

      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = PAD.t + CH * ratio;
        return (
          <line
            key={`grid-y-${ratio}`}
            x1={PAD.l}
            y1={y}
            x2={PAD.l + CW}
            y2={y}
            stroke="rgba(212, 216, 219, 0.58)"
            strokeDasharray="4 6"
            strokeWidth="1"
          />
        );
      })}

      {dataPoints.map((_, i) => (
        <line
          key={`grid-x-${i}`}
          x1={xAt(i)}
          y1={PAD.t}
          x2={xAt(i)}
          y2={PAD.t + CH}
          stroke="rgba(212, 216, 219, 0.42)"
          strokeDasharray="4 6"
          strokeWidth="1"
        />
      ))}

      {bandBot > bandTop && (
        <rect
          x={PAD.l}
          y={bandTop}
          width={CW}
          height={bandBot - bandTop}
          rx="10"
          fill={`url(#${gradientId}-band)`}
        />
      )}

      <path
        d={linePath}
        fill="none"
        stroke={`url(#${gradientId}-line)`}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {dataPoints.map((d, i) => {
        const isLatest = i === n - 1;
        const pointOutOfRange =
          d.value < referenceRange.low || d.value > referenceRange.high;
        return (
          <g key={d.date}>
            <circle
              cx={xAt(i)}
              cy={yAt(d.value)}
              r={isLatest ? 5.4 : 4.6}
              fill={
                pointOutOfRange
                  ? 'var(--color-danger-strong)'
                  : isLatest
                    ? 'var(--color-accent-strong)'
                    : 'var(--color-text)'
              }
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={xAt(i)}
              y={yAt(d.value) - 9}
              textAnchor="middle"
              fontSize="8.8"
              fontWeight={isLatest ? 700 : 600}
              fill={pointOutOfRange ? 'var(--color-danger-strong)' : 'var(--color-text-soft)'}
              fontFamily="var(--font-support)"
            >
              {d.value}
            </text>
          </g>
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
        <g key={`lbl-${d.date}`}>
          <text
            x={xAt(i)}
            y={VH - 17}
            textAnchor="middle"
            fontSize="10.5"
            fontWeight="700"
            fill="var(--color-text-muted)"
            fontFamily="var(--font-support)"
          >
            {formatAxisMonth(d.date)}
          </text>
          <text
            x={xAt(i)}
            y={VH - 4}
            textAnchor="middle"
            fontSize="9.5"
            fill="var(--color-text-muted)"
            fontFamily="var(--font-support)"
          >
            {formatAxisDay(d.date)}
          </text>
        </g>
      ))}
    </svg>
  );
}
