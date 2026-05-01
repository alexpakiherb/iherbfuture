export interface PromoItem {
  id: string;
  text: string;
  link?: string;
}

export interface CategoryNavItem {
  id: string;
  label: string;
  count: number;
  icon?: string;
}

export interface PromoNavItem {
  id: string;
  label: string;
  icon?: string;
  link?: string;
}

export interface SortOption {
  id: string;
  label: string;
  value: string;
}

export const promoBarItems: PromoItem[] = [
  {
    id: "free-shipping",
    text: "Free shipping on orders over $35",
    link: "/promotions/free-shipping"
  },
  {
    id: "loyalty-bonus",
    text: "Loyalty bonus: Spend $50, get 1000 points",
    link: "/promotions/loyalty"
  },
  {
    id: "bestsellers-sale",
    text: "Best sellers sale: Up to 40% off selected items",
    link: "/promotions/bestsellers"
  }
];

export const categoryNav: CategoryNavItem[] = [
  { id: "all", label: "All Products", count: 2365 },
  { id: "supplements", label: "Supplements", count: 850 },
  { id: "sports", label: "Sports & Fitness", count: 420 },
  { id: "bath", label: "Bath & Body", count: 350 },
  { id: "beauty", label: "Beauty", count: 280 },
  { id: "grocery", label: "Grocery", count: 190 },
  { id: "home", label: "Home", count: 125 },
  { id: "baby", label: "Baby & Kids", count: 95 },
  { id: "pets", label: "Pets", count: 75 }
];

export const promoNav: PromoNavItem[] = [
  {
    id: "specials",
    label: "Special Offers",
    icon: "tag",
    link: "/specials"
  },
  {
    id: "bestsellers",
    label: "Best Sellers",
    icon: "fire",
    link: "/bestsellers"
  },
  {
    id: "try",
    label: "Try This",
    icon: "sparkles",
    link: "/try-this"
  },
  {
    id: "new",
    label: "New Arrivals",
    icon: "star",
    link: "/new"
  },
  {
    id: "wellness-hub",
    label: "Wellness Hub",
    icon: "heart",
    link: "/wellness-hub"
  }
];

export const sortOptions: SortOption[] = [
  {
    id: "relevance",
    label: "Best Match",
    value: "relevance"
  },
  {
    id: "popularity",
    label: "Best Selling",
    value: "popularity"
  },
  {
    id: "price-low-high",
    label: "Price: Low to High",
    value: "price-asc"
  },
  {
    id: "price-high-low",
    label: "Price: High to Low",
    value: "price-desc"
  },
  {
    id: "rating",
    label: "Highest Rated",
    value: "rating"
  },
  {
    id: "newest",
    label: "Newest",
    value: "newest"
  }
];
