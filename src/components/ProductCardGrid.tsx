'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/data/products';
import { Heart, ShoppingCart } from 'lucide-react';

function getDiscountPercent(price: number, originalPrice?: number): number | null {
  if (!originalPrice) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half   = !filled && rating >= star - 0.5;
        return (
          <svg key={star} width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1L7.3 4.3H10.8L8.05 6.3L9.15 9.6L6 7.6L2.85 9.6L3.95 6.3L1.2 4.3H4.7L6 1Z"
              fill={filled || half ? '#F5A623' : '#E5E5E5'}
            />
          </svg>
        );
      })}
    </div>
  );
}

export interface ProductCardProps {
  product: Product;
}

export function ProductCardGrid({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const discountPercent = getDiscountPercent(product.price, product.originalPrice);

  const stopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex flex-col bg-white rounded-2xl border border-[#EBEBEB] hover:border-[#C8E6C9] hover:shadow-[0_4px_20px_rgba(10,107,60,0.10)] transition-all duration-200 overflow-hidden"
    >

      {/* ── Image area ─────────────────────────────────────────── */}
      <div className="relative bg-white" style={{ paddingBottom: '100%' }}>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {!imgError && product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            /* Clean placeholder when image fails */
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#F5F8F5] rounded-xl">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: '#E8F4EE' }}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="6" y="4" width="16" height="20" rx="3" fill="#0A6B3C" opacity="0.15"/>
                  <rect x="9" y="7" width="10" height="2" rx="1" fill="#0A6B3C" opacity="0.4"/>
                  <rect x="9" y="11" width="10" height="2" rx="1" fill="#0A6B3C" opacity="0.4"/>
                  <rect x="9" y="15" width="7" height="2" rx="1" fill="#0A6B3C" opacity="0.4"/>
                  <circle cx="20" cy="20" r="5" fill="#0A6B3C" opacity="0.2"/>
                </svg>
              </div>
              <span className="text-[10px] font-medium text-[#AAA] text-center px-2 leading-snug">
                {product.brand}
              </span>
            </div>
          )}
        </div>

        {/* Discount badge */}
        {discountPercent && (
          <div className="absolute top-2.5 right-2.5 bg-[#D14800] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
            −{discountPercent}%
          </div>
        )}

        {/* iHerb Brands badge */}
        {product.isHouseBrand && (
          <div className="absolute top-2.5 left-2.5 bg-white border border-[#0A6B3C] text-[#0A6B3C] text-[9px] font-semibold px-1.5 py-0.5 rounded-full z-10 shadow-sm">
            iHerb Brands
          </div>
        )}

        {/* Wishlist heart — appears on hover */}
        <button
          onClick={stopClick}
          className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150 hover:scale-110 z-10"
          aria-label="Save to wishlist"
        >
          <Heart className="w-3.5 h-3.5 text-[#AAAAAA]" strokeWidth={1.5} />
        </button>
      </div>

      {/* More options — shown inline under image */}
      {product.hasMoreOptions && (
        <div className="px-3 py-1 border-t border-[#F0F0F0] bg-[#FAFAFA] text-center">
          <button
            onClick={stopClick}
            className="text-[11px] font-medium text-[#1558A6] hover:text-[#0A6B3C] transition-colors"
          >
            + More options
          </button>
        </div>
      )}

      {/* ── Content area ───────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">

        {/* Brand */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A6B3C] truncate">
          {product.brand}
        </p>

        {/* Product name */}
        <h3 className="text-[13px] font-normal leading-[1.4] text-[#1A1A1A] line-clamp-2 min-h-[2.8em]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          <span className="text-[11px] font-semibold text-[#444]">{product.rating}</span>
          <span className="text-[11px] text-[#AAAAAA]">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Social proof */}
        <p className="text-[11px] text-[#AAAAAA]">
          {product.soldCount} sold
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price row */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-[15px] font-bold text-[#1A1A1A]">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-[12px] line-through text-[#BBBBBB]">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
          {product.perServing && (
            <span className="text-[10px] text-[#AAAAAA] ml-auto whitespace-nowrap">
              {product.perServing}
            </span>
          )}
        </div>

        {/* Subscribe & Save */}
        {product.autoshipPrice && (
          <p className="text-[11px] text-[#0A6B3C] font-medium">
            Subscribe &amp; Save: <span className="font-bold">${product.autoshipPrice.toFixed(2)}</span>
          </p>
        )}

        {/* Add to Cart */}
        <button
          onClick={stopClick}
          className="mt-1.5 w-full bg-[#D14800] hover:bg-[#B03C00] active:bg-[#963200] text-white text-[12px] font-semibold rounded-full py-2 flex items-center justify-center gap-1.5 transition-colors duration-150 shadow-sm"
        >
          <ShoppingCart size={12} strokeWidth={2.5} />
          Add to Cart
        </button>

      </div>
    </Link>
  );
}
