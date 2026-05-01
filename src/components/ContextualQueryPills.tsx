'use client';

import { Sparkles, Moon, Dumbbell, GitCompare, Pill, Leaf, Layers } from 'lucide-react';
import type { ContextualPill } from '@/data/pdpAnswers';

interface ContextualQueryPillsProps {
  pills: ContextualPill[];
  activePillId: string | null;
  onPillClick: (pillId: string) => void;
}

function iconFor(pill: ContextualPill) {
  switch (pill.id) {
    case 'sleep':      return Moon;
    case 'recovery':   return Dumbbell;
    case 'vs-citrate': return GitCompare;
    case 'dosage':     return Pill;
    case 'vegan':      return Leaf;
    case 'compare':    return Layers;
    default:           return Sparkles;
  }
}

export function ContextualQueryPills({ pills, activePillId, onPillClick }: ContextualQueryPillsProps) {
  return (
    <div className="relative rounded-2xl border border-[#D9EADF] bg-gradient-to-br from-[#F1FAF3] to-white p-4">
      {/* Left green accent bar */}
      <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full bg-[#0A6B3C]" />

      <div className="flex items-center gap-1.5 mb-2.5 pl-1">
        <Sparkles size={14} className="text-[#0A6B3C]" strokeWidth={2.25} />
        <span className="text-[12px] font-semibold text-[#0A6B3C] uppercase tracking-wider">
          Ask about this product
        </span>
      </div>

      <p className="text-[12px] text-[#555] mb-3 pl-1 leading-relaxed">
        One-tap answers pulled from our Wellness Hub &mdash; no chatbot needed.
      </p>

      <div className="flex flex-wrap gap-2">
        {pills.map((pill) => {
          const Icon = iconFor(pill);
          const isActive = activePillId === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => onPillClick(pill.id)}
              className={[
                'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12.5px] font-medium transition-all duration-150',
                'border shadow-sm hover:-translate-y-[1px] active:scale-[0.97] active:shadow-none',
                isActive
                  ? 'bg-[#0A6B3C] text-white border-[#0A6B3C]'
                  : 'bg-white text-[#1A1A1A] border-[#D9EADF] hover:border-[#0A6B3C] hover:text-[#0A6B3C]',
              ].join(' ')}
            >
              <Icon size={13} strokeWidth={2} />
              &ldquo;{pill.label}&rdquo;
            </button>
          );
        })}
      </div>
    </div>
  );
}
