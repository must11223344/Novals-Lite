
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AdminPanel } from '@/components/admin-panel';


export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
        if (!loading) {
            if (!user || user.email !== 'admin@example.com') {
                router.push('/');
            }
        }
    }, [user, loading, router]);

    if (loading || !user || user.email !== 'admin@example.com') {
        return <div className="container max-w-7xl py-8 text-center">Loading or redirecting...</div>;
    }

    return <AdminPanel />;
}
