import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { Analytics } from "@vercel/analytics/next";

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-heading',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
});

const siteUrl = 'https://www.thbacademy.org';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | THB Academy',
    default: 'Triumphant Harmony Brass | Music Academy in Lagos, Nigeria',
  },
  description:
    'Learn music at Triumphant Harmony Brass (THB) Music Academy in Lagos, Nigeria. Professional training in trumpet, saxophone, keyboard, guitar, violin, drums, and voice under Music Director Taiwo Toyinbo.',
  openGraph: {
    locale: 'en_NG',
    type: 'website',
    siteName: 'Triumphant Harmony Brass Music Academy',
    url: siteUrl,
    title: 'Triumphant Harmony Brass | Music Academy in Lagos, Nigeria',
    description:
      'Learn music at Triumphant Harmony Brass (THB) Music Academy in Lagos, Nigeria. Professional training in trumpet, saxophone, keyboard, guitar, violin, drums, and voice.',
    images: [
      {
        url: `${siteUrl}/images/image.png`,
        width: 1200,
        height: 630,
        alt: 'Triumphant Harmony Brass Music Academy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Triumphant Harmony Brass | Music Academy in Lagos, Nigeria',
    description:
      'Learn music at Triumphant Harmony Brass (THB) Music Academy in Lagos, Nigeria.',
    images: [`${siteUrl}/images/image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-white text-[#17243A] font-body antialiased transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
