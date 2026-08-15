import { getPublishedCourses } from '@/lib/queries/public';
import { RegisterClient } from './register-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Registration & Program Enrollment',
  description:
    'Enroll in professional music training programs at Triumphant Harmony Brass Music Academy. Register for keyboard, trumpet, guitar, saxophone, drums, voice, and violin lessons.',
};

export default async function RegisterPage() {
  const courses = await getPublishedCourses();

  const formattedCourses = courses.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    price: Number(c.price) || 0,
    currency: c.currency || 'NGN',
    level: c.level || 'beginner',
    instrument: c.instrument ? { name: c.instrument.name } : undefined,
  }));

  return <RegisterClient courses={formattedCourses} />;
}
