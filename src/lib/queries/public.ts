import 'server-only';
import { createClient } from '@/lib/supabase/server';
import type {
  CourseWithRelations,
  Event,
  Instrument,
  Instructor,
  Venue,
  WebsiteSettings,
  WebsiteContent,
} from '@/types/database.types';

// ==========================================
// Website Settings
// ==========================================

export async function getWebsiteSettings(): Promise<WebsiteSettings | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('website_settings')
    .select('*')
    .single();
  return data as WebsiteSettings | null;
}

export async function getWebsiteContent(sectionKey: string): Promise<WebsiteContent | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('website_content')
    .select('*')
    .eq('section_key', sectionKey)
    .eq('is_active', true)
    .single();
  return data as WebsiteContent | null;
}

export async function getAllWebsiteContent(): Promise<WebsiteContent[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('website_content')
    .select('*')
    .eq('is_active', true);
  return (data as WebsiteContent[]) || [];
}

// ==========================================
// Instruments
// ==========================================

export async function getActiveInstruments(): Promise<Instrument[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('instruments')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return (data as Instrument[]) || [];
}

// ==========================================
// Courses
// ==========================================

export async function getPublishedCourses(): Promise<CourseWithRelations[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('courses')
    .select(`
      *,
      instrument:instruments(*)
    `)
    .eq('status', 'published')
    .order('sort_order', { ascending: true });
  return (data as unknown as CourseWithRelations[]) || [];
}

export async function getFeaturedCourses(): Promise<CourseWithRelations[]> {
  const supabase = await createClient();
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
      instrument:instruments(*)
    `)
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .limit(6);
  return (data as unknown as CourseWithRelations[]) || [];
}

export async function getCourseBySlug(slug: string): Promise<CourseWithRelations | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('courses')
    .select(`
      *,
      instrument:instruments(*),
      instructor:instructors(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  return data as unknown as CourseWithRelations | null;
}

export async function getSiblingCoursesByInstrument(instrumentId?: string | null): Promise<CourseWithRelations[]> {
  if (!instrumentId) return [];
  const supabase = await createClient();
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
      instrument:instruments(*)
    `)
    .eq('instrument_id', instrumentId)
    .eq('status', 'published')
    .order('sort_order', { ascending: true });
  return (data as unknown as CourseWithRelations[]) || [];
}

// ==========================================
// Events
// ==========================================

export async function getPublishedEvents(): Promise<Event[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('events')
    .select('id, title, slug, description, date, start_time, end_time, venue_name, venue_address, banner_url, status, seo_title, seo_description')
    .eq('status', 'published')
    .order('date', { ascending: true });
  return (data as unknown as Event[]) || [];
}

export async function getUpcomingEvents(limit: number = 3): Promise<Event[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('events')
    .select('id, title, slug, description, date, start_time, end_time, venue_name, venue_address, banner_url, status')
    .eq('status', 'published')
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(limit);
  return (data as unknown as Event[]) || [];
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  return data as Event | null;
}

// ==========================================
// Instructors
// ==========================================

export async function getActiveInstructors(): Promise<Instructor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('instructors')
    .select('*')
    .eq('is_active', true)
    .order('first_name', { ascending: true });
  return (data as Instructor[]) || [];
}

// ==========================================
// Venues
// ==========================================

export async function getActiveVenues(): Promise<Venue[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('venues')
    .select('*')
    .eq('is_active', true);
  return (data as Venue[]) || [];
}

export async function getDefaultVenue(): Promise<Venue | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('venues')
    .select('*')
    .eq('is_default', true)
    .single();
  return data as Venue | null;
}

// ==========================================
// Sitemap Queries
// ==========================================

export async function getAllCourseEntriesForSitemap(): Promise<{ slug: string; updated_at?: string }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('courses')
    .select('slug, updated_at')
    .eq('status', 'published');
  return (data as { slug: string; updated_at?: string }[]) || [];
}

export async function getAllEventEntriesForSitemap(): Promise<{ slug: string; updated_at?: string }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('events')
    .select('slug, updated_at')
    .eq('status', 'published');
  return (data as { slug: string; updated_at?: string }[]) || [];
}

export async function getAllCourseSlugs(): Promise<string[]> {
  const entries = await getAllCourseEntriesForSitemap();
  return entries.map(c => c.slug);
}

export async function getAllEventSlugs(): Promise<string[]> {
  const entries = await getAllEventEntriesForSitemap();
  return entries.map(e => e.slug);
}
