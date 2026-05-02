'use client';

// Wellness Advisor — agentic-action console.
// Hero bento of advisor stats (sparklines + color zones), then 7/5 split:
// chat + automation rules on the left, filtered action queue on the right.
// The page now lives as the 5th nav tab — refocused on what the agent has
// done / is doing / wants to do, with chat as the dialog into all of it.

import { useState } from 'react';
import {
  Sparkles,
  Send,
  ArrowRight,
  CheckCircle2,
  Clock,
  PauseCircle,
  Activity,
  Zap,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AgentActionCard } from '@/components/AgentActionCard';
import { ContextPill } from '@/components/AIMoment';
import { Sparkline } from '@/components/Sparkline';
import { ExpertCallout } from '@/components/ExpertCallout';
import { TrustBadgeStrip } from '@/components/TrustBadgeStrip';
import { usePersona } from '@/components/PersonaProvider';
import { AgentAction } from '@/data/personas';
import { EXPERT_DR_CHEN } from '@/data/lifestyleImages';

type StateTab = 'all' | 'pending' | 'taken' | 'paused';
type CategoryFilter = 'all' | AgentAction['category'];

const SUGGESTED_QUESTIONS_MAYA = [
  'Why am I waking up at 3am?',
  'Magnesium glycinate vs citrate?',
  'Can I take Vitamin D and Vitamin C together?',
  'Spring allergies — what do you recommend?',
];

const SUGGESTED_QUESTIONS_DANIEL = [
  'Should I cycle creatine?',
  'What does my Whoop strain tell you about my stack?',
  'Best NMN timing given my fasting routine?',
  'Glycine + magnesium for deep sleep — show me the research',
];

// Trend mocks for hero stats
const ACTIONS_TREND_MAYA = [0, 0, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 7, 7, 8, 8, 8, 9, 9, 10, 10, 10, 10, 11, 11, 11, 12, 12, 12];
const ACTIONS_TREND_DANIEL = [4, 8, 11, 14, 18, 22, 25, 28, 31, 34, 36, 38, 40, 41, 42, 43, 44, 44, 45, 45, 45, 45, 46, 46, 46, 47, 47, 47, 47, 47];
const SAVINGS_TREND_MAYA = [0, 1, 2, 3, 5, 8, 10, 11, 11, 13, 14, 15, 15, 17, 18, 19, 20, 20, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23];
const SAVINGS_TREND_DANIEL = [12, 25, 38, 47, 62, 75, 88, 95, 105, 118, 130, 138, 150, 165, 178, 188, 195, 198, 198, 198, 198, 198, 198, 198, 198, 198, 198, 198, 198, 187];
const APPROVAL_TREND_MAYA = [60, 62, 65, 68, 70, 70, 72, 72, 73, 74, 74, 75, 75, 76, 76, 76, 76, 77, 77, 77, 77, 77, 77, 78, 78, 78, 78, 78, 78, 78];
const APPROVAL_TREND_DANIEL = [82, 85, 87, 88, 89, 90, 90, 91, 91, 92, 92, 92, 92, 92, 92, 93, 93, 93, 93, 93, 93, 94, 94, 94, 94, 94, 94, 94, 94, 94];

const CATEGORY_TINT: Record<AgentAction['category'], { fg: string; bg: string }> = {
  subscription: { fg: '#0A6B3C', bg: '#F1FAF3' },
  bundle:       { fg: '#D14800', bg: '#FFF7F1' },
  protocol:     { fg: '#6B4FBC', bg: '#F4F0FB' },
  inventory:    { fg: '#0E9594', bg: '#E5F6F5' },
  price:        { fg: '#B38900', bg: '#FFF7E5' },
};

const CATEGORY_LABEL: Record<AgentAction['category'], string> = {
  subscription: 'Subscription',
  bundle: 'Bundle',
  protocol: 'Protocol',
  inventory: 'Inventory',
  price: 'Price',
};

export default function AdvisorPage() {
  const { persona } = usePersona();
  const [stateTab, setStateTab] = useState<StateTab>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState<{ from: 'user' | 'advisor'; text: string }[]>([]);

  const isMaya = persona.id === 'maya';
  const suggestedQuestions = isMaya ? SUGGESTED_QUESTIONS_MAYA : SUGGESTED_QUESTIONS_DANIEL;

  const filteredActions = persona.agentActions
    .filter((a) => stateTab === 'all' ? true : a.type === stateTab)
    .filter((a) => categoryFilter === 'all' ? true : a.category === categoryFilter);

  const stateCounts = {
    all: persona.agentActions.length,
    pending: persona.agentActions.filter((a) => a.type === 'pending').length,
    taken: persona.agentActions.filter((a) => a.type === 'taken').length,
    paused: persona.agentActions.filter((a) => a.type === 'paused').length,
  };

  // Per-category counts for filter chips
  const categoryCounts = persona.agentActions.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  }, {});

  const totalActions = isMaya ? 12 : 47;
  const savings = isMaya ? '$23' : '$187';
  const approval = isMaya ? '78%' : '94%';
  const actionsTrend = isMaya ? ACTIONS_TREND_MAYA : ACTIONS_TREND_DANIEL;
  const savingsTrend = isMaya ? SAVINGS_TREND_MAYA : SAVINGS_TREND_DANIEL;
  const approvalTrend = isMaya ? APPROVAL_TREND_MAYA : APPROVAL_TREND_DANIEL;

  const [rules, setRules] = useState([
    { id: 'r1', rule: 'Auto-optimize delivery timing', detail: 'Adjusts subscription dates based on actual usage', on: true, color: '#0A6B3C' },
    { id: 'r2', rule: 'Lock in lower prices when promos hit', detail: 'Applies to active autoship items', on: true, color: '#B38900' },
    { id: 'r3', rule: 'Pause autoship if I\'m overstocked', detail: 'Pauses when 21+ days of supply remain', on: true, color: '#0E9594' },
    {
      id: 'r4',
      rule: 'Modify protocol based on biometric data',
      detail: isMaya ? 'Apple Health only' : 'Whoop, Oura, CGM',
      on: !isMaya,
      color: '#6B4FBC',
    },
    { id: 'r5', rule: 'Smart bundle detection', detail: 'Auto-applies bundle discounts at checkout', on: true, color: '#D14800' },
  ]);

  const toggleRule = (id: string) =>
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, on: !r.on } : r)));

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const lowerText = text.toLowerCase();

    let response = '';
    if (lowerText.includes('sleep') || lowerText.includes('waking')) {
      response = isMaya
        ? "Waking at 3am often points to cortisol or blood sugar. Your magnesium glycinate is great — try moving it to 30 min before bed. I'd also add 100mg L-Theanine for the next 2 weeks. Want me to add that as a trial?"
        : "Your Oura deep sleep has been flat at 82 min for 30+ days. Glycine 3g pre-bed is the most evidence-backed addition for your protocol. I drafted a 21-day trial — review it in your Pending queue.";
    } else if (lowerText.includes('magnesium')) {
      response = "Glycinate pairs magnesium with glycine for a calming effect — best for sleep. Citrate is well-absorbed but has a mild laxative effect. Threonate crosses the blood-brain barrier and is the go-to for cognitive support. Want me to walk through which fits your goals?";
    } else if (lowerText.includes('whoop') || lowerText.includes('strain')) {
      response = "Whoop says your 30-day strain average is 14.8 — slightly above your sustainable baseline of 13.5. Your creatine bump and sleep stack are recovering you, but I'd watch HRV closely this week. If it dips below 60 for two days, I'll auto-adjust your evening ashwagandha.";
    } else if (lowerText.includes('allerg') || lowerText.includes('pollen')) {
      response = "Austin tree and grass pollen is in the top 10% of the year. Quercetin + Bromelain pairs with your existing Vitamin C. I can add both for the next 6 weeks. Want me to draft a seasonal protocol?";
    } else {
      response = "Good question. Let me look at your current stack and goals to give you a grounded answer based on the iHerb Wellness Hub. One moment...";
    }

    setConversation((prev) => [...prev, { from: 'user', text }, { from: 'advisor', text: response }]);
    setInput('');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-8 py-6">
        {/* ── Page header ──────────────────────────────────────── */}
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-1.5 text-[#0A6B3C]">
            <Sparkles size={13} strokeWidth={2.5} />
            <span className="text-[10.5px] font-bold uppercase tracking-widest">
              Your Wellness Advisor
            </span>
          </div>
          <h1 className="text-[28px] font-bold text-[#1A1A1A]">
            Ask anything. Approve actions. See the work.
          </h1>
          <p className="mt-1 text-[13.5px] text-[#666]">
            Your advisor learns from your goals, your data, and the iHerb Wellness Hub. Everything is logged and reversible.
          </p>
        </div>

        {/* ── Hero stats bento (4 tiles) ───────────────────────── */}
        <section className="mb-5 grid grid-cols-12 gap-4">
          {/* Pending — coral */}
          <div className="col-span-3 overflow-hidden rounded-2xl border border-[#FFC7B0] bg-gradient-to-br from-[#FFF1E8] via-[#FFE8DC] to-[#FFD9C4] p-5">
            <div className="mb-2 flex items-center gap-1.5">
              <Clock size={13} className="text-[#FF6B4A]" strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D14800]">
                Awaiting you
              </span>
            </div>
            <div className="text-[36px] font-bold leading-none text-[#7B4022]">{stateCounts.pending}</div>
            <div className="mt-1 text-[11.5px] text-[#7B4022]">
              {stateCounts.pending === 0 ? 'all clear' : stateCounts.pending === 1 ? 'recommendation pending' : 'recommendations pending'}
            </div>
          </div>

          {/* Actions taken — green */}
          <div className="col-span-3 overflow-hidden rounded-2xl border border-[#C3E6CB] bg-gradient-to-br from-[#F1FAF3] via-[#E8F5EC] to-[#DDF0E1] p-5">
            <div className="mb-2 flex items-center gap-1.5">
              <Activity size={13} className="text-[#0A6B3C]" strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A6B3C]">
                Actions taken
              </span>
            </div>
            <div className="flex items-end gap-2">
              <div className="text-[36px] font-bold leading-none text-[#1F5034]">{totalActions}</div>
            </div>
            <div className="mt-1 text-[11.5px] text-[#3A6E4E]">last 30 days</div>
            <div className="mt-2">
              <Sparkline values={actionsTrend} color="#0A6B3C" width={140} height={20} />
            </div>
          </div>

          {/* Saved — teal */}
          <div className="col-span-3 overflow-hidden rounded-2xl border border-[#A7DDDC] bg-gradient-to-br from-[#E5F6F5] via-[#D4EFEE] to-[#BFE6E4] p-5">
            <div className="mb-2 flex items-center gap-1.5">
              <Zap size={13} className="text-[#0E9594]" strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0E9594]">
                You saved
              </span>
            </div>
            <div className="text-[36px] font-bold leading-none text-[#0A4A4A]">{savings}</div>
            <div className="mt-1 text-[11.5px] text-[#1F6E6D]">via auto-tuning</div>
            <div className="mt-2">
              <Sparkline values={savingsTrend} color="#0E9594" width={140} height={20} />
            </div>
          </div>

          {/* Approval rate — purple */}
          <div className="col-span-3 overflow-hidden rounded-2xl border border-[#D6C8F0] bg-gradient-to-br from-[#F4F0FB] via-[#EDE6F8] to-[#E2D9F4] p-5">
            <div className="mb-2 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#6B4FBC]" strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B4FBC]">
                Approval rate
              </span>
            </div>
            <div className="text-[36px] font-bold leading-none text-[#3A2680]">{approval}</div>
            <div className="mt-1 text-[11.5px] text-[#5C3FA8]">of suggestions accepted</div>
            <div className="mt-2">
              <Sparkline values={approvalTrend} color="#6B4FBC" width={140} height={20} />
            </div>
          </div>
        </section>

        {/* ── Expert callout + trust strip ─────────────────────── */}
        <section className="mb-5 grid grid-cols-12 gap-4">
          <div className="col-span-7">
            <ExpertCallout
              portraitUrl={EXPERT_DR_CHEN.url}
              name="Dr. Sarah Chen"
              credentials="ND, MS"
              title="Naturopathic Doctor · iHerb Wellness Hub"
              endorsement={
                isMaya
                  ? 'Reviews every protocol your advisor recommends and only ships changes that match the published Wellness Hub research. You can trust the AI because she can.'
                  : 'Backs your longevity protocol and personally reviewed your sleep stack 3 months ago. Your advisor can act in this lane without re-asking.'
              }
              expertiseChips={['Sleep', 'Mineral repletion', 'Allergy protocols', 'Longevity']}
            />
          </div>
          <div className="col-span-5 flex items-center">
            <TrustBadgeStrip
              badges={['third-party', 'gmp', 'non-gmo', 'usp']}
              density="loose"
              background="tinted"
            />
          </div>
        </section>

        <div className="grid grid-cols-12 gap-5">
          {/* ── LEFT: Chat panel + automation rules ─────────── */}
          <section className="col-span-7 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-[#D9EADF] bg-white shadow-[0_2px_16px_rgba(10,107,60,0.05)]">
              <div className="h-[3px] bg-gradient-to-r from-[#0A6B3C] via-[#79A83C] to-[#0A6B3C]" />

              {/* Conversation area */}
              <div className="max-h-[320px] min-h-[220px] space-y-3 overflow-y-auto p-5">
                {conversation.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0A6B3C] to-[#079A48]">
                      <Sparkles size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="mt-3 text-[15px] font-bold text-[#1A1A1A]">
                      Hi {persona.firstName} — what&rsquo;s on your mind?
                    </h3>
                    <p className="mt-1 max-w-md text-[12.5px] text-[#666]">
                      I know your goals, your stack, and what your data is telling us.
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                      {persona.contextHints.slice(0, 3).map((h) => (
                        <ContextPill
                          key={h}
                          label={h}
                          variant={h.toLowerCase().includes('whoop') || h.toLowerCase().includes('hrv') ? 'data' : 'default'}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  conversation.map((msg, i) =>
                    msg.from === 'user' ? (
                      <div key={i} className="flex justify-end">
                        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#0A6B3C] px-4 py-2.5 text-[13.5px] text-white">
                          {msg.text}
                        </div>
                      </div>
                    ) : (
                      <div key={i} className="flex justify-start">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0A6B3C] to-[#079A48]">
                          <Sparkles size={12} className="text-white" strokeWidth={2.5} />
                        </div>
                        <div className="ml-2 max-w-[85%] rounded-2xl rounded-tl-md border border-[#E0E8E2] bg-[#F9FBFA] px-4 py-2.5 text-[13.5px] leading-relaxed text-[#1A1A1A]">
                          {msg.text}
                        </div>
                      </div>
                    )
                  )
                )}
              </div>

              {conversation.length === 0 && (
                <div className="border-t border-[#F0F0F0] px-5 py-3">
                  <div className="mb-2 text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                    Try asking
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="rounded-full border border-[#D0D0D0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#444] transition-all hover:border-[#0A6B3C] hover:bg-[#F1FAF3] hover:text-[#0A6B3C] active:scale-[0.97]"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-[#F0F0F0] bg-white p-3">
                <div className="flex items-center gap-2 rounded-full border border-[#D0D0D0] bg-white px-3 py-1 focus-within:border-[#0A6B3C] focus-within:ring-1 focus-within:ring-[#0A6B3C]">
                  <Sparkles size={14} className="text-[#0A6B3C]" strokeWidth={2.5} />
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                    placeholder="Ask your advisor..."
                    className="flex-1 bg-transparent py-1.5 text-[13px] text-[#1A1A1A] placeholder-[#999] focus:outline-none"
                  />
                  <button
                    onClick={() => handleSend(input)}
                    disabled={!input.trim()}
                    className="rounded-full bg-[#0A6B3C] p-1.5 text-white transition-all hover:bg-[#085131] disabled:opacity-40 disabled:hover:bg-[#0A6B3C]"
                    aria-label="Send"
                  >
                    <Send size={13} strokeWidth={2.5} />
                  </button>
                </div>
                <div className="mt-1.5 px-1 text-[10px] text-[#999]">
                  Powered by iHerb Wellness Hub. Cites sources, can act with your approval.
                </div>
              </div>
            </div>

            {/* Automation rules */}
            <div className="overflow-hidden rounded-2xl border border-[#D6C8F0] bg-gradient-to-br from-white via-white to-[#F4F0FB] p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10.5px] font-bold uppercase tracking-widest text-[#6B4FBC]">
                    Automation rules
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#666]">
                    What your advisor handles without asking
                  </p>
                </div>
                <button className="text-[11px] font-medium text-[#1558A6] hover:underline">
                  Manage all rules
                </button>
              </div>
              <div className="space-y-1.5">
                {rules.map((r) => (
                  <div
                    key={r.id}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all ${
                      r.on
                        ? 'border-[#D6C8F0] bg-white/70'
                        : 'border-[#F0F0F0] bg-white hover:border-[#D9EADF] hover:bg-[#FAFBFA]'
                    }`}
                  >
                    {/* Color dot indicating which category this rule belongs to */}
                    <div
                      className="h-2 w-2 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: r.on ? r.color : '#D0D0D0' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-semibold text-[#1A1A1A]">{r.rule}</div>
                      <div className="text-[11px] text-[#888]">{r.detail}</div>
                    </div>
                    <button
                      onClick={() => toggleRule(r.id)}
                      className="relative h-5 w-9 flex-shrink-0 rounded-full transition-colors"
                      style={{ backgroundColor: r.on ? r.color : '#E0E0E0' }}
                      aria-label={r.on ? 'Disable rule' : 'Enable rule'}
                    >
                      <div
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                          r.on ? 'left-[18px]' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── RIGHT: Action Queue ─────────────────────────── */}
          <section className="col-span-5">
            <div className="sticky top-[140px]">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-[16px] font-bold text-[#1A1A1A]">Action queue</h2>
                <span className="text-[11.5px] text-[#888]">
                  {filteredActions.length} of {persona.agentActions.length}
                </span>
              </div>

              {/* State tabs (All / Pending / Taken / Paused) */}
              <div className="mb-2.5 flex items-center gap-1 rounded-full border border-[#E0E0E0] bg-white p-1">
                {(
                  [
                    { id: 'all', label: 'All', icon: null, count: stateCounts.all },
                    { id: 'pending', label: 'Pending', icon: Clock, count: stateCounts.pending },
                    { id: 'taken', label: 'Taken', icon: CheckCircle2, count: stateCounts.taken },
                    { id: 'paused', label: 'Paused', icon: PauseCircle, count: stateCounts.paused },
                  ] as const
                ).map((t) => {
                  const active = stateTab === t.id;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setStateTab(t.id)}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[11.5px] font-semibold transition-all ${
                        active
                          ? 'bg-[#0A6B3C] text-white'
                          : 'text-[#444] hover:bg-[#F1FAF3] hover:text-[#0A6B3C]'
                      }`}
                    >
                      {Icon && <Icon size={11} strokeWidth={2.5} />}
                      {t.label}
                      <span
                        className={`rounded-full px-1.5 py-0 text-[10px] font-bold ${
                          active ? 'bg-white/20 text-white' : 'bg-[#F0F0F0] text-[#666]'
                        }`}
                      >
                        {t.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Category filter chips */}
              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                <Filter size={11} className="text-[#888]" strokeWidth={2.5} />
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold transition-all ${
                    categoryFilter === 'all'
                      ? 'bg-[#1A1A1A] text-white'
                      : 'border border-[#E0E0E0] text-[#666] hover:border-[#0A6B3C] hover:text-[#0A6B3C]'
                  }`}
                >
                  All categories
                </button>
                {(Object.keys(CATEGORY_LABEL) as AgentAction['category'][]).map((cat) => {
                  const count = categoryCounts[cat] ?? 0;
                  if (count === 0) return null;
                  const tint = CATEGORY_TINT[cat];
                  const active = categoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className="rounded-full px-2.5 py-1 text-[10.5px] font-bold transition-all"
                      style={{
                        backgroundColor: active ? tint.fg : tint.bg,
                        color: active ? 'white' : tint.fg,
                        border: active ? 'none' : `1px solid ${tint.bg}`,
                      }}
                    >
                      {CATEGORY_LABEL[cat]} · {count}
                    </button>
                  );
                })}
              </div>

              {/* Action list */}
              <div className="max-h-[700px] space-y-2.5 overflow-y-auto pr-1">
                {filteredActions.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#E0E0E0] py-8 text-center text-[12.5px] italic text-[#999]">
                    No items match these filters
                  </div>
                ) : (
                  filteredActions.map((a) => <AgentActionCard key={a.id} action={a} />)
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
