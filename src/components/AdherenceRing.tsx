'use client';

interface AdherenceRingProps {
  percentage: number; // 0-100
  size?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}

export function AdherenceRing({
  percentage,
  size = 80,
  label,
  sublabel,
  color = '#0A6B3C',
}: AdherenceRingProps) {
  const stroke = size * 0.09;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F0F0F0"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 600ms ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[16px] font-bold" style={{ color }}>
            {percentage}%
          </span>
        </div>
      </div>
      {label && (
        <div className="text-center">
          <div className="text-[11px] font-semibold text-[#1A1A1A]">{label}</div>
          {sublabel && <div className="text-[10px] text-[#888]">{sublabel}</div>}
        </div>
      )}
    </div>
  );
}
