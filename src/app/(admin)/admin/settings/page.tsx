import { getWebsiteSettingsAdmin } from '@/lib/queries/admin';
import { AdminTopBar } from '@/components/admin/top-bar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | Admin'
};

const SettingRow = ({ label, value }: { label: string, value: string | undefined | null }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-navy-700/30 last:border-0 gap-2">
    <span className="text-navy-400 text-sm">{label}</span>
    <span className="text-white text-sm font-medium text-left sm:text-right break-words">{value || '-'}</span>
  </div>
);

export default async function SettingsPage() {
  const settings = await getWebsiteSettingsAdmin() as Record<string, any> | null;
  const data = settings || {};

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <AdminTopBar title="System Settings" />
        <button disabled className="px-4 py-2 bg-gold-600/50 text-gold-100 rounded-lg text-sm font-medium cursor-not-allowed border border-gold-500/30 opacity-70">
          Edit Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navy-800/80 border border-navy-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-navy-700 pb-2">Academy Info</h3>
          <div className="flex flex-col">
            <SettingRow label="Academy Name" value={data.name} />
            <SettingRow label="Short Name" value={data.short_name} />
            <SettingRow label="Tagline" value={data.tagline} />
          </div>
        </div>

        <div className="bg-navy-800/80 border border-navy-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-navy-700 pb-2">Contact Info</h3>
          <div className="flex flex-col">
            <SettingRow label="Email" value={data.email} />
            <SettingRow label="Phone" value={data.phone} />
            <SettingRow label="WhatsApp" value={data.whatsapp} />
            <SettingRow label="Address" value={data.address} />
            <SettingRow label="Business Hours" value={data.business_hours} />
          </div>
        </div>

        <div className="bg-navy-800/80 border border-navy-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-navy-700 pb-2">Bank Details</h3>
          <div className="flex flex-col">
            <SettingRow label="Bank Name" value={data.bank_name} />
            <SettingRow label="Account Name" value={data.bank_account_name} />
            <SettingRow label="Account Number" value={data.bank_account_number} />
          </div>
        </div>

        <div className="bg-navy-800/80 border border-navy-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-navy-700 pb-2">Social Media</h3>
          <div className="flex flex-col">
            <SettingRow label="Facebook" value={data.facebook_url} />
            <SettingRow label="Instagram" value={data.instagram_url} />
            <SettingRow label="Twitter" value={data.twitter_url} />
            <SettingRow label="YouTube" value={data.youtube_url} />
            <SettingRow label="TikTok" value={data.tiktok_url} />
          </div>
        </div>

        <div className="bg-navy-800/80 border border-navy-700/50 rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-navy-700 pb-2">SEO configuration</h3>
          <div className="flex flex-col">
            <SettingRow label="Default Title" value={data.default_seo_title} />
            <SettingRow label="Default Description" value={data.default_seo_description} />
          </div>
        </div>
      </div>
    </div>
  );
}
