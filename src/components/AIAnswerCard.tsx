'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface RecoChip {
  label: string;
  sublabel: string;
  filterQuery: string;
}

interface AIAnswerData {
  tagline: string;
  headline: string;
  chips: RecoChip[];
  expandedBody: string;
}

const ANSWER_DATA: Record<string, AIAnswerData> = {
  magnesium: {
    tagline: 'Tip from our Wellness Hub',
    headline: 'Not all magnesium is the same — the form matters.',
    chips: [
      { label: '😴 Best for sleep', sublabel: 'Glycinate', filterQuery: 'magnesium glycinate' },
      { label: '💪 Best for recovery', sublabel: 'Malate', filterQuery: 'magnesium malate' },
      { label: '🌿 Most affordable', sublabel: 'Citrate', filterQuery: 'magnesium citrate' },
    ],
    expandedBody:
      'Magnesium glycinate pairs magnesium with glycine for a calming effect — ideal for sleep and anxiety without GI discomfort. Malate (bound to malic acid) is preferred for daytime energy and exercise recovery. Citrate is well-absorbed, budget-friendly, and has a mild laxative effect useful for digestive regularity.',
  },
  vitamin: {
    tagline: 'Tip from our Wellness Hub',
    headline: 'Choose the right vitamin for your specific goal.',
    chips: [
      { label: '☀️ Bone & immunity', sublabel: 'Vitamin D3', filterQuery: 'vitamin d3' },
      { label: '⚡ Energy support', sublabel: 'B-Complex', filterQuery: 'vitamin b complex' },
      { label: '🛡️ Immune support', sublabel: 'Vitamin C', filterQuery: 'vitamin c' },
    ],
    expandedBody:
      'Vitamin D3 (ideally paired with K2) supports bone density and immune function — especially important for those with limited sun exposure. B-complex vitamins drive nerve health and energy metabolism. Vitamin C is a potent antioxidant and daily immune support staple that\'s safe at higher doses for most adults.',
  },
  omega: {
    tagline: 'Tip from our Wellness Hub',
    headline: 'Look for EPA + DHA content, not just total omega-3.',
    chips: [
      { label: '❤️ Heart health', sublabel: 'High EPA', filterQuery: 'omega 3 epa' },
      { label: '🧠 Brain & focus', sublabel: 'High DHA', filterQuery: 'omega 3 dha' },
      { label: '🌱 Plant-based', sublabel: 'Algae DHA', filterQuery: 'algae omega 3' },
    ],
    expandedBody:
      'When comparing omega-3 supplements, focus on the combined EPA + DHA per serving — not just the total fish oil amount. Higher EPA is associated with heart health and inflammation management; DHA is critical for brain development and cognition. For vegans, algae-derived DHA is the most direct and bioavailable plant-based option.',
  },
  'fish oil': {
    tagline: 'Tip from our Wellness Hub',
    headline: 'Triglyceride form absorbs significantly better than ethyl ester.',
    chips: [
      { label: '🐟 Budget-friendly', sublabel: 'Ethyl ester', filterQuery: 'fish oil' },
      { label: '✅ Better absorbed', sublabel: 'Triglyceride form', filterQuery: 'fish oil triglyceride' },
      { label: '🦐 With antioxidants', sublabel: 'Krill oil', filterQuery: 'krill oil' },
    ],
    expandedBody:
      'Most standard fish oil is in the ethyl ester (EE) form — cheaper but less efficiently absorbed. Triglyceride (TG) form costs more but has meaningfully higher bioavailability. Krill oil uses a phospholipid structure that\'s well-absorbed and naturally includes astaxanthin, a powerful antioxidant.',
  },
  collagen: {
    tagline: 'Tip from our Wellness Hub',
    headline: 'Hydrolyzed peptides are the most bioavailable form of collagen.',
    chips: [
      { label: '✨ Skin, hair & nails', sublabel: 'Types I & III', filterQuery: 'collagen peptides' },
      { label: '🦵 Joint support', sublabel: 'Type II', filterQuery: 'type ii collagen' },
      { label: '💪 Full spectrum', sublabel: 'Multi-type', filterQuery: 'collagen multi' },
    ],
    expandedBody:
      'Hydrolyzed collagen peptides (Types I & III) are pre-digested for fast absorption — best for skin elasticity, hair strength, and nail support. Type II collagen (often undenatured/UC-II) specifically targets joint cartilage. Look for products with 10–15g of collagen per serving for meaningful results.',
  },
  probiotics: {
    tagline: 'Tip from our Wellness Hub',
    headline: 'Strain specificity matters more than raw CFU count.',
    chips: [
      { label: '🦠 Gut & digestion', sublabel: 'Lactobacillus', filterQuery: 'probiotic lactobacillus' },
      { label: '🛡️ Immune support', sublabel: 'Bifidobacterium', filterQuery: 'probiotic bifidobacterium' },
      { label: '💊 After antibiotics', sublabel: 'Saccharomyces', filterQuery: 'probiotic saccharomyces' },
    ],
    expandedBody:
      'A high CFU count doesn\'t guarantee results — the right strains for your goal matter more. Lactobacillus strains are well-studied for digestive comfort and UTI prevention. Bifidobacterium supports immune function and colon health. Saccharomyces boulardii (a yeast probiotic) is especially effective during or after antibiotic use.',
  },
  protein: {
    tagline: 'Tip from our Wellness Hub',
    headline: 'The best protein depends on your diet and timing.',
    chips: [
      { label: '⚡ Post-workout', sublabel: 'Whey protein', filterQuery: 'whey protein' },
      { label: '🌙 Overnight recovery', sublabel: 'Casein protein', filterQuery: 'casein protein' },
      { label: '🌱 Dairy-free', sublabel: 'Plant protein', filterQuery: 'plant protein powder' },
    ],
    expandedBody:
      'Whey protein is fast-digesting and ideal post-workout to kickstart muscle protein synthesis. Casein is slow-release — consuming it before sleep can sustain amino acid delivery overnight. Plant-based options (pea, hemp, brown rice blend) are comparable in muscle-building results when doses are matched to whey.',
  },
  creatine: {
    tagline: 'Tip from our Wellness Hub',
    headline: 'Monohydrate is the most researched, cost-effective form.',
    chips: [
      { label: '💪 Classic & proven', sublabel: 'Monohydrate', filterQuery: 'creatine monohydrate' },
      { label: '🧪 Gentler dose', sublabel: 'Creatine HCl', filterQuery: 'creatine hcl' },
      { label: '🏋️ No loading', sublabel: 'Kre-Alkalyn', filterQuery: 'kre-alkalyn creatine' },
    ],
    expandedBody:
      'Creatine monohydrate is backed by decades of research — effective for strength, power, and muscle gains with excellent safety data. 5g/day without a loading phase is sufficient for most people. Creatine HCl requires a smaller dose and is gentler on the stomach. Kre-Alkalyn has a higher pH that may reduce creatinine conversion.',
  },
  turmeric: {
    tagline: 'Tip from our Wellness Hub',
    headline: 'Curcumin has poor absorption without black pepper (piperine).',
    chips: [
      { label: '🌶️ Standard boost', sublabel: 'With piperine', filterQuery: 'turmeric piperine' },
      { label: '💧 Best absorbed', sublabel: 'Liposomal form', filterQuery: 'liposomal curcumin' },
      { label: '📦 Standardized', sublabel: '95% curcuminoids', filterQuery: 'curcumin extract' },
    ],
    expandedBody:
      'Raw turmeric has very poor bioavailability — curcumin (its active compound) is poorly absorbed on its own. Adding piperine (black pepper extract) increases absorption by up to 20×. Liposomal or phospholipid-complexed formulas (like Meriva® or BCM-95®) offer even higher bioavailability without piperine sensitivity.',
  },
  zinc: {
    tagline: 'Tip from our Wellness Hub',
    headline: 'Chelated forms (glycinate, picolinate) absorb far better than oxide.',
    chips: [
      { label: '🎯 Best absorbed', sublabel: 'Zinc glycinate', filterQuery: 'zinc glycinate' },
      { label: '💊 Budget pick', sublabel: 'Zinc citrate', filterQuery: 'zinc citrate' },
      { label: '🌿 Well-tolerated', sublabel: 'Zinc picolinate', filterQuery: 'zinc picolinate' },
    ],
    expandedBody:
      'Chelated zinc forms (glycinate, picolinate) are significantly better absorbed than zinc oxide, which is the cheapest but least bioavailable form. Take zinc with food to minimize stomach upset. Long-term supplementation above 40mg/day may compete with copper absorption — consider a zinc+copper combo for ongoing use.',
  },
  ashwagandha: {
    tagline: 'Tip from our Wellness Hub',
    headline: 'KSM-66® and Sensoril® are the most clinically validated extracts.',
    chips: [
      { label: '🌿 Most studied', sublabel: 'KSM-66®', filterQuery: 'ashwagandha ksm-66' },
      { label: '😌 Deeper calm', sublabel: 'Sensoril®', filterQuery: 'ashwagandha sensoril' },
      { label: '💰 Budget option', sublabel: 'Root extract', filterQuery: 'ashwagandha root extract' },
    ],
    expandedBody:
      'KSM-66® is a root-only extract with the most clinical trials behind it for stress reduction, testosterone support, and athletic performance. Sensoril® uses the full plant and typically has a stronger calming effect. Both are meaningfully superior to generic root powders that don\'t specify withanolide content or extract ratio.',
  },
  melatonin: {
    tagline: 'Tip from our Wellness Hub',
    headline: 'Lower doses (0.5–1 mg) are often more effective than higher ones.',
    chips: [
      { label: '💤 Fall asleep faster', sublabel: '0.5–1 mg', filterQuery: 'melatonin low dose' },
      { label: '😴 Stay asleep', sublabel: 'Extended release', filterQuery: 'melatonin extended release' },
      { label: '✈️ Jet lag', sublabel: '3–5 mg', filterQuery: 'melatonin 3mg' },
    ],
    expandedBody:
      'Many people default to 5–10mg of melatonin when 0.5–1mg is sufficient for most adults — higher doses don\'t linearly increase effectiveness and may cause morning grogginess or reduce natural production over time. Use low doses for general sleep support; higher doses are reserved for severe jet lag or shift-work schedule adjustment.',
  },
  iron: {
    tagline: 'Tip from our Wellness Hub',
    headline: 'Ferrous bisglycinate is the gentlest, best-absorbed iron form.',
    chips: [
      { label: '💚 Gentle & effective', sublabel: 'Bisglycinate', filterQuery: 'iron bisglycinate' },
      { label: '💊 Most common', sublabel: 'Ferrous sulfate', filterQuery: 'ferrous sulfate' },
      { label: '🍊 Enhanced uptake', sublabel: 'With Vitamin C', filterQuery: 'iron vitamin c' },
    ],
    expandedBody:
      'Chelated iron (ferrous bisglycinate) is significantly gentler on the stomach and better absorbed than ferrous sulfate, the most common pharmacy form. Take iron on an empty stomach if tolerated, or with food to reduce GI side effects. Pairing any iron form with vitamin C meaningfully enhances absorption and reduces constipation risk.',
  },
};

const TRIGGER_MAP: [string[], string][] = [
  [['magnesium', 'mag glycinate', 'magnesium glycinate', 'mag citrate'], 'magnesium'],
  [['vitamin d', 'vitamin b', 'vitamin c', 'vitamin a', 'vitamin e', 'vitamin k', 'vitamins', 'multivitamin'], 'vitamin'],
  [['omega-3', 'omega 3', 'omega3', 'fatty acid'], 'omega'],
  [['fish oil', 'krill oil', 'cod liver'], 'fish oil'],
  [['collagen', 'collagen peptide'], 'collagen'],
  [['probiotic', 'prebiotic', 'gut health', 'gut flora'], 'probiotics'],
  [['protein powder', 'whey protein', 'casein', 'plant protein', 'protein shake'], 'protein'],
  [['creatine'], 'creatine'],
  [['turmeric', 'curcumin'], 'turmeric'],
  [['zinc'], 'zinc'],
  [['ashwagandha', 'adaptogen'], 'ashwagandha'],
  [['melatonin', 'sleep aid'], 'melatonin'],
  [['iron supplement', 'ferrous'], 'iron'],
];

function getAnswerData(query: string): AIAnswerData | null {
  const q = query.toLowerCase().trim();
  if (!q || q === 'all products') return null;
  for (const [triggers, key] of TRIGGER_MAP) {
    if (triggers.some((t) => q.includes(t))) return ANSWER_DATA[key] ?? null;
  }
  return null;
}

interface AIAnswerCardProps {
  query: string;
  onSearch: (q: string) => void;
}

export function AIAnswerCard({ query, onSearch }: AIAnswerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const data = getAnswerData(query);
  if (!data) return null;

  return (
    <div className="col-span-full mb-2 bg-white rounded-2xl border border-[#D9EADF] overflow-hidden shadow-[0_2px_16px_rgba(10,107,60,0.07)] animate-[fadeIn_200ms_ease-out]">
      {/* Gradient accent bar */}
      <div className="h-[3px] bg-gradient-to-r from-[#0A6B3C] via-[#79A83C] to-[#0A6B3C]" />

      <div className="px-5 py-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={12} className="text-[#0A6B3C]" strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A6B3C]">
                {data.tagline}
              </span>
            </div>
            <p className="text-[14px] font-semibold text-[#1A1A1A] leading-snug">
              {data.headline}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0 flex items-center gap-1 text-[11px] text-[#999] hover:text-[#0A6B3C] font-medium transition-colors mt-0.5"
            aria-expanded={expanded}
          >
            {expanded ? (
              <><ChevronUp size={13} strokeWidth={2} />Less</>
            ) : (
              <><ChevronDown size={13} strokeWidth={2} />More</>
            )}
          </button>
        </div>

        {/* Recommendation chips — always visible */}
        <div className="flex flex-wrap gap-2 mt-3">
          {data.chips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => onSearch(chip.filterQuery)}
              className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#E0EEE5] bg-[#FAFBFA] hover:border-[#0A6B3C] hover:bg-[#F1FAF3] text-left transition-all duration-150 active:scale-[0.97]"
            >
              <span className="text-[12px] text-[#555]">{chip.label}</span>
              <span className="text-[11px] font-bold text-[#0A6B3C]">{chip.sublabel}</span>
              <ArrowRight
                size={11}
                className="text-[#0A6B3C] opacity-0 group-hover:opacity-100 -ml-0.5 transition-opacity flex-shrink-0"
                strokeWidth={2.5}
              />
            </button>
          ))}
        </div>

        {/* Expanded detail */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-[#F0F0F0] animate-[fadeIn_150ms_ease-out]">
            <p className="text-[13px] text-[#444] leading-relaxed">{data.expandedBody}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-[#F0F0F0] bg-[#FAFBFA] flex items-center justify-between">
        <span className="text-[10.5px] text-[#BBBBBB]">Powered by iHerb Wellness Hub</span>
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-0.5 text-[11px] text-[#1558A6] hover:underline font-medium"
          >
            Why these forms?
            <ArrowRight size={10} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}
