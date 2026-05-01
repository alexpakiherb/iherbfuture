// Hand-authored AI-style answers for the PDP Contextual Search prototype.
// Each entry maps a pill ID to a structured response: headline, body prose,
// optional bullet highlights, and related product IDs shown as comparison cards.

export interface PillAnswer {
  /** Short citation shown at the top of the panel ("Answer based on...") */
  source: string;
  /** Primary headline rendered at the top of the mini panel. */
  headline: string;
  /** 2-4 short paragraphs. Kept short — this is a compact panel, not an article. */
  paragraphs: string[];
  /** Optional bullet callouts rendered as a light-green highlight block. */
  highlights?: string[];
  /** Product IDs to surface as comparison cards below the answer. */
  relatedProductIds: number[];
  /** Label above the related products block. */
  relatedLabel: string;
}

export interface ContextualPill {
  id: string;
  label: string;
  /** Optional emoji-free icon key for subtle visual differentiation */
  tone?: 'benefit' | 'compare' | 'dosage' | 'diet';
}

/**
 * Pills specific to the Life Extension Magnesium Glycinate PDP (product id 5).
 * In production these would be dynamically generated from product attributes +
 * common customer questions for the category.
 */
export const magnesiumGlycinatePills: ContextualPill[] = [
  { id: 'sleep',       label: 'Is this good for sleep?',           tone: 'benefit' },
  { id: 'recovery',    label: 'Is this good for muscle recovery?', tone: 'benefit' },
  { id: 'vs-citrate',  label: 'Glycinate vs. Citrate',             tone: 'compare' },
  { id: 'dosage',      label: 'How much should I take daily?',     tone: 'dosage'  },
  { id: 'vegan',       label: 'Is this vegan?',                    tone: 'diet'    },
  { id: 'compare',     label: 'Compare similar magnesium products',tone: 'compare' },
];

export const magnesiumGlycinateAnswers: Record<string, PillAnswer> = {
  sleep: {
    source: 'Grounded in Wellness Hub article "Magnesium for Sleep" + product data',
    headline: 'Yes — glycinate is one of the most sleep-friendly forms of magnesium.',
    paragraphs: [
      "Magnesium glycinate pairs elemental magnesium with glycine, an amino acid that has its own calming effect on the nervous system. That combination is why it's commonly recommended for people who want help winding down at night without next-morning grogginess.",
      "This specific product — Life Extension Magnesium Glycinate 200 mg — is lightly dosed per capsule, which makes it easy to take in the evening an hour before bed. Most customers pair it with their nighttime routine.",
    ],
    highlights: [
      'Glycine is associated with faster time-to-sleep in several small trials',
      'Glycinate is gentler on the stomach than citrate or oxide',
      'No reported next-day drowsiness at typical doses',
    ],
    relatedProductIds: [33, 36],
    relatedLabel: 'Other sleep-oriented magnesium options',
  },

  recovery: {
    source: 'Grounded in Wellness Hub article "Magnesium & Muscle Function"',
    headline: 'Good choice, though malate is usually the go-to for recovery.',
    paragraphs: [
      "Magnesium plays a central role in muscle contraction and relaxation, so any well-absorbed form supports recovery. Glycinate is well-absorbed and easy on the gut, which makes it a solid all-rounder.",
      "That said, if muscle recovery and daytime energy are your primary goal, magnesium malate is often preferred — malic acid is involved in cellular energy production. Many athletes stack glycinate at night and malate during the day.",
    ],
    highlights: [
      'Glycinate: gentle, good for evening recovery + sleep',
      'Malate: preferred for daytime energy and soreness',
      'Bisglycinate: higher elemental magnesium per capsule',
    ],
    relatedProductIds: [35, 33, 39],
    relatedLabel: 'Best for muscle recovery',
  },

  'vs-citrate': {
    source: 'Grounded in Wellness Hub article "Magnesium Forms Explained"',
    headline: 'Glycinate for calm and sleep. Citrate for digestion and value.',
    paragraphs: [
      "Both forms are well-absorbed, but they behave differently in the body. Magnesium glycinate is bound to glycine, giving it a calming profile that's friendly to sensitive stomachs — ideal for sleep and stress. It's usually the more expensive option.",
      "Magnesium citrate is bound to citric acid, which has a mild laxative effect. That makes it a popular pick for occasional constipation or digestive regularity. It's typically cheaper per serving and widely available.",
    ],
    highlights: [
      'Pick glycinate if: sleep, anxiety, sensitive stomach',
      'Pick citrate if: digestive regularity, budget-conscious',
      'Both are more bioavailable than magnesium oxide',
    ],
    relatedProductIds: [32, 5],
    relatedLabel: 'Compare head-to-head',
  },

  dosage: {
    source: 'Grounded in NIH Office of Dietary Supplements guidance',
    headline: '1–2 capsules (200–400 mg) daily, ideally with food.',
    paragraphs: [
      "The recommended daily allowance for adults is roughly 310–420 mg of elemental magnesium depending on age and sex, including what you get from food. Most people supplement 200–400 mg on top of their diet.",
      "For this product, that's 1–2 capsules per day. If you're taking it for sleep, time the dose to ~60 minutes before bed. If you're new to magnesium, start with one capsule to gauge tolerance.",
    ],
    highlights: [
      'Upper limit from supplements: 350 mg/day (UL) per NIH',
      'Split larger doses — better absorption, less GI upset',
      'Consult a clinician if you have kidney issues',
    ],
    relatedProductIds: [],
    relatedLabel: '',
  },

  vegan: {
    source: 'Based on the dietary tags and certifications on this product',
    headline: 'Yes — this product is labeled vegan, non-GMO, and gluten-free.',
    paragraphs: [
      "Life Extension Magnesium Glycinate 200 mg uses a vegetable cellulose capsule and does not contain any animal-derived ingredients. It's also third-party tested and free from major allergens.",
      "If you're looking for broader certifications (e.g., vegan society marks, kosher, halal), the list below highlights comparable glycinate/bisglycinate options with those additional certifications.",
    ],
    highlights: [
      'Vegan capsule (vegetable cellulose)',
      'Non-GMO, gluten-free',
      '3rd-party tested for purity',
    ],
    relatedProductIds: [33, 36],
    relatedLabel: 'Other certified-vegan magnesium options',
  },

  compare: {
    source: 'Comparison across top magnesium products in iHerb catalog',
    headline: 'Here\u2019s how this product stacks up against popular alternatives.',
    paragraphs: [
      "This Life Extension Magnesium Glycinate sits in the mid-tier on price with strong ratings and a sleep-leaning profile. Below are three popular alternatives across different forms and price points.",
    ],
    relatedProductIds: [33, 32, 34],
    relatedLabel: 'Top alternatives customers consider',
  },
};
