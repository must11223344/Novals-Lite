import { categories, stories } from '@/lib/data';
import { StoryCard } from '@/components/story-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrainCircuit } from 'lucide-react';

export default function HomePage() {
  const trendingStories = [...stories].sort(() => 0.5 - Math.random()).slice(0, 4);
  const newestStories = [...stories].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const aiSuggestedStories = [...stories].sort(() => 0.5 - Math.random()).slice(0, 4);

  return (
    <div className="container max-w-7xl py-8">
      <div className="space-y-4 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
          Discover a World of Stories
        </h1>
        <p className="text-muted-foreground md:text-xl max-w-2xl mx-auto">
          Read, write, and earn. Your next adventure is just a page away. Explore tales of love, crime, and wonder.
        </p>
      </div>

      <Tabs defaultValue="trending" className="mt-8">
        <div className="flex justify-center">
          <TabsList className="grid grid-cols-3 h-auto md:grid-cols-none md:flex">
            <TabsTrigger value="trending">🔥 Trending</TabsTrigger>
            <TabsTrigger value="newest">📚 Newest</TabsTrigger>
            <TabsTrigger value="ai-suggested">
              <BrainCircuit className="mr-2 h-4 w-4" />
              AI Suggested
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="trending" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingStories.map((story) => (
              <StoryCard key={`trending-${story.id}`} story={story} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="newest" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newestStories.map((story) => (
              <StoryCard key={`newest-${story.id}`} story={story} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="ai-suggested" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {aiSuggestedStories.map((story) => (
              <StoryCard key={`ai-suggested-${story.id}`} story={story} />
            ))}
          </div>
        </TabsContent>
        
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stories
                .filter((story) => story.category === category.id)
                .map((story) => (
                  <StoryCard key={`${category.id}-${story.id}`} story={story} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
