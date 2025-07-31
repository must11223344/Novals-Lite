
'use client';

import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { stories } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, CheckCircle, Download, Loader2, PlayCircle, Volume2 } from 'lucide-react';
import { useBookmarks } from '@/hooks/use-bookmarks';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useRef } from 'react';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import html2pdf from 'html2pdf.js';

export default function StoryPage({ params }: { params: { id: string } }) {
  const story = stories.find((s) => s.id === params.id);
  const { user } = useAuth();
  const { bookmarkedIds, toggleBookmark } = useBookmarks();
  const { toast } = useToast();
  const [hasBeenRead, setHasBeenRead] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voice, setVoice] = useState<'male' | 'female'>('female');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!story) {
      return notFound();
    }
  }, [story]);

  useEffect(() => {
    if (user && story) {
      const readStoriesKey = `read_stories_${user.id}`;
      const readStories = JSON.parse(localStorage.getItem(readStoriesKey) || '[]');
      if (!readStories.includes(story.id)) {
        readStories.push(story.id);
        localStorage.setItem(readStoriesKey, JSON.stringify(readStories));
        setHasBeenRead(true);
        toast({
          title: 'Coins Earned!',
          description: 'You earned 5 coins for reading this story.',
        });
      }
    }
  }, [user, story, toast]);

  if (!story) {
    return null;
  }
  
  const handleListen = async () => {
    if (!story) return;
    setIsGeneratingAudio(true);
    setAudioUrl(null);
    try {
        const result = await textToSpeech({
            text: `${story.title}. ${story.description}. ${story.content}`,
            voice: voice,
        });
        setAudioUrl(result.audioDataUri);
    } catch (error) {
        console.error("Error generating audio:", error);
        toast({
            variant: 'destructive',
            title: 'Audio Generation Failed',
            description: 'Could not generate audio for this story.',
        });
    } finally {
        setIsGeneratingAudio(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!story || !contentRef.current) return;
    setIsDownloadingPdf(true);

    const element = contentRef.current;
    const opt = {
      margin:       1,
      filename:     `${story.title.replace(/ /g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().from(element).set(opt).save().then(() => {
        setIsDownloadingPdf(false);
    });
  };

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

       <div className="my-8 p-4 bg-secondary/50 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className='flex items-center gap-4'>
            <div className='hidden sm:block'>
              <Volume2 className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Listen to this story</h3>
              <RadioGroup defaultValue="female" value={voice} onValueChange={(v) => setVoice(v as 'male' | 'female')} className="flex items-center gap-4 mt-2" disabled={isGeneratingAudio}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female Voice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male Voice</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <Button onClick={handleListen} disabled={isGeneratingAudio}>
            {isGeneratingAudio ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                Listen Now
              </>
            )}
          </Button>
      </div>

      {audioUrl && (
        <div className="my-8">
            <audio controls autoPlay src={audioUrl} className='w-full'>
                Your browser does not support the audio element.
            </audio>
        </div>
      )}

      <div ref={contentRef} className="prose prose-lg dark:prose-invert max-w-none prose-p:text-foreground/80 prose-headings:text-foreground prose-strong:text-foreground">
        <p className="lead !text-xl !text-foreground/90 !font-semibold">{story.description}</p>
        <p>{story.content}</p>
      </div>

      <Separator className="my-8" />
      
      <div className="text-center">
         <Button onClick={handleDownloadPdf} disabled={isDownloadingPdf}>
            {isDownloadingPdf ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download as PDF
              </>
            )}
        </Button>
      </div>

    </article>
  );
}
