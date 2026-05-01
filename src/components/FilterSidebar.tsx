'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { filterSections, FilterSection } from '@/data/filters';

export interface FilterSidebarProps {
  activeFilters: Record<string, string[]>;
  onFilterChange: (filterId: string, value: string, checked: boolean) => void;
  onPriceRangeChange: (min: number, max: number) => void;
  onClearAll: () => void;
}

export function FilterSidebar({
  activeFilters,
  onFilterChange,
  onPriceRangeChange,
  onClearAll,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    filterSections.reduce((acc, section) => {
      acc[section.id] = section.defaultExpanded;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const [showMore, setShowMore] = useState<Record<string, boolean>>({});
  const [priceRange, setPriceRange] = useState({ min: 3, max: 60 });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleShowMore = (id: string) => {
    setShowMore((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value, 10) || 0;
    const newRange = {
      ...priceRange,
      [type]: numValue,
    };
    setPriceRange(newRange);
  };

  const applyPriceRange = () => {
    onPriceRangeChange(priceRange.min, priceRange.max);
  };

  const getTotalActiveFilters = () => {
    return Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0);
  };

  const renderCheckboxFilter = (section: FilterSection) => {
    const options = section.options || [];
    const selected = activeFilters[section.id] || [];
    const isExpanded = expandedSections[section.id];
    const showMoreActive = showMore[section.id];
    const displayCount = showMoreActive ? options.length : 5;
    const displayOptions = options.slice(0, displayCount);
    const hasMore = options.length > 5;

    return (
      <div key={section.id} className="border-b border-[#E0E0E0]">
        <button
          onClick={() => toggleSection(section.id)}
          className="w-full py-3 flex items-center justify-between hover:text-[#0A6B3C] transition-colors"
        >
          <h3 className="font-bold text-sm text-[#333333]">{section.label}</h3>
          {isExpanded ? (
            <ChevronUp size={16} className="text-[#666666]" />
          ) : (
            <ChevronDown size={16} className="text-[#666666]" />
          )}
        </button>

        {isExpanded && (
          <div className="pb-3 space-y-2.5">
            {displayOptions.map((option) => {
              const isChecked = selected.includes(option.value);
              return (
                <label key={option.value} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => onFilterChange(section.id, option.value, e.target.checked)}
                    className={`w-4 h-4 rounded border transition-all ${
                      isChecked
                        ? 'bg-[#0A6B3C] border-[#0A6B3C] accent-[#0A6B3C]'
                        : 'border-[#CCCCCC] hover:border-[#0A6B3C]'
                    }`}
                  />
                  <span className="text-sm text-[#333333] flex-1 group-hover:text-[#0A6B3C] transition-colors">
                    {option.label}
                  </span>
                  <span className="text-xs text-[#666666]">({option.count})</span>
                </label>
              );
            })}

            {hasMore && (
              <button
                onClick={() => toggleShowMore(section.id)}
                className="text-xs font-medium text-[#1558A6] hover:underline pt-1"
              >
                {showMoreActive ? 'Show Less ▲' : 'Show More ▼'}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderPriceFilter = (section: FilterSection) => {
    const isExpanded = expandedSections[section.id];

    return (
      <div key={section.id} className="border-b border-[#E0E0E0]">
        <button
          onClick={() => toggleSection(section.id)}
          className="w-full py-3 flex items-center justify-between hover:text-[#0A6B3C] transition-colors"
        >
          <h3 className="font-bold text-sm text-[#333333]">{section.label}</h3>
          {isExpanded ? (
            <ChevronUp size={16} className="text-[#666666]" />
          ) : (
            <ChevronDown size={16} className="text-[#666666]" />
          )}
        </button>

        {isExpanded && (
          <div className="pb-4 space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs text-[#666666] mb-1">Min</label>
                <div className="flex items-center border border-[#CCCCCC] rounded">
                  <span className="px-2 text-[#666666]">$</span>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full px-2 py-2 text-sm border-0 outline-none"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-[#666666] mb-1">Max</label>
                <div className="flex items-center border border-[#CCCCCC] rounded">
                  <span className="px-2 text-[#666666]">$</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full px-2 py-2 text-sm border-0 outline-none"
                    min="0"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={applyPriceRange}
              className="w-full px-3 py-2 bg-[#0A6B3C] text-white text-xs font-medium rounded-full hover:bg-[#084d2a] transition-colors"
            >
              Apply
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderRatingFilter = (section: FilterSection) => {
    const options = section.options || [];
    const selected = activeFilters[section.id] || [];
    const isExpanded = expandedSections[section.id];

    return (
      <div key={section.id} className="border-b border-[#E0E0E0]">
        <button
          onClick={() => toggleSection(section.id)}
          className="w-full py-3 flex items-center justify-between hover:text-[#0A6B3C] transition-colors"
        >
          <h3 className="font-bold text-sm text-[#333333]">{section.label}</h3>
          {isExpanded ? (
            <ChevronUp size={16} className="text-[#666666]" />
          ) : (
            <ChevronDown size={16} className="text-[#666666]" />
          )}
        </button>

        {isExpanded && (
          <div className="pb-3 space-y-2.5">
            {options.map((option) => {
              const isChecked = selected.includes(option.value);
              const starCount = parseInt(option.label.split(' ')[0]);

              return (
                <label key={option.value} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => onFilterChange(section.id, option.value, e.target.checked)}
                    className={`w-4 h-4 rounded border transition-all ${
                      isChecked
                        ? 'bg-[#0A6B3C] border-[#0A6B3C] accent-[#0A6B3C]'
                        : 'border-[#CCCCCC] hover:border-[#0A6B3C]'
                    }`}
                  />
                  <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-sm text-[#F5A623]">
                      {'★'.repeat(starCount)}
                    </span>
                    <span className="text-xs text-[#666666]">& up</span>
                  </div>
                  <span className="text-xs text-[#666666]">({option.count})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const activeFilterCount = getTotalActiveFilters();

  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-[#EBEBEB] sticky top-0 self-start max-h-screen overflow-y-auto">

      {/* Sidebar header */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between">
        <span className="text-[13px] font-bold text-[#1A1A1A] tracking-tight">Filters</span>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-[11px] font-medium text-[#1558A6] hover:text-[#0A6B3C] transition-colors"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="px-4 pb-8">
        {filterSections.map((section) => {
          if (section.type === 'checkbox' && section.id === 'rating') {
            return renderRatingFilter(section);
          }
          if (section.type === 'range') {
            return renderPriceFilter(section);
          }
          if (section.type === 'checkbox') {
            return renderCheckboxFilter(section);
          }
          return null;
        })}
      </div>
    </aside>
  );
}
