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
              