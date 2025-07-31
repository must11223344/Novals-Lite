
'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Story } from '@/lib/types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface StoryCardProps {
  story: Story;
}

function formatReads(reads: number) {
  if (reads >= 1_000_000) {
    return `${(reads / 1_000_000).toFixed(1)}M`;
  }
  if (reads >= 1_000) {
    return `${(reads / 1_000).toFixed(0)}K`;
  }
  return reads.toString();
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Link href={`/stories/${story.id}`} className="group block">
        <Card className="overflow-hidden transition-all duration-300 ease-in-out bg-transparent border-none shadow-none flex flex-col h-full">
            <div className="relative">
                <div className="aspect-[2/3] w-full relative">
                    <Image
                        src={story.thumbnailUrl}
                        alt={story.title}
                        fill
                        className="object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
                        data-ai-hint="story fantasy"
                    />
                </div>
                <Badge className="absolute top-2 right-2 bg-primary/80 text-primary-foreground border-none">
                  {formatReads(story.reads)} Reads
                </Badge>
                <Badge variant="secondary" className="absolute bottom-2 left-2 bg-black/50 text-white border-none text-xs">NEW CHAPTERS DAILY</Badge>
            </div>
            <CardContent className="p-2 flex-grow">
                 <h3 className="font-headline text-md font-semibold leading-tight mb-1 truncate group-hover:text-primary">
                    {story.title}
                 </h3>
                 <p className="text-muted-foreground text-sm">{story.category}</p>
            </CardContent>
        </Card>
    </Link>
  );
}
