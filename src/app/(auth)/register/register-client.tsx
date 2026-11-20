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
      <div className="bg-white border border-[#E7E5DF] rounded-3xl p-8 shadow-[0_12px_36px_-6px_rgba(20,37,68,0.08)] space-y-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#23845B]/15 text-[#23845B] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-heading font-bold text-[#142544]">Registration Submitted!</h2>
          <p className="text-[#647084] text-xs sm:text-sm leading-relaxed">
            Thank you <strong className="text-[#142544]">{form.firstName}</strong> for joining Triumphant Harmony Brass Music Academy.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#E7E5DF] text-left space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-[#E7E5DF]">
            <span className="text-[#647084]">Program</span>
            <span className="text-[#142544] font-semibold">{selectedCourse?.name}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#E7E5DF]">
            <span className="text-[#647084]">Skill Level</span>
            <span className="text-[#C58A19] font-bold">{selectedLevelFormatted}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[#647084]">Account Email</span>
            <span className="text-[#142544] font-medium">{form.email}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://api.whatsapp.com/send?phone=2347038595356&text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-full transition-all shadow-xs text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Connect on WhatsApp</span>
          </a>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 bg-[#142544] hover:bg-[#243653] text-white rounded-full transition-colors text-xs sm:text-sm font-semibold"
          >
            Sign In to Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E7E5DF] rounded-3xl p-7 sm:p-9 shadow-[0_12px_36px_-6px_rgba(20,37,68,0.08)] space-y-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#142544]">
          Program Enrollment
        </h1>
        <p className="text-[#647084] text-xs sm:text-sm">
          Select your music program track and register your student profile
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#C74646]/10 border border-[#C74646]/25 flex items-start gap-3 text-[#C74646] text-xs sm:text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: PROGRAM SELECTION & DIRECT WHATSAPP ACTION */}
      {step === 1 && (
        <form onSubmit={handleNextToPayment} className="space-y-4">
          {/* Program & Level Selection */}
          <div className="p-4 bg-[#F8F7F4] border border-[#E7E5DF] rounded-2xl space-y-3">
            <label className="block text-xs font-bold text-[#142544] uppercase tracking-wider flex items-center gap-1.5">
              <Music className="w-4 h-4 text-[#C58A19]" />
              <span>Select Program Track *</span>
            </label>
            <select
              value={form.courseId}
              onChange={(e) => updateField('courseId', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E7E5DF] rounded-xl text-sm text-[#17243A] focus:border-[#C58A19] focus:outline-none"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.level.replace('_', ' ').toUpperCase()})
                </option>
              ))}
            </select>
            {fieldErrors.courseId && <p className="text-xs text-[#C74646]">{fieldErrors.courseId}</p>}

            {selectedCourse && (
              <div className="pt-2 border-t border-[#E7E5DF] flex items-center justify-between gap-2 text-xs">
                <span className="text-[#647084] font-medium">Selected Skill Level:</span>
                <LevelBadge level={selectedCourse.level} />
              </div>
            )}
          </div>

          {/* Quick WhatsApp Admissions Banner */}
          <div className="p-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl space-y-2 text-center">
            <p className="text-xs text-[#142544] font-medium">
              Want to speak with an admissions counselor first?
            </p>
            <a
              href={`https://api.whatsapp.com/send?phone=2347038595356&text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-full transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>

          <div className="relative py-2 flex items-center justify-center">
            <div className="border-t border-[#E7E5DF] w-full" />
            <span className="bg-white px-3 text-[10px] text-[#647084] uppercase tracking-widest font-bold absolute">
              OR FILL ONLINE FORM
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
            />
            <Input
              label="Last Name *"
              placeholder="Toyinbo"
              value={form.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              error={fieldErrors.lastName}
              required
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
            />
            <Input
              label="Phone Number (11 digits) *"
              placeholder="08144326123"
              maxLength={11}
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 11))}
              error={fieldErrors.phone}
              required
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
            />
            <Input
              label="Confirm Password *"
              type="password"
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              error={fieldErrors.confirmPassword}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#C58A19] hover:bg-[#b07b14] active:bg-[#9a680c] text-white font-bold h-12 rounded-full transition-all shadow-[0_2px_12px_rgba(197,138,25,0.25)] text-sm mt-4 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Review &amp; Complete Registration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* STEP 2: REGISTRATION SUBMISSION */}
      {step === 2 && (
        <form onSubmit={handleSubmitRegistration} className="space-y-4">
          <div className="p-5 bg-[#F8F7F4] border border-[#E7E5DF] rounded-2xl space-y-3 text-xs">
            <h3 className="font-heading font-bold text-[#142544] text-sm border-b border-[#E7E5DF] pb-2">
              Enrollment Summary
            </h3>
            <div className="flex justify-between py-1">
              <span className="text-[#647084]">Student:</span>
              <span className="text-[#142544] font-semibold">{form.firstName} {form.lastName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#647084]">Program:</span>
              <span className="text-[#142544] font-semibold">{selectedCourse?.name}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#647084]">Track Level:</span>
              <span className="text-[#C58A19] font-bold">{selectedLevelFormatted}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#647084]">Email:</span>
              <span className="text-[#142544] font-semibold">{form.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-[#E7E5DF]">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 bg-white border border-[#E7E5DF] text-[#142544] hover:bg-[#F8F7F4] rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#142544] hover:bg-[#243653] text-white font-semibold h-11 rounded-full transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Enrollment...</span>
                </>
              ) : (
                <span>Confirm &amp; Create Student Account</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
