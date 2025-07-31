import { BookOpenText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <BookOpenText className="h-6 w-6 text-primary" />
      <span className="font-headline text-xl font-bold text-foreground">
        MS Stories World
      </span>
    </div>
  );
}
