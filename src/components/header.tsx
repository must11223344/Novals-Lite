'use client';

import Link from 'next/link';
import { Logo } from './logo';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react';

export function Header() {
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
        <Button variant="ghost" size="icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
                <path d="M11.25 4.5V6.75M11.25 17.25V19.5M6 6.525L6.975 7.5M15.525 16.5L16.5 17.475M4.5 11.25H6.75M17.25 11.25H19.5M6.975 15.525L6 16.5M16.5 6.525L15.525 7.5M18.375 11.25C18.375 15.1875 15.1875 18.375 11.25 18.375C7.3125 18.375 4.125 15.1875 4.125 11.25C4.125 7.3125 7.3125 4.125 11.25 4.125C15.1875 4.125 18.375 7.3125 18.375 11.25ZM12.75 10.875H14.25V12.375H12.75V15H11.25V12.375H8.625V11.25L11.25 7.5H12.75V10.875Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="sr-only">Language</span>
        </Button>
      </div>
    </header>
  );
}
