'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCoursePrice } from '@/lib/utils';
import { compressImageFile } from '@/lib/image-utils';
import { registerStudentAndEnroll, checkEmailAvailabilityAction } from '@/lib/actions/registration-actions';
import {
  CheckCircle2,
  AlertCircle,
  Building2,
  Upload,
  FileCheck,
  Music,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
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

  async function handleEmailBlur() {
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return;
    const result = await checkEmailAvailabilityAction(form.email);
    if (!result.available && result.message) {
      setFieldErrors((prev) => ({ ...prev, email: result.message! }));
    }
  }

  function validateStep1(): boolean {
    const errors: Record<string, string> = {};

    if (!form.courseId) errors.courseId = 'Please select a program';
    if (form.firstName.trim().length < 2) errors.firstName = 'First name must be at least 2 characters';
    if (form.lastName.trim().length < 2) errors.lastName = 'Surname / Last name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Please enter a valid email address';
    if (/[a-zA-Z]/.test(form.phone) || form.phone.replace(/\D/g, '').length !== 11) {
      errors.phone = 'Phone number must be exactly 11 digits (numbers only, e.g. 08012345678)';
    }
    if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleNextToPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep1()) return;
    setError(null);
    setStep(2);
  }

  async function handleFileSelect(file: File) {
    try {
      setError(null);
      const compressedDataUrl = await compressImageFile(file, 1200, 1200, 0.75);
      setProofFile(file);
      setProofPreview(compressedDataUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to process selected payment proof file.');
    }
  }

  async function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!proofPreview) {
      setError('Please select and upload your payment proof image before submitting.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await registerStudentAndEnroll({
        first_name: form.firstName,
        last_name: form.lastName,
        middle_name: form.middleName,
        email: form.email,
        phone: form.phone,
        gender: form.gender,
        date_of_birth: form.dateOfBirth,
        address: form.address,
        state: form.state,
        country: form.country,
        password: form.password,
        course_id: form.courseId,
        payment_proof_url: proofPreview,
        transaction_reference: form.transactionReference,
      });

      setIsLoading(false);

      if (!res.success) {
        setError(res.error || 'Registration failed. Please review your details.');
      } else {
        setStep(3);
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'An unexpected error occurred during registration. Please try again.');
    }
  }

  // STEP 3: SUCCESS CONFIRMATION
  if (step === 3) {
    return (
      <div className="bg-navy-900/90 border border-navy-700/60 rounded-2xl p-6 sm:p-10 text-center space-y-6 backdrop-blur-xl shadow-2xl max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto text-green-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Enrollment Pending Review</span>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Registration & Payment Submitted!
          </h1>
          <p className="text-navy-300 text-sm leading-relaxed">
            Thank you <strong className="text-white">{form.firstName}</strong> for joining Triumphant Harmony Brass Music Academy.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 text-left space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-navy-800">
            <span className="text-navy-400">Program</span>
            <span className="text-white font-semibold">{selectedCourse?.name}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-navy-800">
            <span className="text-navy-400">Tuition Fee</span>
            <span className="text-brand-400 font-bold">{selectedCourse ? formatCoursePrice(selectedCourse.price, selectedCourse.currency) : ''}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-navy-800">
            <span className="text-navy-400">Payment Status</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
              PENDING REVIEW
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-navy-400">Account Email</span>
            <span className="text-white font-medium">{form.email}</span>
          </div>
        </div>

        <p className="text-xs text-navy-400 leading-relaxed">
          Our administrative team will verify your payment receipt. You will receive an email confirmation once approved.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl transition-all shadow-glow text-sm"
          >
            Sign In to Student Portal
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-navy-950 border border-navy-700 text-navy-200 hover:text-white rounded-xl transition-colors text-sm font-semibold"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy-900/90 border border-navy-700/60 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 max-w-xl mx-auto">
      {/* Header & Step Indicator */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
          {step === 1 ? 'Student Registration & Enrollment' : 'Payment Proof Submission'}
        </h1>
        <p className="text-navy-300 text-xs sm:text-sm">
          {step === 1
            ? 'Choose your music program and fill in your student details'
            : 'Make transfer to academy bank account and upload your payment proof'}
        </p>

        {/* Step indicator pills */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${step === 1 ? 'bg-brand-500 text-white' : 'bg-navy-800 text-navy-400'}`}>
            <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">1</span>
            <span>Student & Program</span>
          </div>
          <div className="w-4 h-[1px] bg-navy-700" />
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${step === 2 ? 'bg-brand-500 text-white' : 'bg-navy-800 text-navy-400'}`}>
            <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">2</span>
            <span>Payment & Proof</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: PROGRAM SELECTION & STUDENT INFORMATION */}
      {step === 1 && (
        <form onSubmit={handleNextToPayment} className="space-y-4">
          {/* Program Selection */}
          <div className="p-4 bg-navy-950/80 border border-navy-700/80 rounded-xl space-y-2">
            <label className="block text-xs font-bold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
              <Music className="w-4 h-4 text-brand-400" />
              <span>Select Programme to Enroll In *</span>
            </label>
            <select
              value={form.courseId}
              onChange={(e) => updateField('courseId', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-sm text-white focus:border-brand-500 focus:outline-none"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({formatCoursePrice(course.price, course.currency)})
                </option>
              ))}
            </select>
            {fieldErrors.courseId && <p className="text-xs text-red-400">{fieldErrors.courseId}</p>}

            {selectedCourse && (
              <div className="pt-2.5 border-t border-navy-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-navy-400 font-medium">Programme Level:</span>
                  <LevelBadge level={selectedCourse.level} />
                  <span className="text-navy-300 ml-1 font-medium">
                    Duration: <strong className="text-white">{selectedCourse.duration || '4 Weeks'}</strong>
                  </span>
                </div>
                <div>
                  <span className="text-navy-400 mr-1.5">Tuition Fee:</span>
                  <span className="text-brand-400 font-bold text-sm">
                    {formatCoursePrice(selectedCourse.price, selectedCourse.currency)}
                  </span>
                </div>
              </div>
            )}
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
              label="Other Name (Optional)"
              placeholder="Francis"
              value={form.middleName}
              onChange={(e) => updateField('middleName', e.target.value)}
              className="bg-navy-950/80 border-navy-700 text-white"
            />
            <Input
              label="Phone Number *"
              type="tel"
              maxLength={11}
              placeholder="08012345678 (11 digits)"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 11))}
              error={fieldErrors.phone}
              required
              className="bg-navy-950/80 border-navy-700 text-white"
            />
          </div>

          <Input
            label="Email Address *"
            type="email"
            placeholder="student@example.com"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            onBlur={handleEmailBlur}
            error={fieldErrors.email}
            required
            className="bg-navy-950/80 border-navy-700 text-white"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-200 mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => updateField('gender', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-navy-950/80 border border-navy-700 rounded-xl text-sm text-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <Input
              label="Date of Birth (Optional)"
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => updateField('dateOfBirth', e.target.value)}
              className="bg-navy-950/80 border-navy-700 text-white"
            />
          </div>

          <Input
            label="Home / Residential Address"
            placeholder="Ikeja, Lagos"
            value={form.address}
            onChange={(e) => updateField('address', e.target.value)}
            className="bg-navy-950/80 border-navy-700 text-white"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password *"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              error={fieldErrors.password}
              required
              className="bg-navy-950/80 border-navy-700 text-white"
            />
            <Input
              label="Confirm Password *"
              type="password"
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              error={fieldErrors.confirmPassword}
              required
              className="bg-navy-950/80 border-navy-700 text-white"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-400 text-white font-bold py-3 rounded-xl transition-all shadow-glow mt-2 flex items-center justify-center gap-2"
          >
            <span>Continue to Payment & Upload Proof</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <div className="text-center pt-3 border-t border-navy-800">
            <p className="text-xs text-navy-300">
              Already registered?{' '}
              <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
                Sign In to Student Portal
              </Link>
            </p>
          </div>
        </form>
      )}

      {/* STEP 2: BANK TRANSFER & PAYMENT PROOF UPLOAD */}
      {step === 2 && (
        <form onSubmit={handleFinalSubmit} className="space-y-5">
          {/* Bank Account Info Card */}
          <div className="p-4 sm:p-5 bg-gradient-to-br from-navy-950 to-navy-900 border border-brand-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-navy-800 pb-2">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-brand-400" />
                <span>Academy Bank Account Details</span>
              </span>
              <span className="text-xs text-navy-400">Bank Transfer</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-navy-400">Bank Name</p>
                <p className="text-white font-bold text-sm">First Bank of Nigeria</p>
              </div>
              <div>
                <p className="text-navy-400">Account Number</p>
                <p className="text-brand-300 font-mono font-bold text-base tracking-wider">2034567890</p>
              </div>
              <div>
                <p className="text-navy-400">Account Name</p>
                <p className="text-white font-semibold">Triumphant Harmony Brass</p>
              </div>
              <div>
                <p className="text-navy-400">Program Fee Due</p>
                <p className="text-brand-400 font-bold text-sm">
                  {selectedCourse ? formatCoursePrice(selectedCourse.price, selectedCourse.currency) : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Proof File Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-navy-200 flex items-center justify-between">
              <span>Upload Payment Proof (Receipt / Teller Photo) *</span>
              <span className="text-[10px] text-navy-400">JPG, PNG, PDF (Max 10MB)</span>
            </label>

            {proofPreview ? (
              <div className="p-4 bg-navy-950 border border-brand-500/40 rounded-xl space-y-3">
                <div className="flex items-center gap-4">
                  {proofFile?.type.startsWith('image/') || proofPreview.startsWith('data:image') ? (
                    <img src={proofPreview} alt="Proof Preview" className="w-16 h-16 object-cover rounded-lg border border-brand-500/30 shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-navy-900 border border-navy-700 rounded-lg flex items-center justify-center text-brand-400 shrink-0">
                      <FileCheck className="w-8 h-8" />
                    </div>
                  )}
                  <div className="grow overflow-hidden text-xs">
                    <p className="text-white font-semibold truncate">{proofFile?.name || 'Payment Proof Receipt'}</p>
                    <p className="text-green-400 text-[11px] font-medium flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Ready for submission</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setProofFile(null); setProofPreview(null); }}
                    className="px-2.5 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-red-500/20"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-navy-700 hover:border-brand-500/60 bg-navy-950/60 rounded-xl p-6 text-center space-y-2 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs text-navy-200 font-semibold">
                  Tap or click to select payment proof image from your device
                </p>
                <p className="text-[11px] text-navy-400">Supports iPhone, Android, Tablet & Computer photos</p>
              </div>
            )}
          </div>

          <Input
            label="Transaction Reference / Teller No. (Optional)"
            placeholder="e.g. FBN-PAY-987654"
            value={form.transactionReference}
            onChange={(e) => updateField('transactionReference', e.target.value)}
            className="bg-navy-950/80 border-navy-700 text-white"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={isLoading}
              className="px-4 py-3 bg-navy-950 border border-navy-700 text-navy-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <Button
              type="submit"
              disabled={isLoading}
              className="grow bg-brand-500 hover:bg-brand-400 text-white font-bold py-3 rounded-xl transition-all shadow-glow flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Registration & Proof...</span>
                </>
              ) : (
                <span>Submit Registration & Payment Proof</span>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
