'use client';

// Sparkline — tiny inline SVG trend visualizer.
// Drop into stat tiles, agent action deltas, anywhere a metric is mentioned.
// No axes, no labels, just the shape of the trend with optional fill underneath.

interface SparklineProps {
  /** Numeric series (>= 2 points) */
  values: number[];
  /** Width in px. Default 60. */
  width?: number;
  /** Height in px. Default 18. */
  height?: number;
  /** Stroke color. Defaults to brand evergreen. */
  color?: string;
  /** Render a soft fill below the line at low opacity. Default true. */
  filled?: boolean;
  /** Show small dot at the last point. Default true. */
  showLastPoint?: boolean;
  /** Stroke width. Default 1.5. */
  strokeWidth?: number;
  className?: string;
}

export function Sparkline({
  values,
  width = 60,
  height = 18,
  color = '#0A6B3C',
  filled = true,
  showLastPoint = true,
  strokeWidth = 1.5,
  className = '',
}: SparklineProps) {
  if (!values || values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = 1.5;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * innerW;
    const y = padding + innerH - ((v - min) / range) * innerH;
    return [x, y] as const;
  });

  const lineD = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(' ');

  const fillD = `${lineD} L ${points[points.length - 1][0].toFixed(2)} ${(height - padding).toFixed(2)} L ${points[0][0].toFixed(2)} ${(height - padding).toFixed(2)} Z`;

  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`inline-block flex-shrink-0 ${className}`}
      aria-hidden="true"
    >
      {filled && <path d={fillD} fill={color} fillOpacity={0.12} />}
      <path d={lineD} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {showLastPoint && (
        <circle cx={lastX} cy={lastY} r={1.8} fill={color} stroke="white" strokeWidth={0.8} />
      )}
    </svg>
  );
}
