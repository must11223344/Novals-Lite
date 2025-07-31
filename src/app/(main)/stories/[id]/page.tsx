'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { stories } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, CheckCircle } from 'lucide-react';
import { useBookmarks } from '@/hooks/use-bookmarks';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export default function StoryPage({ params }: { params: { id: string } }) {
  const story = stories.find((s) => s.id === params.id);
  const { user } = useAuth();
  const { bookmarkedIds, toggleBookmark } = useBookmarks();
  const { toast } = useToast();
  const [hasBeenRead, setHasBeenRead] = useState(false);

  useEffect(() => {
    if (user && story) {
      const readStories = JSON.parse(localStorage.getItem('read_stories') || '[]');
      if (!readStories.includes(story.id)) {
        readStories.push(story.id);
        localStorage.setItem('read_stories', JSON.stringify(readStories));
        setHasBeenRead(true);
        toast({
          title: 'Coins Earned!',
          description: 'You earned 5 coins for reading this story.',
        });
      }
    }
  }, [user, story, toast]);

  if (!story) {
    notFound();
  }

  const isBookmarked = bookmarkedIds.includes(story.id);

  return (
    <article className="container max-w-4xl py-8">
      <div className="space-y-4">
        <Badge variant="secondary" className="font-semibold uppercase tracking-wider bg-accent/90 text-accent-foreground">{story.category}</Badge>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold leading-tight tracking-tighter">
          {story.title}
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={story.authorAvatarUrl} alt={story.author} />
              <AvatarFallback>{story.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{story.author}</p>
              <p className="text-sm text-muted-foreground">
                Published on {new Date(story.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          {user && (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => toggleBookmark(story.id)}
              aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
            >
              <Bookmark className={cn(isBookmarked && 'fill-primary text-primary')} />
            </Button>
          )}
        </div>
      </div>

      <Separator className="my-8" />
      
      <div className="w-full aspect-video relative rounded-lg overflow-hidden my-8 shadow-lg">
        <Image
          src={story.thumbnailUrl}
          alt={story.title}
          fill
          className="object-cover"
          priority
          data-ai-hint="story background"
        />
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-foreground/80 prose-headings:text-foreground prose-strong:text-foreground">
        <p className="lead !text-xl !text-foreground/90 !font-semibold">{story.description}</p>
        <p>{story.content}</p>
      </div>

    </article>
  );
}
