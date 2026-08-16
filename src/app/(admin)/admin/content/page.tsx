import { getAllWebsiteContentAdmin } from '@/lib/queries/admin';
import { AdminTopBar } from '@/components/admin/top-bar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Metadata } from 'next';
import { PerformanceGalleryManager } from './performance-gallery-client';
import { PerformanceGalleryPhoto } from '@/lib/event-gallery-utils';

export const metadata: Metadata = {
  title: 'Website CMS | Admin',
};

export default async function ContentPage() {
  const contentSections = (await getAllWebsiteContentAdmin()) as Record<string, any>[];

  const gallerySection = contentSections?.find((s) => s.section_key === 'performance_gallery');
  const initialPhotos: PerformanceGalleryPhoto[] = gallerySection?.metadata?.photos || [];

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <AdminTopBar title="Website CMS & Media Galleries" />

      {/* Stage Performance Gallery Manager */}
      <PerformanceGalleryManager initialPhotos={initialPhotos} />

      {/* Website Sections List */}
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-bold text-white">General Website Content Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentSections?.map((section) => (
            <div key={section.id} className="bg-navy-800/80 border border-navy-700/50 rounded-xl p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                  <p className="text-sm text-navy-400 font-mono mt-1">{section.section_key}</p>
                </div>
                <Badge variant="default" className={section.is_active ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'}>
                  {section.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {section.subtitle && <p className="text-navy-300 text-sm mb-6 flex-1">{section.subtitle}</p>}
              <div className="mt-auto pt-4 border-t border-navy-700/50">
                <Link href={`/admin/content/${section.id}/edit`} className="text-gold-500 hover:text-gold-400 text-sm font-medium transition-colors">
                  Edit Section &rarr;
                </Link>
              </div>
            </div>
          ))}
          {!contentSections?.length && (
            <div className="col-span-full py-12 text-center text-navy-300 bg-navy-800/30 rounded-xl border border-navy-700/30">
              No general content sections found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
