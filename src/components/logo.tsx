import { BookOpenText } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
        <Image src="/logo.svg" alt="Ms Stories" width={36} height={36} />
    </div>
  );
}
