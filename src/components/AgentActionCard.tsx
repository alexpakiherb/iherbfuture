'use client';

// AgentActionCard — visualizes one autonomous action by the iHerb advisor agent.
// Three states: 'taken' (already happened), 'pending' (needs approval),
// 'paused' (paused by you or by the agent).

import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  PauseCircle,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { AgentAction } from '@/data/personas';

const CATEGORY_LABEL: Record<AgentAction['category'], string> = {
  subscription: 'Subscription',
  bundle: 'Bundle',
  protocol: 'Protocol',
  inventory: 'Inventory',
  price: 'Price',
};

const CATEGORY_TINT: Record<AgentAction['category'], string> = {
  subscription: '#0A6B3C',
  bundle: '#D14800',
  protocol: '#1558A6',
  inventory: '#79A83C',
  price: '#B38900',
};

interface AgentActionCardProps {
  action: AgentAction;
  compact?: boolean;
}

export function AgentActionCard({ action, compact }: AgentActionCardProps) {
  const [resolved, setResolved] = useState<'approved' | 'declined' | null>(null);

  const isTaken = action.type === 'taken';
  const isPending = action.type === 'pending';
  const isPaused = action.type === 'paused';

  const StatusIcon = isTaken ? CheckCircle2 : isPending ? Clock : PauseCircle;
  const statusColor = isTaken ? '#0A6B3C' : isPending ? '#D14800' : '#888';
  const statusLabel = isTaken
    ? 'Done for you'
    : isPending
      ? 'Awaiting your approval'
      : 'Paused';

  return (
    <div
      className={`group rounded-xl border bg-white transition-all ${
        isPending
          ? 'border-[#FFD9C4] shadow-[0_2px_12px_rgba(209,72,0,0.06)]'
          : 'border-[#E8E8E8]'
      } ${compact ? 'p-3' : 'p-4'} hover:border-[#0A6B3C]`}
    >
      {/* Header row: status badge + category + timestamp */}
      <div className="mb-2 flex items-center gap-2">
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
          className="text-[9.5px] font-bold uppercase tracking-widest"
          style={{ color: CATEGORY_TINT[action.category] }}
        >
          {CATEGORY_LABEL[action.category]}
        </span>
        <span className="ml-auto text-[10.5px] text-[#999]">{action.timestamp}</span>
      </div>

      {/* Body */}
      <div className="flex gap-3">
        {action.productImage && !compact && (
          <div className="relative flex-shrink-0">
            <img
              src={action.productImage}
              alt=""
              className="h-12 w-12 rounded-lg border border-[#E8E8E8] bg-[#FAFAFA] object-cover"
            />
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0A6B3C]">
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
          <div
            className={`mt-1 leading-relaxed text-[#555] ${compact ? 'text-[12px]' : 'text-[13px]'}`}
          >
            {action.detail}
          </div>

          {/* Savings badge */}
          {action.savings && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#F1FAF3] px-2 py-0.5 text-[11px] font-bold text-[#0A6B3C]">
              <span className="text-[10px]">💰</span>
              Saved {action.savings}
            </div>
          )}
        </div>
      </div>

      {/* Pending: action buttons */}
      {isPending && !resolved && (
        <div className="mt-3 flex items-center gap-2 border-t border-[#F4F4F4] pt-3">
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
        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-[#F1FAF3] px-3 py-2 text-[12px] font-medium text-[#0A6B3C]">
          <CheckCircle2 size={13} strokeWidth={2.5} />
          Approved — your advisor will set this up.
        </div>
      )}
      {resolved === 'declined' && (
        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-[#F8F8F8] px-3 py-2 text-[12px] font-medium text-[#666]">
          <X size={13} strokeWidth={2.5} />
          Skipped — your advisor will check back later.
        </div>
      )}

      {/* Taken action: optional view-detail link */}
      {isTaken && !compact && (
        <button className="mt-2 flex items-center gap-0.5 text-[11px] font-medium text-[#1558A6] hover:underline">
          See what changed
          <ArrowRight size={10} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
