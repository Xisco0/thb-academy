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
    <div className="bg-white border border-[#E7E5DF] rounded-3xl p-7 sm:p-9 shadow-[0_12px_36px_-6px_rgba(20,37,68,0.08)]">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-[#142544] mb-2">
          Forgot Password?
        </h1>
        <p className="text-[#647084] text-xs sm:text-sm">
          Enter your registered email address below and we&apos;ll send instructions to reset your password.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[#C74646]/10 border border-[#C74646]/25 rounded-2xl flex items-start gap-3 text-[#C74646] text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 bg-[#23845B]/15 border border-[#23845B]/30 rounded-full flex items-center justify-center mx-auto text-[#23845B]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-heading font-bold text-[#142544]">Reset Link Sent!</h2>
          <p className="text-[#647084] text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
            We&apos;ve sent a password recovery link to <strong className="text-[#C58A19]">{email}</strong>. Please check your inbox and follow the link to reset your password.
          </p>
          <div className="pt-4">
            <Link
              href="/login"
              className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#142544] hover:text-[#C58A19] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-xs font-semibold text-[#142544] uppercase tracking-wider mb-1.5">
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
                className="pl-10 h-11"
              />
              <Mail className="w-4 h-4 text-[#8896AB] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#142544] hover:bg-[#243653] text-white font-semibold rounded-full transition-all shadow-xs text-sm cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center text-xs font-semibold text-[#647084] hover:text-[#C58A19] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
