'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .single();

        if (profile?.user_type === 'admin') {
          router.push('/admin');
        } else {
          router.push('/student');
        }
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#E7E5DF] rounded-3xl p-7 sm:p-9 shadow-[0_12px_36px_-6px_rgba(20,37,68,0.08)]">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-[#142544] mb-2">Welcome Back</h1>
        <p className="text-[#647084] text-xs sm:text-sm">Sign in to your THB Academy student or faculty account</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-[#C74646]/10 border border-[#C74646]/25 flex items-start gap-3 text-[#C74646] text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-[#142544] uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            className="h-11"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-[#142544] uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#C58A19] hover:text-[#9A680C] transition-colors font-medium"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="h-11"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-[#142544] hover:bg-[#243653] active:bg-[#0e1b32] text-white font-semibold rounded-full transition-all shadow-xs text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center pt-4 border-t border-[#E7E5DF]">
        <p className="text-xs sm:text-sm text-[#647084]">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#C58A19] hover:text-[#9A680C] font-bold transition-colors">
            Register / Enroll Now
          </Link>
        </p>
      </div>
    </div>
  );
}
