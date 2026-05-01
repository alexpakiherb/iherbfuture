'use client';

import { useState, useMemo, useCallback, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Grid3x3, List, SlidersHorizontal } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ProductCardGrid } from '@/components/ProductCardGrid';
import { ProductCardList } from '@/components/ProductCardList';
import { AIContextualHeader } from '@/components/AIContextualHeader';
import { AIAnswerCard } from '@/components/AIAnswerCard';
import { SmartFilterPills } from '@/components/SmartFilterPills';
import { products, Product } from '@/data/products';
import { sortOptions } from '@/data/navigation';

const PRODUCTS_PER_PAGE = 12;

const EMPTY_FILTERS: Record<string, string[]> = {
  category: [],
  brand: [],
  price: [],
  rating: [],
  dietary: [],
  form: [],
  'health-goals': [],
  badges: [],
};

function SERPPageInner() {
  const params = useSearchParams();
  const queryParam = params.get('q') ?? 'magnesium';
  const [searchQuery, setSearchQuery]   = useState(queryParam);

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(EMPTY_FILTERS);
  const [priceRange, setPriceRange]     = useState<{ min: number; max: number }>({ min: 3, max: 60 });
  const [sortBy, setSortBy]             = useState('relevance');
  const [viewMode, setViewMode]         = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage]   = useState(1);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback(
    (filterId: string, value: string, checked: boolean) => {
      setActiveFilters((prev) => {
        const current = prev[filterId] ?? [];
        return {
          ...prev,
          [filterId]: checked
            ? [...current, value]
            : current.filter((v) => v !== value),
        };
      });
      setCurrentPage(1);
    },
    []
  );

  const handlePriceRangeChange = useCallback((min: number, max: number) => {
    setPriceRange({ min, max });
    setCurrentPage(1);
  }, []);

  const handleClearAll = useCallback(() => {
    setActiveFilters(EMPTY_FILTERS);
    setPriceRange({ min: 3, max: 60 });
    setCurrentPage(1);
  }, []);

  const removeFilterPill = useCallback((filterId: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: (prev[filterId] ?? []).filter((v) => v !== value),
    }));
    setCurrentPage(1);
  }, []);

  // ── Filter + Sort ─────────────────────────────────────────────────────────

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filtering
    const q = searchQuery.trim().toLowerCase();
    if (q && q !== 'all products') {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.healthGoals.some((hg) => hg.toLowerCase().includes(q)) ||
          p.dietaryTags.some((dt) => dt.toLowerCase().includes(q)) ||
          p.form.toLowerCase().includes(q)
      );
    }

    // Category
    if (activeFilters.category.length > 0) {
      const categoryMap: Record<string, Product['category']> = {
        supplements: 'Supplements', sports: 'Sports', bath: 'Bath',
        beauty: 'Beauty', grocery: 'Grocery', home: 'Home', baby: 'Baby', pets: 'Pets',
      };
      result = result.filter((p) =>
        activeFilters.category.includes(
          Object.keys(categoryMap).find((k) => categoryMap[k] === p.category) ?? ''
        )
      );
    }

    // Brand
    if (activeFilters.brand.length > 0) {
      const brandMap: Record<string, string> = {
        'california-gold': 'California Gold Nutrition', 'now-foods': 'NOW Foods',
        'sports-research': 'Sports Research', 'life-extension': 'Life Extension',
        solgar: 'Solgar', 'natures-way': "Nature's Way", 'garden-of-life': 'Garden of Life',
        'doctors-best': "Doctor's Best", 'nordic-naturals': 'Nordic Naturals',
        'jarrow-formulas': 'Jarrow Formulas', nuun: 'Nuun',
      };
      result = result.filter((p) =>
        activeFilters.brand.some((b) => brandMap[b] === p.brand)
      );
    }

    // Price range
    result = result.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);

    // Rating — values: 5-star, 4-5-star, 4-star, 3-5-star
    if (activeFilters.rating.length > 0) {
      const ratingValueMap: Record<string, number> = {
        '5-star': 5.0, '4-5-star': 4.5, '4-star': 4.0, '3-5-star': 3.5,
      };
      const minRating = Math.min(
        ...activeFilters.rating.map((r) => ratingValueMap[r] ?? 0)
      );
      result = result.filter((p) => p.rating >= minRating);
    }

    // Dietary tags
    if (activeFilters.dietary.length > 0) {
      const dietaryMap: Record<string, string> = {
        vegan: 'Vegan', 'gluten-free': 'No Gluten', 'non-gmo': 'Non-GMO',
        organic: 'Organic', keto: 'Keto Friendly', paleo: 'Paleo', 'sugar-free': 'Sugar Free',
      };
      result = result.filter((p) =>
        activeFilters.dietary.some((d) => p.dietaryTags.includes(dietaryMap[d]))
      );
    }

    // Form
    if (activeFilters.form.length > 0) {
      const formMap: Record<string, string> = {
        capsules: 'Capsules', tablets: 'Tablets', softgels: 'Softgels',
        powder: 'Powder', gummies: 'Gummies', liquid: 'Liquid', chewables: 'Chewables',
      };
      result = result.filter((p) =>
        activeFilters.form.some((f) => formMap[f] === p.form)
      );
    }

    // Health goals
    if (activeFilters['health-goals'].length > 0) {
      const healthGoalMap: Record<string, string> = {
        'immune-support': 'Immune Support', 'energy-support': 'Energy Support',
        'heart-health': 'Heart Health', 'joint-health': 'Joint Health',
        'sleep-quality': 'Sleep Quality', 'brain-support': 'Brain Support',
        'muscle-building': 'Muscle Building', 'skin-beauty': 'Skin Beauty',
        'digestive-health': 'Digestive Health', 'athletic-performance': 'Athletic Performance',
      };
      result = result.filter((p) =>
        activeFilters['health-goals'].some((hg) => p.healthGoals.includes(healthGoalMap[hg]))
      );
    }

    // Badges
    if (activeFilters.badges.length > 0) {
      const badgeMap: Record<string, string> = {
        'iherb-brands': 'iHerb Brands', 'quality-promise': 'Quality Promise',
        '3rd-party': '3rd Party Tested', 'non-gmo-verified': 'Non-GMO Verified',
        'informed-choice': 'Informed Choice', 'organic-verified': 'Organic Verified',
      };
      result = result.filter((p) =>
        activeFilters.badges.some((b) => p.badges.includes(badgeMap[b]))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':   result.sort((a, b) => a.price - b.price); break;
      case 'price-desc':  result.sort((a, b) => b.price - a.price); break;
      case 'rating':      result.sort((a, b) => b.rating - a.rating); break;
      case 'popularity':
        result.sort((a, b) => {
          const parse = (s: string) => parseInt(s.replace(/[KM+]/g, '')) *
            (s.includes('M') ? 1000 : s.includes('K') ? 1 : 1);
          return parse(b.soldCount) - parse(a.soldCount);
        });
        break;
    }

    return result;
  }, [activeFilters, priceRange, sortBy, searchQuery]);

  // ── Pagination ────────────────────────────────────────────────────────────

  const totalPages      = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIdx        = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIdx, startIdx + PRODUCTS_PER_PAGE);

  // ── Active filter pills (for the removable tags above results) ────────────

  const activeFilterPills = useMemo(() => {
    const MAPS: Record<string, Record<string, string>> = {
      category:       { supplements: 'Supplements', sports: 'Sports', bath: 'Bath & Body', beauty: 'Beauty', grocery: 'Grocery', home: 'Home', baby: 'Baby', pets: 'Pets' },
      brand:          { 'california-gold': 'California Gold', 'now-foods': 'NOW Foods', 'sports-research': 'Sports Research', 'life-extension': 'Life Extension', solgar: 'Solgar', 'natures-way': "Nature's Way", 'garden-of-life': 'Garden of Life', 'doctors-best': "Doctor's Best", 'nordic-naturals': 'Nordic Naturals', 'jarrow-formulas': 'Jarrow Formulas', nuun: 'Nuun' },
      dietary:        { vegan: 'Vegan', 'gluten-free': 'Gluten Free', 'non-gmo': 'Non-GMO', organic: 'Organic', keto: 'Keto', paleo: 'Paleo', 'sugar-free': 'Sugar Free' },
      form:           { capsules: 'Capsules', tablets: 'Tablets', softgels: 'Softgels', powder: 'Powder', gummies: 'Gummies', liquid: 'Liquid', chewables: 'Chewables' },
      'health-goals': { 'immune-support': 'Immune Support', 'energy-support': 'Energy Support', 'heart-health': 'Heart Health', 'joint-health': 'Joint Health', 'sleep-quality': 'Sleep Quality', 'brain-support': 'Brain Support', 'muscle-building': 'Muscle Building', 'skin-beauty': 'Skin Beauty', 'digestive-health': 'Digestive Health', 'athletic-performance': 'Athletic Performance' },
      badges:         { 'iherb-brands': 'iHerb Brands', 'quality-promise': 'Quality Promise', '3rd-party': '3rd Party Tested', 'non-gmo-verified': 'Non-GMO Verified', 'informed-choice': 'Informed Choice', 'organic-verified': 'Organic Verified' },
      rating:         { '5-star': '5★', '4-5-star': '4.5★ & Up', '4-star': '4★ & Up', '3-5-star': '3.5★ & Up' },
    };

    const pills: { id: string; label: string; filterId: string; value: string }[] = [];
    Object.entries(activeFilters).forEach(([filterId, values]) => {
      const map = MAPS[filterId];
      if (!map) return;
      values.forEach((v) => {
        if (map[v]) pills.push({ id: `${filterId}-${v}`, label: map[v], filterId, value: v });
      });
    });
    return pills;
  }, [activeFilters]);

  const totalActiveFilters = activeFilterPills.length;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header onSearch={handleSearch} initialQuery={searchQuery} />

      <div className="flex flex-col flex-1">

        {/* Breadcrumb */}
        <div className="px-8 py-2 flex items-center gap-1.5 text-[11px] text-[#AAAAAA] border-b border-[#F0F0F0]">
          <a href="/" className="hover:text-[#1558A6] transition-colors">Home</a>
          <span className="text-[#DDDDDD]">/</span>
          <a href="/search" className="hover:text-[#1558A6] transition-colors">Search Results</a>
          <span className="text-[#DDDDDD]">/</span>
          <span className="text-[#555555] font-medium">{searchQuery}</span>
        </div>

        {/* AI Contextual Header — only triggers on ingredient/health queries */}
        <AIContextualHeader query={searchQuery} onSearch={handleSearch} />

        {/* Smart Filter Pills */}
        <SmartFilterPills
          query={searchQuery}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />

        {/* Results bar */}
        <div className="px-8 py-2.5 border-b border-[#F0F0F0] flex items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] text-[#555555]">
              <span className="font-semibold text-[#1A1A1A]">{filteredProducts.length.toLocaleString()}</span> results
              {searchQuery && searchQuery !== 'All Products' && (
                <> for <span className="font-semibold text-[#1A1A1A]">&ldquo;{searchQuery}&rdquo;</span></>
              )}
            </span>

            {totalActiveFilters > 0 && (
              <span className="rounded-full bg-[#0A6B3C] px-2.5 py-0.5 text-[10px] font-bold text-white">
                {totalActiveFilters} active
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal size={13} className="text-[#AAAAAA]" />
              <label className="text-[12px] text-[#888888]">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="px-2 py-1 border border-[#E8E8E8] rounded-lg text-[12px] text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#0A6B3C] focus:border-[#0A6B3C] bg-white cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o.id} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-0.5 border-l border-[#EBEBEB] pl-3">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-[#0A6B3C] text-white' : 'text-[#BBBBBB] hover:text-[#0A6B3C]'
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-[#0A6B3C] text-white' : 'text-[#BBBBBB] hover:text-[#0A6B3C]'
                }`}
                aria-label="List view"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Active filter pills row */}
        {activeFilterPills.length > 0 && (
          <div className="px-8 py-2 border-b border-[#F0F0F0] flex flex-wrap items-center gap-1.5 bg-white">
            {activeFilterPills.map((pill) => (
              <div
                key={pill.id}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F0FAF3] border border-[#B8DFC4] rounded-full text-[11px] font-medium text-[#0A6B3C]"
              >
                {pill.label}
                <button
                  onClick={() => removeFilterPill(pill.filterId, pill.value)}
                  className="text-[#0A6B3C] hover:text-[#D14800] transition-colors leading-none ml-0.5"
                  aria-label={`Remove ${pill.label}`}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={handleClearAll}
              className="text-[11px] text-[#AAAAAA] hover:text-[#D14800] transition-colors ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main content: sidebar + products */}
        <div className="flex flex-1 items-start bg-[#F7F8F7]">
          <FilterSidebar
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onPriceRangeChange={handlePriceRangeChange}
            onClearAll={handleClearAll}
          />

          <main className="flex-1 px-5 py-5 min-w-0">
            {paginatedProducts.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-4 gap-3.5 mb-8">
                    <AIAnswerCard query={searchQuery} onSearch={handleSearch} />
                    {paginatedProducts.map((product) => (
                      <ProductCardGrid key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 mb-8">
                    {paginatedProducts.map((product) => (
                      <ProductCardList key={product.id} product={product} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-10">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-[#D0D0D0] text-[#555555] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 10) {
                          pageNum = i + 1;
                        } else if (currentPage <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 4) {
                          pageNum = totalPages - 9 + i;
                        } else {
                          pageNum = currentPage - 4 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-[#0A6B3C] text-white'
                                : 'border border-[#D0D0D0] text-[#555555] hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {totalPages > 10 && currentPage < totalPages - 4 && (
                        <>
                          <span className="text-[#AAAAAA] px-1">…</span>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className="w-8 h-8 rounded-full text-sm font-medium border border-[#D0D0D0] text-[#555555] hover:bg-gray-50 transition-colors"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-[#D0D0D0] text-[#555555] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      aria-label="Next page"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-base font-semibold text-[#333333] mb-1">No products found</p>
                  <p className="text-sm text-[#888888]">Try adjusting your filters or search for something else</p>
                  <button
                    onClick={handleClearAll}
                    className="mt-4 px-5 py-2 rounded-full border border-[#0A6B3C] text-sm font-medium text-[#0A6B3C] hover:bg-[#F1FAF3] transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SERPPage() {
  return (
    <Suspense fallback={<div />}>
      <SERPPageInner />
    </Suspense>
  );
}
