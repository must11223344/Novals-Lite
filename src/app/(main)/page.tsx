
'use client';
import { stories } from '@/lib/data';
import { StoryCard } from '@/components/story-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { AdPlaceholder } from '@/components/ad-placeholder';
import { AdminPanel } from '@/components/admin-panel';
import { useEffect, useState } from 'react';
import type { Story } from '@/lib/types';

function StoryCarousel({ title, stories, moreLink = '#' }: { title: string; stories: any[]; moreLink?: string }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-2xl font-bold tracking-tight">{title}</h2>
        <Link href={moreLink} className="text-sm font-semibold text-primary hover:underline">
          More
        </Link>
      </div>
      <Carousel
        opts={{
          align: 'start',
          slidesToScroll: 'auto',
        }}
        className="mx-12"
      >
        <CarouselContent className="-ml-4">
          {stories.map((story, index) => (
            <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 pl-4">
              <StoryCard story={story} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}


export default function HomePage() {
  const { user } = useAuth();
  const [continueReadingStories, setContinueReadingStories] = useState<Story[]>([]);
  const [topPicks, setTopPicks] = useState<Story[]>([]);
  
  const popularStories = [...stories].sort((a, b) => b.reads - a.reads).slice(0, 8);

  useEffect(() => {
    // Shuffle stories for the carousels on client-side to avoid hydration mismatch
    const shuffledStories = [...stories].sort(() => 0.5 - Math.random());
    setContinueReadingStories(shuffledStories.slice(0, 8));
    setTopPicks(shuffledStories.slice(8, 16));
  }, [user]);


  const isAdmin = user?.email === 'mustakeem011220@gmail.com';

  return (
    <div className="container max-w-7xl py-8 space-y-8">
      {isAdmin ? (
        <AdminPanel />
      ) : (
        <>
          <AdPlaceholder />
          <div className="space-y-12">
            {user && continueReadingStories.length > 0 && <StoryCarousel title={`Continue Reading for ${user.name.split(' ')[0]}`} stories={continueReadingStories} />}
            {topPicks.length > 0 && <StoryCarousel title="Top Picks for You" stories={topPicks} />}
            <StoryCarousel title="Popular on Pocket Novels" stories={popularStories} />
          </div>
        </>
      )}
    </div>
  );
}
