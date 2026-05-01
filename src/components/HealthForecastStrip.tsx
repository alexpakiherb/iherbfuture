'use client';

import { ForecastDay } from '@/data/healthForecast';

interface HealthForecastStripProps {
  days: ForecastDay[];
  city: string;
  state: string;
  compact?: boolean;
}

function uvColor(label: ForecastDay['uvLabel']) {
  switch (label) {
    case 'Low': return '#79A83C';
    case 'Moderate': return '#F5A623';
    case 'High': return '#D14800';
    case 'Very High':
    case 'Extreme': return '#CA2222';
  }
}

function pollenColor(label: ForecastDay['pollenLevel']) {
  switch (label) {
    case 'Low': return '#79A83C';
    case 'Moderate': return '#F5A623';
    case 'High': return '#D14800';
    case 'Very High': return '#CA2222';
  }
}

export function HealthForecastStrip({ days, city, state, compact }: HealthForecastStripProps) {
  return (
    <div className="rounded-2xl border border-[#E0E0E0] bg-white p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
            7-Day Health Forecast
          </div>
          <div className="text-[14px] font-semibold text-[#1A1A1A]">{city}, {state}</div>
        </div>
        {!compact && (
          <a href="/forecast" className="text-[12px] font-medium text-[#1558A6] hover:underline">
            See full forecast →
          </a>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-1 rounded-xl p-2 ${
              i === 0
                ? 'bg-gradient-to-b from-[#F1FAF3] to-white border border-[#C3E6CB]'
                : 'border border-[#F0F0F0]'
            }`}
          >
            <div className={`text-[10.5px] font-bold ${i === 0 ? 'text-[#0A6B3C]' : 'text-[#666]'}`}>
              {day.label}
            </div>
            <div className="text-[18px] leading-none">{day.weather}</div>
            <div className="text-[11px] font-semibold text-[#1A1A1A]">
              {day.tempHigh}°
            </div>
            <div className="text-[10px] text-[#888]">{day.tempLow}°</div>

            {/* UV pill */}
            <div
              className="rounded-full px-1.5 py-0.5 text-[8.5px] font-bold uppercase text-white"
              style={{ backgroundColor: uvColor(day.uvLabel) }}
              title={`UV ${day.uvIndex}`}
            >
              UV {day.uvIndex}
            </div>

            {/* Pollen pill */}
            <div
              className="rounded-full px-1.5 py-0.5 text-[8.5px] font-bold uppercase"
              style={{
                color: pollenColor(day.pollenLevel),
                backgroundColor: `${pollenColor(day.pollenLevel)}1a`,
              }}
              title={`Pollen ${day.pollenLevel}`}
            >
              🌳 {day.pollenLevel.split(' ')[0]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
