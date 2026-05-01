'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, Check, Sun, Cloud, Moon } from 'lucide-react';
import { usePersona } from './PersonaProvider';
import { PERSONAS, PersonaId } from '@/data/personas';

// A floating control in the bottom-right that lets reviewers switch personas
// AND time-of-day so the prototype's dynamic behavior is visible.
export function PersonaSwitcher() {
  const { persona, personaId, setPersonaId, timeOfDay, setTimeOfDay } = usePersona();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[100] font-[family-name:var(--font-sans)]">
      {open && (
        <div
          className="mb-3 w-[300px] rounded-2xl border border-[#D9EADF] bg-white p-3 shadow-[0_12px_32px_rgba(0,0,0,0.15)] animate-[fadeIn_180ms_ease-out]"
        >
          {/* Header */}
          <div className="mb-2 flex items-center gap-1.5">
            <Sparkles size={11} className="text-[#0A6B3C]" strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A6B3C]">
              Demo Controls
            </span>
          </div>

          {/* Persona */}
          <div className="mb-3">
            <div className="mb-1.5 text-[11px] font-semibold text-[#666]">Persona</div>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(PERSONAS) as PersonaId[]).map((id) => {
                const p = PERSONAS[id];
                const active = id === personaId;
                return (
                  <button
                    key={id}
                    onClick={() => setPersonaId(id)}
                    className={`relative flex flex-col items-start gap-1 rounded-xl border px-2.5 py-2 text-left transition-all ${
                      active
                        ? 'border-[#0A6B3C] bg-[#F1FAF3]'
                        : 'border-[#E8E8E8] bg-white hover:border-[#0A6B3C] hover:bg-[#FAFBFA]'
                    }`}
                  >
                    {active && (
                      <Check
                        size={10}
                        strokeWidth={3}
                        className="absolute right-1.5 top-1.5 text-[#0A6B3C]"
                      />
                    )}
                    <div className="flex items-center gap-1.5">
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: p.avatarColor }}
                      >
                        {p.initials}
                      </div>
                      <span className="text-[12px] font-semibold text-[#1A1A1A]">{p.firstName}</span>
                    </div>
                    <span className="text-[10px] leading-tight text-[#666]">{p.archetypeShort}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time of day */}
          <div>
            <div className="mb-1.5 text-[11px] font-semibold text-[#666]">Time of day</div>
            <div className="flex items-center gap-1.5">
              {(['morning', 'afternoon', 'evening'] as const).map((t) => {
                const Icon = t === 'morning' ? Sun : t === 'afternoon' ? Cloud : Moon;
                const active = t === timeOfDay;
                return (
                  <button
                    key={t}
                    onClick={() => setTimeOfDay(t)}
                    className={`flex flex-1 items-center justify-center gap-1 rounded-full border px-2 py-1.5 text-[11px] font-medium capitalize transition-all ${
                      active
                        ? 'border-[#0A6B3C] bg-[#0A6B3C] text-white'
                        : 'border-[#E0E0E0] bg-white text-[#444] hover:border-[#0A6B3C] hover:text-[#0A6B3C]'
                    }`}
                  >
                    <Icon size={11} />
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 border-t border-[#F0F0F0] pt-2 text-[10px] leading-tight text-[#999]">
            Switching persona reloads page state to demonstrate how the experience adapts.
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-[#0A6B3C] bg-white px-3.5 py-2 shadow-[0_6px_18px_rgba(10,107,60,0.18)] transition-all hover:bg-[#F1FAF3] active:scale-[0.97]"
      >
        <div
          className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: persona.avatarColor }}
        >
          {persona.initials}
        </div>
        <div className="leading-tight">
          <div className="text-[11px] font-semibold text-[#1A1A1A]">{persona.firstName}</div>
          <div className="text-[9px] text-[#666]">{persona.archetypeShort}</div>
        </div>
        <ChevronDown
          size={13}
          className={`text-[#666] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  );
}
