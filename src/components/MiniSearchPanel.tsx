'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Sparkles, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { PillAnswer, ContextualPill } from '@/data/pdpAnswers';
import { products } from '@/data/products';

interface MiniSearchPanelProps {
  pill: ContextualPill;
  answer: PillAnswer;
  onClose: () => void;
}

function CompactProductCard({ productId }: { productId: number }) {
  const product = products.find((p) => p.id === productId);
  const [imgError, setImgError] = useState(false);
  if (!product) return null;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex gap-3 p-3 rounded-xl border border-[#EBEBEB] hover:border-[#0A6B3C] hover:shadow-[0_2px_12px_rgba(10,107,60,0.10)] bg-white transition-all duration-150"
    >
      {/* Thumbnail */}
      <div className="w-[68px] h-[68px] flex-shrink-0 bg-[#FAFAFA] rounded-lg border border-[#F0F0F0] flex items-center justify-center overflow-hidden">
        {!imgError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-1"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-[#F5F8F5] rounded-lg" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col">
        <p className="text-[9px] font-bold uppercase tracking-widest text-[#0A6B3C] truncate">
          {product.brand}
        </p>
        <h4 className="text-[12px] font-medium leading-[1.35] text-[#1A1A1A] line-clamp-2 mt-0.5 flex-1">
          {product.name}
        </h4>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-[13px] font-bold text-[#1A1A1A]">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] line-through text-[#CCCCCC]">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-[10px] text-[#AAA] ml-auto">
            ★ {product.rating}
          </span>
          <ArrowRight
            size={11}
            className="text-[#0A6B3C] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            strokeWidth={2.5}
          />
        </div>
      </div>
    </Link>
  );
}

export function MiniSearchPanel({ pill, answer, onClose }: MiniSearchPanelProps) {
  return (
    <div className="relative rounded-2xl border border-[#0A6B3C]/20 bg-white shadow-[0_8px_32px_rgba(10,107,60,0.12)] overflow-hidden animate-[fadeIn_180ms_ease-out]">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#0A6B3C] via-[#79A83C] to-[#0A6B3C]" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-[#F0F0F0]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={12} className="text-[#0A6B3C]" strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A6B3C]">
              AI Answer
            </span>
          </div>
          <p className="text-[12.5px] text-[#666] italic leading-snug">
            &ldquo;{pill.label}&rdquo;
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close answer panel"
          className="flex-shrink-0 w-7 h-7 rounded-full hover:bg-[#F1FAF3] flex items-center justify-center text-[#BBBBBB] hover:text-[#0A6B3C] transition-colors mt-0.5"
        >
          <X size={15} strokeWidth={2} />
        </button>
      </div>

      {/* Answer body */}
      <div className="px-5 py-4">
        <h3 className="text-[19px] font-bold text-[#1A1A1A] leading-snug mb-3">
          {answer.headline}
        </h3>

        {answer.paragraphs.map((para, i) => (
          <p key={i} className="text-[13.5px] leading-[1.7] text-[#444] mb-3 last:mb-0">
            {para}
          </p>
        ))}

        {/* Key points */}
        {answer.highlights && answer.highlights.length > 0 && (
          <div className="mt-4 rounded-xl bg-[#F1FAF3] border border-[#D9EADF] px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A6B3C] mb-2.5">
              Key takeaways
            </p>
            <ul className="space-y-2">
              {answer.highlights.map((h, i) => (
                <li key={i} className="flex gap-2 text-[12.5px] text-[#1A1A1A] leading-snug">
                  <CheckCircle2
                    size={14}
                    className="text-[#0A6B3C] flex-shrink-0 mt-[1px]"
                    strokeWidth={2}
                  />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Source citation */}
        <div className="mt-4 flex items-start gap-2 text-[11px] text-[#AAA] bg-[#FAFAFA] rounded-lg px-3 py-2">
          <BookOpen size={12} strokeWidth={2} className="flex-shrink-0 mt-[1px]" />
          <span className="flex-1 leading-snug">{answer.source}</span>
          <a
            href="#"
            className="flex-shrink-0 text-[#1558A6] font-semibold hover:underline inline-flex items-center gap-0.5 whitespace-nowrap"
          >
            Full article
            <ArrowRight size={10} strokeWidth={2.5} />
          </a>
        </div>
      </div>

      {/* Related products */}
      {answer.relatedProductIds.length > 0 && (
        <div className="border-t border-[#F0F0F0] bg-[#FAFBFA] px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#555] mb-3">
            {answer.relatedLabel}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {answer.relatedProductIds.map((id) => (
              <CompactProductCard key={id} productId={id} />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-[#F0F0F0] px-5 py-3 flex items-center justify-between bg-white">
        <p className="text-[11.5px] text-[#999]">
          Was this helpful?
          <button className="ml-2 text-[#1558A6] font-semibold hover:underline">Yes</button>
          <span className="mx-1.5 text-[#E0E0E0]">&middot;</span>
          <button className="text-[#1558A6] font-semibold hover:underline">No</button>
        </p>
        <Link
          href="/?q=magnesium+glycinate"
          className="inline-flex items-center gap-1 text-[11.5px] text-[#0A6B3C] font-semibold hover:underline"
        >
          Browse all results
          <ArrowRight size={11} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}
