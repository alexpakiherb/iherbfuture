'use client';

// Wellness Advisor — chat input + suggested questions + agent action console.
// Demonstrates how AI is treated as a teammate that earns trust through a
// visible audit log of actions taken on the user's behalf.

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
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AgentActionCard } from '@/components/AgentActionCard';
import { ContextPill } from '@/components/AIMoment';
import { usePersona } from '@/components/PersonaProvider';

type Tab = 'all' | 'pending' | 'taken' | 'paused';

const SUGGESTED_QUESTIONS_MAYA = [
  'Why am I waking up at 3am?',
  'What\'s the difference between magnesium glycinate and citrate?',
  'Can I take Vitamin D and Vitamin C together?',
  'I have spring allergies — what do you recommend?',
];

const SUGGESTED_QUESTIONS_DANIEL = [
  'Should I cycle creatine?',
  'What does my Whoop strain tell you about my stack?',
  'Best timing for NMN given my morning fasting routine?',
  'Glycine + magnesium for deep sleep — show me the research',
];

export default function AdvisorPage() {
  const { persona } = usePersona();
  const [tab, setTab] = useState<Tab>('all');
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState<{ from: 'user' | 'advisor'; text: string }[]>([]);

  const suggestedQuestions =
    persona.id === 'maya' ? SUGGESTED_QUESTIONS_MAYA : SUGGESTED_QUESTIONS_DANIEL;

  const filteredActions = persona.agentActions.filter((a) =>
    tab === 'all' ? true : a.type === tab
  );

  const counts = {
    all: persona.agentActions.length,
    pending: persona.agentActions.filter((a) => a.type === 'pending').length,
    taken: persona.agentActions.filter((a) => a.type === 'taken').length,
    paused: persona.agentActions.filter((a) => a.type === 'paused').length,
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const lowerText = text.toLowerCase();

    // Mock advisor response — keyed to a few topics
    let response = '';
    if (lowerText.includes('sleep') || lowerText.includes('waking')) {
      response =
        persona.id === 'maya'
          ? "Waking at 3am often points to cortisol or blood sugar. Your magnesium glycinate is great — try moving it to 30 min before bed. I'd also add 100mg L-Theanine for the next 2 weeks to test if it helps stabilize your sleep architecture. Want me to add that as a trial?"
          : 'Your Oura deep sleep has been flat at 82 min for 30+ days. Glycine 3g pre-bed is the most evidence-backed addition for your protocol. I drafted a 21-day trial — review it in your Pending queue.';
    } else if (lowerText.includes('magnesium')) {
      response =
        'Glycinate pairs magnesium with glycine for a calming effect — best for sleep and anxiety. Citrate is well-absorbed and budget-friendly but has a mild laxative effect. Threonate crosses the blood-brain barrier and is the go-to for cognitive support. Want me to walk through which fits your goals?';
    } else if (lowerText.includes('whoop') || lowerText.includes('strain')) {
      response =
        'Whoop says your 30-day strain average is 14.8 — slightly above your sustainable baseline of 13.5. Your creatine bump and sleep stack are doing their job recovering you, but I\'d watch HRV closely this week. If it dips below 60 for two days, I\'ll automatically adjust your evening ashwagandha to address cortisol.';
    } else if (lowerText.includes('allerg') || lowerText.includes('pollen')) {
      response =
        "Austin tree and grass pollen is in the top 10% of the year. Quercetin + Bromelain (for natural antihistamine support) and stinging nettle pair well with your existing Vitamin C. I can add both to your routine for the next 6 weeks. Want me to draft a seasonal protocol?";
    } else {
      response =
        "Good question. Let me look at your current stack and goals to give you a grounded answer based on the iHerb Wellness Hub. One moment...";
    }

    setConversation((prev) => [...prev, { from: 'user', text }, { from: 'advisor', text: response }]);
    setInput('');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-8 py-6">
        {/* Page header */}
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-1.5 text-[#0A6B3C]">
            <Sparkles size={13} strokeWidth={2.5} />
            <span className="text-[10.5px] font-bold uppercase tracking-widest">
              Your Wellness Advisor
            </span>
          </div>
          <h1 className="text-[26px] font-bold text-[#1A1A1A]">
            Ask anything. Approve actions. See the work.
          </h1>
          <p className="mt-1 text-[13.5px] text-[#666]">
            Your advisor learns from your goals, your data, and the iHerb Wellness Hub. Everything it does is logged and reversible.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-5">
          {/* ── LEFT — Chat ───────────────────────────────────────── */}
          <section className="col-span-7 flex flex-col gap-4">
            <div className="overflow-hidden rounded-2xl border border-[#D9EADF] bg-white shadow-[0_2px_16px_rgba(10,107,60,0.05)]">
              <div className="h-[3px] bg-gradient-to-r from-[#0A6B3C] via-[#79A83C] to-[#0A6B3C]" />

              {/* Conversation area */}
              <div className="max-h-[420px] min-h-[280px] space-y-3 overflow-y-auto p-5">
                {conversation.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0A6B3C] to-[#079A48]">
                      <Sparkles size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="mt-3 text-[15px] font-bold text-[#1A1A1A]">
                      Hi {persona.firstName} — what’s on your mind?
                    </h3>
                    <p className="mt-1 max-w-md text-[12.5px] text-[#666]">
                      I know your goals, your stack, and what your data is telling us.
                      Ask me anything from product comparisons to protocol design.
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

              {/* Suggested questions (only when empty) */}
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

              {/* Input */}
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
                  Powered by iHerb Wellness Hub. Your advisor cites its sources and can act on your behalf with your approval.
                </div>
              </div>
            </div>

            {/* Performance card */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-[#E0E0E0] bg-white p-3">
                <div className="flex items-center gap-1.5">
                  <Activity size={12} className="text-[#0A6B3C]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#666]">
                    Actions taken
                  </span>
                </div>
                <div className="mt-1 text-[20px] font-bold text-[#1A1A1A]">
                  {persona.id === 'maya' ? '12' : '47'}
                </div>
                <div className="text-[10.5px] text-[#888]">last 30 days</div>
              </div>
              <div className="rounded-xl border border-[#E0E0E0] bg-white p-3">
                <div className="flex items-center gap-1.5">
                  <Zap size={12} className="text-[#D14800]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#666]">
                    You saved
                  </span>
                </div>
                <div className="mt-1 text-[20px] font-bold text-[#1A1A1A]">
                  ${persona.id === 'maya' ? '23' : '187'}
                </div>
                <div className="text-[10.5px] text-[#888]">via auto-tuning</div>
              </div>
              <div className="rounded-xl border border-[#E0E0E0] bg-white p-3">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-[#1558A6]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#666]">
                    Approval rate
                  </span>
                </div>
                <div className="mt-1 text-[20px] font-bold text-[#1A1A1A]">
                  {persona.id === 'maya' ? '78%' : '94%'}
                </div>
                <div className="text-[10.5px] text-[#888]">of suggestions</div>
              </div>
            </div>

            {/* Automation rules card */}
            <div className="rounded-2xl border border-[#E0E0E0] bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                    Automation rules
                  </div>
                  <p className="mt-0.5 text-[12.5px] text-[#666]">
                    Things your advisor handles without asking
                  </p>
                </div>
                <button className="text-[11px] font-medium text-[#1558A6] hover:underline">
                  Manage rules
                </button>
              </div>
              <div className="space-y-1.5">
                {[
                  { rule: 'Auto-optimize delivery timing', detail: 'Adjusts subscription dates based on actual usage patterns', on: true },
                  { rule: 'Lock in lower prices when promos hit', detail: 'Applies to active autoship items', on: true },
                  { rule: 'Pause autoship if I\'m overstocked', detail: 'Pauses when 21+ days of supply remain', on: true },
                  {
                    rule: 'Modify protocol based on biometric data',
                    detail: persona.id === 'daniel' ? 'Whoop, Oura, CGM' : 'Apple Health',
                    on: persona.id === 'daniel',
                  },
                  { rule: 'Smart bundle detection', detail: 'Auto-applies bundle discounts at checkout', on: true },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-[#F0F0F0] px-3 py-2 transition-all hover:border-[#D9EADF] hover:bg-[#FAFBFA]"
                  >
                    <div>
                      <div className="text-[12.5px] font-semibold text-[#1A1A1A]">{r.rule}</div>
                      <div className="text-[11px] text-[#888]">{r.detail}</div>
                    </div>
                    <div
                      className={`relative h-5 w-9 rounded-full transition-colors ${
                        r.on ? 'bg-[#0A6B3C]' : 'bg-[#E0E0E0]'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                          r.on ? 'left-[18px]' : 'left-0.5'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── RIGHT — Action Queue ─────────────────────────────── */}
          <section className="col-span-5">
            <div className="sticky top-[140px]">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-[16px] font-bold text-[#1A1A1A]">Action queue</h2>
                <span className="text-[11.5px] text-[#888]">
                  {persona.agentActions.length} total
                </span>
              </div>

              {/* Tabs */}
              <div className="mb-3 flex items-center gap-1 rounded-full border border-[#E0E0E0] bg-white p-1">
                {(
                  [
                    { id: 'all', label: 'All', icon: null, count: counts.all },
                    { id: 'pending', label: 'Pending', icon: Clock, count: counts.pending },
                    { id: 'taken', label: 'Taken', icon: CheckCircle2, count: counts.taken },
                    { id: 'paused', label: 'Paused', icon: PauseCircle, count: counts.paused },
                  ] as const
                ).map((t) => {
                  const active = tab === t.id;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] font-semibold transition-all ${
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

              {/* Action list */}
              <div className="max-h-[700px] space-y-2.5 overflow-y-auto pr-1">
                {filteredActions.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#E0E0E0] py-8 text-center text-[12.5px] italic text-[#999]">
                    No items in this tab
                  </div>
                ) : (
                  filteredActions.map((a) => <AgentActionCard key={a.id} action={a} compact />)
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
