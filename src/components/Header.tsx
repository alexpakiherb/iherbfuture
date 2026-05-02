'use client';

import { useState, useEffect } from 'react';
import {
  ChevronDown,
  Search,
  X,
  ShoppingCart,
  Globe,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { promoBarItems, categoryNav, promoNav } from '@/data/navigation';
import { usePersona } from './PersonaProvider';

interface HeaderProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
}

const WELLNESS_NAV = [
  { id: 'today', label: 'Today', href: '/' },
  { id: 'stack', label: 'My Stack', href: '/stack' },
  { id: 'forecast', label: 'Health Forecast', href: '/forecast' },
  { id: 'subscriptions', label: 'Subscriptions', href: '/subscriptions' },
  { id: 'advisor', label: 'Wellness Advisor', href: '/advisor' },
];

export default function Header({ initialQuery = '', onSearch }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { persona, greeting } = usePersona();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((p) => (p + 1) % promoBarItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    if (onSearch) onSearch(searchQuery);
    else router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearchSubmit();
  };

  const currentPromo = promoBarItems[currentPromoIndex];
  const greetingShort = greeting.split('—')[0].trim();

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* Promo bar */}
      <div className="bg-[#0A6B3C]">
        <div className="flex h-9 items-center justify-between gap-8 px-8">
          <a href={currentPromo.link} className="text-[13px] font-medium text-white hover:underline">
            {currentPromo.text}
          </a>
          <div className="flex flex-shrink-0 items-center gap-5">
            <a href="#" className="text-[13px] font-medium text-white hover:underline">
              24/7 Support
            </a>
            <button className="flex items-center gap-1 text-[13px] font-medium text-white hover:underline">
              <Globe size={14} />
              <span>EN · USD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary bar */}
      <div className="bg-[#0A6B3C]">
        <div className="flex items-center gap-4 px-8 py-2.5">
          <Link href="/" className="mr-1 flex-shrink-0">
            <span className="text-[22px] font-bold tracking-tight text-white">iHerb</span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative flex items-center overflow-hidden rounded-full bg-white">
              <input
                type="text"
                placeholder="Search 30,000+ products or ask a question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent py-2 pl-4 pr-10 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSearchSubmit}
                  className="absolute right-2 rounded-full bg-[#0A6B3C] p-1.5 text-white transition-colors hover:bg-[#085131]"
                >
                  <Search size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Always-on Advisor entry point */}
          <Link
            href="/advisor"
            className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            <Sparkles size={13} className="text-white" strokeWidth={2.5} />
            <span className="text-[12.5px] font-semibold text-white">Ask Advisor</span>
          </Link>

          <div className="ml-1 flex flex-shrink-0 items-center gap-4">
            <Link href="/account" className="flex cursor-pointer items-center gap-2 hover:opacity-80">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: persona.avatarColor }}
              >
                {persona.initials}
              </div>
              <div className="leading-tight">
                <div className="text-[10.5px] text-white/75">{greetingShort}</div>
                <div className="flex items-center gap-0.5">
                  <span className="text-[12.5px] font-semibold text-white">My Account</span>
                  <ChevronDown size={12} className="text-white" />
                </div>
              </div>
            </Link>

            <Link
              href="/cart"
              className="relative transition-opacity hover:opacity-80"
              aria-label="Cart"
            >
              <ShoppingCart size={22} className="text-white" />
              {persona.cartItemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#D14800] px-1 text-[10px] font-bold text-white">
                  {persona.cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Wellness nav (replaces category subnav) */}
      <nav className="border-b border-[#EBEBEB] bg-white">
        <div className="flex items-center px-8">
          <div className="flex items-center">
            {WELLNESS_NAV.map((item) => {
              const active = pathname === item.href || (item.id === 'today' && pathname === '/');
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`relative whitespace-nowrap px-3.5 py-2.5 text-[13px] font-semibold transition-colors ${
                    active ? 'text-[#0A6B3C]' : 'text-[#444] hover:text-[#0A6B3C]'
                  }`}
                >
                  {item.label}
                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full bg-[#0A6B3C]" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex-1" />

          {/* Shop categories */}
          <div className="flex items-center gap-1">
            {categoryNav.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                href={`/search?category=${cat.id}`}
                className="whitespace-nowrap px-3 py-2.5 text-[12.5px] font-semibold text-[#444] transition-colors hover:text-[#0A6B3C]"
              >
                {cat.label}
              </Link>
            ))}
            <Link
              href="/specials"
              className="whitespace-nowrap px-3 py-2.5 text-[12.5px] font-semibold text-[#D14800] transition-colors hover:text-[#A83600]"
            >
              {promoNav[0].label}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
