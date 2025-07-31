'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useBookmarks } from '@/hooks/use-bookmarks';
import { stories } from '@/lib/data';
import { StoryCard } from '@/components/story-card';
import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { bookmarkedIds } = useBookmarks();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const bookmarkedStories = stories.filter((story) => bookmarkedIds.includes(story.id));

  if (loading) {
    return <div className="container max-w-7xl py-8 text-center">Loading...</div>;
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter flex items-center gap-3">
          <Bookmark className="h-8 w-8 text-primary" />
          My Bookmarks
        </h1>
        <p className="text-muted-foreground mt-2">Your collection of saved stories. Ready to dive back in?</p>
      </div>

      {bookmarkedStories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarkedStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold font-headline">No Bookmarks Yet</h2>
          <p className="text-muted-foreground mt-2">
            Click the bookmark icon on any story to save it for later.
          </p>
        </div>
      )}
    </div>
  );
}
