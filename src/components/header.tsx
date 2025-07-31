
'use client';

import Link from 'next/link';
import { Logo } from './logo';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Wallet } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { UserNav } from './user-nav';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';

export function Header() {
  const { user } = useAuth();
  const [coins, setCoins] = useState(250);

  useEffect(() => {
    // In a real app, you would fetch this from a database.
    // For now, we'll use a static value and update it.
    if (user) {
        const lastLogin = localStorage.getItem('last_login_date');
        const readStories = JSON.parse(localStorage.getItem(`read_stories_${user.id}`) || '[]');
        
        let baseCoins = 250;
        if (lastLogin === new Date().toDateString()) {
             baseCoins += 0; // Already added for today
        }

        const coinFromReads = readStories.length * 5;
        // This is a simplified calculation. A real app would track this on the server.
        setCoins(baseCoins + coinFromReads);
    }
  }, [user]);


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center gap-4">
        <Link href="/" className="flex items-center space-x-2">
            <Logo />
        </Link>
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search for Novels or Artists..." className="pl-10" />
        </div>
        
        {user && (
          <Button variant="outline" asChild>
            <Link href="/wallet">
              <Wallet className="mr-2 h-4 w-4" />
              <span>{coins.toLocaleString()} Coins</span>
            </Link>
          </Button>
        )}

        <ModeToggle />
        <UserNav />
      </div>
    </header>
  );
}
