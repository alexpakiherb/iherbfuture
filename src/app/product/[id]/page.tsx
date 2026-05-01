'use client';

// Product Detail Page — Magnesium Glycinate
// Full personalized PDP with AIMoment "Why this is good for you", tabs,
// smart pairing strip, reviews with AI summary, quality testing section.
// Falls back to "now-mag-glycinate" mock data if no product ID match.

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Heart,
  ShoppingCart,
  RefreshCw,
  Truck,
  Shield,
  ChevronRight,
  CheckCircle2,
  Award,
  Package,
  ArrowRight,
  Plus,
  Minus,
  FlaskConical,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AIMoment, ContextPill } from '@/components/AIMoment';
import { usePersona } from '@/components/PersonaProvider';
import { products } from '@/data/products';

// ── Mock product (fallback + hero product) ──────────────────────────────────
const MOCK_PRODUCT = {
  id: 'now-mag-glycinate',
  name: 'Magnesium Glycinate 200 mg, 180 Capsules',
  brand: 'NOW Foods',
  category: 'Supplements',
  price: 18.99,
  originalPrice: 24.99,
  autoshipPrice: 17.09,
  perServing: '$0.10 / serving',
  rating: 4.8,
  reviewCount: 6842,
  soldCount: '148K+',
  image: 'https://res.cloudinary.com/iherb/image/upload/v1700000001/products/mag.jpg',
  badges: ['Quality Promise', '3rd-Party Tested', 'Non-GMO Verified', 'Vegan'],
  dietaryTags: ['Vegan', 'Non-GMO', 'No Gluten'],
  healthGoals: ['Sleep Quality', 'Relaxation Support', 'Muscle Recovery'],
  form: 'Capsules',
  servingSize: '2 Capsules',
  servingsPerContainer: 90,
  weight: '4.23 oz',
  isHouseBrand: false,
};

// ── Pairing products ─────────────────────────────────────────────────────────
const MAYA_PAIRINGS = [
  { emoji: '☀️', brand: 'California Gold Nutrition', name: 'Vitamin D3 5,000 IU', reason: 'Already in your morning stack', price: '$9.99', badge: 'In your stack' },
  { emoji: '🍊', brand: 'California Gold Nutrition', name: 'Vitamin C 1,000 mg', reason: 'Supports immune + sleep synergy', price: '$12.49', badge: 'Immune pair' },
  { emoji: '💤', brand: 'NOW Foods', name: 'L-Theanine 200 mg', reason: 'Amplifies the calming effect at night', price: '$12.99', badge: 'Sleep stack' },
];

const DANIEL_PAIRINGS = [
  { emoji: '🧬', brand: 'Life Extension', name: 'Glycine 3g', reason: 'Synergistic with bisglycinate for deep sleep', price: '$14.99', badge: 'Protocol pair' },
  { emoji: '🌿', brand: 'Thorne', name: 'Ashwagandha KSM-66', reason: 'Already in your evening stack', price: '$34.99', badge: 'In your stack' },
  { emoji: '🔬', brand: 'Life Extension', name: 'Magnesium L-Threonate 2g', reason: 'Add Tue/Fri for BBB cognitive lift', price: '$32.99', badge: 'Advanced add-on' },
];

// ── Mock reviews ─────────────────────────────────────────────────────────────
const REVIEWS = [
  {
    name: 'Sarah K.',
    date: 'Apr 18, 2026',
    rating: 5,
    headline: 'Finally sleeping through the night',
    body: "I've tried three different magnesium supplements and this is the first one that actually helps me fall asleep without any stomach issues. Two capsules 30 minutes before bed and I'm out. Highly recommend for anyone with sleep trouble.",
    verified: true,
  },
  {
    name: 'Marcus T.',
    date: 'Mar 31, 2026',
    rating: 5,
    headline: 'Gentle form — zero GI issues',
    body: "The glycinate form is so much easier on my stomach than citrate was. I noticed a real difference in my sleep quality within the first week. NOW Foods' quality is consistent and the capsule size is manageable.",
    verified: true,
  },
  {
    name: 'Priya L.',
    date: 'Mar 12, 2026',
    rating: 4,
    headline: 'Solid daily mineral for sleep',
    body: 'Works well and the price per serving is great. I pair it with D3 and feel noticeably calmer in the evenings. One star off only because I wish the bottle was larger. Will repurchase.',
    verified: true,
  },
];

// ── Star renderer ─────────────────────────────────────────────────────────────
function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          fill={rating >= s ? '#F5A623' : rating >= s - 0.5 ? '#F5A623' : 'none'}
          stroke={rating >= s ? '#F5A623' : '#DDD'}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

type TabId = 'description' | 'facts' | 'reviews' | 'quality';

export default function PDPPage() {
  const { persona } = usePersona();
  const params = useParams<{ id: string }>();

  // Try to match from products.ts, else use mock
  const numericId = Number(params?.id);
  const lookedUp = products.find((p) => p.id === numericId);
  const product = lookedUp ?? MOCK_PRODUCT;

  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('description');
  const [subscribeSave, setSubscribeSave] = useState(false);

  const pairings = persona.id === 'daniel' ? DANIEL_PAIRINGS : MAYA_PAIRINGS;

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const displayPrice = subscribeSave && product.autoshipPrice
    ? product.autoshipPrice
    : product.price;

  const TABS: { id: TabId; label: string }[] = [
    { id: 'description', label: 'Description' },
    { id: 'facts', label: 'Supplement Facts' },
    { id: 'reviews', label: `Reviews (${product.reviewCount.toLocaleString()})` },
    { id: 'quality', label: 'Quality Testing' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-8 py-5">

        {/* ── Breadcrumb ────────────────────────────────────────── */}
        <nav className="mb-4 flex items-center gap-1.5 text-[12px] text-[#666]">
          <Link href="/" className="transition-colors hover:text-[#0A6B3C]">Home</Link>
          <ChevronRight size={11} className="text-[#BBB]" />
          <Link href="/search?q=supplements" className="transition-colors hover:text-[#0A6B3C]">Supplements</Link>
          <ChevronRight size={11} className="text-[#BBB]" />
          <Link href="/search?q=magnesium" className="transition-colors hover:text-[#0A6B3C]">Magnesium</Link>
          <ChevronRight size={11} className="text-[#BBB]" />
          <span className="max-w-[200px] truncate text-[#1A1A1A]">{product.brand}</span>
          <ChevronRight size={11} className="text-[#BBB]" />
          <span className="max-w-[220px] truncate text-[#1A1A1A]">{product.name}</span>
        </nav>

        {/* ── Two-column layout ────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">

          {/* ── LEFT: Images ────────────────────────────────────── */}
          <div>
            <div className="sticky top-[130px]">
              {/* Main image */}
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-[#EBEBEB] bg-[#F1FAF3]">
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="text-[72px]">💊</span>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-[#0A6B3C]">{product.brand}</div>
                    <div className="mt-0.5 text-[13px] font-semibold text-[#1A1A1A]">Magnesium Glycinate</div>
                  </div>
                </div>
              </div>

              {/* Thumbnail row */}
              <div className="mt-3 flex gap-2">
                {['💊', '📋', '🔬', '✅'].map((em, i) => (
                  <button
                    key={i}
                    className={`flex h-16 w-16 items-center justify-center rounded-xl border-2 text-[22px] transition-all hover:border-[#0A6B3C] ${
                      i === 0 ? 'border-[#0A6B3C] bg-[#F1FAF3]' : 'border-[#E8E8E8] bg-white'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Product info ──────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Brand + title + rating */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#0A6B3C]">
                  {product.brand}
                </span>
                {product.isHouseBrand && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#0A6B3C] bg-[#F1FAF3] px-2 py-0.5 text-[10px] font-semibold text-[#0A6B3C]">
                    <Award size={10} strokeWidth={2.5} />
                    iHerb Brands
                  </span>
                )}
              </div>
              <h1 className="text-[24px] font-bold leading-snug text-[#1A1A1A]">{product.name}</h1>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-[12.5px]">
                <StarRow rating={product.rating} />
                <span className="font-semibold text-[#1A1A1A]">{product.rating}</span>
                <a href="#reviews" className="text-[#1558A6] hover:underline">
                  {product.reviewCount.toLocaleString()} reviews
                </a>
                <span className="text-[#CCC]">·</span>
                <span className="text-[#666]">{product.soldCount} sold</span>
              </div>
            </div>

            {/* Badge pills */}
            <div className="flex flex-wrap gap-1.5">
              {(product.badges ?? []).map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 rounded-full border border-[#C3E6CB] bg-[#F1FAF3] px-2.5 py-1 text-[11px] font-semibold text-[#0A6B3C]"
                >
                  <CheckCircle2 size={10} strokeWidth={2.5} />
                  {b}
                </span>
              ))}
            </div>

            {/* Price + Subscribe & Save toggle */}
            <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-[0_2px_16px_rgba(10,107,60,0.04)]">
              <div className="mb-3 flex items-baseline gap-2.5">
                <span className="text-[32px] font-bold text-[#1A1A1A]">${displayPrice.toFixed(2)}</span>
                {product.originalPrice && !subscribeSave && (
                  <span className="text-[16px] text-[#AAA] line-through">${product.originalPrice.toFixed(2)}</span>
                )}
                {discountPct && !subscribeSave && (
                  <span className="ml-1 rounded-full bg-[#D14800] px-2 py-0.5 text-[11px] font-bold text-white">
                    -{discountPct}%
                  </span>
                )}
                {subscribeSave && (
                  <span className="rounded-full bg-[#F1FAF3] px-2.5 py-0.5 text-[11px] font-bold text-[#0A6B3C]">
                    Autoship price
                  </span>
                )}
              </div>
              <div className="text-[11.5px] text-[#888]">{product.perServing} · {product.servingsPerContainer ?? 90} servings per container</div>

              {/* Subscribe & Save toggle */}
              <div
                onClick={() => setSubscribeSave(!subscribeSave)}
                className={`mt-4 flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                  subscribeSave
                    ? 'border-[#0A6B3C] bg-[#F1FAF3]'
                    : 'border-[#E0E0E0] bg-[#FAFAFA] hover:border-[#C3E6CB]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <RefreshCw size={13} className={subscribeSave ? 'text-[#0A6B3C]' : 'text-[#888]'} strokeWidth={2.5} />
                  <div>
                    <div className={`text-[12.5px] font-semibold ${subscribeSave ? 'text-[#0A6B3C]' : 'text-[#1A1A1A]'}`}>
                      Subscribe &amp; Save 10%
                    </div>
                    <div className="text-[11px] text-[#666]">
                      {product.autoshipPrice ? `$${product.autoshipPrice.toFixed(2)}/delivery · cancel anytime` : 'Cancel anytime'}
                    </div>
                  </div>
                </div>
                <div className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${subscribeSave ? 'bg-[#0A6B3C]' : 'bg-[#D0D0D0]'}`}>
                  <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${subscribeSave ? 'left-[18px]' : 'left-0.5'}`} />
                </div>
              </div>

              {/* Qty selector */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-[11.5px] font-semibold uppercase tracking-wide text-[#666]">Qty</span>
                <div className="inline-flex items-center overflow-hidden rounded-full border border-[#D0D0D0]">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="flex h-9 w-9 items-center justify-center text-[#666] transition-colors hover:bg-[#F1FAF3] hover:text-[#0A6B3C]"
                  >
                    <Minus size={14} strokeWidth={2.5} />
                  </button>
                  <span className="w-9 text-center text-[14px] font-semibold text-[#1A1A1A]">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="flex h-9 w-9 items-center justify-center text-[#666] transition-colors hover:bg-[#F1FAF3] hover:text-[#0A6B3C]"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="mt-4 flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#D14800] py-3 text-[14px] font-bold text-white shadow-sm transition-all hover:bg-[#B03C00] active:scale-[0.97]">
                  <ShoppingCart size={15} strokeWidth={2.5} />
                  Add to Cart
                </button>
                <button
                  onClick={() => setWishlist(!wishlist)}
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border transition-all active:scale-[0.97] ${
                    wishlist
                      ? 'border-[#D14800] bg-[#FFF1E8] text-[#D14800]'
                      : 'border-[#D0D0D0] text-[#888] hover:border-[#D14800] hover:text-[#D14800]'
                  }`}
                >
                  <Heart size={16} strokeWidth={2} fill={wishlist ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Subscribe CTA (below) */}
              <button className="mt-2 w-full rounded-full border border-[#0A6B3C] py-2.5 text-[13px] font-semibold text-[#0A6B3C] transition-all hover:bg-[#F1FAF3] active:scale-[0.97]">
                Add to Subscription
              </button>
            </div>

            {/* Trust badges row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Truck, label: 'Free shipping', sub: 'Orders over $35' },
                { icon: Shield, label: 'Quality Promise', sub: '3rd-party tested' },
                { icon: Package, label: '90-day returns', sub: 'No questions asked' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2 rounded-xl border border-[#EBEBEB] bg-white p-2.5">
                  <Icon size={15} className="flex-shrink-0 text-[#0A6B3C]" strokeWidth={2} />
                  <div>
                    <div className="text-[11.5px] font-semibold text-[#1A1A1A]">{label}</div>
                    <div className="text-[10.5px] text-[#888]">{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── AIMoment: Why this is good for you ────────────── */}
            <AIMoment
              eyebrow="Why this is good for you"
              headline={
                persona.id === 'maya'
                  ? 'The gentlest magnesium form — perfect for your sleep goals'
                  : 'Bisglycinate supports sleep architecture without the GI friction'
              }
              body={
                persona.id === 'maya'
                  ? "Magnesium glycinate pairs magnesium with glycine — an amino acid that calms the nervous system. It's the easiest form on the stomach, making it ideal for someone building their first supplement routine. Your advisor added this specifically for your sleep goal."
                  : 'Bisglycinate form avoids the GI disruption (loose stool) that limits many athletes on citrate. It delivers elemental magnesium efficiently without the cramping that would interfere with your training tolerance. Pairs directly with your evening stack timing. Your HRV data supports the need for deeper recovery support.'
              }
              footerLabel="Powered by iHerb Wellness Hub"
              footerRight={
                <Link href="/wellness-hub/magnesium-guide" className="flex items-center gap-0.5 text-[11px] font-medium text-[#1558A6] hover:underline">
                  {persona.id === 'maya' ? 'Read the magnesium guide' : 'Read the research'}
                  <ArrowRight size={10} strokeWidth={2.5} />
                </Link>
              }
            >
              <div className="flex flex-wrap gap-1.5">
                <ContextPill label={persona.id === 'maya' ? 'Based on your sleep goal' : 'Based on your Oura sleep score'} />
                <ContextPill
                  label={persona.id === 'maya' ? 'Beginner-friendly form' : 'Optimized for longevity protocol'}
                  variant={persona.id === 'daniel' ? 'data' : 'default'}
                />
              </div>
            </AIMoment>

            {/* ── Smart pairing strip ───────────────────────────── */}
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-[16px] font-bold text-[#1A1A1A]">Pairs well with your stack</h2>
                <Link href="/search?q=sleep+stack" className="flex items-center gap-0.5 text-[11.5px] font-medium text-[#1558A6] hover:underline">
                  View all
                  <ArrowRight size={10} strokeWidth={2.5} />
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {pairings.map((p) => (
                  <div
                    key={p.name}
                    className="group flex flex-col rounded-xl border border-[#E8E8E8] bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-[#0A6B3C] hover:shadow-[0_4px_16px_rgba(10,107,60,0.08)]"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[24px]">{p.emoji}</span>
                      <span className="rounded-full bg-[#F1FAF3] px-2 py-0.5 text-[9.5px] font-bold text-[#0A6B3C]">
                        {p.badge}
                      </span>
                    </div>
                    <div className="mb-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#0A6B3C]">{p.brand}</div>
                    <div className="text-[12px] font-semibold leading-snug text-[#1A1A1A]">{p.name}</div>
                    <div className="mt-1 text-[10.5px] leading-relaxed text-[#666]">{p.reason}</div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[13px] font-bold text-[#1A1A1A]">{p.price}</span>
                      <button className="rounded-full bg-[#0A6B3C] px-2.5 py-1 text-[11px] font-bold text-white transition-all hover:bg-[#085131] active:scale-[0.97]">
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Tabs ─────────────────────────────────────────────── */}
            <div id="reviews">
              {/* Tab bar */}
              <div className="mb-5 flex gap-0 overflow-x-auto border-b border-[#EBEBEB]">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`relative whitespace-nowrap px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                      activeTab === t.id
                        ? 'text-[#0A6B3C]'
                        : 'text-[#666] hover:text-[#0A6B3C]'
                    }`}
                  >
                    {t.label}
                    {activeTab === t.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full bg-[#0A6B3C]" />
                    )}
                  </button>
                ))}
              </div>

              {/* ── Description tab ────────────────────────────────── */}
              {activeTab === 'description' && (
                <div className="animate-[fadeIn_200ms_ease-out] space-y-3">
                  <p className="text-[13.5px] leading-relaxed text-[#444]">
                    NOW Foods Magnesium Glycinate delivers elemental magnesium chelated to glycine, an inhibitory amino acid that promotes calm and supports sleep onset. Unlike oxide or citrate forms, glycinate is gentle on the GI tract — nearly zero laxative effect — and absorption rate is consistent across meals.
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Chelated bisglycinate form — superior absorption vs. oxide (15% vs. ~4%)',
                      'Supports healthy muscle relaxation and nerve function',
                      'Glycine co-delivery promotes GABA activity for a calming, sleep-onset effect',
                      'No laxative effect at standard doses — suitable for daily long-term use',
                      'Manufactured in a GMP-certified facility; verified by independent 3rd-party labs',
                      'Free from gluten, soy, GMOs; 100% vegan capsule shell',
                    ].map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[13px] text-[#444]">
                        <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-[#0A6B3C]" strokeWidth={2.5} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ── Supplement Facts tab ────────────────────────────── */}
              {activeTab === 'facts' && (
                <div className="animate-[fadeIn_200ms_ease-out]">
                  <div className="overflow-hidden rounded-xl border border-[#EBEBEB]">
                    <div className="border-b border-[#EBEBEB] bg-[#F7F8F7] px-5 py-3">
                      <div className="text-[14px] font-bold text-[#1A1A1A]">Supplement Facts</div>
                      <div className="text-[12px] text-[#666]">Serving Size: 2 Capsules (1,100 mg) · Servings Per Container: 90</div>
                    </div>
                    <table className="w-full text-[12.5px]">
                      <thead>
                        <tr className="border-b-2 border-[#1A1A1A] bg-[#FAFAFA]">
                          <th className="px-5 py-2 text-left font-bold text-[#1A1A1A]">Ingredient</th>
                          <th className="px-4 py-2 text-right font-bold text-[#1A1A1A]">Amount Per Serving</th>
                          <th className="px-4 py-2 text-right font-bold text-[#1A1A1A]">% Daily Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Magnesium (as Magnesium Glycinate)', amount: '200 mg', dv: '48%' },
                          { name: 'Glycine (as Magnesium Glycinate)', amount: '900 mg', dv: '†' },
                        ].map((row, i) => (
                          <tr key={row.name} className={`border-b border-[#F0F0F0] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                            <td className="px-5 py-2.5 text-[#1A1A1A]">{row.name}</td>
                            <td className="px-4 py-2.5 text-right font-medium text-[#1A1A1A]">{row.amount}</td>
                            <td className="px-4 py-2.5 text-right text-[#666]">{row.dv}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="bg-[#FAFAFA] px-5 py-3 text-[11px] text-[#888]">
                      † Daily Value not established. · Percent Daily Values based on a 2,000 calorie diet.
                    </div>
                    <div className="border-t border-[#EBEBEB] px-5 py-3 text-[11.5px] text-[#666]">
                      <strong className="text-[#1A1A1A]">Other Ingredients:</strong> Cellulose (capsule), Microcrystalline Cellulose, Magnesium Stearate (vegetable source), Silicon Dioxide.
                    </div>
                  </div>
                </div>
              )}

              {/* ── Reviews tab ────────────────────────────────────── */}
              {activeTab === 'reviews' && (
                <div className="animate-[fadeIn_200ms_ease-out] space-y-4">
                  {/* AI Review Summary */}
                  <AIMoment
                    variant="inline"
                    eyebrow="AI review summary"
                    headline="Customers say: gentle on stomach, helps sleep, easy to take"
                    body="Most reviewers (89%) report improved sleep onset within 1–2 weeks. The most mentioned benefit is zero GI side effects compared to other magnesium forms. Recurring phrase: 'finally a form that works without stomach upset.'"
                  />

                  {/* Rating overview */}
                  <div className="flex items-center gap-5 rounded-xl border border-[#EBEBEB] bg-white p-4">
                    <div className="text-center">
                      <div className="text-[40px] font-bold text-[#1A1A1A]">{product.rating}</div>
                      <StarRow rating={product.rating} />
                      <div className="mt-0.5 text-[11px] text-[#888]">{product.reviewCount.toLocaleString()} reviews</div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((s) => {
                        const pct = s === 5 ? 71 : s === 4 ? 18 : s === 3 ? 7 : s === 2 ? 2 : 2;
                        return (
                          <div key={s} className="flex items-center gap-2 text-[11.5px]">
                            <span className="w-3 text-right text-[#666]">{s}</span>
                            <Star size={10} fill="#F5A623" stroke="#F5A623" strokeWidth={1} />
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#F0F0F0]">
                              <div className="h-full rounded-full bg-[#F5A623]" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-7 text-right text-[#888]">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Individual reviews */}
                  {REVIEWS.map((r) => (
                    <div key={r.name} className="rounded-xl border border-[#EBEBEB] bg-white p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1FAF3] text-[12px] font-bold text-[#0A6B3C]">
                            {r.name[0]}
                          </div>
                          <div>
                            <div className="text-[12.5px] font-semibold text-[#1A1A1A]">{r.name}</div>
                            <div className="text-[11px] text-[#888]">{r.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <StarRow rating={r.rating} size={12} />
                          {r.verified && (
                            <span className="rounded-full bg-[#F1FAF3] px-2 py-0.5 text-[9.5px] font-bold text-[#0A6B3C]">
                              Verified purchase
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mb-1 text-[13px] font-semibold text-[#1A1A1A]">{r.headline}</div>
                      <p className="text-[12.5px] leading-relaxed text-[#555]">{r.body}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Quality Testing tab ────────────────────────────── */}
              {activeTab === 'quality' && (
                <div className="animate-[fadeIn_200ms_ease-out] space-y-4">
                  {/* Certifications */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: '🛡️', label: 'NSF Certified', detail: 'Sports certification program verifies no banned substances' },
                      { icon: '🔬', label: 'ConsumerLab Verified', detail: 'Independent testing confirms label accuracy within 2%' },
                      { icon: '✅', label: 'Non-GMO Project Verified', detail: 'Raw materials traced through supply chain' },
                      { icon: '🌱', label: 'Vegan Action Certified', detail: 'No animal-derived ingredients or processing aids' },
                    ].map((c) => (
                      <div key={c.label} className="flex items-start gap-3 rounded-xl border border-[#EBEBEB] bg-white p-3.5">
                        <span className="text-[22px]">{c.icon}</span>
                        <div>
                          <div className="text-[12.5px] font-semibold text-[#1A1A1A]">{c.label}</div>
                          <div className="mt-0.5 text-[11px] leading-relaxed text-[#666]">{c.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Heavy metal test results */}
                  <div className="overflow-hidden rounded-xl border border-[#EBEBEB]">
                    <div className="flex items-center gap-2 border-b border-[#EBEBEB] bg-[#F7F8F7] px-5 py-3">
                      <FlaskConical size={14} className="text-[#0A6B3C]" strokeWidth={2} />
                      <div className="text-[13px] font-bold text-[#1A1A1A]">Heavy Metal Testing</div>
                      <span className="ml-auto text-[11px] text-[#888]">Batch #MG-2026-04-18 · tested Apr 18, 2026</span>
                    </div>
                    <table className="w-full text-[12.5px]">
                      <thead>
                        <tr className="border-b border-[#EBEBEB] bg-[#FAFAFA] text-[11px] font-bold uppercase tracking-wider text-[#666]">
                          <th className="px-5 py-2 text-left">Metal</th>
                          <th className="px-4 py-2 text-right">Result</th>
                          <th className="px-4 py-2 text-right">Limit</th>
                          <th className="px-4 py-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { metal: 'Lead (Pb)', result: '<0.01 ppm', limit: '0.5 ppm', pass: true },
                          { metal: 'Arsenic (As)', result: '<0.01 ppm', limit: '1.0 ppm', pass: true },
                          { metal: 'Cadmium (Cd)', result: '<0.01 ppm', limit: '0.3 ppm', pass: true },
                          { metal: 'Mercury (Hg)', result: '<0.001 ppm', limit: '0.1 ppm', pass: true },
                        ].map((row, i) => (
                          <tr key={row.metal} className={`border-b border-[#F0F0F0] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                            <td className="px-5 py-2.5 font-medium text-[#1A1A1A]">{row.metal}</td>
                            <td className="px-4 py-2.5 text-right font-mono text-[#1A1A1A]">{row.result}</td>
                            <td className="px-4 py-2.5 text-right text-[#888]">{row.limit}</td>
                            <td className="px-4 py-2.5 text-right">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${row.pass ? 'bg-[#F1FAF3] text-[#0A6B3C]' : 'bg-[#FFF1E8] text-[#D14800]'}`}>
                                <CheckCircle2 size={9} strokeWidth={3} />
                                {row.pass ? 'PASS' : 'FAIL'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 3rd party labs */}
                  <div className="rounded-xl border border-[#D9EADF] bg-[#F1FAF3] p-4">
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#0A6B3C]">
                      3rd-Party Laboratories Used
                    </div>
                    <div className="space-y-1.5 text-[12.5px] text-[#444]">
                      {['NSF International · Ann Arbor, MI', 'ConsumerLab.com · White Plains, NY', 'Eurofins Scientific · Des Moines, IA'].map((lab) => (
                        <div key={lab} className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="flex-shrink-0 text-[#0A6B3C]" strokeWidth={2.5} />
                          {lab}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Wellness Hub sticky article link ─────────────── */}
            <Link
              href="/wellness-hub/magnesium-guide"
              className="group flex items-center gap-4 rounded-2xl border border-[#E0E0E0] bg-white p-4 transition-all hover:border-[#0A6B3C] hover:shadow-[0_2px_16px_rgba(10,107,60,0.07)]"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F1FAF3] to-[#E5F8E6] text-[24px]">
                <BookOpen size={22} className="text-[#0A6B3C]" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="mb-0.5 flex items-center gap-1.5">
                  <Sparkles size={10} className="text-[#0A6B3C]" strokeWidth={2.5} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A6B3C]">Wellness Hub · Recommended</span>
                  <span className="rounded-full bg-[#FFF7F1] px-2 py-0.5 text-[9.5px] font-bold text-[#D14800]">6 min read</span>
                </div>
                <div className="text-[13.5px] font-semibold text-[#1A1A1A] group-hover:text-[#0A6B3C]">
                  {persona.id === 'maya'
                    ? 'The Magnesium Guide: Glycinate vs Citrate vs Malate'
                    : 'Magnesium Forms & Cognitive Performance: What the Research Says'}
                </div>
              </div>
              <ArrowRight size={16} className="flex-shrink-0 text-[#999] group-hover:text-[#0A6B3C]" />
            </Link>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
