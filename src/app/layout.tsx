import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';

const titleFont = Poppins({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
  variable: "--font-title",
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    template: '%s | Triumphant Harmony Brass',
    default: 'Triumphant Harmony Brass | Music Academy in Lagos, Nigeria',
  },
  description:
    'Learn music at Triumphant Harmony Brass (THB), a premier music academy in Lagos, Nigeria. Professional training in keyboard, guitar, trumpet, saxophone, violin, drums, and voice.',
  openGraph: {
    locale: 'en_NG',
    type: 'website',
    siteName: 'Triumphant Harmony Brass',
  },
  twitter: {
    card: 'summary_large_image',
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
    <html lang="en" className={`${titleFont.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-navy-950 text-navy-100 font-body antialiased">
        {children}
      </body>
    </html>
  );
}
