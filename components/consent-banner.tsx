"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Cookie, X, ShieldCheck, ChartBar as BarChart2, Megaphone } from 'lucide-react';

const STORAGE_KEY = 'wevysya-consent';

type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState<ConsentState>({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function save(consent: ConsentState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...consent, savedAt: Date.now() }));
    setVisible(false);
  }

  function acceptAll() {
    save({ necessary: true, analytics: true, marketing: true });
  }

  function rejectAll() {
    save({ necessary: true, analytics: false, marketing: false });
  }

  function saveCustom() {
    save(prefs);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-[420px] z-[9999]"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="relative rounded-2xl border border-emerald-700/40 bg-[#0a1f16]/95 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-4.5 h-4.5 text-emerald-400" style={{ width: 18, height: 18 }} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm leading-tight">We use cookies</p>
                    <p className="text-emerald-400/70 text-[11px] font-medium">Your privacy matters to us</p>
                  </div>
                </div>
                <button
                  onClick={rejectAll}
                  className="text-gray-500 hover:text-gray-300 transition-colors mt-0.5 flex-shrink-0"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-gray-400 text-xs leading-relaxed mb-4">
                We use cookies to enhance your experience, analyze site traffic, and serve relevant content. Read our{' '}
                <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors">
                  Privacy Policy
                </Link>{' '}
                to learn more.
              </p>

              {/* Expanded preferences */}
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2.5 mb-4 pt-1 border-t border-white/5">
                      <PreferenceRow
                        icon={ShieldCheck}
                        iconColor="text-emerald-400"
                        label="Necessary"
                        description="Login, security, core functionality"
                        checked={true}
                        disabled
                      />
                      <PreferenceRow
                        icon={BarChart2}
                        iconColor="text-sky-400"
                        label="Analytics"
                        description="Help us understand how you use the site"
                        checked={prefs.analytics}
                        onChange={(v) => setPrefs(p => ({ ...p, analytics: v }))}
                      />
                      <PreferenceRow
                        icon={Megaphone}
                        iconColor="text-amber-400"
                        label="Marketing"
                        description="Personalised content and promotions"
                        checked={prefs.marketing}
                        onChange={(v) => setPrefs(p => ({ ...p, marketing: v }))}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={acceptAll}
                    className="flex-1 h-9 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-black text-xs font-bold transition-all"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={rejectAll}
                    className="flex-1 h-9 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 active:scale-[0.98] text-gray-300 text-xs font-semibold transition-all"
                  >
                    Reject All
                  </button>
                </div>

                {expanded ? (
                  <button
                    onClick={saveCustom}
                    className="w-full h-9 rounded-lg border border-emerald-600/40 hover:border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-[0.98] text-emerald-400 text-xs font-semibold transition-all"
                  >
                    Save Preferences
                  </button>
                ) : (
                  <button
                    onClick={() => setExpanded(true)}
                    className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors text-center"
                  >
                    Manage preferences
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PreferenceRow({
  icon: Icon,
  iconColor,
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  icon: React.ElementType;
  iconColor: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <Icon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white leading-tight">{label}</p>
        <p className="text-[11px] text-gray-500 leading-tight mt-0.5 truncate">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative w-9 h-5 rounded-full transition-all flex-shrink-0 ${
          checked
            ? 'bg-emerald-500'
            : 'bg-white/10'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
