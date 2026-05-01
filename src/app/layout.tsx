import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import './globals.css';
import { PersonaProvider } from '@/components/PersonaProvider';
import { PersonaSwitcher } from '@/components/PersonaSwitcher';

const notoSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'iHerb — Your Wellness, Personalized',
  description:
    'iHerb knows you, anticipates your needs, and helps you reach your wellness goals.',
};

export default function RootLayout({
  childr