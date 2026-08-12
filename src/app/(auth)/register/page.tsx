'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendWelcomeEmail } from '@/lib/email';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    setError(null);
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (form.firstName.length < 2) errors.firstName = 'First name must be at least 2 characters';
    if (form.lastName.length < 2) errors.lastName = 'Last name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email';
    if (form.phone.length < 10) errors.phone = 'Please enter a valid phone number';
    if (form.password.length < 8) errors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(form.password)) errors.password = 'Must contain an uppercase letter';
    else if (!/[a-z]/.test(form.password)) errors.password = 'Must contain a lowercase letter';
    else if (!/[0-9]/.test(form.password)) errors.password = 'Must contain a number';
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const emailRedirectTo = `${window.location.origin}/`;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo,
          data: {
            first_name: form.firstName,
            last_name: form.lastName,
            phone: form.phone,
            user_type: 'student',
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        setSuccess(true);
        sendWelcomeEmail({
          email: form.email,
          name: `${form.firstName} ${form.lastName}`,
        }).catch(() => {});
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-navy-900/90 border border-navy-700/60 rounded-2xl p-6 sm:p-8 text-center space-y-5 backdrop-blur-xl shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto text-green-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-white">Check Your Email</h1>
        <p className="text-navy-300 text-sm leading-relaxed max-w-sm mx-auto">
          We&apos;ve sent a confirmation link to <strong className="text-brand-400">{form.email}</strong>.
          Click the link in your email to activate your account and return directly to THB Music Academy.
        </p>
        <div className="pt-4">
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-brand-500 text-navy-950 rounded-xl font-bold hover:bg-brand-400 transition-colors shadow-glow"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy-900/90 border border-navy-700/60 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-heading font-bold text-white mb-1">
          Create Your Account
        </h1>
        <p className="text-navy-300 text-sm">
          Join Triumphant Harmony Brass and start your musical journey
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="Taiwo"
            value={form.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            error={fieldErrors.firstName}
            required
            className="bg-navy-950/80 border-navy-700 text-white placeholder:text-navy-400"
          />
          <Input
            label="Last Name"
            placeholder="Toyinbo"
            value={form.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            error={fieldErrors.lastName}
            required
            className="bg-navy-950/80 border-navy-700 text-white placeholder:text-navy-400"
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => updateField('email', e.target.value)}
          error={fieldErrors.email}
          required
          className="bg-navy-950/80 border-navy-700 text-white placeholder:text-navy-400"
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="08012345678"
          value={form.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          error={fieldErrors.phone}
          required
          className="bg-navy-950/80 border-navy-700 text-white placeholder:text-navy-400"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          value={form.password}
          onChange={(e) => updateField('password', e.target.value)}
          error={fieldErrors.password}
          helperText="Must contain uppercase, lowercase, and a number"
          required
          className="bg-navy-950/80 border-navy-700 text-white placeholder:text-navy-400"
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={(e) => updateField('confirmPassword', e.target.value)}
          error={fieldErrors.confirmPassword}
          required
          className="bg-navy-950/80 border-navy-700 text-white placeholder:text-navy-400"
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-500 hover:bg-brand-400 text-navy-950 font-bold py-3 rounded-xl transition-all shadow-glow mt-2"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="text-center pt-3 border-t border-navy-800">
          <p className="text-sm text-navy-300">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
