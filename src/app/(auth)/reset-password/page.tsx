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
    <div className="bg-navy-900/90 border border-navy-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-white mb-2">
          Reset Your Password
        </h1>
        <p className="text-navy-300 text-sm">
          Enter your new password below to secure your THB Academy account.
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
          <h2 className="text-lg font-semibold text-white">Password Reset Successful!</h2>
          <p className="text-navy-300 text-sm leading-relaxed max-w-sm mx-auto">
            Your password has been updated. Redirecting you to the sign-in page...
          </p>
          <div className="pt-4">
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 bg-brand-500 text-navy-950 font-bold rounded-lg hover:bg-brand-400 transition-colors shadow-md"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="new-password" className="block text-sm font-medium text-navy-200">
              New Password
            </label>
            <div className="relative">
              <Input
                id="new-password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-navy-950/80 border-navy-700 text-white placeholder:text-navy-400 focus:border-brand-500"
              />
              <Lock className="w-5 h-5 text-navy-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-navy-200">
              Confirm New Password
            </label>
            <div className="relative">
              <Input
                id="confirm-password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 bg-navy-950/80 border-navy-700 text-white placeholder:text-navy-400 focus:border-brand-500"
              />
              <Lock className="w-5 h-5 text-navy-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-500 hover:bg-brand-400 text-navy-950 font-bold py-3 rounded-xl transition-all shadow-glow"
          >
            {isLoading ? 'Updating Password...' : 'Update Password'}
          </Button>
        </form>
      )}
    </div>
  );
}
