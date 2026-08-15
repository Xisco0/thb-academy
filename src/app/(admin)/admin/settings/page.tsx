import type { Metadata } from 'next';
import { AdminTopBar } from '@/components/admin/top-bar';
import { getWebsiteSettingsAdmin } from '@/lib/queries/admin';
import { SettingsClient } from './settings-client';

export const metadata: Metadata = {
  title: 'Academy Settings | Admin',
};

export default async function SettingsPage() {
  const settings = await getWebsiteSettingsAdmin();

  return (
    <div className="space-y-6">
      <AdminTopBar title="Website & Academy Settings" />
      <SettingsClient settings={settings} />
    </div>
  );
}
