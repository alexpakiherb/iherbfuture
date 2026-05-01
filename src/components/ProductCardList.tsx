'use client';

import { Product } from '@/data/products';
import { Star, ShoppingCart } from 'lucide-react';

const CATEGORY_COLORS: Record<Product['category'], string> = {
  Supplements: '#79A83C',
  Sports: '#1E65D6',
  Bath: '#148777',
  Beauty: '#6E46C8',
  Grocery: '#B38900',
  Home: '#454B49',
  Baby: '#3D93BF',
  Pets: '#083833',
};

const CATEGORY_EMOJI: Record<Product['category'], string> = {
  Supplements: '💊',
  Sports: '💪',
  Bath: '🛁',
  Beauty: '💄',
  Grocery: '🍎',
  Home: '🏠',
  Baby: '👶',
  Pets: '🐾',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function getAutoshipDiscount(price: number, autoshipPrice?: number): number | null {
  if (!autoshipPrice) return null;
  return Math.round(((price - autoshipPrice) / price) * 100);
}

function formatSoldCount(count: string): string {
  if (count.includes('K+')) {
    return count;
  }
  const num = parseInt(count);
  if (num >= 1000000) return `${Math.floor(num / 100000) / 10}M+`;
  if (num >= 1000) return `${Math.floor(num / 1000)}K+`;
  return count;
}

export interface ProductCardListProps {
  product: Product;
}

export function ProductCardList({ product }: ProductCardListProps) {
  const categoryColor = CATEGORY_COLORS[product.category];
  const categoryEmoji = CATEGORY_EMOJI[product.category];
  const initials = getInitials(product.name);
  const autoshipDiscount = getAutoshipDiscount(product.price, product.autoshipPrice);
  const soldCountDisplay = formatSoldCount(product.soldCount);

  return (
    <div className="flex rounded-lg border border-[#E0E0E0] bg-white transition-shadow duration-200 hover:shadow-lg">
      {/* Left: Image Area (35%) */}
      <div className="relative w-[35%] min-w-0 flex-shrink-0 bg-[#F7F8F7] p-4">
        {/* Badge Overlay */}
        <div className="absolute left-4 top-4 z-10">
          {product.isHouseBrand && (
            <div className="inline-flex items-center gap-1 rounded-full border-2 border-[#0A6B3C] px-2 py-1">
              <span className="text-xs font-semibold text-[#0A6B3C]">iHerb Brands</span>
            </div>
          )}
        </div>

        {/* Image */}
        <div className="flex h-full items-center justify-center">
          {product.image ? (
            <img src={product.image} alt={product.name} className="max-h-32 w-auto object-contain" />
          ) : (
            <div
              className="flex h-32 w-28 items-center justify-center rounded-lg"
              style={{ backgroundColor: categoryColor }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">{categoryEmoji}</span>
                <span className="text-center text-xs font-bold text-white">{initials}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Content Area (65%) */}
      <div className="flex w-[65%] flex-col justify-between p-4">
        {/* Top Section */}
        <div className="flex flex-col gap-2">
          {/* Brand */}
          <p className="text-xs text-[#666666]">{product.brand}</p>

          {/* Title */}
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-[#333333]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star
              className="h-3.5 w-3.5"
              fill="#F5A623"
              color="#F5A623"
            />
            <span className="text-xs font-semibold text-[#333333]">{product.rating}</span>
            <span className="text-xs text-[#666666]">({product.reviewCount.toLocaleString()})</span>
          </div>

          {/* Social Proof */}
          <p className="text-xs text-[#666666]">
            {soldCountDisplay} sold in 30 days
          </p>

          {/* Price Section */}
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-[#333333]">${product.price.toFixed(2)}</span>
            {product.perServing && (
              <span className="text-xs text-[#999999]">({product.perServing}/serving)</span>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-2">
          {/* Autoship Info */}
          {product.autoshipPrice && (
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0A6B3C]">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
              <div className="flex flex-col gap-0">
                <span className="text-xs font-medium text-[#333333]">
                  Autoship: ${product.autoshipPrice.toFixed(2)}
                </span>
                {autoshipDiscount && (
                  <span className="text-xs font-medium text-[#0A6B3C]">
                    ({autoshipDiscount}% Off)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Add Button */}
          <button className="inline-flex items-center gap-1.5 rounded-full bg-[#0A6B3C] px-4 py-2 transition-colors hover:bg-[#084a2c]">
            <ShoppingCart className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
