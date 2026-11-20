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
        .select('*')
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
      const items = (data as unknown as WebsiteContent[]) || [];
      return items.map((item) => {
        if (item.content && item.content.length > 50000) {
          item.content = item.content.replace(/data:image\/[a-zA-Z+]+;base64,[A-Za-z0-9+/=]{10000,}/g, '/images/image.png');
        }
        return item;
      });
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
// Courses & Base64 Payload Sanitizers
// Prevents 2MB+ unstable_cache and 20MB+ ISR HTML blowups
// ==========================================

function sanitizeCourse<T extends Partial<CourseWithRelations> | null>(course: T): T {
  if (!course) return course;

  // Sanitize oversized base64 image_url
  if (course.image_url && course.image_url.startsWith('data:image') && course.image_url.length > 50000) {
    const instSlug = course.instrument?.slug || '';
    if (instSlug.includes('brass') || instSlug.includes('trumpet') || instSlug.includes('horn')) {
      course.image_url = '/images/programs-brass-v2.jpg';
    } else if (instSlug.includes('keyboard') || instSlug.includes('piano')) {
      course.image_url = '/images/programs-keyboards-v2.jpg';
    } else {
      course.image_url = '/images/image.png';
    }
  }

  const sanitizeText = (str?: string | null): string | null | undefined => {
    if (!str || typeof str !== 'string') return str;
    if (str.length < 50000 && !str.includes('data:image/')) return str;
    return str.replace(/data:image\/[a-zA-Z+]+;base64,[A-Za-z0-9+/=]{10000,}/g, '/images/image.png');
  };

  if (course.description) course.description = sanitizeText(course.description);
  if (course.detailed_content) course.detailed_content = sanitizeText(course.detailed_content);
  if (course.what_you_learn) course.what_you_learn = sanitizeText(course.what_you_learn);
  if (course.who_can_join) course.who_can_join = sanitizeText(course.who_can_join);

  return course;
}

function sanitizeCourses(courses: CourseWithRelations[]): CourseWithRelations[] {
  return courses.map((c) => sanitizeCourse(c));
}

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
      return sanitizeCourses((data as unknown as CourseWithRelations[]) || []);
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
      return sanitizeCourses((data as unknown as CourseWithRelations[]) || []);
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
        const cleanSlug = slug.trim();
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanSlug);

        // 1. Primary query by slug with full relations
        let primaryQuery = supabase
          .from('courses')
          .select(`
            *,
            instrument:instruments(id, name, slug),
            instructor:instructors(id, first_name, last_name, image_url, bio)
          `);

        if (isUuid) {
          primaryQuery = primaryQuery.or(`slug.eq.${cleanSlug},id.eq.${cleanSlug}`);
        } else {
          primaryQuery = primaryQuery.eq('slug', cleanSlug);
        }

        const { data, error } = await primaryQuery.maybeSingle();

        if (data && !error) {
          return sanitizeCourse(data as unknown as CourseWithRelations);
        }

        // 2. Resilient fallback without instructor join
        let fallbackQuery = supabase
          .from('courses')
          .select(`
            *,
            instrument:instruments(id, name, slug)
          `);

        if (isUuid) {
          fallbackQuery = fallbackQuery.or(`slug.eq.${cleanSlug},id.eq.${cleanSlug}`);
        } else {
          fallbackQuery = fallbackQuery.eq('slug', cleanSlug);
        }

        const { data: fallbackData } = await fallbackQuery.maybeSingle();
        if (fallbackData) {
          return sanitizeCourse(fallbackData as unknown as CourseWithRelations);
        }

        // 3. Case-insensitive fallback
        const { data: ilikeData } = await supabase
          .from('courses')
          .select(`
            *,
            instrument:instruments(id, name, slug)
          `)
          .ilike('slug', cleanSlug)
          .maybeSingle();

        return sanitizeCourse(ilikeData as unknown as CourseWithRelations | null);
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
            *,
            instrument:instruments(id, name, slug)
          `)
          .eq('instrument_id', instrumentId)
          .order('sort_order', { ascending: true });
        return sanitizeCourses((data as unknown as CourseWithRelations[]) || []);
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
          .maybeSingle();

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
        .select('id, first_name, last_name, bio, image_url, is_active')
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
