
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User as UserIcon, Mail, Smartphone, Edit } from 'lucide-react';


export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  if (loading || !user) {
    return <div className="container max-w-4xl py-8 text-center">Loading...</div>;
  }

  return (
    <div className="container max-w-2xl py-12">
        <Card className="shadow-lg">
            <CardHeader className="items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="font-headline text-3xl">{user.name}</CardTitle>
                <CardDescription>Joined on {new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                     <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-foreground">{user.name}</span>
                    </div>
                     <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <span className="text-foreground">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                        <span className="text-foreground">+91 12345 67890</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" className="w-full">
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
