'use client';

// Smart Cart — the agentic cart moment.
// The AI is actively curating, not just listing items.
// AIMoment cards surface bundle savings and free-shipping unlocks.
// AgentActionCards show what the advisor already handled for this cart.

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  RefreshCw,
  Truck,
  Shield,
  Phone,
  ArrowRight,
  Tag,
  Sparkles,
  CheckCircle2,
  Package,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AIMoment, ContextPill } from '@/components/AIMoment';
import { AgentActionCard } from '@/components/AgentActionCard';
import { usePersona } from '@/components/PersonaProvider';
import { AgentAction } from '@/data/personas';

// ── Mock cart items by persona ────────────────────────────────────────────────

interface CartItem {
  id: string;
  imageUrl: string;
  brand: string;
  name: string;
  dose: string;
  price: number;
  autoshipPrice: number;
  qty: number;
  autoship: boolean;
  showAutoshipPromo?: boolean; // show the "save X% with autoship" pill
}

const MAYA_CART: CartItem[] = [
  {
    id: 'cgn-vit-d3',
    imageUrl: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn01066/u/159.jpg',
    brand: 'California Gold Nutrition',
    name: 'Vitamin D3 5,000 IU, 360 Softgels',
    dose: '1 softgel daily · morning',
    price: 9.99,
    autoshipPrice: 8.99,
    qty: 1,
    autoship: true,
  },
  {
    id: 'now-mag-glycinate',
    imageUrl: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01289/u/62.jpg',
    brand: 'NOW Foods',
    name: 'Magnesium Glycinate 200 mg, 180 Capsules',
    dose: '2 capsules daily · evening',
    price: 18.99,
    autoshipPrice: 17.09,
    qty: 1,
    autoship: false,
    showAutoshipPromo: true,
  },
];

const DANIEL_CART: CartItem[] = [
  {
    id: 'le-nmn',
    imageUrl: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lex/lex23443/u/24.jpg',
    brand: 'Life Extension',
    name: 'NMN 500 mg, 60 Capsules',
    dose: '1 capsule daily · morning',
    price: 38.99,
    autoshipPrice: 35.09,
    qty: 1,
    autoship: true,
  },
  {
    id: 'le-quercetin',
    imageUrl: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lex/lex23023/u/66.jpg',
    brand: 'Life Extension',
    name: 'Quercetin Phytosome, 60 Capsules',
    dose: '1 capsule daily · morning',
    price: 24.99,
    autoshipPrice: 22.49,
    qty: 1,
    autoship: true,
  },
  {
    id: 'cgn-resveratrol',
    imageUrl: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn00934/u/221.jpg',
    brand: 'California Gold Nutrition',
    name: 'Resveratrol 500 mg, 60 Capsules',
    dose: '1 capsule daily · morning',
    price: 14.99,
    autoshipPrice: 13.49,
    qty: 1,
    autoship: true,
    showAutoshipPromo: true,
  },
  {
    id: 'thorne-omega',
    imageUrl: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00690/u/50.jpg',
    brand: 'Thorne',
    name: 'Omega-3 Triglyceride EPA/DHA 2.5g, 60 Softgels',
    dose: '2 softgels daily · morning',
    price: 42.99,
    autoshipPrice: 38.69,
    qty: 1,
    autoship: true,
  },
];

// ── Agent actions for cart context ───────────────────────────────────────────

const MAYA_CART_ACTIONS: AgentAction[] = [
  {
    id: 'cart-m-1',
    type: 'taken',
    title: 'Auto-applied 5% loyalty discount',
    detail: 'You crossed the $25 threshold for your Silver loyalty tier. Applied automatically.',
    timestamp: 'Just now',
    category: 'price',
    savings: '$1.45',
  },
  {
    id: 'cart-m-2',
    type: 'taken',
    title: 'Locked in $4 lower price on Vitamin D3',
    detail: 'Caught a 20% flash promo before it expired this morning. Applied to your cart.',
    timestamp: '2 hours ago',
    category: 'price',
    savings: '$4.00',
  },
];

const DANIEL_CART_ACTIONS: AgentAction[] = [
  {
    id: 'cart-d-1',
    type: 'taken',
    title: 'Auto-applied 5% loyalty discount',
    detail: 'Platinum tier discount applied — saved $6.10 across your 4 items.',
    timestamp: 'Just now',
    category: 'price',
    savings: '$6.10',
  },
  {
    id: 'cart-d-2',
    type: 'taken',
    title: 'Locked in current price on Thorne EPA before June increase',
    detail: 'Thorne announced a 9% increase effective June 1. Locked your next 3 autoship deliveries at today\'s price.',
    timestamp: '4 days ago',
    category: 'price',
    savings: '$11.97',
  },
];

// ── Stepper component ─────────────────────────────────────────────────────────
function QtyStepper({ qty, onChange }: { qty: number; onChange: (n: number) => void }) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-[#D0D0D0]">
      <button
        onClick={() => onChange(Math.max(1, qty - 1))}
        className="flex h-7 w-7 items-center justify-center text-[#666] transition-colors hover:bg-[#F1FAF3] hover:text-[#0A6B3C]"
      >
        <Minus size={12} strokeWidth={2.5} />
      </button>
      <span className="w-7 text-center text-[12.5px] font-semibold text-[#1A1A1A]">{qty}</span>
      <button
        onClick={() => onChange(qty + 1)}
        className="flex h-7 w-7 items-center justify-center text-[#666] transition-colors hover:bg-[#F1FAF3] hover:text-[#0A6B3C]"
      >
        <Plus size={12} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CartPage() {
  const { persona } = usePersona();

  const initialItems = persona.id === 'daniel' ? DANIEL_CART : MAYA_CART;

  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [bundleApplied, setBundleApplied] = useState(false);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const visibleItems = items.filter((i) => !removedIds.has(i.id));

  const updateQty = (id: string, qty: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const toggleAutoship = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, autoship: !i.autoship } : i)));
  };

  const removeItem = (id: string) => {
    setRemovedIds((prev) => new Set([...prev, id]));
  };

  // ── Calculations ──────────────────────────────────────────────────────────
  const subtotal = visibleItems.reduce((sum, i) => {
    const price = i.autoship ? i.autoshipPrice : i.price;
    return sum + price * i.qty;
  }, 0);

  const autoshipDiscount = visibleItems.reduce((sum, i) => {
    if (!i.autoship) return sum;
    return sum + (i.price - i.autoshipPrice) * i.qty;
  }, 0);

  const bundleSavings = bundleApplied
    ? persona.id === 'maya'
      ? 8.75
      : 31.2
    : 0;

  const FREE_SHIPPING_THRESHOLD = 35;
  const toFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 4.99;

  const loyaltyDiscount = persona.id === 'daniel' ? subtotal * 0.05 : subtotal >= 25 ? subtotal * 0.05 : 0;

  const total = subtotal - bundleSavings - loyaltyDiscount + shippingCost;

  // ── Upsell product for free shipping strip ──────────────────────────────
  const freeShippingUpsell =
    persona.id === 'maya'
      ? {
          imageUrl: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn00932/u/298.jpg',
          name: 'Vitamin C 1,000 mg',
          brand: 'California Gold Nutrition',
          price: 12.49,
          note: 'On your wish list',
        }
      : {
          imageUrl: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now00225/u/32.jpg',
          name: 'Glycine 3g Powder',
          brand: 'NOW Foods',
          price: 9.99,
          note: 'Advisor recommended',
        };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 pt-12 pb-24 md:px-10 md:pt-16 md:pb-32">

        {/* ── Editorial page header ───────────────────────────────── */}
        <div className="mb-12">
          <div className="mb-3 flex items-center gap-1.5 text-[#0A6B3C]">
            <ShoppingCart size={13} strokeWidth={2.5} />
            <span className="text-[11.5px] font-bold uppercase" style={{ letterSpacing: '0.18em' }}>
              Your Cart
            </span>
          </div>
          <h1
            className="font-serif-display text-[36px] font-bold text-[#1A1A1A] md:text-[52px]"
            style={{ letterSpacing: '-0.022em', lineHeight: 1.04 }}
          >
            {visibleItems.length} {visibleItems.length === 1 ? 'item' : 'items'}, ready when you are.
          </h1>
          <p className="mt-4 max-w-[560px] text-[16px] text-[#555]" style={{ lineHeight: 1.55 }}>
            {persona.id === 'maya'
              ? 'Your advisor found a way to save before you check out — apply or skip below.'
              : 'Your advisor curated this cart, locked prices, and found a bundle worth your while.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">

          {/* ── LEFT: Cart items + AI moments ──────────────────── */}
          <div className="space-y-4">

            {/* Cart items list */}
            <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-[#EFEFEF]">
              <div className="divide-y divide-[#F4F4F4]">
                {visibleItems.map((item) => (
                  <div key={item.id} className="px-7 py-6">
                    <div className="flex gap-5">
                      {/* Product image */}
                      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#FAFBFA]">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-contain p-2"
                          loading="lazy"
                        />
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 text-[10.5px] font-bold uppercase text-[#0A6B3C]" style={{ letterSpacing: '0.14em' }}>{item.brand}</div>
                        <div className="text-[15.5px] font-semibold leading-snug text-[#1A1A1A]" style={{ letterSpacing: '-0.005em' }}>{item.name}</div>
                        <div className="mt-1 text-[12.5px] text-[#888]">{item.dose}</div>

                        {/* Autoship toggle row */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => toggleAutoship(item.id)}
                            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                              item.autoship
                                ? 'border-[#0A6B3C] bg-[#F1FAF3] text-[#0A6B3C]'
                                : 'border-[#D0D0D0] text-[#666] hover:border-[#0A6B3C] hover:text-[#0A6B3C]'
                            }`}
                          >
                            <RefreshCw size={10} strokeWidth={2.5} className={item.autoship ? 'text-[#0A6B3C]' : 'text-[#888]'} />
                            {item.autoship ? 'Autoship on · save 10%' : 'Subscribe & save 10%'}
                          </button>

                          {item.showAutoshipPromo && !item.autoship && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#FFD9C4] bg-[#FFF7F1] px-2 py-0.5 text-[10.5px] font-semibold text-[#D14800]">
                              <Tag size={9} strokeWidth={2.5} />
                              Save 12% · autoship every 60 days
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: qty + price + remove */}
                      <div className="flex flex-shrink-0 flex-col items-end gap-2">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#CCC] transition-colors hover:text-[#888]"
                          aria-label="Remove item"
                        >
                          <X size={14} strokeWidth={2} />
                        </button>
                        <div className="text-right">
                          <div className="text-[15px] font-bold text-[#1A1A1A]">
                            ${(item.autoship ? item.autoshipPrice : item.price).toFixed(2)}
                          </div>
                          {item.autoship && (
                            <div className="text-[11px] text-[#888] line-through">${item.price.toFixed(2)}</div>
                          )}
                        </div>
                        <QtyStepper qty={item.qty} onChange={(n) => updateQty(item.id, n)} />
                      </div>
                    </div>
                  </div>
                ))}

                {visibleItems.length === 0 && (
                  <div className="px-5 py-12 text-center text-[13px] italic text-[#999]">
                    Your cart is empty.{' '}
                    <Link href="/search?q=supplements" className="text-[#1558A6] hover:underline">
                      Browse supplements
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* ── AIMoment 1: Bundle savings ───────────────────── */}
            <AIMoment
              variant="flat"
              className="rounded-2xl bg-white p-7 ring-1 ring-[#EFEFEF]"
              eyebrow="Your advisor noticed"
              headline={
                persona.id === 'maya'
                  ? "Add Vitamin C to qualify for the Immune Foundations bundle — saves $8.75/mo"
                  : "Switching your NMN + Quercetin + Resveratrol to autoship qualifies for the Longevity Stack bundle — saves $31.20/mo"
              }
              body={
                persona.id === 'maya'
                  ? "You already have Vitamin D3 and Magnesium in your cart. Adding Vitamin C (already on your wish list) unlocks the Immune Foundations bundle pricing — 3 supplements, one optimized monthly delivery."
                  : "Your 3 longevity supplements are already in this cart. Bundling them as a single autoship order triggers the Longevity Stack discount and reduces your delivery logistics to one shipment per 30 days."
              }
              footerLabel="Powered by iHerb Wellness Hub"
              footerRight={
                bundleApplied ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[#0A6B3C]">
                    <CheckCircle2 size={11} strokeWidth={2.5} />
                    Bundle applied
                  </span>
                ) : (
                  <button
                    onClick={() => setBundleApplied(true)}
                    className="flex items-center gap-1.5 rounded-full bg-[#0A6B3C] px-4 py-1.5 text-[12px] font-bold text-white transition-all hover:bg-[#085131] active:scale-[0.97]"
                  >
                    <Tag size={11} strokeWidth={2.5} />
                    Apply bundle · save {persona.id === 'maya' ? '$8.75' : '$31.20'}/mo
                  </button>
                )
              }
            >
              <div className="flex flex-wrap gap-1.5">
                <ContextPill label={persona.id === 'maya' ? 'Based on your immune goal' : 'Based on your longevity protocol'} />
                {persona.id === 'daniel' && (
                  <ContextPill label="Whoop recovery: 84%" variant="data" />
                )}
              </div>
            </AIMoment>

            {/* ── AIMoment 2: Free shipping unlock (inline variant) */}
            {toFreeShipping > 0 && (
              <AIMoment
                variant="inline"
                eyebrow="Free shipping unlock"
                headline={`Add $${toFreeShipping.toFixed(2)} more for free shipping`}
                body={
                  <span className="flex items-center gap-2">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#EBEBEB] bg-white">
                      <img
                        src={freeShippingUpsell.imageUrl}
                        alt={freeShippingUpsell.name}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </span>
                    <span>
                      Suggested:{' '}
                      <span className="font-semibold text-[#1A1A1A]">
                        {freeShippingUpsell.brand} {freeShippingUpsell.name}
                      </span>{' '}
                      (${freeShippingUpsell.price.toFixed(2)}) · {freeShippingUpsell.note}
                    </span>
                  </span>
                }
              >
                <div className="flex items-center gap-2">
                  <button className="rounded-full bg-[#0A6B3C] px-3.5 py-1.5 text-[12px] font-bold text-white transition-all hover:bg-[#085131] active:scale-[0.97]">
                    Add to cart
                  </button>
                  <Link href="/product/10" className="flex items-center gap-0.5 text-[11.5px] font-medium text-[#1558A6] hover:underline">
                    View product
                    <ArrowRight size={10} strokeWidth={2.5} />
                  </Link>
                </div>
              </AIMoment>
            )}

            {/* ── Things your advisor handled ──────────────────── */}
            <div className="pt-4">
              <div className="mb-5 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase text-[#0A6B3C]" style={{ letterSpacing: '0.18em' }}>Hands-off</div>
                  <h2 className="mt-1.5 text-[20px] font-bold text-[#1A1A1A]" style={{ letterSpacing: '-0.012em' }}>What your advisor handled for this cart</h2>
                </div>
                <Link href="/advisor" className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#1A1A1A] hover:text-[#0A6B3C]">
                  Full audit log
                  <ArrowRight size={12} strokeWidth={2.5} />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {(persona.id === 'maya' ? MAYA_CART_ACTIONS : DANIEL_CART_ACTIONS).map((a) => (
                  <AgentActionCard key={a.id} action={a} />
                ))}
              </div>
            </div>

            {/* ── Trust strip — Patagonia/Apple cleaner row ───── */}
            <div className="grid grid-cols-1 divide-x divide-y divide-[#EFEFEF] sm:grid-cols-3 sm:divide-y-0">
              {[
                { icon: Package, label: '90-day money back', sub: 'No questions asked' },
                { icon: Phone, label: '24/7 support', sub: 'Chat, email, or phone' },
                { icon: Shield, label: 'Secure checkout', sub: 'SSL encrypted · PCI-DSS' },
              ].map(({ icon: Icon, label, sub }, i) => (
                <div key={label} className={`flex items-center gap-3 px-5 py-5 ${i === 0 ? 'sm:pl-0' : ''} ${i === 2 ? 'sm:pr-0' : ''}`}>
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F1FAF3]">
                    <Icon size={16} className="text-[#0A6B3C]" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1A1A1A]">{label}</div>
                    <div className="text-[11.5px] text-[#888]">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Order summary ─────────────────────────── */}
          <div>
            <div className="sticky top-[130px]">
              <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-[#EFEFEF]">

                {/* Summary header */}
                <div className="border-b border-[#F2F2F2] px-6 py-4">
                  <span className="text-[11px] font-bold uppercase text-[#666]" style={{ letterSpacing: '0.18em' }}>Order summary</span>
                </div>

                <div className="px-5 py-4 space-y-2.5">

                  {/* Line items */}
                  <div className="flex justify-between text-[13.5px]">
                    <span className="text-[#444]">Subtotal ({visibleItems.reduce((s, i) => s + i.qty, 0)} items)</span>
                    <span className="font-semibold text-[#1A1A1A]">${subtotal.toFixed(2)}</span>
                  </div>

                  {autoshipDiscount > 0 && (
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#0A6B3C]">Autoship discount</span>
                      <span className="font-semibold text-[#0A6B3C]">-${autoshipDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  {loyaltyDiscount > 0 && (
                    <div className="flex justify-between text-[13px]">
                      <span className="flex items-center gap-1 text-[#0A6B3C]">
                        <Sparkles size={10} strokeWidth={2.5} />
                        {persona.id === 'daniel' ? 'Platinum loyalty (5%)' : 'Silver loyalty (5%)'}
                      </span>
                      <span className="font-semibold text-[#0A6B3C]">-${loyaltyDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  {bundleApplied && (
                    <div className="flex justify-between text-[13px]">
                      <span className="flex items-center gap-1 text-[#D14800]">
                        <Tag size={10} strokeWidth={2.5} />
                        {persona.id === 'maya' ? 'Immune Foundations bundle' : 'Longevity Stack bundle'}
                      </span>
                      <span className="font-semibold text-[#D14800]">-${bundleSavings.toFixed(2)}/mo</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#444]">Shipping</span>
                    {shippingCost === 0 ? (
                      <span className="font-semibold text-[#0A6B3C]">Free</span>
                    ) : (
                      <span className="font-semibold text-[#1A1A1A]">${shippingCost.toFixed(2)}</span>
                    )}
                  </div>

                  {toFreeShipping > 0 && (
                    <div className="rounded-lg border border-[#FFD9C4] bg-[#FFF7F1] px-3 py-2 text-[11.5px] text-[#D14800]">
                      <span className="font-semibold">Add ${toFreeShipping.toFixed(2)} more</span> to unlock free shipping
                    </div>
                  )}

                  {toFreeShipping === 0 && (
                    <div className="flex items-center gap-1.5 rounded-lg bg-[#F1FAF3] px-3 py-2 text-[11.5px] text-[#0A6B3C]">
                      <Truck size={12} strokeWidth={2.5} />
                      <span className="font-semibold">Free shipping unlocked</span>
                    </div>
                  )}

                  <div className="border-t border-[#EBEBEB] pt-2.5">
                    <div className="flex justify-between">
                      <span className="text-[15px] font-bold text-[#1A1A1A]">Estimated total</span>
                      <span className="text-[20px] font-bold text-[#1A1A1A]">${total.toFixed(2)}</span>
                    </div>
                    {(autoshipDiscount > 0 || bundleSavings > 0 || loyaltyDiscount > 0) && (
                      <div className="mt-1 text-right text-[11px] text-[#0A6B3C]">
                        You&apos;re saving ${(autoshipDiscount + bundleSavings + loyaltyDiscount).toFixed(2)} on this order
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button className="w-full rounded-full bg-[#0A6B3C] py-3.5 text-[15px] font-bold text-white shadow-sm transition-all hover:bg-[#085131] active:scale-[0.98]">
                    Proceed to Checkout
                  </button>
                  <Link
                    href="/"
                    className="mt-2.5 flex items-center justify-center gap-1 text-[12px] font-medium text-[#666] hover:text-[#0A6B3C] hover:underline"
                  >
                    Continue shopping
                    <ArrowRight size={11} strokeWidth={2.5} />
                  </Link>
                </div>

                {/* Secure checkout badges */}
                <div className="border-t border-[#F0F0F0] bg-[#FAFBFA] px-5 py-3">
                  <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-[#888]">
                    <Shield size={11} strokeWidth={2} />
                    Secured with 256-bit SSL encryption
                  </div>
                  <div className="mt-1.5 flex flex-wrap justify-center gap-2">
                    {['Visa', 'MC', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay'].map((m) => (
                      <span
                        key={m}
                        className="rounded border border-[#E0E0E0] bg-white px-2 py-0.5 text-[9.5px] font-semibold text-[#666]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Advisor stats mini-card */}
              <div className="mt-3 rounded-xl border border-[#D9EADF] bg-[#F1FAF3] p-4">
                <div className="mb-2 flex items-center gap-1.5">
                  <Sparkles size={11} className="text-[#0A6B3C]" strokeWidth={2.5} />
                  <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#0A6B3C]">
                    Advisor savings this session
                  </span>
                </div>
                <div className="text-[22px] font-bold text-[#1A1A1A]">
                  ${(
                    (persona.id === 'maya' ? 5.45 : 18.07) +
                    (bundleApplied ? (persona.id === 'maya' ? 8.75 : 31.2) : 0)
                  ).toFixed(2)}
                </div>
                <div className="text-[11.5px] text-[#555]">
                  {persona.id === 'maya'
                    ? 'Price lock + loyalty discount applied'
                    : 'Price lock + Platinum discount + bundle'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
