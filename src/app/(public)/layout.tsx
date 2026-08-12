import React from 'react';
import { Header } from '@/components/public/header';
import { Footer } from '@/components/public/footer';
import { getWebsiteSettings } from '@/lib/queries/public';
import { JsonLd, organizationSchema } from '@/lib/seo';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getWebsiteSettings();

  return (
    <>
      <JsonLd data={organizationSchema(settings)} />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
