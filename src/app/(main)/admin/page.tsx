
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AdminPanel } from '@/components/admin-panel';
import { Loader2 } from 'lucide-react';


export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (user.email !== 'admin@example.com') {
                router.push('/');
            }
        }
    }, [user, loading, router]);

    if (loading || !user || user.email !== 'admin@example.com') {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Checking credentials...</p>
            </div>
        );
    }

    return <AdminPanel />;
}
