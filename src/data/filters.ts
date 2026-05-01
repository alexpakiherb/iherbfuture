export interface FilterSection {
  id: string;
  label: string;
  type: "checkbox" | "range" | "color";
  options?: { value: string; label: string; count: number }[];
  range?: { min: number; max: number; step: number };
  defaultExpanded: boolean;
}

export const filterSections: FilterSection[] = [
  {
    id: "category",
    label: "Category",
    type: "checkbox",
    defaultExpanded: true,
    options: [
      { value: "supplements", label: "Supplements", count: 850 },
      { value: "sports", label: "Sports", count: 420 },
      { value: "bath", label: "Bath & Body", count: 350 },
      { value: "beauty", label: "Beauty", count: 280 },
      { value: "grocery", label: "Grocery", count: 190 },
      { value: "home", label: "Home", count: 125 },
      { value: "baby", label: "Baby", count: 95 },
      { value: "pets", label: "Pets", count: 75 }
    ]
  },
  {
    id: "brand",
    label: "Brand",
    type: "checkbox",
    defaultExpanded: true,
    options: [
      { value: "california-gold", label: "California Gold Nutrition", count: 285 },
      { value: "now-foods", label: "NOW Foods", count: 210 },
      { value: "sports-research", label: "Sports Research", count: 165 },
      { value: "life-extension", label: "Life Extension", count: 145 },
      { value: "solgar", label: "Solgar", count: 130 },
      { value: "natures-way", label: "Nature's Way", count: 125 },
      { value: "garden-of-life", label: "Garden of Life", count: 115 },
      { value: "doctors-best", label: "Doctor's Best", count: 95 },
      { value: "nordic-naturals", label: "Nordic Naturals", count: 85 },
      { value: "jarrow-formulas", label: "Jarrow Formulas", count: 75 }
    ]
  },
  {
    id: "price",
    label: "Price",
    type: "range",
    defaultExpanded: true,
    range: { min: 3, max: 60, step: 1 }
  },
  {
    id: "rating",
    label: "Rating",
    type: "checkbox",
    defaultExpanded: false,
    options: [
      { value: "5-star", label: "5 Stars", count: 145 },
      { value: "4-5-star", label: "4.5+ Stars", count: 480 },
      { value: "4-star", label: "4+ Stars", count: 1020 },
      { value: "3-5-star", label: "3.5+ Stars", count: 1410 }
    ]
  },
  {
    id: "dietary",
    label: "Dietary Tags",
    type: "checkbox",
    defaultExpanded: true,
    options: [
      { value: "vegan", label: "Vegan", count: 580 },
      { value: "gluten-free", label: "Gluten Free", count: 720 },
      { value: "non-gmo", label: "Non-GMO", count: 650 },
      { value: "organic", label: "Organic", count: 185 },
      { value: "keto", label: "Keto Friendly", count: 320 },
      { value: "paleo", label: "Paleo", count: 95 },
      { value: "sugar-free", label: "Sugar Free", count: 410 }
    ]
  },
  {
    id: "form",
    label: "Form",
    type: "checkbox",
    defaultExpanded: true,
    options: [
      { value: "capsules", label: "Capsules", count: 480 },
      { value: "tablets", label: "Tablets", count: 320 },
      { value: "softgels", label: "Softgels", count: 385 },
      { value: "powder", label: "Powder", count: 275 },
      { value: "gummies", label: "Gummies", count: 165 },
      { value: "liquid", label: "Liquid", count: 120 },
      { value: "chewables", label: "Chewables", count: 45 }
    ]
  },
  {
    id: "health-goals",
    label: "Health Goals",
    type: "checkbox",
    defaultExpanded: true,
    options: [
      { value: "immune-support", label: "Immune Support", count: 420 },
      { value: "energy-support", label: "Energy Support", count: 285 },
      { value: "heart-health", label: "Heart Health", count: 195 },
      { value: "joint-health", label: "Joint Health", count: 165 },
      { value: "sleep-quality", label: "Sleep Quality", count: 145 },
      { value: "brain-support", label: "Brain Support", count: 210 },
      { value: "muscle-building", label: "Muscle Building", count: 280 },
      { value: "skin-beauty", label: "Skin Beauty", count: 175 },
      { value: "digestive-health", label: "Digestive Health", count: 135 },
      { value: "athletic-performance", label: "Athletic Performance", count: 220 }
    ]
  },
  {
    id: "badges",
    label: "Special Badges",
    type: "checkbox",
    defaultExpanded: false,
    options: [
      { value: "iherb-brands", label: "iHerb Brands", count: 285 },
      { value: "quality-promise", label: "Quality Promise", count: 950 },
      { value: "3rd-party", label: "3rd Party Tested", count: 580 },
      { value: "non-gmo-verified", label: "Non-GMO Verified", count: 420 },
      { value: "informed-choice", label: "Informed Choice", count: 195 },
      { value: "organic-verified", label: "Organic Verified", count: 115 }
    ]
  }
];

export const defaultSelectedFilters = {
  category: [],
  brand: [],
  price: [3, 60],
  rating: [],
  dietary: [],
  form: [],
  "health-goals": [],
  badges: []
};
