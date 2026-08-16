export interface EventActivityPhoto {
  id: string;
  url: string;
  caption: string;
}

export interface PerformanceGalleryPhoto {
  id: string;
  title: string;
  category: 'wedding' | 'church' | 'concert' | 'corporate' | 'private_event' | 'other';
  image_url: string;
  caption: string;
}

export function parseEventActivityPhotos(detailedContent: string | null): {
  cleanContent: string;
  photos: EventActivityPhoto[];
} {
  if (!detailedContent) return { cleanContent: '', photos: [] };

  const match = detailedContent.match(/<!--EVENT_ACTIVITY_PHOTOS:([\s\S]*?)-->/);
  if (!match) {
    return { cleanContent: detailedContent, photos: [] };
  }

  const cleanContent = detailedContent.replace(/<!--EVENT_ACTIVITY_PHOTOS:([\s\S]*?)-->/, '').trim();
  try {
    const parsed = JSON.parse(match[1]);
    const photos: EventActivityPhoto[] = Array.isArray(parsed)
      ? parsed.map((p: any, i: number) => ({
          id: p.id || `photo-${i}-${Date.now()}`,
          url: p.url || (typeof p === 'string' ? p : ''),
          caption: p.caption || '',
        }))
      : [];
    return { cleanContent, photos };
  } catch {
    return { cleanContent: detailedContent, photos: [] };
  }
}

export function formatEventDetailedContent(text: string, photos: EventActivityPhoto[]): string {
  const cleanText = text.replace(/<!--EVENT_ACTIVITY_PHOTOS:([\s\S]*?)-->/, '').trim();
  if (!photos || photos.length === 0) return cleanText;

  const validPhotos = photos.filter((p) => p.url && p.url.trim());
  const serialized = JSON.stringify(validPhotos);
  return `${cleanText}\n\n<!--EVENT_ACTIVITY_PHOTOS:${serialized}-->`;
}
