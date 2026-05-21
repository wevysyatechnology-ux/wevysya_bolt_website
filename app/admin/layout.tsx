"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (pathname === '/admin/login') {
        setChecking(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/admin/login');
        return;
      }

      const { data: adminData } = await supabase
        .from('website_admins')
        .select('id, role')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!adminData) {
        await supabase.auth.signOut();
        router.replace('/admin/login');
        return;
      }

      setChecking(false);
    }

    checkAuth();
  }, [pathname, router]);

  if (checking && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
