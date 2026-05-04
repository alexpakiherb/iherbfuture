import type { Metadata } from 'next';
import { Noto_Sans, Fraunces } from 'next/font/google';
import './globals.css';
import { PersonaProvider } from '@/components/PersonaProvider';
import { PersonaSwitcher } from '@/components/PersonaSwitcher';

const notoSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// Fraunces — serif accent for editorial display moments (page-level
// headlines, pull quotes). Used as `font-serif-display` utility class.
const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  // Variable font — no `weight` so all axes (opsz) are available.
});

export const metadata: Metadata = {
  title: 'iHerb — Your Wellness, Personalized',
  description:
    'iHerb knows you, anticipates your needs, and helps you reach your wellness goals.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${notoSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="m-0 flex min-h-screen flex-col p-0">
        <PersonaProvider>
          {children}
          <PersonaSwitcher />
        </PersonaProvider>
      </body>
    </html>
  );
}
