'use client';

// Wellness Advisor — editorial v2 (May 3, 2026).
//
// Editorial page header · Stat row (clean) · Expert + trust split ·
// Chat + automation rules (left) + Action queue (right). The console
// layout stays — it's the right shape — but the chrome on every tile
// gets lifted off so the eye lands on the chat and the queue.

import { useState } from 'react';
import {
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  PauseCircle,
  Filter,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AgentActionCard } from '@/components/AgentActionCard';
import { ContextPill } from '@/components/AIMoment';
import { SectionHeader } from '@/components/SectionHeader';
import { Bento, BentoTile } from '@/components/BentoTile';
import { Billboard } from '@/components/Billboard';
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
    { id: 'r3', rule: "Pause autoship if I'm overstocked", detail: 'Pauses when 21+ days of supply remain', on: true, color: '#0E9594' },
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

  // (advisor stats now rendered as a 4-tile Bento)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* ── 1. Billboard hero — ink-black brand moment (v3) ────────── */}
        <section className="mx-auto w-full max-w-[1500px] px-4 pt-4 sm:px-6 md:px-8 md:pt-6">
          <Billboard
            surface="ink"
            size="md"
            eyebrow="Your Wellness Advisor"
            headline={<>Ask anything. <em className="not-italic font-serif-display italic">Approve.</em> See the work.</>}
            body="Your advisor learns from your goals, your data, and the iHerb Wellness Hub. Every action is logged and reversible."
            ctaLabel="Open the chat"
            ctaHref="#chat"
            secondaryCtaLabel="See what it handled"
            secondaryCtaHref="#queue"
          />
        </section>

        {/* ── 2. Stat bento — 4 tiles, mixed accents ─────────────────── */}
        <section className="mx-auto w-full max-w-[1500px] px-4 pt-6 sm:px-6 md:px-8 md:pt-8">
          <Bento>
            <BentoTile
              variant="stat"
              span="col-span-6 lg:col-span-3"
              surface="oat"
              label="Awaiting you"
              value={stateCounts.pending.toString()}
              caption={stateCounts.pending === 0 ? 'All clear.' : stateCounts.pending === 1 ? 'One recommendation pending.' : `${stateCounts.pending} pending.`}
              accent="#0F1815"
              serif
              size="xl"
              minHeight="240px"
            />
            <BentoTile
              variant="stat"
              span="col-span-6 lg:col-span-3"
              surface="bone"
              label="Actions taken"
              value={totalActions.toString()}
              caption="last 30 days"
              trend={actionsTrend}
              accent="#0A6B3C"
              size="lg"
              minHeight="240px"
            />
            <BentoTile
              variant="stat"
              span="col-span-6 lg:col-span-3"
              surface="forest"
              label="You saved"
              value={savings}
              caption="via auto-tuning"
              trend={savingsTrend}
              accent="#FFFFFF"
              size="lg"
              minHeight="240px"
            />
            <BentoTile
              variant="stat"
              span="col-span-6 lg:col-span-3"
              surface="bone"
              label="Approval rate"
              value={approval}
              caption="of suggestions accepted"
              trend={approvalTrend}
              accent="#6B4FBC"
              size="lg"
              minHeight="240px"
            />
          </Bento>
        </section>

        {/* ── 3. Expert + trust ──────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 pt-16 md:px-10 md:pt-20">
          <div className="grid grid-cols-12 gap-6 lg:gap-10">
            <div className="col-span-12 lg:col-span-7">
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
            <div className="col-span-12 flex items-center lg:col-span-5">
              <TrustBadgeStrip
                badges={['third-party', 'gmp', 'non-gmo', 'usp']}
                density="loose"
                background="white"
              />
            </div>
          </div>
        </section>

        {/* ── 4. Chat + queue console ────────────────────────────────── */}
        <section id="chat" className="mx-auto w-full max-w-[1280px] px-6 pt-20 pb-24 md:px-10 md:pt-24 md:pb-32">
          <SectionHeader
            eyebrow="The console"
            headline="Talk to it. Watch it work."
            lede="Chat is the conversation. The queue on the right is the work — what's pending, what's done, what's paused."
          />

          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            {/* LEFT: Chat panel + automation rules */}
            <div className="col-span-12 space-y-5 lg:col-span-7">
              <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-[#EFEFEF]">
                <div className="h-[2px] bg-gradient-to-r from-[#0A6B3C] via-[#79A83C] to-[#0A6B3C]" />

                {/* Conversation */}
                <div className="max-h-[400px] min-h-[280px] space-y-3 overflow-y-auto p-6">
                  {conversation.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#0A6B3C] to-[#079A48]">
                        <Sparkles size={22} className="text-white" strokeWidth={2.5} />
                      </div>
                      <h3 className="mt-4 text-[18px] font-bold text-[#1A1A1A]" style={{ letterSpacing: '-0.012em' }}>
                        Hi {persona.firstName} — what&rsquo;s on your mind?
                      </h3>
                      <p className="mt-2 max-w-md text-[13.5px] text-[#666]" style={{ lineHeight: 1.55 }}>
                        I know your goals, your stack, and what your data is telling us.
                      </p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
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
                          <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#0A6B3C] px-4 py-2.5 text-[14px] text-white">
                            {msg.text}
                          </div>
                        </div>
                      ) : (
                        <div key={i} className="flex justify-start">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0A6B3C] to-[#079A48]">
                            <Sparkles size={13} className="text-white" strokeWidth={2.5} />
                          </div>
                          <div className="ml-2 max-w-[85%] rounded-2xl rounded-tl-md border border-[#E0E8E2] bg-[#F9FBFA] px-4 py-2.5 text-[14px] text-[#1A1A1A]" style={{ lineHeight: 1.55 }}>
                            {msg.text}
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>

                {conversation.length === 0 && (
                  <div className="border-t border-[#F2F2F2] px-6 py-4">
                    <div className="mb-2.5 text-[10.5px] font-bold uppercase text-[#666]" style={{ letterSpacing: '0.18em' }}>
                      Try asking
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSend(q)}
                          className="rounded-full border border-[#E0E0E0] bg-white px-3.5 py-2 text-[12.5px] font-medium text-[#444] transition-all hover:border-[#0A6B3C] hover:bg-[#F1FAF3] hover:text-[#0A6B3C] active:scale-[0.97]"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-[#F2F2F2] bg-white p-4">
                  <div className="flex items-center gap-2 rounded-full border border-[#D0D0D0] bg-white px-4 py-1.5 focus-within:border-[#0A6B3C] focus-within:ring-1 focus-within:ring-[#0A6B3C]">
                    <Sparkles size={14} className="text-[#0A6B3C]" strokeWidth={2.5} />
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                      placeholder="Ask your advisor..."
                      className="flex-1 bg-transparent py-2 text-[13.5px] text-[#1A1A1A] placeholder-[#999] focus:outline-none"
                    />
                    <button
                      onClick={() => handleSend(input)}
                      disabled={!input.trim()}
                      className="rounded-full bg-[#0A6B3C] p-2 text-white transition-all hover:bg-[#085131] disabled:opacity-40 disabled:hover:bg-[#0A6B3C]"
                      aria-label="Send"
                    >
                      <Send size={13} strokeWidth={2.5} />
                    </button>
                  </div>
                  <div className="mt-2 px-1 text-[11px] text-[#999]">
                    Powered by iHerb Wellness Hub. Cites sources, can act with your approval.
                  </div>
                </div>
              </div>

              {/* Automation rules */}
              <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-[#EFEFEF]">
                <div className="flex items-baseline justify-between p-6 pb-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase text-[#6B4FBC]" style={{ letterSpacing: '0.18em' }}>
                      Automation rules
                    </div>
                    <p className="mt-1.5 text-[13px] text-[#666]">What your advisor handles without asking</p>
                  </div>
                  <button className="text-[12px] font-semibold text-[#1558A6] hover:underline">
                    Manage all
                  </button>
                </div>
                {rules.map((r, i) => (
                  <div
                    key={r.id}
                    className={`flex items-center gap-4 px-6 py-4 transition-colors ${i > 0 ? 'border-t border-[#F2F2F2]' : 'border-t border-[#F2F2F2]'}`}
                  >
                    <div
                      className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: r.on ? r.color : '#D8D8D8' }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-semibold text-[#1A1A1A]">{r.rule}</div>
                      <div className="mt-0.5 text-[12px] text-[#888]">{r.detail}</div>
                    </div>
                    <button
                      onClick={() => toggleRule(r.id)}
                      className="relative h-6 w-11 flex-shrink-0 rounded-full transition-colors"
                      style={{ backgroundColor: r.on ? r.color : '#E0E0E0' }}
                      aria-label={r.on ? 'Disable rule' : 'Enable rule'}
                    >
                      <div
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                          r.on ? 'left-[22px]' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Action queue */}
            <div id="queue" className="col-span-12 lg:col-span-5">
              <div className="lg:sticky lg:top-[140px]">
                <div className="mb-4 flex items-baseline justify-between">
                  <h3 className="text-[20px] font-bold text-[#1A1A1A]" style={{ letterSpacing: '-0.012em' }}>
                    Action queue
                  </h3>
                  <span className="text-[12px] text-[#888]">
                    {filteredActions.length} of {persona.agentActions.length}
                  </span>
                </div>

                <div className="mb-3 flex items-center gap-1 rounded-full border border-[#E0E0E0] bg-white p-1">
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
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-[12px] font-semibold transition-all ${
                          active ? 'bg-[#1A1A1A] text-white' : 'text-[#444] hover:bg-[#F2F2F2]'
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

                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <Filter size={12} className="text-[#888]" strokeWidth={2.5} />
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all ${
                      categoryFilter === 'all'
                        ? 'bg-[#1A1A1A] text-white'
                        : 'border border-[#E0E0E0] text-[#666] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                    }`}
                  >
                    All
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
                        className="rounded-full px-3 py-1.5 text-[11px] font-bold transition-all"
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

                <div className="max-h-[800px] space-y-3 overflow-y-auto pr-1">
                  {filteredActions.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#E0E0E0] py-10 text-center text-[13px] italic text-[#999]">
                      No items match these filters
                    </div>
                  ) : (
                    filteredActions.map((a) => <AgentActionCard key={a.id} action={a} />)
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
