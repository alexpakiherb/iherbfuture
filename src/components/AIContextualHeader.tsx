'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface AIContextInfo {
  headline: string;
  summary: string;
  pillars: { label: string; note: string; searchQuery?: string }[];
  wellnessHubPath: string;
}

const AI_CONTEXTS: Record<string, AIContextInfo> = {
  magnesium: {
    headline: 'About Magnesium',
    summary:
      "An essential mineral involved in 300+ body functions — from muscle relaxation and nerve signaling to energy production and deep sleep. Most adults don't get enough from diet alone.",
    pillars: [
      { label: 'Glycinate', note: 'Gentlest form, best for sleep & anxiety', searchQuery: 'magnesium glycinate' },
      { label: 'Citrate', note: 'Well-absorbed, supports digestion', searchQuery: 'magnesium citrate' },
      { label: 'Malate', note: 'Energy & muscle recovery', searchQuery: 'magnesium malate' },
    ],
    wellnessHubPath: '/wellness-hub/magnesium-guide',
  },
  vitamin: {
    headline: 'Choosing the Right Vitamin',
    summary:
      'Vitamins are essential micronutrients that support immunity, energy, bone health, and more. Fat-soluble vitamins (A, D, E, K) are stored in the body; water-soluble vitamins (B, C) need daily replenishment.',
    pillars: [
      { label: 'Vitamin D3', note: 'Best absorbed with K2 and healthy fats' },
      { label: 'B-Complex', note: 'Supports energy and nerve health' },
      { label: 'Vitamin C', note: 'Immune support, antioxidant protection' },
    ],
    wellnessHubPath: '/wellness-hub/vitamins-guide',
  },
  omega: {
    headline: 'About Omega-3 Fatty Acids',
    summary:
      "Omega-3s (EPA, DHA, ALA) are essential fats your body can't make on its own. They support heart health, brain function, joint mobility, and a healthy inflammation response.",
    pillars: [
      { label: 'EPA', note: 'Heart health & inflammation' },
      { label: 'DHA', note: 'Brain development & cognition' },
      { label: 'ALA', note: 'Plant-based, found in flaxseed & chia' },
    ],
    wellnessHubPath: '/wellness-hub/omega-3-guide',
  },
  'fish oil': {
    headline: 'About Fish Oil & Omega-3s',
    summary:
      'Fish oil is the most bioavailable source of omega-3 fatty acids (EPA and DHA). Look for triglyceride form for better absorption, and third-party testing to confirm purity.',
    pillars: [
      { label: 'EPA + DHA', note: 'Anti-inflammatory, heart & joint support' },
      { label: 'Purity', note: 'Look for 3rd-party testing for heavy metals' },
      { label: 'Triglyceride form', note: 'Absorbs better than ethyl ester' },
    ],
    wellnessHubPath: '/wellness-hub/fish-oil-guide',
  },
  collagen: {
    headline: 'About Collagen',
    summary:
      'Collagen is the most abundant protein in your body, supporting skin elasticity, joint cushioning, and bone strength. Natural production declines with age — supplementation may help replenish it.',
    pillars: [
      { label: 'Type I & III', note: 'Skin, hair, nails, tendons' },
      { label: 'Type II', note: 'Joint cartilage support' },
      { label: 'Hydrolyzed', note: 'Best-absorbed form — look for peptides' },
    ],
    wellnessHubPath: '/wellness-hub/collagen-guide',
  },
  probiotics: {
    headline: 'About Probiotics',
    summary:
      'Probiotics are live beneficial bacteria that support gut microbiome health, immune function, and even mood. Different strains have different benefits — strain specificity matters more than CFU count alone.',
    pillars: [
      { label: 'Lactobacillus', note: 'Digestive health, IBS, UTI prevention' },
      { label: 'Bifidobacterium', note: 'Immune support, colon health' },
      { label: 'Saccharomyces', note: 'Antibiotic recovery, traveler\'s diarrhea' },
    ],
    wellnessHubPath: '/wellness-hub/probiotics-guide',
  },
  protein: {
    headline: 'Choosing a Protein Supplement',
    summary:
      'Protein is essential for muscle building, recovery, and satiety. Different sources vary in amino acid profiles, absorption rates, and digestibility — the best choice depends on your goals and diet.',
    pillars: [
      { label: 'Whey', note: 'Fast-absorbing, complete amino profile — best post-workout' },
      { label: 'Casein', note: 'Slow-release — ideal before sleep' },
      { label: 'Plant-based', note: 'Pea, hemp, or rice for dairy-free options' },
    ],
    wellnessHubPath: '/wellness-hub/protein-guide',
  },
  creatine: {
    headline: 'About Creatine',
    summary:
      "One of the most research-backed sports supplements. Creatine monohydrate increases ATP production, supporting explosive power, strength gains, and workout capacity. It's safe and effective for most people.",
    pillars: [
      { label: 'Monohydrate', note: 'Most studied form — effective and affordable' },
      { label: 'HCl', note: 'Smaller dose, easier on stomach' },
      { label: '5g/day', note: 'Sufficient without a loading phase' },
    ],
    wellnessHubPath: '/wellness-hub/creatine-guide',
  },
  turmeric: {
    headline: 'About Turmeric & Curcumin',
    summary:
      "Turmeric's active compound curcumin is a powerful antioxidant with anti-inflammatory properties. It has poor bioavailability on its own — look for formulas with black pepper extract (piperine) to maximize absorption.",
    pillars: [
      { label: 'Curcumin', note: 'Active compound — choose standardized extracts' },
      { label: 'Piperine', note: 'Black pepper extract boosts absorption up to 20×' },
      { label: 'Liposomal', note: 'Enhanced delivery for maximum bioavailability' },
    ],
    wellnessHubPath: '/wellness-hub/turmeric-guide',
  },
  zinc: {
    headline: 'About Zinc',
    summary:
      'Zinc is a trace mineral essential for immune function, wound healing, protein synthesis, and DNA production. Deficiency is common — especially in vegetarians, athletes, and older adults.',
    pillars: [
      { label: 'Zinc Glycinate', note: 'Most bioavailable and gentle on stomach' },
      { label: 'Zinc Citrate', note: 'Good absorption, affordable' },
      { label: 'Zinc Picolinate', note: 'High bioavailability, well-tolerated' },
    ],
    wellnessHubPath: '/wellness-hub/zinc-guide',
  },
  ashwagandha: {
    headline: 'About Ashwagandha',
    summary:
      'An adaptogenic herb from Ayurvedic medicine, ashwagandha helps the body manage stress by regulating cortisol. Research supports benefits for anxiety reduction, sleep quality, and physical performance.',
    pillars: [
      { label: 'KSM-66®', note: 'Most clinically studied root extract' },
      { label: 'Sensoril®', note: 'Full-plant extract, stronger calming effect' },
      { label: 'Dose', note: '300–600mg/day root extract is the studied range' },
    ],
    wellnessHubPath: '/wellness-hub/ashwagandha-guide',
  },
  melatonin: {
    headline: 'About Melatonin',
    summary:
      "Melatonin is a hormone your body naturally produces to regulate sleep-wake cycles. Supplements work best for jet lag and shift work. Lower doses (0.5–1mg) are often more effective than higher doses for most people.",
    pillars: [
      { label: 'Low dose (0.5mg)', note: 'Mimics natural production more closely' },
      { label: 'Extended release', note: 'Helps maintain sleep through the night' },
      { label: 'Timing', note: 'Take 30–60 min before desired sleep time' },
    ],
    wellnessHubPath: '/wellness-hub/melatonin-guide',
  },
  iron: {
    headline: 'About Iron',
    summary:
      "Iron is essential for red blood cell production and oxygen transport throughout the body. Iron deficiency is the most common nutritional deficiency worldwide — especially in women of childbearing age.",
    pillars: [
      { label: 'Ferrous bisglycinate', note: 'Gentlest on stomach, well-absorbed' },
      { label: 'Ferrous sulfate', note: 'Most common form, affordable' },
      { label: 'Take with Vitamin C', note: 'Significantly enhances absorption' },
    ],
    wellnessHubPath: '/wellness-hub/iron-guide',
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

function getAIContext(query: string): AIContextInfo | null {
  const q = query.toLowerCase().trim();
  if (!q || q === 'all products') return null;
  for (const [triggers, key] of TRIGGER_MAP) {
    if (triggers.some((t) => q.includes(t))) {
      return AI_CONTEXTS[key] ?? null;
    }
  }
  return null;
}

interface AIContextualHeaderProps {
  query: string;
  onSearch?: (query: string) => void;
}

export function AIContextualHeader({ query, onSearch }: AIContextualHeaderProps) {
  const [dismissed, setDismissed] = useState(false);
  const context = getAIContext(query);

  if (!context || dismissed) return null;

  return (
    <div className="mx-8 mb-2 flex gap-3 rounded-xl border border-[#C3E6CB] bg-[#F1FAF3] px-4 py-3.5">
      {/* Left accent */}
      <div className="mt-1 w-[3px] flex-shrink-0 rounded-full bg-[#0A6B3C]" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Source label + dismiss */}
        <div className="flex items-center justify-between gap-4 mb-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#0A6B3C]" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0A6B3C]">
              Wellness Hub Overview
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-[#999999] hover:text-[#555555] transition-colors flex-shrink-0"
            aria-label="Dismiss overview"
          >
            <X size={15} />
          </button>
        </div>

        {/* Headline */}
        <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">{context.headline}</h3>

        {/* Summary */}
        <p className="text-sm text-[#555555] leading-relaxed mb-2.5">{context.summary}</p>

        {/* Key difference pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-[#666666]">Key differences:</span>
          {context.pillars.map((pillar) => {
            const isClickable = !!(onSearch && pillar.searchQuery);
            return isClickable ? (
              <button
                key={pillar.label}
                onClick={() => onSearch!(pillar.searchQuery!)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#B2DFDB] bg-white px-2.5 py-1 hover:border-[#0A6B3C] hover:bg-[#F1FAF3] transition-colors cursor-pointer"
              >
                <span className="text-[11px] font-bold text-[#0A6B3C]">{pillar.label}</span>
                <span className="text-[11px] text-[#666666]">— {pillar.note}</span>
              </button>
            ) : (
              <span
                key={pillar.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#B2DFDB] bg-white px-2.5 py-1"
              >
                <span className="text-[11px] font-bold text-[#0A6B3C]">{pillar.label}</span>
                <span className="text-[11px] text-[#666666]">— {pillar.note}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
