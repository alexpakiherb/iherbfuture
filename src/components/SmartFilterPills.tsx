'use client';

interface SmartPill {
  id: string;
  label: string;
  filterId: string;
  value: string;
}

interface SmartPillGroup {
  label: string;
  pills: SmartPill[];
}

// ── Static groups ────────────────────────────────────────────────────────────

const FORM_GROUP: SmartPillGroup = {
  label: 'Form',
  pills: [
    { id: 'form-capsules', label: 'Capsules', filterId: 'form', value: 'capsules' },
    { id: 'form-softgels', label: 'Softgels', filterId: 'form', value: 'softgels' },
    { id: 'form-powder',   label: 'Powder',   filterId: 'form', value: 'powder'   },
    { id: 'form-gummies',  label: 'Gummies',  filterId: 'form', value: 'gummies'  },
    { id: 'form-liquid',   label: 'Liquid',   filterId: 'form', value: 'liquid'   },
  ],
};

const QUALITY_GROUP: SmartPillGroup = {
  label: 'Shop',
  pills: [
    { id: 'badge-iherb',   label: 'iHerb Brands',     filterId: 'badges', value: 'iherb-brands' },
    { id: 'badge-3rd',     label: '3rd Party Tested',  filterId: 'badges', value: '3rd-party'   },
    { id: 'rating-4',      label: '4★ & Up',           filterId: 'rating', value: '4-star'       },
    { id: 'diet-vegan',    label: 'Vegan',             filterId: 'dietary', value: 'vegan'       },
  ],
};

// ── Dynamic groups: change by query keyword ───────────────────────────────────

function getBenefitGroup(query: string): SmartPillGroup {
  const q = query.toLowerCase();

  if (q.includes('magnesium') || q.includes('mag ')) {
    return {
      label: 'By Goal',
      pills: [
        { id: 'goal-sleep',  label: 'For Sleep',   filterId: 'health-goals', value: 'sleep-quality'       },
        { id: 'goal-muscle', label: 'For Muscle',  filterId: 'health-goals', value: 'muscle-building'     },
        { id: 'goal-heart',  label: 'Heart Health',filterId: 'health-goals', value: 'heart-health'        },
        { id: 'goal-energy', label: 'Energy',      filterId: 'health-goals', value: 'energy-support'      },
      ],
    };
  }

  if (q.includes('omega') || q.includes('fish oil') || q.includes('krill')) {
    return {
      label: 'By Goal',
      pills: [
        { id: 'goal-heart',  label: 'Heart Health',   filterId: 'health-goals', value: 'heart-health'   },
        { id: 'goal-brain',  label: 'Brain Support',  filterId: 'health-goals', value: 'brain-support'  },
        { id: 'goal-joint',  label: 'Joint Health',   filterId: 'health-goals', value: 'joint-health'   },
      ],
    };
  }

  if (q.includes('protein') || q.includes('creatine') || q.includes('pre-workout') || q.includes('bcaa')) {
    return {
      label: 'By Goal',
      pills: [
        { id: 'goal-muscle', label: 'Muscle Building',      filterId: 'health-goals', value: 'muscle-building'       },
        { id: 'goal-perf',   label: 'Athletic Performance', filterId: 'health-goals', value: 'athletic-performance'  },
        { id: 'goal-energy', label: 'Energy Support',       filterId: 'health-goals', value: 'energy-support'        },
      ],
    };
  }

  if (q.includes('vitamin') || q.includes('immune') || q.includes('zinc') || q.includes('elderberry')) {
    return {
      label: 'By Goal',
      pills: [
        { id: 'goal-immune', label: 'Immune Support', filterId: 'health-goals', value: 'immune-support' },
        { id: 'goal-energy', label: 'Energy Support', filterId: 'health-goals', value: 'energy-support' },
        { id: 'goal-brain',  label: 'Brain Support',  filterId: 'health-goals', value: 'brain-support'  },
      ],
    };
  }

  if (
    q.includes('sleep') ||
    q.includes('melatonin') ||
    q.includes('ashwagandha') ||
    q.includes('magnesium glycinate')
  ) {
    return {
      label: 'By Goal',
      pills: [
        { id: 'goal-sleep',  label: 'Sleep Quality', filterId: 'health-goals', value: 'sleep-quality'  },
        { id: 'goal-brain',  label: 'Brain Support',  filterId: 'health-goals', value: 'brain-support'  },
        { id: 'goal-energy', label: 'Energy Support', filterId: 'health-goals', value: 'energy-support' },
      ],
    };
  }

  if (q.includes('collagen') || q.includes('biotin') || q.includes('skin') || q.includes('hair')) {
    return {
      label: 'By Goal',
      pills: [
        { id: 'goal-skin',   label: 'Skin & Beauty',  filterId: 'health-goals', value: 'skin-beauty'    },
        { id: 'goal-joint',  label: 'Joint Health',   filterId: 'health-goals', value: 'joint-health'   },
        { id: 'goal-immune', label: 'Immune Support', filterId: 'health-goals', value: 'immune-support'  },
      ],
    };
  }

  if (q.includes('probiotic') || q.includes('gut') || q.includes('digestive')) {
    return {
      label: 'By Goal',
      pills: [
        { id: 'goal-gut',    label: 'Digestive Health', filterId: 'health-goals', value: 'digestive-health' },
        { id: 'goal-immune', label: 'Immune Support',   filterId: 'health-goals', value: 'immune-support'   },
        { id: 'goal-energy', label: 'Energy Support',   filterId: 'health-goals', value: 'energy-support'   },
      ],
    };
  }

  // Default — broad selection
  return {
    label: 'By Goal',
    pills: [
      { id: 'goal-immune', label: 'Immune Support', filterId: 'health-goals', value: 'immune-support'   },
      { id: 'goal-energy', label: 'Energy Support', filterId: 'health-goals', value: 'energy-support'   },
      { id: 'goal-heart',  label: 'Heart Health',   filterId: 'health-goals', value: 'heart-health'     },
      { id: 'goal-sleep',  label: 'For Sleep',      filterId: 'health-goals', value: 'sleep-quality'    },
      { id: 'goal-muscle', label: 'Muscle Support', filterId: 'health-goals', value: 'muscle-building'  },
    ],
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface SmartFilterPillsProps {
  query: string;
  activeFilters: Record<string, string[]>;
  onFilterChange: (filterId: string, value: string, checked: boolean) => void;
}

export function SmartFilterPills({
  query,
  activeFilters,
  onFilterChange,
}: SmartFilterPillsProps) {
  const benefitGroup = getBenefitGroup(query);

  const groups: SmartPillGroup[] = [FORM_GROUP, benefitGroup, QUALITY_GROUP];

  const isActive = (pill: SmartPill) =>
    (activeFilters[pill.filterId] ?? []).includes(pill.value);

  const totalActive = groups
    .flatMap((g) => g.pills)
    .filter(isActive).length;

  return (
    <div className="border-b border-[#E0E0E0] bg-[#FAFAFA]">
      <div className="px-8 py-2.5 overflow-x-auto">
        <div className="flex items-center gap-5 min-w-max">
          {/* Label */}
          <span className="text-xs font-semibold text-[#0A6B3C] flex-shrink-0 flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="inline">
              <path
                d="M6.5 1L7.9 4.5H11.5L8.6 6.6L9.7 10.1L6.5 8L3.3 10.1L4.4 6.6L1.5 4.5H5.1L6.5 1Z"
                fill="#0A6B3C"
              />
            </svg>
            Quick filters
          </span>

          <div className="h-4 w-px bg-[#E0E0E0]" />

          {groups.map((group, gi) => (
            <div key={group.label} className="flex items-center gap-2">
              {/* Group label */}
              <span className="text-[11px] font-semibold text-[#888888] whitespace-nowrap uppercase tracking-wide">
                {group.label}
              </span>

              {/* Pills */}
              <div className="flex items-center gap-1.5">
                {group.pills.map((pill) => {
                  const active = isActive(pill);
                  return (
                    <button
                      key={pill.id}
                      onClick={() => onFilterChange(pill.filterId, pill.value, !active)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap border ${
                        active
                          ? 'bg-[#0A6B3C] text-white border-[#0A6B3C] shadow-sm'
                          : 'bg-white text-[#444444] border-[#D0D0D0] hover:border-[#0A6B3C] hover:text-[#0A6B3C] hover:bg-[#F0FAF3]'
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>

              {/* Group divider */}
              {gi < groups.length - 1 && (
                <div className="h-4 w-px bg-[#E0E0E0] ml-1.5" />
              )}
            </div>
          ))}

          {/* Clear smart filters */}
          {totalActive > 0 && (
            <>
              <div className="h-4 w-px bg-[#E0E0E0]" />
              <button
                onClick={() => {
                  groups.flatMap((g) => g.pills).filter(isActive).forEach((p) => {
                    onFilterChange(p.filterId, p.value, false);
                  });
                }}
                className="text-xs text-[#1558A6] hover:underline whitespace-nowrap"
              >
                Clear ({totalActive})
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
