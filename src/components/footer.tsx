'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Library, Compass, Store, Edit } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/library', label: 'My Library', icon: Library },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/store', label: 'My Store', icon: Store },
    { href: '/write', label: 'Write', icon: Edit },
  ];

  return (
    <footer className="fixed bottom-0 z-50 w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center">
        <nav className="flex items-center justify-around w-full text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 transition-colors hover:text-primary',
                pathname === item.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
