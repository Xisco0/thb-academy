'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { compressImageFile } from '@/lib/image-utils';
import { registerStudentAndEnroll } from '@/lib/actions/registration-actions';
import {
  CheckCircle2,
  AlertCircle,
  Building2,
  Music,
  ArrowRight,
  ArrowLeft,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import { LevelBadge } from '@/components/ui/level-badge';

interface CourseOption {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  instrument?: { name: string };
  level: string;
  duration?: string;
}

export function RegisterClient({ courses }: { courses: CourseOption[] }) {
  const searchParams = useSearchParams();
  const programSlug = searchParams.get('program') || searchParams.get('course');
  const levelParam = searchParams.get('level');

  const matchedCourse = courses.find((c) => {
    const slugMatch = c.slug.toLowerCase() === (programSlug || '').toLowerCase() || c.id === programSlug;
    if (levelParam) {
      return slugMatch && c.level.toLowerCase() === levelParam.toLowerCase();
    }
    return slugMatch;
  }) || courses.find((c) => c.slug.toLowerCase() === (programSlug || '').toLowerCase());

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    gender: 'male',
    dateOfBirth: '',
    address: '',
    state: 'Lagos',
    country: 'Nigeria',
    password: '',
    confirmPassword: '',
    courseId: matchedCourse?.id || courses[0]?.id || '',
    transactionReference: '',
  });

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const selectedCourse = courses.find((c) => c.id === form.courseId) || courses[0];

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    setError(null);
  }

  const selectedLevelFormatted = (selectedCourse?.level || 'beginner')
    .replace('_', ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const whatsappMessage = encodeURIComponent(
    `Hello THB Academy,\n\nI would like to enquire about registering for the following programme:\n\nProgramme: ${selectedCourse?.name || 'Music Course'}\nLevel: ${selectedLevelFormatted}\n\nPlease provide me with more information about the programme, schedule and registration process.\n\nThank you.`
  );

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (/[a-zA-Z]/.test(form.phone) || form.phone.replace(/\D/g, '').length !== 11) {
      errors.phone = 'Phone number must be 11 digits (numbers only)';
    }

    if (!form.password) {
      errors.password = 'Password is required';
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors before proceeding.');
      return;
    }

    setStep(2);
  };

  const handleProofChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, JPEG)');
      return;
    }

    try {
      setProofFile(file);
      const compressedDataUrl = await compressImageFile(file, 1200, 1200, 0.8);
      setProofPreview(compressedDataUrl);
      setError(null);
    } catch {
      setError('Failed to process image file. Please try another image.');
    }
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await registerStudentAndEnroll({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        gender: form.gender,
        date_of_birth: form.dateOfBirth,
        address: form.address,
        password: form.password,
        course_id: form.courseId,
        payment_proof_url: proofPreview || undefined,
        transaction_reference: form.transactionReference || undefined,
      });

      setIsLoading(false);

      if (!res.success) {
        setError(res.error || 'Registration failed.');
      } else {
        setStep(3);
      }
    } catch (err: unknown) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : 'An error occurred during submission.');
    }
  };

  if (step === 3) {
    return (
      <div className="bg-navy-900/90 border border-brand-500/40 rounded-2xl p-8 backdrop-blur-xl shadow-2xl space-y-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-glow">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-heading font-bold text-white">Registration Submitted!</h2>
          <p className="text-navy-300 text-sm leading-relaxed">
            Thank you <strong className="text-white">{form.firstName}</strong> for joining Triumphant Harmony Brass Music Academy.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 text-left space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-navy-800">
            <span className="text-navy-400">Programme</span>
            <span className="text-white font-semibold">{selectedCourse?.name}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-navy-800">
            <span className="text-navy-400">Level</span>
            <span className="text-brand-400 font-bold">{selectedLevelFormatted}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-navy-400">Account Email</span>
            <span className="text-white font-medium">{form.email}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://api.whatsapp.com/send?phone=2348077566475&text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all shadow-glow text-sm flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Connect on WhatsApp</span>
          </a>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 bg-navy-950 border border-navy-700 text-navy-200 hover:text-white rounded-xl transition-colors text-sm font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy-900/90 border border-navy-700/60 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
          Programme Selection & Registration
        </h1>
        <p className="text-navy-300 text-xs sm:text-sm">
          Select your music programme and connect directly with THB Academy on WhatsApp
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: PROGRAMME SELECTION & DIRECT WHATSAPP ACTION */}
      {step === 1 && (
        <form onSubmit={handleNextToPayment} className="space-y-4">
          {/* Programme & Level Selection */}
          <div className="p-4 bg-navy-950/80 border border-navy-700/80 rounded-xl space-y-3">
            <label className="block text-xs font-bold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
              <Music className="w-4 h-4 text-brand-400" />
              <span>Select Programme *</span>
            </label>
            <select
              value={form.courseId}
              onChange={(e) => updateField('courseId', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-sm text-white focus:border-brand-500 focus:outline-none"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.level.replace('_', ' ').toUpperCase()})
                </option>
              ))}
            </select>
            {fieldErrors.courseId && <p className="text-xs text-red-400">{fieldErrors.courseId}</p>}

            {selectedCourse && (
              <div className="pt-2.5 border-t border-navy-800/80 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-navy-400 font-medium">Level:</span>
                  <LevelBadge level={selectedCourse.level} />
                </div>
              </div>
            )}
          </div>

          {/* Primary WhatsApp Enquiry CTA Banner */}
          <div className="p-5 bg-gradient-to-r from-emerald-950/80 to-navy-950 border border-emerald-500/40 rounded-xl space-y-3 text-center">
            <p className="text-xs text-emerald-300 font-medium">
              Have questions or want to register directly with our admissions coordinator?
            </p>
            <a
              href={`https://api.whatsapp.com/send?phone=2348077566475&text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold rounded-xl transition-all shadow-glow text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>PROCEED TO WHATSAPP</span>
            </a>
          </div>

          <div className="relative py-2 flex items-center justify-center">
            <div className="border-t border-navy-800 w-full" />
            <span className="bg-navy-900 px-3 text-[11px] text-navy-400 uppercase tracking-widest font-bold absolute">
              OR FILL STUDENT DETAILS
            </span>
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name *"
              placeholder="Taiwo"
              value={form.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              error={fieldErrors.firstName}
              required
              className="bg-navy-950/80 border-navy-700 text-white"
            />
            <Input
              label="Surname / Last Name *"
              placeholder="Toyinbo"
              value={form.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              error={fieldErrors.lastName}
              required
              className="bg-navy-950/80 border-navy-700 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address *"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              error={fieldErrors.email}
              required
              className="bg-navy-950/80 border-navy-700 text-white"
            />
            <Input
              label="Phone Number (11 digits) *"
              placeholder="08144326123"
              maxLength={11}
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 11))}
              error={fieldErrors.phone}
              required
              className="bg-navy-950/80 border-navy-700 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password *"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              error={fieldErrors.password}
              required
              className="bg-navy-950/80 border-navy-700 text-white"
            />
            <Input
              label="Confirm Password *"
              type="password"
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              error={fieldErrors.confirmPassword}
              required
              className="bg-navy-950/80 border-navy-700 text-white"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-400 text-white font-bold h-12 rounded-xl transition-all shadow-glow text-sm mt-4 flex items-center justify-center gap-2"
          >
            <span>Continue Student Registration</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      )}

      {/* STEP 2: REGISTRATION SUBMISSION */}
      {step === 2 && (
        <form onSubmit={handleSubmitRegistration} className="space-y-4">
          <div className="p-4 bg-navy-950/80 border border-navy-700 rounded-xl space-y-2 text-xs">
            <h3 className="font-bold text-white text-sm border-b border-navy-800 pb-2">Student & Programme Summary</h3>
            <div className="flex justify-between py-1">
              <span className="text-navy-400">Student:</span>
              <span className="text-white font-semibold">{form.firstName} {form.lastName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-navy-400">Programme:</span>
              <span className="text-white font-semibold">{selectedCourse?.name}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-navy-400">Level:</span>
              <span className="text-brand-400 font-bold">{selectedLevelFormatted}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-navy-800">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 bg-navy-950 border border-navy-700 text-navy-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-brand-500 hover:bg-brand-400 text-white font-bold h-11 rounded-xl transition-all shadow-glow text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Registration...
                </>
              ) : (
                'Submit Student Profile'
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
