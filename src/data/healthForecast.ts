// 7-day health forecast — environmental data that feeds AI recommendations.
// Different per persona to demonstrate location-aware adaptation.

import { PersonaId } from './personas';

export interface ForecastDay {
  label: string; // "Today", "Tue", "Wed"
  date: string; // "May 1"
  tempHigh: number;
  tempLow: number;
  uvIndex: number;
  uvLabel: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  pollenTree: number;
  pollenGrass: number;
  pollenLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  airQualityIndex: number;
  weather: '☀️' | '⛅' | '☁️' | '🌧️' | '⛈️' | '🌫️';
  alerts?: string[];
}

export interface ForecastInsight {
  icon: string;
  title: string;
  body: string;
  productSuggestion?: { name: string; reason: string; productId?: string };
  ctaLabel: string;
}

export interface HealthForecast {
  city: string;
  state: string;
  days: ForecastDay[];
  insights: ForecastInsight[];
}

const MAYA_FORECAST: HealthForecast = {
  city: 'Austin',
  state: 'TX',
  days: [
    { label: 'Today', date: 'May 1', tempHigh: 88, tempLow: 67, uvIndex: 9, uvLabel: 'Very High', pollenTree: 8.2, pollenGrass: 6.5, pollenLevel: 'Very High', airQualityIndex: 78, weather: '☀️', alerts: ['High pollen — symptoms likely'] },
    { label: 'Fri', date: 'May 2', tempHigh: 91, tempLow: 70, uvIndex: 10, uvLabel: 'Very High', pollenTree: 7.8, pollenGrass: 6.8, pollenLevel: 'Very High', airQualityIndex: 82, weather: '☀️' },
    { label: 'Sat', date: 'May 3', tempHigh: 85, tempLow: 68, uvIndex: 7, uvLabel: 'High', pollenTree: 6.5, pollenGrass: 6.2, pollenLevel: 'High', airQualityIndex: 65, weather: '⛅' },
    { label: 'Sun', date: 'May 4', tempHigh: 79, tempLow: 62, uvIndex: 5, uvLabel: 'Moderate', pollenTree: 4.2, pollenGrass: 5.0, pollenLevel: 'Moderate', airQualityIndex: 48, weather: '🌧️', alerts: ['Rain may lower pollen'] },
    { label: 'Mon', date: 'May 5', tempHigh: 82, tempLow: 64, uvIndex: 7, uvLabel: 'High', pollenTree: 5.5, pollenGrass: 5.8, pollenLevel: 'High', airQualityIndex: 62, weather: '⛅' },
    { label: 'Tue', date: 'May 6', tempHigh: 87, tempLow: 67, uvIndex: 9, uvLabel: 'Very High', pollenTree: 7.2, pollenGrass: 6.4, pollenLevel: 'Very High', airQualityIndex: 75, weather: '☀️' },
    { label: 'Wed', date: 'May 7', tempHigh: 89, tempLow: 69, uvIndex: 10, uvLabel: 'Very High', pollenTree: 7.8, pollenGrass: 6.7, pollenLevel: 'Very High', airQualityIndex: 80, weather: '☀️' },
  ],
  insights: [
    {
      icon: '🌳',
      title: 'Tree pollen is in the top 10% of the year',
      body: 'Cedar and oak pollen peaks for Central Texas this week. If you typically experience allergy symptoms, consider adding quercetin and stinging nettle to your routine.',
      productSuggestion: { name: 'Quercetin + Bromelain', reason: 'Natural antihistamine support', productId: 'le-quercetin' },
      ctaLabel: 'See seasonal protocol',
    },
    {
      icon: '☀️',
      title: 'UV index reaches 10 on Friday',
      body: 'Very High UV expected. Your Vitamin D3 intake is fine through diet + sun this week — your advisor will pause your D3 autoship and resume in fall.',
      ctaLabel: 'View autoship adjustment',
    },
    {
      icon: '💧',
      title: 'Heat advisory may impact hydration',
      body: 'Heat index of 95+ on 4 of the next 7 days. Add electrolytes if you\'re training outdoors or experiencing low energy.',
      productSuggestion: { name: 'LMNT Electrolyte Mix', reason: 'Replenishes sodium loss in heat' },
      ctaLabel: 'Shop electrolytes',
    },
  ],
};

const DANIEL_FORECAST: HealthForecast = {
  city: 'Seattle',
  state: 'WA',
  days: [
    { label: 'Today', date: 'May 1', tempHigh: 62, tempLow: 48, uvIndex: 4, uvLabel: 'Moderate', pollenTree: 4.5, pollenGrass: 2.1, pollenLevel: 'Moderate', airQualityIndex: 32, weather: '⛅' },
    { label: 'Fri', date: 'May 2', tempHigh: 58, tempLow: 46, uvIndex: 3, uvLabel: 'Moderate', pollenTree: 3.8, pollenGrass: 2.0, pollenLevel: 'Moderate', airQualityIndex: 28, weather: '🌧️' },
    { label: 'Sat', date: 'May 3', tempHigh: 60, tempLow: 47, uvIndex: 5, uvLabel: 'Moderate', pollenTree: 4.2, pollenGrass: 2.4, pollenLevel: 'Moderate', airQualityIndex: 35, weather: '⛅' },
    { label: 'Sun', date: 'May 4', tempHigh: 65, tempLow: 50, uvIndex: 6, uvLabel: 'High', pollenTree: 5.0, pollenGrass: 2.8, pollenLevel: 'High', airQualityIndex: 42, weather: '☀️' },
    { label: 'Mon', date: 'May 5', tempHigh: 67, tempLow: 51, uvIndex: 7, uvLabel: 'High', pollenTree: 5.5, pollenGrass: 3.2, pollenLevel: 'High', airQualityIndex: 48, weather: '☀️' },
    { label: 'Tue', date: 'May 6', tempHigh: 64, tempLow: 49, uvIndex: 5, uvLabel: 'Moderate', pollenTree: 4.8, pollenGrass: 2.6, pollenLevel: 'Moderate', airQualityIndex: 38, weather: '⛅' },
    { label: 'Wed', date: 'May 7', tempHigh: 61, tempLow: 47, uvIndex: 4, uvLabel: 'Moderate', pollenTree: 4.0, pollenGrass: 2.3, pollenLevel: 'Moderate', airQualityIndex: 30, weather: '🌧️' },
  ],
  insights: [
    {
      icon: '🧬',
      title: 'Continue NMN through Q2 — vitamin D supports synthesis',
      body: 'Seattle UV is climbing into seasonal "high" range. Natural vitamin D synthesis from sun exposure complements your NMN protocol. Your Vitamin D3 dose has been auto-reduced from 5,000 IU to 2,000 IU.',
      ctaLabel: 'View protocol change',
    },
    {
      icon: '🏃',
      title: 'Outdoor Z2 cardio window is opening up',
      body: 'Mostly dry days Mon–Wed. Whoop forecast: ideal recovery for outdoor zone-2 sessions. Pre-workout electrolytes and creatine timing have been adjusted in your stack.',
      productSuggestion: { name: 'LMNT Citrus Salt', reason: 'Pre-workout sodium for outdoor heat' },
      ctaLabel: 'View workout stack',
    },
    {
      icon: '😷',
      title: 'Air quality favorable for HIIT',
      body: 'AQI averaging 35 over the week — well below thresholds for high-intensity outdoor work. Your Quercetin protocol is performing as expected.',
      ctaLabel: 'View HRV trend',
    },
  ],
};

export function getForecast(personaId: PersonaId): HealthForecast {
  return personaId === 'maya' ? MAYA_FORECAST : DANIEL_FORECAST;
}
