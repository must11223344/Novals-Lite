'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';
import { UserNav } from './user-nav';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { PencilRuler } from 'lucide-react';
import { ModeToggle } from './mode-toggle';

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/write', label: 'Write', auth: true },
    { href: '/bookmarks', label: 'Bookmarks', auth: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-4 text-sm lg:flex">
            {navItems.map((item) => {
              if (item.auth && !user) return null;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'transition-colors hover:text-foreground/80',
                    pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            {user && (
                 <Button asChild>
                    <Link href="/write">
                        <PencilRuler className="mr-2 h-4 w-4" />
                        Write a Story
                    </Link>
                </Button>
            )}
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
