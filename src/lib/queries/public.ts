import 'server-only';
import { createPublicClient } from '@/lib/supabase/public';
import { unstable_cache } from 'next/cache';
import { parseEventActivityPhotos, formatEventDetailedContent } from '@/lib/event-gallery-utils';
import type {
  CourseWithRelations,
  Event,
  Instrument,
  Instructor,
  Venue,
  WebsiteSettings,
  WebsiteContent,
} from '@/types/database.types';

// Cache revalidation window for public content: 1 hour (3600 seconds)
const CACHE_REVALIDATE_SECONDS = 3600;

// ==========================================
// Website Settings
// ==========================================

export const getWebsiteSettings = unstable_cache(
  async (): Promise<WebsiteSettings | null> => {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from('website_settings')
        .select('id, site_name, tagline, contact_email, contact_phone, address, whatsapp_number, hero_title, hero_subtitle, logo_url')
        .single();
      return data as unknown as WebsiteSettings | null;
    } catch (err) {
      console.error('getWebsiteSettings error:', err);
      return null;
    }
  },
  ['website-settings'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ['website-settings'] }
);

export const getWebsiteContent = (sectionKey: string): Promise<WebsiteContent | null> =>
  unstable_cache(
    async (): Promise<WebsiteContent | null> => {
      try {
        const supabase = createPublicClient();
        const { data } = await supabase
          .from('website_content')
          .select('id, section_key, title, subtitle, body_content, metadata, is_active')
          .eq('section_key', sectionKey)
          .eq('is_active', true)
          .single();
        return data as unknown as WebsiteContent | null;
      } catch (err) {
        console.error(`getWebsiteContent(${sectionKey}) error:`, err);
        return null;
      }
    },
    [`website-content-${sectionKey}`],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [`website-content-${sectionKey}`] }
  )();

export const getAllWebsiteContent = unstable_cache(
  async (): Promise<WebsiteContent[]> => {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from('website_content')
        .select('id, section_key, title, subtitle, body_content, is_active')
        .eq('is_active', true);
      return (data as unknown as WebsiteContent[]) || [];
    } catch (err) {
      console.error('getAllWebsiteContent error:', err);
      return [];
    }
  },
  ['all-website-content'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ['website-content'] }
);

// ==========================================
// Instruments
// ==========================================

export const getActiveInstruments = unstable_cache(
  async (): Promise<Instrument[]> => {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from('instruments')
        .select('id, name, slug, description, category, sort_order, is_active')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      return (data as unknown as Instrument[]) || [];
    } catch (err) {
      console.error('getActiveInstruments error:', err);
      return [];
    }
  },
  ['active-instruments'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ['instruments'] }
);

// ==========================================
// Courses
// ==========================================

export const getPublishedCourses = unstable_cache(
  async (): Promise<CourseWithRelations[]> => {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from('courses')
        .select(`
          id,
          name,
          slug,
          description,
          image_url,
          level,
          price,
          currency,
          status,
          is_featured,
          sort_order,
          instrument_id,
          seo_title,
          seo_description,
          instrument:instruments(id, name, slug)
        `)
        .eq('status', 'published')
        .order('sort_order', { ascending: true });
      return (data as unknown as CourseWithRelations[]) || [];
    } catch (err) {
      console.error('getPublishedCourses error:', err);
      return [];
    }
  },
  ['published-courses'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ['courses'] }
);

export const getFeaturedCourses = unstable_cache(
  async (): Promise<CourseWithRelations[]> => {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from('courses')
        .select(`
          id,
          name,
          slug,
          description,
          image_url,
          level,
          price,
          currency,
          status,
          is_featured,
          sort_order,
          instrument_id,
          instrument:instruments(id, name, slug)
        `)
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(6);
      return (data as unknown as CourseWithRelations[]) || [];
    } catch (err) {
      console.error('getFeaturedCourses error:', err);
      return [];
    }
  },
  ['featured-courses'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ['courses'] }
);

export const getCourseBySlug = (slug: string): Promise<CourseWithRelations | null> =>
  unstable_cache(
    async (): Promise<CourseWithRelations | null> => {
      try {
        const supabase = createPublicClient();
        const { data } = await supabase
          .from('courses')
          .select(`
            id,
            name,
            slug,
            description,
            image_url,
            level,
            price,
            currency,
            duration,
            status,
            is_featured,
            instrument_id,
            instructor_id,
            seo_title,
            seo_description,
            instrument:instruments(id, name, slug),
            instructor:instructors(id, first_name, last_name, photo_url, bio)
          `)
          .eq('slug', slug)
          .eq('status', 'published')
          .single();
        return data as unknown as CourseWithRelations | null;
      } catch (err) {
        console.error(`getCourseBySlug(${slug}) error:`, err);
        return null;
      }
    },
    [`course-by-slug-${slug}`],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [`course-${slug}`, 'courses'] }
  )();

export const getSiblingCoursesByInstrument = (instrumentId?: string | null): Promise<CourseWithRelations[]> => {
  if (!instrumentId) return Promise.resolve([]);
  return unstable_cache(
    async (): Promise<CourseWithRelations[]> => {
      try {
        const supabase = createPublicClient();
        const { data } = await supabase
          .from('courses')
          .select(`
            id,
            name,
            slug,
            description,
            image_url,
            level,
            price,
            currency,
            status,
            instrument_id,
            instrument:instruments(id, name, slug)
          `)
          .eq('instrument_id', instrumentId)
          .eq('status', 'published')
          .order('sort_order', { ascending: true });
        return (data as unknown as CourseWithRelations[]) || [];
      } catch (err) {
        console.error('getSiblingCoursesByInstrument error:', err);
        return [];
      }
    },
    [`sibling-courses-${instrumentId}`],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ['courses'] }
  )();
};

// ==========================================
// Events
// ==========================================

export const getPublishedEvents = unstable_cache(
  async (): Promise<Event[]> => {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from('events')
        .select('id, title, slug, description, date, start_time, end_time, venue_name, venue_address, banner_url, status, seo_title, seo_description')
        .eq('status', 'published')
        .order('date', { ascending: true });
      return (data as unknown as Event[]) || [];
    } catch (err) {
      console.error('getPublishedEvents error:', err);
      return [];
    }
  },
  ['published-events'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ['events'] }
);

export const getUpcomingEvents = (limit: number = 3): Promise<Event[]> =>
  unstable_cache(
    async (): Promise<Event[]> => {
      try {
        const supabase = createPublicClient();
        const today = new Date().toISOString().split('T')[0];
        const { data } = await supabase
          .from('events')
          .select('id, title, slug, description, date, start_time, end_time, venue_name, venue_address, banner_url, status')
          .eq('status', 'published')
          .gte('date', today)
          .order('date', { ascending: true })
          .limit(limit);
        return (data as unknown as Event[]) || [];
      } catch (err) {
        console.error('getUpcomingEvents error:', err);
        return [];
      }
    },
    [`upcoming-events-${limit}`],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ['events'] }
  )();

export const getEventBySlug = (slug: string): Promise<Event | null> =>
  unstable_cache(
    async (): Promise<Event | null> => {
      try {
        const supabase = createPublicClient();
        const { data } = await supabase
          .from('events')
          .select('id, title, slug, description, detailed_content, date, start_time, end_time, venue_id, venue_name, venue_address, banner_url, status, seo_title, seo_description')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (!data) return null;

        // Sanitize oversized base64 images embedded in detailed_content comments to prevent 2MB+ cache/RSC payloads
        if (data.detailed_content && data.detailed_content.length > 300000) {
          const { cleanContent, photos } = parseEventActivityPhotos(data.detailed_content);
          const lightPhotos = photos.map((p) => ({
            ...p,
            url: p.url && p.url.startsWith('data:image') && p.url.length > 50000 ? '/images/image.png' : p.url,
          }));
          data.detailed_content = formatEventDetailedContent(cleanContent, lightPhotos);
        }

        return data as unknown as Event | null;
      } catch (err) {
        console.error(`getEventBySlug(${slug}) error:`, err);
        return null;
      }
    },
    [`event-by-slug-${slug}`],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [`event-${slug}`, 'events'] }
  )();

// ==========================================
// Instructors
// ==========================================

export const getActiveInstructors = unstable_cache(
  async (): Promise<Instructor[]> => {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from('instructors')
        .select('id, first_name, last_name, bio, photo_url, is_active')
        .eq('is_active', true)
        .order('first_name', { ascending: true });
      return (data as unknown as Instructor[]) || [];
    } catch (err) {
      console.error('getActiveInstructors error:', err);
      return [];
    }
  },
  ['active-instructors'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ['instructors'] }
);

// ==========================================
// Venues
// ==========================================

export const getActiveVenues = unstable_cache(
  async (): Promise<Venue[]> => {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from('venues')
        .select('id, name, address, capacity, is_default, is_active')
        .eq('is_active', true);
      return (data as unknown as Venue[]) || [];
    } catch (err) {
      console.error('getActiveVenues error:', err);
      return [];
    }
  },
  ['active-venues'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ['venues'] }
);

export const getDefaultVenue = unstable_cache(
  async (): Promise<Venue | null> => {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from('venues')
        .select('id, name, address, capacity, is_default, is_active')
        .eq('is_default', true)
        .single();
      return data as unknown as Venue | null;
    } catch (err) {
      console.error('getDefaultVenue error:', err);
      return null;
    }
  },
  ['default-venue'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ['venues'] }
);

// ==========================================
// Sitemap Queries
// ==========================================

export const getAllCourseEntriesForSitemap = unstable_cache(
  async (): Promise<{ slug: string; updated_at?: string }[]> => {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from('courses')
        .select('slug, updated_at')
        .eq('status', 'published');
      return (data as { slug: string; updated_at?: string }[]) || [];
    } catch (err) {
      console.error('getAllCourseEntriesForSitemap error:', err);
      return [];
    }
  },
  ['sitemap-course-entries'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ['courses', 'sitemap'] }
);

export const getAllEventEntriesForSitemap = unstable_cache(
  async (): Promise<{ slug: string; updated_at?: string }[]> => {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from('events')
        .select('slug, updated_at')
        .eq('status', 'published');
      return (data as { slug: string; updated_at?: string }[]) || [];
    } catch (err) {
      console.error('getAllEventEntriesForSitemap error:', err);
      return [];
    }
  },
  ['sitemap-event-entries'],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ['events', 'sitemap'] }
);

export async function getAllCourseSlugs(): Promise<string[]> {
  const entries = await getAllCourseEntriesForSitemap();
  return entries.map(c => c.slug);
}

export async function getAllEventSlugs(): Promise<string[]> {
  const entries = await getAllEventEntriesForSitemap();
  return entries.map(e => e.slug);
}
