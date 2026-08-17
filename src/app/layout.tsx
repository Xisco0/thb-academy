import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const titleFont = Poppins({
  subsets: ['latin'],
  weight: ['600'],
  display: 'swap',
  variable: '--font-title',
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
    'Learn music at Triumphant Harmony Brass (THB) Music Academy in Lagos, Nigeria. Professional training in keyboard, guitar, trumpet, saxophone, violin, drums, and voice.',
  openGraph: {
    locale: 'en_NG',
    type: 'website',
    siteName: 'Triumphant Harmony Brass Music Academy',
    url: siteUrl,
    title: 'Triumphant Harmony Brass | Music Academy in Lagos, Nigeria',
    description:
      'Learn music at Triumphant Harmony Brass (THB) Music Academy in Lagos, Nigeria. Professional training in keyboard, guitar, trumpet, saxophone, violin, drums, and voice.',
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
    <html lang="en" suppressHydrationWarning className={`${titleFont.variable} ${inter.variable}`}>
      <body className="min-h-screen font-body antialiased transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
