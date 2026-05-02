'use client';

// AgentActionCard — visualizes one autonomous action by the iHerb advisor agent.
// Three states: 'taken' (already happened), 'pending' (needs approval),
// 'paused' (paused by you or by the agent).
//
// Visual recipe: tight body copy, a colored category strip on the left edge,
// and a delta row that pulls savings/timing/metric changes out of the prose
// into chips and sparkline thumbs. Reduces text density while preserving meaning.

import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  PauseCircle,
  Sparkles,
  ArrowRight,
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  CircleDollarSign,
} from 'lucide-react';
import { AgentAction } from '@/data/personas';
import { Sparkline } from './Sparkline';

const CATEGORY_LABEL: Record<AgentAction['category'], string> = {
  subscription: 'Subscription',
  bundle: 'Bundle',
  protocol: 'Protocol',
  inventory: 'Inventory',
  price: 'Price',
};

// Each category gets a distinct color zone so a glance tells you what type of
// action this is. New accent palette adds coral + purple for visual variety.
const CATEGORY_TINT: Record<AgentAction['category'], { fg: string; bg: string; bar: string }> = {
  subscription: { fg: '#0A6B3C', bg: '#F1FAF3', bar: '#0A6B3C' },
  bundle:       { fg: '#D14800', bg: '#FFF7F1', bar: '#D14800' },
  protocol:     { fg: '#6B4FBC', bg: '#F4F0FB', bar: '#6B4FBC' }, // purple
  inventory:    { fg: '#0E9594', bg: '#E5F6F5', bar: '#0E9594' }, // teal
  price:        { fg: '#B38900', bg: '#FFF7E5', bar: '#F5A623' },
};

// Optional small visual rendered under the body. Most actions in personas.ts
// only need a savings chip; some can pass a sparkline for dramatic effect.
export interface ActionDelta {
  /** A small text-and-color chip like "Sleep score ↑ 12%" or "May 18 → May 21". */
  label?: string;
  /** Direction of change (drives icon). */
  direction?: 'up' | 'down' | 'neutral' | 'date' | 'savings';
  /** Optional series for an inline sparkline thumb. */
  sparkline?: number[];
  /** Optional override color (hex). Defaults to category color. */
  color?: string;
}

interface AgentActionCardProps {
  action: AgentAction;
  /** Compact layout: smaller padding, no sparkline, single-line body. */
  compact?: boolean;
  /** Optional delta visual (savings / metric trend / date shift). */
  delta?: ActionDelta;
}

export function AgentActionCard({ action, compact, delta }: AgentActionCardProps) {
  const [resolved, setResolved] = useState<'approved' | 'declined' | null>(null);

  const isTaken = action.type === 'taken';
  const isPending = action.type === 'pending';
  const isPaused = action.type === 'paused';

  const StatusIcon = isTaken ? CheckCircle2 : isPending ? Clock : PauseCircle;
  const statusColor = isTaken ? '#0A6B3C' : isPending ? '#D14800' : '#888';
  const statusLabel = isTaken
    ? 'Done for you'
    : isPending
      ? 'Awaiting approval'
      : 'Paused';

  const tint = CATEGORY_TINT[action.category];

  // Build a synthesized delta if the caller didn't pass one but we have signal
  // from the action itself (savings, date shift in detail, etc.). Keeps the
  // tighter visual without requiring every callsite to be updated.
  const inferredDelta: ActionDelta | undefined = delta
    ?? (action.savings
      ? { label: action.savings, direction: 'savings', color: tint.fg }
      : undefined);

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-white transition-all ${
        isPending
          ? 'border-[#FFD9C4] shadow-[0_2px_12px_rgba(209,72,0,0.06)]'
          : 'border-[#E8E8E8]'
      } ${compact ? 'p-3' : 'p-4'} hover:border-[#0A6B3C]`}
    >
      {/* Left-edge category strip */}
      <div
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ backgroundColor: tint.bar }}
      />

      {/* Header row: status badge + category + timestamp */}
      <div className="mb-2 flex items-center gap-2 pl-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
          style={{
            color: statusColor,
            backgroundColor: isPending ? '#FFF1E8' : isTaken ? '#F1FAF3' : '#F4F4F4',
          }}
        >
          <StatusIcon size={10} strokeWidth={2.8} />
          {statusLabel}
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-widest"
          style={{ color: tint.fg, backgroundColor: tint.bg }}
        >
          {CATEGORY_LABEL[action.category]}
        </span>
        <span className="ml-auto text-[10.5px] text-[#999]">{action.timestamp}</span>
      </div>

      {/* Body */}
      <div className="flex gap-3 pl-2">
        {action.productImage && !compact && (
          <div className="relative flex-shrink-0">
            <img
              src={action.productImage}
              alt=""
              className="h-12 w-12 rounded-lg border border-[#E8E8E8] bg-white object-contain p-1"
            />
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0A6B3C] ring-2 ring-white">
              <Sparkles size={8} className="text-white" strokeWidth={3} />
            </div>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div
            className={`font-semibold leading-snug text-[#1A1A1A] ${compact ? 'text-[13px]' : 'text-[14px]'}`}
          >
            {action.title}
          </div>

          {/* Tighter body: 1 line by default in compact mode, 2 lines in regular */}
          <div
            className={`mt-1 leading-snug text-[#555] ${compact ? 'line-clamp-1 text-[12px]' : 'line-clamp-2 text-[13px]'}`}
          >
            {action.detail}
          </div>

          {/* Delta row — compact visual representation of the action's effect. */}
          {inferredDelta && (
            <div className="mt-2 flex items-center gap-2">
              <DeltaChip delta={inferredDelta} />
              {inferredDelta.sparkline && !compact && (
                <Sparkline
                  values={inferredDelta.sparkline}
                  color={inferredDelta.color ?? tint.fg}
                  width={56}
                  height={16}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pending: action buttons */}
      {isPending && !resolved && (
        <div className="mt-3 flex items-center gap-2 border-t border-[#F4F4F4] pt-3 pl-2">
          <button
            onClick={() => setResolved('approved')}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#0A6B3C] px-3 py-1.5 text-[12px] font-bold text-white transition-all hover:bg-[#085131] active:scale-[0.97]"
          >
            <CheckCircle2 size={13} strokeWidth={2.5} />
            Approve
          </button>
          <button
            onClick={() => setResolved('declined')}
            className="rounded-full border border-[#D0D0D0] px-3 py-1.5 text-[12px] font-medium text-[#666] transition-all hover:border-[#999] hover:text-[#333]"
          >
            Skip
          </button>
          {action.approvalDeadline && (
            <span className="ml-auto text-[10.5px] text-[#999]">
              {action.approvalDeadline}
            </span>
          )}
        </div>
      )}

      {resolved === 'approved' && (
        <div className="mt-3 ml-2 flex items-center gap-1.5 rounded-lg bg-[#F1FAF3] px-3 py-2 text-[12px] font-medium text-[#0A6B3C]">
          <CheckCircle2 size={13} strokeWidth={2.5} />
          Approved — your advisor will set this up.
        </div>
      )}
      {resolved === 'declined' && (
        <div className="mt-3 ml-2 flex items-center gap-1.5 rounded-lg bg-[#F8F8F8] px-3 py-2 text-[12px] font-medium text-[#666]">
          <X size={13} strokeWidth={2.5} />
          Skipped — your advisor will check back later.
        </div>
      )}

      {/* Taken action: optional view-detail link */}
      {isTaken && !compact && (
        <button className="mt-2 ml-2 flex items-center gap-0.5 text-[11px] font-medium text-[#1558A6] hover:underline">
          See what changed
          <ArrowRight size={10} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

// ── Delta chip ──────────────────────────────────────────────────────────────

function DeltaChip({ delta }: { delta: ActionDelta }) {
  const { label, direction, color = '#0A6B3C' } = delta;
  if (!label) return null;

  let Icon = TrendingUp;
  if (direction === 'down') Icon = TrendingDown;
  if (direction === 'date') Icon = Calendar;
  if (direction === 'savings') Icon = CircleDollarSign;

  // Hex → rgba helper for soft chip background.
  const toBg = (hex: string, a = 0.12) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
      style={{ color, backgroundColor: toBg(color) }}
    >
      <Icon size={11} strokeWidth={2.5} />
      {direction === 'savings' && !label.startsWith('Saved') ? `Saved ${label}` : label}
    </span>
  );
}
