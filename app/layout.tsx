import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Long Life',
  description: 'Cold-pressed organic juices crafted for vitality.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} style={{ '--font-futura': 'Futura, "Futura PT", "Century Gothic", "Trebuchet MS", Arial, sans-serif' } as any}>
      <body className="bg-white text-black">{children}</body>
    </html>
  );
}
