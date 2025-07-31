
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Share2, Copy, Gift } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReferralPage() {
    const { toast } = useToast();
    const { user, loading } = useAuth();
    const router = useRouter();
    const [referralLink, setReferralLink] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            setReferralLink(`${window.location.origin}/login?ref=${user.id}`);
        }
    }, [user, loading, router]);


    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        toast({
            title: 'Copied to clipboard!',
            description: 'Your referral link has been copied.',
        });
    };

    if (loading || !user) {
        return <div className="container max-w-4xl py-8 text-center">Loading...</div>;
    }

    return (
        <div className="container max-w-4xl py-12">
            <Card className="shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4">
                        <Share2 className="h-10 w-10" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Refer & Earn</CardTitle>
                    <CardDescription className="text-lg">
                        Invite your friends and earn <span className="font-bold text-primary">250 coins</span> for every friend who signs up!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center">
                        <p className="text-muted-foreground">Share your unique referral link:</p>
                        <div className="flex items-center gap-2 mt-2 max-w-md mx-auto">
                            <Input value={referralLink} readOnly className="text-center" />
                            <Button size="icon" onClick={copyToClipboard} aria-label="Copy link">
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 text-center">
                        <Card className="bg-secondary/50 p-6">
                            <CardTitle className="font-headline text-4xl">5</CardTitle>
                            <p className="text-muted-foreground mt-1">Friends Referred</p>
                        </Card>
                        <Card className="bg-secondary/50 p-6">
                             <CardTitle className="font-headline text-4xl flex items-center justify-center gap-2">1250 <Gift className="h-8 w-8 text-amber-500" /></CardTitle>
                            <p className="text-muted-foreground mt-1">Coins Earned</p>
                        </Card>
                    </div>
                     <p className="text-xs text-center text-muted-foreground pt-4">
                        *Coins will be credited to your account after your friend successfully signs up using your link.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
