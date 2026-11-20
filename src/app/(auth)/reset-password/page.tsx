'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || !confirmPassword) return;

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while resetting your password.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white border border-[#E7E5DF] rounded-3xl p-7 sm:p-9 shadow-[0_12px_36px_-6px_rgba(20,37,68,0.08)]">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-[#142544] mb-2">
          Set New Password
        </h1>
        <p className="text-[#647084] text-xs sm:text-sm">
          Please enter your new password to regain access to your THB student account.
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
          <h2 className="text-lg font-heading font-bold text-[#142544]">Password Reset Successfully!</h2>
          <p className="text-[#647084] text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
            Your password has been updated. Redirecting you to login...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-xs font-semibold text-[#142544] uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <Input
              id="new-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-xs font-semibold text-[#142544] uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <Input
              id="confirm-password"
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#142544] hover:bg-[#243653] text-white font-semibold rounded-full transition-all shadow-xs text-sm cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
