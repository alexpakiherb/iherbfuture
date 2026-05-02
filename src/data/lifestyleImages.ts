// Curated lifestyle imagery for the wellness prototype.
// Mix of Unsplash (CDN: images.unsplash.com) and Pexels (images.pexels.com).
// All photos are royalty-free and appropriate for commercial use.
//
// Each entry has a stable CDN URL plus alt text. URLs include w/q params so
// we ship reasonably sized assets (typically 1600 wide for heroes, 800 for
// inline, 400 for thumbs). We use plain <img> tags — no Next.js Image
// optimization — so no remotePattern needed in next.config.

export interface LifestyleImage {
  url: string;
  alt: string;
  /** Optional credit attribution (Unsplash/Pexels). Display in tiny copy if shown. */
  credit?: string;
}

// ── Persona-aware morning lifestyle (Today page hero) ────────────────────────

export const MORNING_HERO_MAYA: LifestyleImage = {
  // Warm light, hands holding mug, plants — beginner morning aesthetic.
  url: 'https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa?w=1600&q=80&auto=format&fit=crop',
  alt: 'Soft morning light over a wellness ritual',
  credit: 'Brooke Lark / Unsplash',
};

export const MORNING_HERO_DANIEL: LifestyleImage = {
  // PNW pre-workout / morning training prep.
  url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80&auto=format&fit=crop',
  alt: 'Outdoor training in early morning Pacific Northwest light',
  credit: 'Bradley Dunn / Unsplash',
};

// ── Forecast page heroes (location-aware) ───────────────────────────────────

export const FORECAST_HERO_AUSTIN: LifestyleImage = {
  // Hill country sunrise, warm dry climate.
  url: 'https://images.unsplash.com/photo-1531219432768-9f540ec081f3?w=1800&q=80&auto=format&fit=crop',
  alt: 'Texas hill country in golden morning light',
  credit: 'Carlos Alfonso / Unsplash',
};

export const FORECAST_HERO_SEATTLE: LifestyleImage = {
  // Misty PNW evergreen forest.
  url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1800&q=80&auto=format&fit=crop',
  alt: 'Evergreen forest path in Pacific Northwest',
  credit: 'Lukasz Szmigiel / Unsplash',
};

// ── Forecast inline lifestyle (climate / season editorial breaks) ───────────

export const ALLERGY_LIFESTYLE: LifestyleImage = {
  // Spring tree blossoms — pollen season.
  url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80&auto=format&fit=crop',
  alt: 'Tree blossoms during spring allergy season',
  credit: 'Aaron Burden / Unsplash',
};

export const HYDRATION_LIFESTYLE: LifestyleImage = {
  // Glass of water with citrus — hydration cue.
  url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=1200&q=80&auto=format&fit=crop',
  alt: 'Glass of water with fresh citrus',
  credit: 'Aleksandar Cvetanović / Unsplash',
};

// ── Subscriptions page heroes ────────────────────────────────────────────────

export const SUBSCRIPTIONS_HERO: LifestyleImage = {
  // Wellness flat lay — supplements + journal + plant.
  url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1800&q=80&auto=format&fit=crop',
  alt: 'Premium amber bottles arranged in warm light',
  credit: 'Volodymyr Hryshchenko / Unsplash',
};

export const DELIVERY_LIFESTYLE: LifestyleImage = {
  // Pexels: a clean unboxing aesthetic / curated package.
  url: 'https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=1600',
  alt: 'Curated wellness delivery box',
  credit: 'Polina Tankilevitch / Pexels',
};

// ── Stack page hero (wellness ritual) ────────────────────────────────────────

export const STACK_HERO: LifestyleImage = {
  // Supplements in soft daylight — minimalist ritual.
  url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1800&q=80&auto=format&fit=crop',
  alt: 'Daily supplement ritual in soft natural light',
  credit: 'Diana Polekhina / Unsplash',
};

// ── Advisor expert portraits ─────────────────────────────────────────────────

export const EXPERT_DR_CHEN: LifestyleImage = {
  // Professional headshot — naturopathic doctor style.
  url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80&auto=format&fit=crop',
  alt: 'Dr. Sarah Chen, ND — Wellness Hub clinical reviewer',
  credit: 'Unsplash',
};

export const EXPERT_DR_PATEL: LifestyleImage = {
  // Male doctor / scientist headshot.
  url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80&auto=format&fit=crop',
  alt: 'Dr. Ravi Patel, PhD — Performance research advisor',
  credit: 'Unsplash',
};

// ── Generic supplement still-lifes (PDP, bundles, editorial breaks) ─────────

export const SUPPLEMENT_STILLLIFE_AMBER: LifestyleImage = {
  // Amber bottles in sunlight — premium supplement aesthetic.
  url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80&auto=format&fit=crop',
  alt: 'Amber supplement bottles in warm light',
  credit: 'Volodymyr Hryshchenko / Unsplash',
};

export const SUPPLEMENT_STILLLIFE_NEUTRAL: LifestyleImage = {
  // Pexels: clean lay of pills/capsules on neutral surface.
  url: 'https://images.pexels.com/photos/3683083/pexels-photo-3683083.jpeg?auto=compress&cs=tinysrgb&w=1200',
  alt: 'Premium capsules on neutral surface',
  credit: 'Pexels',
};

// ── Convenience map ─────────────────────────────────────────────────────────

export const LIFESTYLE_IMAGES = {
  morningMaya: MORNING_HERO_MAYA,
  morningDaniel: MORNING_HERO_DANIEL,
  forecastAustin: FORECAST_HERO_AUSTIN,
  forecastSeattle: FORECAST_HERO_SEATTLE,
  allergy: ALLERGY_LIFESTYLE,
  hydration: HYDRATION_LIFESTYLE,
  subscriptions: SUBSCRIPTIONS_HERO,
  delivery: DELIVERY_LIFESTYLE,
  stack: STACK_HERO,
  expertChen: EXPERT_DR_CHEN,
  expertPatel: EXPERT_DR_PATEL,
  supplementAmber: SUPPLEMENT_STILLLIFE_AMBER,
  supplementNeutral: SUPPLEMENT_STILLLIFE_NEUTRAL,
} as const;
