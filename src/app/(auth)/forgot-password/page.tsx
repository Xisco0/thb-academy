'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-navy-900/90 border border-navy-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-white mb-2">
          Forgot Password?
        </h1>
        <p className="text-navy-300 text-sm">
          Enter your email address below and we&apos;ll send you instructions to reset your password.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 bg-green-500/15 border border-green-500/30 rounded-full flex items-center justify-center mx-auto text-green-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-white">Reset Link Sent!</h2>
          <p className="text-navy-300 text-sm leading-relaxed max-w-sm mx-auto">
            We&apos;ve sent a password recovery link to <strong className="text-brand-400">{email}</strong>. Please check your inbox and follow the link to reset your password.
          </p>
          <div className="pt-4">
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="reset-email" className="block text-sm font-medium text-navy-200">
              Email Address
            </label>
            <div className="relative">
              <Input
                id="reset-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-navy-950/80 border-navy-700 text-white placeholder:text-navy-400 focus:border-brand-500"
              />
              <Mail className="w-5 h-5 text-navy-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-500 hover:bg-brand-400 text-white font-bold py-3 rounded-xl transition-all shadow-glow"
          >
            {isLoading ? 'Sending Reset Link...' : 'Send Recovery Link'}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-medium text-navy-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
