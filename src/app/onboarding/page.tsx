'use client';

// Onboarding — 5-step wizard that builds the user's wellness profile.
// Step state is local; the flow demonstrates how iHerb learns about you
// before you ever land on the home dashboard.

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Sparkles, Check, ChevronLeft, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AIMoment, ContextPill } from '@/components/AIMoment';

// ── Types ────────────────────────────────────────────────────────────────────

type GoalKey =
  | 'sleep' | 'energy' | 'immune' | 'stress' | 'athletic'
  | 'cognitive' | 'longevity' | 'gut' | 'skin';

type ActivityLevel = 'sedentary' | 'lightly' | 'moderately' | 'very';
type DietTag = 'vegan' | 'vegetarian' | 'gluten-free' | 'keto' | 'paleo' | 'none';
type PregnancyStatus = 'yes' | 'no' | 'na';
type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
type ConnectorKey = 'apple' | 'whoop' | 'oura' | 'garmin' | 'levels' | 'mfp';

interface ProfileFields {
  age: string;
  sex: 'female' | 'male' | 'prefer-not' | '';
  activity: ActivityLevel | '';
  diet: DietTag[];
  pregnancy: PregnancyStatus | '';
  sensitivities: string;
}

interface RoutineFields {
  morningTime: string;
  eveningTime: string;
  workoutDays: WeekDay[];
  sleepHours: number;
}

// ── Static data ──────────────────────────────────────────────────────────────

const GOALS: { key: GoalKey; emoji: string; label: string }[] = [
  { key: 'sleep',     emoji: '😴', label: 'Sleep'               },
  { key: 'energy',    emoji: '⚡', label: 'Energy'              },
  { key: 'immune',    emoji: '🛡️', label: 'Immune support'     },
  { key: 'stress',    emoji: '🧘', label: 'Stress & calm'       },
  { key: 'athletic',  emoji: '🏋️', label: 'Athletic performance'},
  { key: 'cognitive', emoji: '🧠', label: 'Cognitive clarity'   },
  { key: 'longevity', emoji: '🧬', label: 'Longevity'           },
  { key: 'gut',       emoji: '🌿', label: 'Gut health'          },
  { key: 'skin',      emoji: '✨', label: 'Skin & beauty'       },
];

const DIET_OPTIONS: { key: DietTag; label: string }[] = [
  { key: 'vegan',        label: 'Vegan'          },
  { key: 'vegetarian',   label: 'Vegetarian'     },
  { key: 'gluten-free',  label: 'Gluten-free'    },
  { key: 'keto',         label: 'Keto'           },
  { key: 'paleo',        label: 'Paleo'          },
  { key: 'none',         label: 'No restrictions'},
];

const ACTIVITY_OPTIONS: { key: ActivityLevel; label: string }[] = [
  { key: 'sedentary',   label: 'Sedentary'         },
  { key: 'lightly',     label: 'Lightly active'    },
  { key: 'moderately',  label: 'Moderately active' },
  { key: 'very',        label: 'Very active'       },
];

const WEEK_DAYS: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CONNECTORS: {
  key: ConnectorKey;
  icon: string;
  name: string;
  alwaysConnected?: boolean;
  contextLabel: string;
}[] = [
  { key: 'apple',  icon: '❤️', name: 'Apple Health',  alwaysConnected: true,  contextLabel: "We'll factor in your step & sleep data"    },
  { key: 'whoop',  icon: '⌚', name: 'Whoop',                                  contextLabel: "We'll factor in your recovery score"        },
  { key: 'oura',   icon: '💍', name: 'Oura',                                   contextLabel: "We'll factor in your sleep score"           },
  { key: 'garmin', icon: '🏃', name: 'Garmin',                                 contextLabel: "We'll factor in your training load"         },
  { key: 'levels', icon: '📈', name: 'Levels CGM',                             contextLabel: "We'll optimize around your glucose patterns"},
  { key: 'mfp',    icon: '🥗', name: 'MyFitnessPal',                           contextLabel: "We'll align your stack with your nutrition" },
];

const STEP_LABELS = ['Welcome', 'Goals', 'Profile', 'Routine', 'Connect'];

// ── Component ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  // ── State ──
  const [step, setStep] = useState(1);
  const [animKey, setAnimKey] = useState(0); // triggers re-mount for fadeIn

  const [selectedGoals, setSelectedGoals] = useState<GoalKey[]>([]);

  const [profile, setProfile] = useState<ProfileFields>({
    age: '',
    sex: '',
    activity: '',
    diet: [],
    pregnancy: '',
    sensitivities: '',
  });

  const [routine, setRoutine] = useState<RoutineFields>({
    morningTime: '07:30',
    eveningTime: '22:00',
    workoutDays: [],
    sleepHours: 8,
  });

  const [connectedApps, setConnectedApps] = useState<ConnectorKey[]>(['apple']);
  const [completed, setCompleted] = useState(false);

  // ── Navigation helpers ──

  const goTo = useCallback((s: number) => {
    setStep(s);
    setAnimKey((k) => k + 1);
  }, []);

  const next = useCallback(() => goTo(Math.min(step + 1, 5)), [step, goTo]);
  const back = useCallback(() => goTo(Math.max(step - 1, 1)), [step, goTo]);

  // ── Goal toggles ──

  const toggleGoal = (key: GoalKey) => {
    setSelectedGoals((prev) => {
      if (prev.includes(key)) return prev.filter((g) => g !== key);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, key];
    });
  };

  // ── Profile helpers ──

  const toggleDiet = (key: DietTag) => {
    setProfile((p) => ({
      ...p,
      diet: p.diet.includes(key) ? p.diet.filter((d) => d !== key) : [...p.diet, key],
    }));
  };

  // ── Routine helpers ──

  const toggleWorkoutDay = (day: WeekDay) => {
    setRoutine((r) => ({
      ...r,
      workoutDays: r.workoutDays.includes(day)
        ? r.workoutDays.filter((d) => d !== day)
        : [...r.workoutDays, day],
    }));
  };

  // ── Connector toggles ──

  const toggleConnector = (key: ConnectorKey) => {
    if (key === 'apple') return; // always connected
    setConnectedApps((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // ── Continue disabled rules ──
  const continueDisabled = step === 2 && selectedGoals.length === 0;

  // ── Finish handler ──
  const handleFinish = () => setCompleted(true);

  // ── Shared card shell classes ──
  const cardShell =
    'overflow-hidden rounded-2xl border border-[#D9EADF] bg-white shadow-[0_4px_24px_rgba(10,107,60,0.08)]';

  // ── Progress bar ──────────────────────────────────────────────────────────

  const ProgressBar = () => (
    <div className="sticky top-[140px] z-30 border-b border-[#E8F3EA] bg-white/95 backdrop-blur-sm px-8 py-3.5">
      <div className="mx-auto flex max-w-[640px] items-center justify-between gap-0">
        {STEP_LABELS.map((label, idx) => {
          const s = idx + 1;
          const isDone = s < step;
          const isActive = s === step;
          const isLocked = s > step;
          return (
            <div key={s} className="flex flex-1 flex-col items-center">
              {/* connector line left */}
              <div className="flex w-full items-center">
                {s > 1 && (
                  <div
                    className={`h-[2px] flex-1 transition-colors duration-300 ${
                      isDone || isActive ? 'bg-[#0A6B3C]' : 'bg-[#E0E0E0]'
                    }`}
                  />
                )}
                <button
                  onClick={() => !isLocked && goTo(s)}
                  disabled={isLocked}
                  className={`relative flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all duration-200 ${
                    isDone
                      ? 'border-[#0A6B3C] bg-[#0A6B3C] text-white hover:opacity-80'
                      : isActive
                        ? 'border-[#0A6B3C] bg-white text-[#0A6B3C] shadow-[0_0_0_3px_rgba(10,107,60,0.15)]'
                        : 'border-[#D0D0D0] bg-white text-[#999] cursor-default'
                  }`}
                  aria-label={`Go to step ${s}: ${label}`}
                >
                  {isDone ? <Check size={12} strokeWidth={3} /> : s}
                </button>
                {s < 5 && (
                  <div
                    className={`h-[2px] flex-1 transition-colors duration-300 ${
                      isDone ? 'bg-[#0A6B3C]' : 'bg-[#E0E0E0]'
                    }`}
                  />
                )}
              </div>
              <span
                className={`mt-1.5 text-[10px] font-semibold transition-colors ${
                  isActive ? 'text-[#0A6B3C]' : isDone ? 'text-[#0A6B3C]' : 'text-[#999]'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── Bottom action row ─────────────────────────────────────────────────────

  const ActionRow = ({
    onContinue,
    continueLabel = 'Continue',
    continueDisabled: localDisabled,
    continueOrange,
  }: {
    onContinue: () => void;
    continueLabel?: string;
    continueDisabled?: boolean;
    continueOrange?: boolean;
  }) => (
    <div className="mt-8 flex items-center justify-between">
      {step > 1 ? (
        <button
          onClick={back}
          className="flex items-center gap-1.5 rounded-full border border-[#D0D0D0] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#444] transition-all hover:border-[#0A6B3C] hover:text-[#0A6B3C] active:scale-[0.97]"
        >
          <ChevronLeft size={14} strokeWidth={2.5} />
          Back
        </button>
      ) : (
        <div />
      )}
      <button
        onClick={onContinue}
        disabled={localDisabled}
        className={`flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-bold text-white shadow-[0_2px_12px_rgba(0,0,0,0.15)] transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed ${
          continueOrange
            ? 'bg-[#D14800] hover:bg-[#A83600] disabled:hover:bg-[#D14800]'
            : 'bg-[#0A6B3C] hover:bg-[#065C32] disabled:hover:bg-[#0A6B3C]'
        }`}
      >
        {continueLabel}
        <ArrowRight size={15} strokeWidth={2.5} />
      </button>
    </div>
  );

  // ── Eyebrow ───────────────────────────────────────────────────────────────

  const Eyebrow = ({ label }: { label: string }) => (
    <div className="mb-3 flex items-center gap-1.5">
      <Sparkles size={12} className="text-[#0A6B3C]" strokeWidth={2.5} />
      <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#0A6B3C]">
        {label}
      </span>
    </div>
  );

  // ── Gradient accent bar ───────────────────────────────────────────────────

  const AccentBar = () => (
    <div className="h-[3px] bg-gradient-to-r from-[#0A6B3C] via-[#79A83C] to-[#0A6B3C]" />
  );

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 1 — Welcome
  // ══════════════════════════════════════════════════════════════════════════

  const Step1 = () => (
    <div>
      <Eyebrow label="iHerb Wellness Advisor" />
      <h1 className="text-[28px] font-bold leading-tight text-[#1A1A1A]">
        Let's build your wellness profile
      </h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-[#555]">
        Your iHerb advisor learns your goals, lifestyle, and preferences — and proactively helps
        you reach them.
      </p>

      <div className="mt-7 grid grid-cols-2 gap-3">
        {[
          { emoji: '🎯', title: 'Personalized recommendations',  body: 'Supplements matched to your exact goals and biology.'       },
          { emoji: '🤖', title: 'Autonomous protocol adjustments', body: 'Your advisor fine-tunes doses and timing as you progress.'   },
          { emoji: '📊', title: 'Adherence tracking',             body: 'See your consistency and celebrate streaks.'                 },
          { emoji: '🌱', title: 'Smart routine',                  body: 'Morning and evening stacks anchored to your schedule.'       },
        ].map(({ emoji, title, body }) => (
          <div
            key={title}
            className="flex flex-col gap-2 rounded-xl border border-[#D9EADF] bg-[#F9FBFA] p-4 transition-all hover:border-[#0A6B3C] hover:bg-[#F1FAF3]"
          >
            <div className="text-[28px]">{emoji}</div>
            <div className="text-[13.5px] font-semibold text-[#1A1A1A]">{title}</div>
            <div className="text-[12px] leading-relaxed text-[#666]">{body}</div>
          </div>
        ))}
      </div>

      <ActionRow onContinue={next} continueLabel="Get started" />
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 2 — Goals
  // ══════════════════════════════════════════════════════════════════════════

  const Step2 = () => (
    <div>
      <Eyebrow label="Step 1 of 4 — Wellness goals" />
      <h2 className="text-[26px] font-bold leading-tight text-[#1A1A1A]">
        What are your wellness goals?
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-[#555]">
        Pick up to 3. We'll personalize everything around them.
      </p>

      <div className="mt-1.5">
        <ContextPill label="We use this to build your starter stack" />
      </div>

      {/* Counter */}
      <div className="mt-5 flex items-center justify-between">
        <div className="text-[12px] font-semibold text-[#888]">
          {selectedGoals.length}/3 selected
        </div>
        {selectedGoals.length === 3 && (
          <span className="rounded-full bg-[#F1FAF3] px-3 py-1 text-[11px] font-semibold text-[#0A6B3C]">
            Max 3 reached
          </span>
        )}
      </div>

      {/* Goal grid */}
      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {GOALS.map(({ key, emoji, label }) => {
          const selected = selectedGoals.includes(key);
          const maxed = selectedGoals.length >= 3 && !selected;
          return (
            <button
              key={key}
              onClick={() => toggleGoal(key)}
              disabled={maxed}
              className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-[13px] font-semibold transition-all active:scale-[0.97] ${
                selected
                  ? 'border-[#0A6B3C] bg-[#0A6B3C] text-white shadow-[0_2px_8px_rgba(10,107,60,0.25)]'
                  : maxed
                    ? 'cursor-not-allowed border-[#E0E0E0] bg-[#F7F7F7] text-[#BBB]'
                    : 'border-[#D9EADF] bg-white text-[#333] hover:border-[#0A6B3C] hover:bg-[#F1FAF3]'
              }`}
            >
              <span className="text-[20px]">{emoji}</span>
              <span>{label}</span>
              {selected && <Check size={13} strokeWidth={3} className="ml-auto" />}
            </button>
          );
        })}
      </div>

      <ActionRow onContinue={next} continueDisabled={continueDisabled} />
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 3 — Profile
  // ══════════════════════════════════════════════════════════════════════════

  const Step3 = () => (
    <div>
      <Eyebrow label="Step 2 of 4 — About you" />
      <h2 className="text-[26px] font-bold leading-tight text-[#1A1A1A]">Tell us about you</h2>
      <p className="mt-2 text-[14px] leading-relaxed text-[#555]">
        We'll calibrate doses and supplement forms to fit your needs.
      </p>

      <div className="mt-6 space-y-6">

        {/* Age */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-wider text-[#444]">
            Age
          </label>
          <div className="mb-1.5">
            <ContextPill label="We use this to calibrate dose ranges" />
          </div>
          <input
            type="number"
            min={13}
            max={100}
            value={profile.age}
            onChange={(e) => setProfile((p) => ({ ...p, age: e.target.value }))}
            placeholder="e.g. 32"
            className="w-32 rounded-full border border-[#D0D0D0] px-4 py-2 text-[13.5px] text-[#1A1A1A] placeholder-[#999] transition-all focus:border-[#0A6B3C] focus:outline-none focus:ring-1 focus:ring-[#0A6B3C]"
          />
        </div>

        {/* Sex */}
        <div>
          <div className="mb-1.5 text-[12.5px] font-bold uppercase tracking-wider text-[#444]">
            Sex assigned at birth
          </div>
          <div className="mb-1.5">
            <ContextPill label="Helps us filter contraindications" />
          </div>
          <div className="flex gap-2">
            {(['female', 'male', 'prefer-not'] as const).map((opt) => {
              const label = opt === 'prefer-not' ? 'Prefer not to say' : opt.charAt(0).toUpperCase() + opt.slice(1);
              return (
                <button
                  key={opt}
                  onClick={() => setProfile((p) => ({ ...p, sex: opt }))}
                  className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-all active:scale-[0.97] ${
                    profile.sex === opt
                      ? 'border-[#0A6B3C] bg-[#0A6B3C] text-white'
                      : 'border-[#D0D0D0] bg-white text-[#444] hover:border-[#0A6B3C] hover:text-[#0A6B3C]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Activity level */}
        <div>
          <div className="mb-1.5 text-[12.5px] font-bold uppercase tracking-wider text-[#444]">
            Activity level
          </div>
          <div className="mb-1.5">
            <ContextPill label="We use this for energy & recovery recommendations" />
          </div>
          <div className="flex flex-wrap gap-2">
            {ACTIVITY_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setProfile((p) => ({ ...p, activity: key }))}
                className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-all active:scale-[0.97] ${
                  profile.activity === key
                    ? 'border-[#0A6B3C] bg-[#0A6B3C] text-white'
                    : 'border-[#D0D0D0] bg-white text-[#444] hover:border-[#0A6B3C] hover:text-[#0A6B3C]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Diet */}
        <div>
          <div className="mb-1.5 text-[12.5px] font-bold uppercase tracking-wider text-[#444]">
            Diet
          </div>
          <div className="mb-1.5">
            <ContextPill label="Filters products by ingredient compatibility" />
          </div>
          <div className="flex flex-wrap gap-2">
            {DIET_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleDiet(key)}
                className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-all active:scale-[0.97] ${
                  profile.diet.includes(key)
                    ? 'border-[#0A6B3C] bg-[#0A6B3C] text-white'
                    : 'border-[#D0D0D0] bg-white text-[#444] hover:border-[#0A6B3C] hover:text-[#0A6B3C]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Pregnancy */}
        <div>
          <div className="mb-1.5 text-[12.5px] font-bold uppercase tracking-wider text-[#444]">
            Currently pregnant or breastfeeding?
          </div>
          <div className="mb-1.5">
            <ContextPill label="We use this to apply safety guardrails" />
          </div>
          <div className="flex gap-2">
            {(['yes', 'no', 'na'] as const).map((opt) => {
              const labels = { yes: 'Yes', no: 'No', na: 'N/A' };
              return (
                <button
                  key={opt}
                  onClick={() => setProfile((p) => ({ ...p, pregnancy: opt }))}
                  className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-all active:scale-[0.97] ${
                    profile.pregnancy === opt
                      ? 'border-[#0A6B3C] bg-[#0A6B3C] text-white'
                      : 'border-[#D0D0D0] bg-white text-[#444] hover:border-[#0A6B3C] hover:text-[#0A6B3C]'
                  }`}
                >
                  {labels[opt]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sensitivities */}
        <div>
          <label className="mb-1.5 block text-[12.5px] font-bold uppercase tracking-wider text-[#444]">
            Sensitivities or ingredients to avoid
          </label>
          <div className="mb-1.5">
            <ContextPill label="We flag products that contain these" />
          </div>
          <input
            type="text"
            value={profile.sensitivities}
            onChange={(e) => setProfile((p) => ({ ...p, sensitivities: e.target.value }))}
            placeholder="e.g. caffeine, magnesium oxide, shellfish"
            className="w-full rounded-full border border-[#D0D0D0] px-4 py-2 text-[13.5px] text-[#1A1A1A] placeholder-[#999] transition-all focus:border-[#0A6B3C] focus:outline-none focus:ring-1 focus:ring-[#0A6B3C]"
          />
        </div>

      </div>

      <ActionRow onContinue={next} />
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 4 — Routine
  // ══════════════════════════════════════════════════════════════════════════

  const Step4 = () => (
    <div>
      <Eyebrow label="Step 3 of 4 — Your schedule" />
      <h2 className="text-[26px] font-bold leading-tight text-[#1A1A1A]">
        When do you want to take supplements?
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-[#555]">
        We'll anchor reminders and deliveries to your schedule.
      </p>

      <div className="mt-6 space-y-6">

        {/* Morning + Evening times */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-1.5 text-[12.5px] font-bold uppercase tracking-wider text-[#444]">
              Morning routine starts at
            </div>
            <div className="mb-2">
              <ContextPill label="Anchors your AM stack" />
            </div>
            <input
              type="time"
              value={routine.morningTime}
              onChange={(e) => setRoutine((r) => ({ ...r, morningTime: e.target.value }))}
              className="rounded-full border border-[#D0D0D0] px-4 py-2 text-[13.5px] text-[#1A1A1A] transition-all focus:border-[#0A6B3C] focus:outline-none focus:ring-1 focus:ring-[#0A6B3C]"
            />
          </div>
          <div>
            <div className="mb-1.5 text-[12.5px] font-bold uppercase tracking-wider text-[#444]">
              Evening routine starts at
            </div>
            <div className="mb-2">
              <ContextPill label="Anchors your PM wind-down stack" />
            </div>
            <input
              type="time"
              value={routine.eveningTime}
              onChange={(e) => setRoutine((r) => ({ ...r, eveningTime: e.target.value }))}
              className="rounded-full border border-[#D0D0D0] px-4 py-2 text-[13.5px] text-[#1A1A1A] transition-all focus:border-[#0A6B3C] focus:outline-none focus:ring-1 focus:ring-[#0A6B3C]"
            />
          </div>
        </div>

        {/* Workout days */}
        <div>
          <div className="mb-1.5 text-[12.5px] font-bold uppercase tracking-wider text-[#444]">
            Workout days
          </div>
          <div className="mb-2">
            <ContextPill label="We use this to time pre- and post-workout supplements" />
          </div>
          <div className="flex flex-wrap gap-2">
            {WEEK_DAYS.map((day) => (
              <button
                key={day}
                onClick={() => toggleWorkoutDay(day)}
                className={`h-10 w-12 rounded-full border text-[12.5px] font-bold transition-all active:scale-[0.97] ${
                  routine.workoutDays.includes(day)
                    ? 'border-[#0A6B3C] bg-[#0A6B3C] text-white'
                    : 'border-[#D0D0D0] bg-white text-[#444] hover:border-[#0A6B3C] hover:text-[#0A6B3C]'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Sleep target */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-[12.5px] font-bold uppercase tracking-wider text-[#444]">
            <span>Sleep target</span>
            <span className="rounded-full bg-[#F1FAF3] px-3 py-0.5 text-[13px] font-bold text-[#0A6B3C]">
              {routine.sleepHours} hrs
            </span>
          </div>
          <div className="mb-3">
            <ContextPill label="We use this to calibrate evening stack timing" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-[#999]">6h</span>
            <input
              type="range"
              min={6}
              max={10}
              step={0.5}
              value={routine.sleepHours}
              onChange={(e) => setRoutine((r) => ({ ...r, sleepHours: parseFloat(e.target.value) }))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#D9EADF] accent-[#0A6B3C]"
            />
            <span className="text-[11px] font-semibold text-[#999]">10h</span>
          </div>
        </div>

        {/* AIMoment */}
        <AIMoment
          eyebrow="Advisor insight"
          headline="Based on your goals, your advisor recommends a 2-stack split"
          body="A morning anchor + evening wind-down gives your supplements the right absorption window — and fits how the ingredients actually work."
          variant="inline"
        />

      </div>

      <ActionRow onContinue={next} />
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 5 — Connect
  // ══════════════════════════════════════════════════════════════════════════

  const Step5 = () => (
    <div>
      <Eyebrow label="Step 4 of 4 — Data connections" />
      <h2 className="text-[26px] font-bold leading-tight text-[#1A1A1A]">
        Connect what you're already tracking
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-[#555]">
        Optional — but the more your advisor knows, the better it gets.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {CONNECTORS.map(({ key, icon, name, alwaysConnected, contextLabel }) => {
          const isConnected = connectedApps.includes(key);
          return (
            <div
              key={key}
              className={`relative overflow-hidden rounded-xl border p-4 transition-all ${
                isConnected
                  ? 'border-[#C3E6CB] bg-[#F1FAF3]'
                  : 'border-[#E0E0E0] bg-white hover:border-[#C3E6CB]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[22px] ${
                      isConnected ? 'bg-white' : 'bg-[#F7F7F7]'
                    }`}
                  >
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-semibold text-[#1A1A1A]">{name}</div>
                    {isConnected && (
                      <div className="mt-0.5 text-[10.5px] font-semibold text-[#0A6B3C]">
                        Connected ✓
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleConnector(key)}
                  disabled={alwaysConnected}
                  className={`flex-shrink-0 rounded-full px-3 py-1.5 text-[11.5px] font-bold transition-all active:scale-[0.97] ${
                    isConnected
                      ? alwaysConnected
                        ? 'cursor-default border border-[#C3E6CB] bg-white text-[#0A6B3C]'
                        : 'border border-[#C3E6CB] bg-white text-[#0A6B3C] hover:bg-[#E5F8E6]'
                      : 'bg-[#0A6B3C] text-white hover:bg-[#065C32]'
                  }`}
                >
                  {isConnected ? (alwaysConnected ? 'Default' : 'Connected') : 'Connect'}
                </button>
              </div>

              {/* Context pill appears when connected */}
              {isConnected && (
                <div className="mt-3 animate-[fadeIn_180ms_ease-out]">
                  <ContextPill label={contextLabel} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final CTA */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={back}
          className="flex items-center gap-1.5 rounded-full border border-[#D0D0D0] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#444] transition-all hover:border-[#0A6B3C] hover:text-[#0A6B3C] active:scale-[0.97]"
        >
          <ChevronLeft size={14} strokeWidth={2.5} />
          Back
        </button>
        <button
          onClick={handleFinish}
          className="flex items-center gap-2 rounded-full bg-[#D14800] px-8 py-3 text-[14px] font-bold text-white shadow-[0_2px_16px_rgba(209,72,0,0.3)] transition-all hover:bg-[#A83600] active:scale-[0.97]"
        >
          Finish setup
          <Sparkles size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // SUCCESS STATE
  // ══════════════════════════════════════════════════════════════════════════

  const SuccessState = () => (
    <div className="animate-[fadeIn_200ms_ease-out] text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#0A6B3C] to-[#079A48]">
        <Sparkles size={28} className="text-white" strokeWidth={2.5} />
      </div>

      <AIMoment
        eyebrow="Welcome to iHerb Wellness"
        headline="Welcome aboard! Your wellness advisor is ready."
        body="Your starter recommendations have been prepared based on your goals, profile, and routine. Your advisor will keep learning as you go."
        footerLabel="Powered by iHerb Wellness Hub"
      >
        <div className="mt-1 flex flex-wrap justify-center gap-2">
          {selectedGoals.map((g) => {
            const goal = GOALS.find((x) => x.key === g);
            return goal ? (
              <span
                key={g}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#C3E6CB] bg-[#F1FAF3] px-3 py-1 text-[12px] font-semibold text-[#0A6B3C]"
              >
                {goal.emoji} {goal.label}
              </span>
            ) : null;
          })}
        </div>
        <div className="mt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#0A6B3C] px-8 py-3 text-[14px] font-bold text-white shadow-[0_2px_12px_rgba(10,107,60,0.25)] transition-all hover:bg-[#065C32] active:scale-[0.97]"
          >
            Take me to my dashboard
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>
      </AIMoment>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════

  const stepContent: Record<number, React.ReactNode> = {
    1: <Step1 />,
    2: <Step2 />,
    3: <Step3 />,
    4: <Step4 />,
    5: <Step5 />,
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      {!completed && <ProgressBar />}

      <main className="mx-auto w-full max-w-[680px] flex-1 px-6 py-8">
        {completed ? (
          <SuccessState />
        ) : (
          <div
            key={animKey}
            className={`animate-[fadeIn_180ms_ease-out] ${cardShell}`}
          >
            <AccentBar />
            <div className="px-8 py-8">
              {stepContent[step]}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
