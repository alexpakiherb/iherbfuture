'use client';

// Wellness Hub — Long-form editorial article page.
// Hardcoded to "magnesium-guide" content; unrecognized slugs fall back to same.
// Personalized mid-article AIMoment differs between Maya and Daniel.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  ShoppingCart,
  BookOpen,
  FlaskConical,
  Pill,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AIMoment, ContextPill } from '@/components/AIMoment';
import { usePersona } from '@/components/PersonaProvider';

// ── Section IDs (TOC) ────────────────────────────────────────────────────────
const TOC_SECTIONS = [
  { id: 'what-is-magnesium', label: 'What is magnesium?' },
  { id: 'five-forms', label: 'The 5 most common forms' },
  { id: 'how-to-choose', label: 'How to choose the right form' },
  { id: 'dosing-timing', label: 'Dosing and timing' },
  { id: 'what-to-avoid', label: 'What to avoid' },
  { id: 'sources', label: 'Sources' },
];

// ── Related Articles ─────────────────────────────────────────────────────────
const RELATED_ARTICLES = [
  {
    icon: '😴',
    title: 'The Sleep Stack: What Actually Works',
    readTime: '5 min read',
    href: '/wellness-hub/sleep-stack',
  },
  {
    icon: '⚡',
    title: 'Electrolytes 101: Beyond Sports Drinks',
    readTime: '4 min read',
    href: '/wellness-hub/electrolytes',
  },
  {
    icon: '🧬',
    title: 'Mineral Synergies: Zinc, Mag & Boron',
    readTime: '6 min read',
    href: '/wellness-hub/mineral-synergies',
  },
];

// ── Try This Stack ───────────────────────────────────────────────────────────
const STACK_PRODUCTS = [
  {
    imageUrl: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01289/u/62.jpg',
    brand: 'NOW Foods',
    name: 'Magnesium Glycinate 200mg',
    badge: 'Best for sleep',
    price: '$18.99',
    rating: 4.8,
    reviews: 2341,
  },
  {
    imageUrl: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00644/u/96.jpg',
    brand: 'Thorne',
    name: 'Magnesium Bisglycinate 200mg',
    badge: 'Premium pick',
    price: '$28.00',
    rating: 4.9,
    reviews: 891,
  },
  {
    imageUrl: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/drb/drb00565/u/32.jpg',
    brand: "Doctor's Best",
    name: 'Magnesium Glycinate 100mg',
    badge: 'Budget-friendly',
    price: '$14.49',
    rating: 4.7,
    reviews: 5122,
  },
];

// ── Inline Product Card ──────────────────────────────────────────────────────
function InlineProductCard() {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[#D9EADF] bg-white shadow-[0_2px_12px_rgba(10,107,60,0.06)]">
      <div className="h-[3px] bg-gradient-to-r from-[#0A6B3C] via-[#79A83C] to-[#0A6B3C]" />
      <div className="flex gap-4 p-4">
        {/* Product image */}
        <div className="flex h-[88px] w-[88px] flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#EBEBEB] bg-white p-2">
          <img
            src="https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01289/u/62.jpg"
            alt="NOW Foods Magnesium Glycinate"
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-widest text-[#0A6B3C]">
              NOW Foods
            </div>
            <div className="mt-0.5 text-[15px] font-bold leading-snug text-[#1A1A1A]">
              Magnesium Glycinate 200mg — 180 Tablets
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={11}
                    className={s <= 5 ? 'fill-[#F5A623] text-[#F5A623]' : 'text-[#DDD]'}
                  />
                ))}
              </div>
              <span className="text-[11.5px] font-semibold text-[#1A1A1A]">4.8</span>
              <span className="text-[11px] text-[#888]">(2,341 reviews)</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[18px] font-bold text-[#1A1A1A]">$18.99</span>
              <span className="ml-1.5 text-[11px] text-[#888] line-through">$24.99</span>
              <span className="ml-1.5 rounded-full bg-[#FFF7F1] px-2 py-0.5 text-[10.5px] font-bold text-[#D14800]">
                Save 24%
              </span>
            </div>
            <button className="flex items-center gap-1.5 rounded-full bg-[#0A6B3C] px-4 py-2 text-[12.5px] font-bold text-white transition-all hover:bg-[#085131] active:scale-[0.97]">
              <ShoppingCart size={13} strokeWidth={2.5} />
              Add to cart
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-[#F0F0F0] bg-[#FAFBFA] px-4 py-2">
        <span className="text-[10.5px] text-[#888]">
          ✓ Third-party tested · ✓ Non-GMO · ✓ Free shipping on orders $20+
        </span>
      </div>
    </div>
  );
}

// ── Comparison Table ──────────────────────────────────────────────────────────
function ComparisonTable() {
  const rows = [
    { form: 'Glycinate', absorption: '★★★★★', laxative: 'No', bestFor: 'Sleep, anxiety, daily use', price: '$$' },
    { form: 'Citrate', absorption: '★★★★☆', laxative: 'Mild', bestFor: 'Digestion, constipation relief', price: '$' },
    { form: 'Malate', absorption: '★★★★☆', laxative: 'No', bestFor: 'Fatigue, muscle energy', price: '$$' },
    { form: 'Threonate', absorption: '★★★★★', laxative: 'No', bestFor: 'Cognition, memory, brain health', price: '$$$' },
    { form: 'Oxide', absorption: '★★☆☆☆', laxative: 'Yes', bestFor: 'Occasional constipation only', price: '$' },
  ];

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-[#D9EADF]">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="bg-[#F1FAF3]">
            <th className="border-b border-[#D9EADF] px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#0A6B3C]">Form</th>
            <th className="border-b border-[#D9EADF] px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#0A6B3C]">Absorption</th>
            <th className="border-b border-[#D9EADF] px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#0A6B3C]">Laxative effect</th>
            <th className="border-b border-[#D9EADF] px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#0A6B3C]">Best for</th>
            <th className="border-b border-[#D9EADF] px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#0A6B3C]">Cost</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.form} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFA]'}>
              <td className="border-b border-[#F0F0F0] px-3 py-2.5 font-semibold text-[#1A1A1A]">{row.form}</td>
              <td className="border-b border-[#F0F0F0] px-3 py-2.5 text-[#F5A623]">{row.absorption}</td>
              <td className="border-b border-[#F0F0F0] px-3 py-2.5 text-[#555]">{row.laxative}</td>
              <td className="border-b border-[#F0F0F0] px-3 py-2.5 text-[#555]">{row.bestFor}</td>
              <td className="border-b border-[#F0F0F0] px-3 py-2.5 font-semibold text-[#0A6B3C]">{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function WellnessHubArticlePage() {
  const { persona } = usePersona();
  const [activeSection, setActiveSection] = useState('what-is-magnesium');
  const [helpfulVote, setHelpfulVote] = useState<'up' | 'down' | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Scroll-spy: track which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    TOC_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Persona-specific AIMoment copy
  const aiMomentHeadline =
    persona.id === 'maya'
      ? 'Based on your sleep goal, glycinate is most likely the right starting point.'
      : 'Given your data, you might benefit from rotating threonate 2×/week for cognitive support.';

  const aiMomentBody =
    persona.id === 'maya'
      ? "Your advisor already has you on magnesium glycinate at bedtime — that's the correct call. Glycinate's glycine component has independent calming effects that compound the mineral's muscle-relaxing role. Stick with 200–400mg, 30 minutes before bed."
      : "Your Oura sleep score has held above 75 for 21 consecutive nights — bisglycinate is working. Adding magnesium threonate (Magtein) 2× per week on higher cognitive-demand days (Tue/Fri in your training split) can further support synaptic density without disrupting your evening wind-down.";

  const aiContextHint =
    persona.id === 'maya'
      ? 'Based on your sleep goal'
      : 'Whoop recovery: 84% · Oura sleep score: 79';

  const aiContextVariant = persona.id === 'daniel' ? 'data' : 'default';

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-8 py-6">

        {/* ── Breadcrumb ────────────────────────────────────────────── */}
        <nav className="mb-5 flex items-center gap-1 text-[12px] text-[#888]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#0A6B3C] hover:underline">Home</Link>
          <ChevronRight size={12} className="text-[#CCC]" />
          <span className="text-[#888]">Wellness Hub</span>
          <ChevronRight size={12} className="text-[#CCC]" />
          <span className="text-[#888]">Minerals</span>
          <ChevronRight size={12} className="text-[#CCC]" />
          <span className="text-[#0A6B3C] font-medium">The Magnesium Guide</span>
        </nav>

        {/* ── Article Hero ─────────────────────────────────────────── */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-[#D9EADF] bg-white shadow-[0_2px_16px_rgba(10,107,60,0.06)]">
          <div className="h-[3px] bg-gradient-to-r from-[#0A6B3C] via-[#79A83C] to-[#0A6B3C]" />

          <div className="px-8 pt-6 pb-0">
            {/* Eyebrow */}
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#0A6B3C]">
                Wellness Hub · Minerals
              </span>
              <span className="rounded-full bg-[#FFF7F1] px-2.5 py-1 text-[10.5px] font-bold text-[#D14800]">
                <Clock size={9} className="mr-1 inline" strokeWidth={2.5} />
                6 min read
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-[30px] font-bold leading-tight text-[#1A1A1A]">
              The Magnesium Guide: Glycinate vs Citrate vs Malate
            </h1>

            {/* Dek */}
            <p className="mt-2.5 text-[15.5px] leading-relaxed text-[#555]">
              Magnesium comes in a dozen forms — but only a few are worth your attention.
              Here&apos;s how to match the right form to your goal, whether that&apos;s better sleep,
              more energy, or sharper cognition.
            </p>

            {/* Author byline */}
            <div className="mt-4 flex items-center gap-3 pb-5">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#0A6B3C] text-[12px] font-bold text-white">
                SC
              </div>
              <div>
                <div className="text-[13px] font-semibold text-[#1A1A1A]">
                  Reviewed by Dr. Sarah Chen, ND
                </div>
                <div className="text-[11.5px] text-[#888]">Updated April 18, 2026</div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <ContextPill label={aiContextHint} variant={aiContextVariant} />
              </div>
            </div>
          </div>

          {/* Hero image area — three-bottle product collage on tinted backdrop */}
          <div className="relative flex h-[220px] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#F1FAF3] via-[#E8F5EC] to-[#E5F8E6]">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 -rotate-6 transform">
              <div className="flex h-[140px] w-[110px] items-center justify-center overflow-hidden rounded-xl border border-[#EBEBEB] bg-white p-3 shadow-[0_8px_24px_rgba(10,107,60,0.12)]">
                <img
                  src="https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01289/u/62.jpg"
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="z-10 flex h-[170px] w-[130px] items-center justify-center overflow-hidden rounded-xl border border-[#EBEBEB] bg-white p-3 shadow-[0_12px_32px_rgba(10,107,60,0.18)]">
              <img
                src="https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00644/u/96.jpg"
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 rotate-6 transform">
              <div className="flex h-[140px] w-[110px] items-center justify-center overflow-hidden rounded-xl border border-[#EBEBEB] bg-white p-3 shadow-[0_8px_24px_rgba(10,107,60,0.12)]">
                <img
                  src="https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lex/lex16039/u/276.jpg"
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 transform">
              <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#0A6B3C] backdrop-blur">
                Minerals · Magnesium
              </span>
            </div>
          </div>
        </div>

        {/* ── Two-column layout ────────────────────────────────────── */}
        <div className="flex gap-7">

          {/* ── MAIN COLUMN ─────────────────────────────────────────── */}
          <article className="min-w-0 flex-1" style={{ maxWidth: 680 }}>

            {/* ── Section: What is magnesium? ── */}
            <section id="what-is-magnesium">
              <h2 className="text-[22px] font-bold text-[#0A6B3C] mt-8 mb-3">
                What is magnesium?
              </h2>
              <div className="space-y-4 text-[15px] leading-relaxed text-[#333]">
                <p>
                  Magnesium is the fourth most abundant mineral in the human body and a
                  cofactor in more than 300 enzymatic reactions — from ATP production and
                  DNA synthesis to nerve transmission and muscle contraction. Yet an
                  estimated 48% of Americans fail to meet the Recommended Daily Allowance
                  from diet alone, partly because modern farming has depleted soil magnesium
                  levels by as much as 25% over the last 50 years.
                </p>
                <p>
                  The downstream consequences of chronic low magnesium are subtle but
                  compounding: poor sleep quality, muscle cramps, heightened anxiety,
                  irregular heartbeat, and blunted energy metabolism. Supplementing is
                  one of the highest-leverage interventions in foundational wellness —
                  provided you choose the right form.
                </p>
                <p>
                  The key distinction between magnesium supplements is the
                  <em> chelate</em> — the molecule the mineral is bound to for delivery.
                  Different chelates dictate how much elemental magnesium reaches your
                  cells, how your gut tolerates it, and which tissues benefit most.
                </p>
              </div>
            </section>

            {/* ── Section: 5 most common forms ── */}
            <section id="five-forms">
              <h2 className="text-[22px] font-bold text-[#0A6B3C] mt-8 mb-3">
                The 5 most common forms — and what they&apos;re for
              </h2>
              <div className="space-y-4 text-[15px] leading-relaxed text-[#333]">
                <p>
                  Walk down the supplement aisle and you&apos;ll find magnesium labeled as
                  glycinate, citrate, malate, threonate, and oxide. They&apos;re not
                  interchangeable. Here&apos;s what the evidence says about each:
                </p>
                <ul className="space-y-3 pl-0 list-none">
                  {[
                    {
                      form: 'Magnesium Glycinate (bisglycinate)',
                      desc:
                        'Bound to two glycine molecules, this is the gold standard for sleep and anxiety. Glycine itself is an inhibitory neurotransmitter that lowers core body temperature at night — a key sleep-onset signal. Glycinate is highly bioavailable, gentle on the gut, and the first form most practitioners reach for.',
                    },
                    {
                      form: 'Magnesium Citrate',
                      desc:
                        "Bound to citric acid, citrate is well-absorbed and inexpensive. It has a mild osmotic laxative effect — useful if you're constipated, less ideal if you're not. A solid general-purpose form if budget matters.",
                    },
                    {
                      form: 'Magnesium Malate',
                      desc:
                        'Bound to malic acid, a molecule central to the Krebs cycle (cellular energy). Preferred by people dealing with chronic fatigue or fibromyalgia. The malate component supports ATP production independently of the magnesium itself.',
                    },
                    {
                      form: 'Magnesium Threonate (Magtein)',
                      desc:
                        "Developed by MIT researchers, threonate is the only form demonstrated to cross the blood-brain barrier efficiently. Early trials show improvement in short-term memory and synaptic density. Expensive, but worth considering if cognitive performance is a priority.",
                    },
                    {
                      form: 'Magnesium Oxide',
                      desc:
                        "The cheapest and most common form found in low-cost multivitamins — but only about 4% is absorbed. Its primary utility is as a laxative. If your label lists oxide as the only form, you're essentially getting very little benefit for mineral repletion.",
                    },
                  ].map(({ form, desc }) => (
                    <li key={form} className="flex gap-3 rounded-xl border border-[#E8E8E8] bg-white p-4">
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#F1FAF3]">
                        <div className="h-2 w-2 rounded-full bg-[#0A6B3C]" />
                      </div>
                      <div>
                        <span className="font-bold text-[#1A1A1A]">{form}: </span>
                        <span>{desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── Inline Product Card ── */}
            <InlineProductCard />

            {/* ── Section: How to choose ── */}
            <section id="how-to-choose">
              <h2 className="text-[22px] font-bold text-[#0A6B3C] mt-8 mb-3">
                How to choose the right form for your goal
              </h2>
              <div className="space-y-4 text-[15px] leading-relaxed text-[#333]">
                <p>
                  The decision tree is simpler than the label count suggests. Start with
                  your primary complaint, not the marketing. If you&apos;re here because
                  you&apos;re not sleeping well, start with glycinate and take it 30–60 minutes
                  before bed. If energy and fatigue are your concern, malate pairs
                  naturally with your morning stack. If you have a sensitive gut, avoid
                  citrate and oxide.
                </p>
                <p>
                  Advanced users with a clean foundation — solid sleep, stable energy,
                  good gut motility — may find value in threonate as a targeted
                  nootropic addition, particularly on high-cognitive-demand days. But
                  it&apos;s a poor first choice if the basics aren&apos;t covered.
                </p>
              </div>

              <ComparisonTable />

              <div className="mt-4 rounded-xl border-l-4 border-[#0A6B3C] bg-[#F1FAF3] px-5 py-4 text-[14px] leading-relaxed text-[#333]">
                <strong className="text-[#0A6B3C]">Clinical note:</strong> There&apos;s no benefit
                to stacking multiple magnesium forms simultaneously unless you have a specific
                protocol designed by a clinician. Choose one, run it for four to six weeks,
                and assess. Too many forms at once clouds the signal.
              </div>
            </section>

            {/* ── Mid-article AIMoment ── */}
            <div className="my-7">
              <AIMoment
                eyebrow="Personalized for you"
                headline={aiMomentHeadline}
                body={aiMomentBody}
                footerLabel="Powered by iHerb Wellness Hub"
                footerRight={
                  <Link
                    href="/advisor"
                    className="flex items-center gap-0.5 text-[11px] font-medium text-[#1558A6] hover:underline"
                  >
                    Ask your advisor
                    <ArrowRight size={10} strokeWidth={2.5} />
                  </Link>
                }
              >
                <div className="flex flex-wrap gap-1.5">
                  <ContextPill label={aiContextHint} variant={aiContextVariant} />
                  {persona.id === 'maya' && (
                    <ContextPill label="Beginner-friendly form" />
                  )}
                  {persona.id === 'daniel' && (
                    <ContextPill label="Oura sleep score: 79" variant="data" />
                  )}
                </div>
              </AIMoment>
            </div>

            {/* ── Section: Dosing and timing ── */}
            <section id="dosing-timing">
              <h2 className="text-[22px] font-bold text-[#0A6B3C] mt-8 mb-3">
                Dosing and timing
              </h2>
              <div className="space-y-4 text-[15px] leading-relaxed text-[#333]">
                <p>
                  The RDA for magnesium is 310–420mg/day for adults, but most people
                  in Western countries get 200–270mg from food. A supplemental dose of
                  200–400mg of <em>elemental</em> magnesium per day fills the gap without
                  risk of excess. Always check labels for elemental magnesium, not total
                  compound weight — 1,000mg of magnesium glycinate delivers roughly 140mg
                  of elemental magnesium.
                </p>
                <p>
                  <strong>For sleep:</strong> Take glycinate 30–60 minutes before bed.
                  The timing lets plasma levels peak during the early sleep cycles when
                  deep sleep initiation is most sensitive to mineral availability.
                </p>
                <p>
                  <strong>For energy and fatigue:</strong> Take malate in the morning
                  with food. The malic acid component works synergistically with the
                  magnesium in mitochondrial respiration — aligning it with your active
                  hours makes biological sense.
                </p>
                <p>
                  <strong>For cognition (threonate):</strong> Morning or early afternoon
                  is optimal. Threonate&apos;s mechanism involves long-term potentiation — a
                  synaptic strengthening process that benefits from being active during
                  waking hours rather than competing with sleep-related consolidation.
                </p>
                <p>
                  Split dosing — half in the morning, half at night — is a valid
                  strategy for improving tolerability when starting at higher doses.
                  There&apos;s minimal pharmacokinetic benefit beyond gut comfort.
                </p>
              </div>
            </section>

            {/* ── Section: What to avoid ── */}
            <section id="what-to-avoid">
              <h2 className="text-[22px] font-bold text-[#0A6B3C] mt-8 mb-3">
                What to avoid
              </h2>
              <div className="space-y-4 text-[15px] leading-relaxed text-[#333]">
                <p>
                  A few common mistakes undermine otherwise good supplementation habits:
                </p>
                <ul className="space-y-2 pl-5 list-disc">
                  <li>
                    <strong>Taking magnesium with high-dose zinc at the same time.</strong> Both
                    minerals compete for the same transporters. If you&apos;re taking zinc,
                    separate it from magnesium by a few hours.
                  </li>
                  <li>
                    <strong>Expecting overnight results.</strong> Tissue magnesium repletion
                    takes 4–6 weeks of consistent supplementation to show measurable
                    change. Don&apos;t abandon the protocol in week two.
                  </li>
                  <li>
                    <strong>Choosing based on price alone.</strong> Magnesium oxide is cheap
                    for a reason. The cost-per-dose difference between oxide and glycinate
                    is typically under $0.20/day — an easy trade for dramatically superior
                    absorption.
                  </li>
                  <li>
                    <strong>Ignoring interactions with medications.</strong> Magnesium can
                    affect the absorption of certain antibiotics (especially tetracyclines
                    and fluoroquinolones) and blood pressure medications. If you&apos;re on
                    prescription medication, check with your clinician.
                  </li>
                  <li>
                    <strong>Megadosing without cause.</strong> Doses above 350mg supplemental
                    elemental magnesium per day from supplements can cause diarrhea in
                    sensitive individuals. More is not better — sufficiency is the goal.
                  </li>
                </ul>
              </div>
            </section>

            {/* ── Section: Sources ── */}
            <section id="sources">
              <h2 className="text-[22px] font-bold text-[#0A6B3C] mt-8 mb-3">
                Sources
              </h2>
              <ol className="space-y-2 text-[13px] leading-relaxed text-[#555] pl-5 list-decimal">
                <li>
                  Abbasi B, et al. &quot;The effect of magnesium supplementation on primary
                  insomnia in elderly: A double-blind placebo-controlled clinical trial.&quot;
                  <em> J Res Med Sci.</em> 2012;17(12):1161–1169. PMID: 23853635.
                </li>
                <li>
                  Slutsky I, et al. &quot;Enhancement of learning and memory by elevating
                  brain magnesium.&quot; <em>Neuron.</em> 2010;65(2):165–177.
                  DOI: 10.1016/j.neuron.2009.12.026.
                </li>
                <li>
                  DiNicolantonio JJ, O&apos;Keefe JH, Wilson W. &quot;Subclinical magnesium
                  deficiency: a principal driver of cardiovascular disease and a
                  public health crisis.&quot; <em>Open Heart.</em> 2018;5(1):e000668.
                  DOI: 10.1136/openhrt-2017-000668.
                </li>
                <li>
                  Held K, et al. &quot;Oral Mg(2+) supplementation reverses age-related
                  neuroendocrine and sleep EEG changes in humans.&quot;
                  <em> Pharmacopsychiatry.</em> 2002;35(4):135–143.
                  DOI: 10.1055/s-2002-33195.
                </li>
                <li>
                  Schwalfenberg GK, Genuis SJ. &quot;The Importance of Magnesium in
                  Clinical Healthcare.&quot; <em>Scientifica (Cairo).</em> 2017;2017:4179326.
                  DOI: 10.1155/2017/4179326.
                </li>
              </ol>
            </section>

            {/* ── Helpful? ─────────────────────────────────────────── */}
            <div className="mt-10 flex items-center gap-3 rounded-xl border border-[#E0E0E0] bg-white p-4">
              <span className="text-[13.5px] font-semibold text-[#1A1A1A]">
                Was this article helpful?
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHelpfulVote('up')}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-all ${
                    helpfulVote === 'up'
                      ? 'border-[#0A6B3C] bg-[#F1FAF3] text-[#0A6B3C]'
                      : 'border-[#D0D0D0] bg-white text-[#555] hover:border-[#0A6B3C] hover:text-[#0A6B3C]'
                  }`}
                >
                  <ThumbsUp size={13} strokeWidth={2.5} />
                  Yes
                </button>
                <button
                  onClick={() => setHelpfulVote('down')}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-all ${
                    helpfulVote === 'down'
                      ? 'border-[#D14800] bg-[#FFF7F1] text-[#D14800]'
                      : 'border-[#D0D0D0] bg-white text-[#555] hover:border-[#D14800] hover:text-[#D14800]'
                  }`}
                >
                  <ThumbsDown size={13} strokeWidth={2.5} />
                  No
                </button>
              </div>
              {helpfulVote && (
                <span className="ml-1 text-[12px] text-[#888]">
                  {helpfulVote === 'up' ? 'Thanks for the feedback!' : 'We will keep improving.'}
                </span>
              )}
            </div>

            {/* ── Big AIMoment CTA ──────────────────────────────────── */}
            <div className="mt-6">
              <AIMoment
                eyebrow="Want to go deeper?"
                headline={`Want to discuss this with your advisor, ${persona.firstName}?`}
                body="Your Wellness Advisor can apply the research in this article directly to your stack, goals, and data. Ask it anything — from which form to buy to how to time it with your existing supplements."
                footerLabel="Powered by iHerb Wellness Hub"
                footerRight={
                  <Link
                    href="/advisor"
                    className="flex items-center gap-1.5 rounded-full bg-[#0A6B3C] px-4 py-2 text-[12.5px] font-bold text-white transition-all hover:bg-[#085131] active:scale-[0.97]"
                  >
                    Open Wellness Advisor
                    <ArrowRight size={12} strokeWidth={2.5} />
                  </Link>
                }
              >
                <div className="flex flex-wrap gap-1.5">
                  <ContextPill label={aiContextHint} variant={aiContextVariant} />
                  {persona.id === 'maya' ? (
                    <ContextPill label="New to supplements — recommended starter" />
                  ) : (
                    <ContextPill label="Optimized for longevity protocol" variant="data" />
                  )}
                </div>
              </AIMoment>
            </div>

          </article>

          {/* ── SIDEBAR ─────────────────────────────────────────────── */}
          <aside className="w-[280px] flex-shrink-0">
            <div className="sticky top-[100px] flex flex-col gap-5">

              {/* Table of Contents */}
              <div className="overflow-hidden rounded-2xl border border-[#D9EADF] bg-white shadow-[0_2px_12px_rgba(10,107,60,0.05)]">
                <div className="border-b border-[#F0F0F0] bg-[#F1FAF3] px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={13} className="text-[#0A6B3C]" strokeWidth={2.5} />
                    <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#0A6B3C]">
                      In this article
                    </span>
                  </div>
                </div>
                <nav className="px-4 py-3">
                  <ol className="space-y-1">
                    {TOC_SECTIONS.map(({ id, label }) => (
                      <li key={id}>
                        <button
                          onClick={() => scrollTo(id)}
                          className={`w-full rounded-lg px-3 py-2 text-left text-[12.5px] font-medium transition-all ${
                            activeSection === id
                              ? 'bg-[#F1FAF3] text-[#0A6B3C] font-semibold'
                              : 'text-[#555] hover:bg-[#FAFBFA] hover:text-[#0A6B3C]'
                          }`}
                        >
                          {activeSection === id && (
                            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#0A6B3C] align-middle" />
                          )}
                          {label}
                        </button>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>

              {/* Try This Stack */}
              <div className="overflow-hidden rounded-2xl border border-[#D9EADF] bg-white shadow-[0_2px_12px_rgba(10,107,60,0.05)]">
                <div className="border-b border-[#F0F0F0] bg-[#F1FAF3] px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Pill size={13} className="text-[#0A6B3C]" strokeWidth={2.5} />
                    <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#0A6B3C]">
                      Try this stack
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-[#F0F0F0]">
                  {STACK_PRODUCTS.map((p) => (
                    <div key={p.name} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#EBEBEB] bg-white">
                        <img src={p.imageUrl} alt={p.name} className="h-full w-full object-contain" loading="lazy" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-wide text-[#0A6B3C]">
                          {p.brand}
                        </div>
                        <div className="truncate text-[12.5px] font-semibold text-[#1A1A1A]">
                          {p.name}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={9}
                                className="fill-[#F5A623] text-[#F5A623]"
                              />
                            ))}
                          </div>
                          <span className="text-[10.5px] text-[#888]">{p.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[13px] font-bold text-[#1A1A1A]">{p.price}</span>
                        <span className="rounded-full bg-[#FFF7F1] px-2 py-0.5 text-[9.5px] font-bold text-[#D14800]">
                          {p.badge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#F0F0F0] bg-[#FAFBFA] p-4">
                  <button className="w-full rounded-full bg-[#0A6B3C] py-2.5 text-[13px] font-bold text-white transition-all hover:bg-[#085131] active:scale-[0.98]">
                    Add all to cart
                  </button>
                </div>
              </div>

              {/* Related Articles */}
              <div className="overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <div className="border-b border-[#F0F0F0] bg-[#FAFBFA] px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <FlaskConical size={13} className="text-[#888]" strokeWidth={2.5} />
                    <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                      Related articles
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-[#F0F0F0]">
                  {RELATED_ARTICLES.map((a) => (
                    <Link
                      key={a.title}
                      href={a.href}
                      className="flex items-center gap-3 px-4 py-3 transition-all hover:bg-[#FAFBFA] group"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#E8E8E8] bg-white text-[20px]">
                        {a.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12.5px] font-semibold leading-snug text-[#1A1A1A] group-hover:text-[#0A6B3C]">
                          {a.title}
                        </div>
                        <div className="mt-0.5 text-[10.5px] text-[#888]">{a.readTime}</div>
                      </div>
                      <ArrowRight size={13} className="text-[#CCC] group-hover:text-[#0A6B3C]" strokeWidth={2.5} />
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
