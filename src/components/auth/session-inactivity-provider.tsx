'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SessionContextType {
  confirmLogout: () => void;
}

const SessionContext = createContext<SessionContextType>({
  confirmLogout: () => {},
});

export const useSessionAuth = () => useContext(SessionContext);

// 10 minutes in milliseconds
const INACTIVITY_TIMEOUT = 10 * 60 * 1000;

export function SessionInactivityProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Perform actual logout & clear auth session
  const performLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore network errors on signout
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
      setShowExpiredModal(false);
      router.push('/login?logout=success');
    }
  }, [supabase, router]);

  // Reset inactivity timer on user action
  const resetInactivityTimer = useCallback(() => {
    if (showExpiredModal || showLogoutModal) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setShowExpiredModal(true);
    }, INACTIVITY_TIMEOUT);
  }, [showExpiredModal, showLogoutModal]);

  useEffect(() => {
    // Events to monitor for activity
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // Initial timer setup
    resetInactivityTimer();

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetInactivityTimer]);

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  return (
    <SessionContext.Provider value={{ confirmLogout }}>
      {children}

      {/* 1. Manual Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E7E5DF] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#DC2626] shrink-0">
                <LogOut className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-[#142544]">Confirm Sign Out</h3>
                <p className="text-[#647084] text-xs mt-0.5">Are you sure you want to end your current session?</p>
              </div>
            </div>

            <p className="text-[#647084] text-sm leading-relaxed bg-[#F8F7F4] p-3.5 rounded-xl border border-[#E7E5DF]">
              You will be signed out of the THB Academy Portal and will need to log in again to access your dashboard.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-full text-sm font-semibold text-[#647084] hover:text-[#142544] hover:bg-[#F8F7F4] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={performLogout}
                className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                {isLoggingOut && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Yes, Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Automatic 10-Minute Inactivity Expiration Modal */}
      {showExpiredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E7E5DF] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#F5F0E6] border border-[#C58A19]/30 flex items-center justify-center text-[#C58A19] shrink-0">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-[#142544]">Session Expired</h3>
                <p className="text-[#C58A19] text-xs font-semibold mt-0.5">Inactive for 10 minutes</p>
              </div>
            </div>

            <div className="space-y-2 bg-[#F8F7F4] p-4 rounded-xl border border-[#E7E5DF] text-xs text-[#647084] leading-relaxed">
              <div className="flex items-center gap-2 text-[#C58A19] font-bold text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Automatic Security Timeout</span>
              </div>
              <p>
                Your portal session has expired due to 10 minutes of inactivity. To protect your account security, your session has been closed.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={performLogout}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-sm font-semibold bg-[#C58A19] hover:bg-[#A37013] text-white shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isLoggingOut && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Sign In Again</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </SessionContext.Provider>
  );
}
