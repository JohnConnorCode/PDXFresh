import type { Metadata } from 'next';
import { Playfair_Display, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import '@/styles/globals.css';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://pdxfreshfoods.com'),
  title: {
    default: 'Portland Fresh | Small-Batch Sauces & Pestos',
    template: '%s | Portland Fresh',
  },
  description: 'Portland Fresh crafts pestos, salsa, chimichurri, and pantry sauces from Pacific Northwest produce. Weekly batches, same-week delivery, wholesale programs, and market pop-ups across Portland.',
  keywords: ['Portland Fresh', 'PDX pesto', 'Portland salsa', 'small batch sauces', 'chimichurri', 'Portland pantry'],
  authors: [{ name: 'Portland Fresh' }],
  creator: 'Portland Fresh',
  publisher: 'Portland Fresh',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pdxfreshfoods.com',
    title: 'Portland Fresh | Sauces From Portland Kitchens',
    description: 'Seasonal, organic ingredients blended into pesto, salsa, chimichurri, and spreads.',
    siteName: 'Portland Fresh',
    images: [{
      url: '/portland-fresh-new-1.jpg',
      width: 1200,
      height: 630,
      alt: 'Portland Fresh sauces prepared with Portland produce',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portland Fresh | Sauces From Portland Kitchens',
    description: 'Seasonal produce sauces, pestos, and salsa made for Portland tables.',
    images: ['/portland-fresh-new-1.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${spaceGrotesk.variable}`}>
      <head />
      <body className="bg-[var(--bg)] text-[var(--fg)] font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
