'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Story } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { useBookmarks } from '@/hooks/use-bookmarks';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const { user } = useAuth();
  const { bookmarkedIds, toggleBookmark } = useBookmarks();
  const isBookmarked = bookmarkedIds.includes(story.id);

  const handleBookmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(story.id);
  };

  return (
    <Link href={`/stories/${story.id}`} className="group block">
        <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:border-primary/50 flex flex-col">
            <CardHeader className="p-0 relative">
                <div className="aspect-[3/2] w-full relative">
                    <Image
                        src={story.thumbnailUrl}
                        alt={story.title}
                        fill
                        className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                        data-ai-hint="story fantasy"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-2 right-2">
                        {user && (
                            <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full h-10 w-10 bg-background/20 backdrop-blur-sm hover:bg-background/40"
                                onClick={handleBookmarkClick}
                                aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                            >
                                <Bookmark className={cn("h-5 w-5", isBookmarked ? 'fill-accent stroke-accent' : 'text-white')} />
                            </Button>
                        )}
                    </div>
                     <div className="absolute bottom-4 left-4">
                        <Badge variant="secondary" className="font-semibold uppercase tracking-wider bg-accent/90 text-accent-foreground">{story.category}</Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                 <CardTitle className="font-headline text-xl leading-tight mb-2">
                    {story.title}
                 </CardTitle>
                 <p className="text-muted-foreground text-sm line-clamp-2">{story.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <div className="flex items-center gap-2 w-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={story.authorAvatarUrl} alt={story.author} />
                        <AvatarFallback>{story.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                        <p className="font-semibold text-foreground">{story.author}</p>
                         <p className="text-xs text-muted-foreground">
                            {new Date(story.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
            </CardFooter>
        </Card>
    </Link>
  );
}
