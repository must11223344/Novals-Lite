'use client';

import { useState, useTransition, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2, Sparkles, PencilRuler, Image as ImageIcon, Upload } from 'lucide-react';
import { suggestStoryTitle } from '@/ai/flows/suggest-story-title';
import { contentContinuation } from '@/ai/flows/content-continuation';
import { improveWriting } from '@/ai/flows/improve-writing';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export function WritingEditor() {
  const [isPending, startTransition] = useTransition();
  const [isSuggestingTitle, setIsSuggestingTitle] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const handleSuggestTitle = () => {
    startTransition(async () => {
      setIsSuggestingTitle(true);
      if (!content) {
        toast({
          title: 'Content is empty',
          description: 'Please write some content before suggesting a title.',
          variant: 'destructive',
        });
        setIsSuggestingTitle(false);
        return;
      }
      try {
        const result = await suggestStoryTitle({ storyContent: content });
        setTitle(result.suggestedTitle);
        toast({ title: 'Title suggestion successful!' });
      } catch (error) {
        toast({
          title: 'Error suggesting title',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
      } finally {
        setIsSuggestingTitle(false);
      }
    });
  };

  const handleContinueWriting = () => {
    startTransition(async () => {
      setIsContinuing(true);
      if (!content) {
        toast({
          title: 'Content is empty',
          description: 'Please write some content to get a continuation.',
          variant: 'destructive',
        });
        setIsContinuing(false);
        return;
      }
      try {
        const result = await contentContinuation({ context: content });
        setContent((prev) => `${prev}\n\n${result.continuation}`);
        toast({ title: 'Continuation added!' });
      } catch (error) {
        toast({
          title: 'Error continuing writing',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
      } finally {
        setIsContinuing(false);
      }
    });
  };
  
  const handleImproveWriting = () => {
    startTransition(async () => {
      setIsImproving(true);
      if (!content) {
        toast({
          title: 'Content is empty',
          description: 'Please write some content to improve.',
          variant: 'destructive',
        });
        setIsImproving(false);
        return;
      }
      try {
        const result = await improveWriting({ storyContent: content });
        setContent(result.improvedContent);
        toast({ title: 'Your writing has been improved!' });
      } catch (error) {
         toast({
          title: 'Error improving writing',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
      } finally {
        setIsImproving(false);
      }
    });
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isAiBusy = isSuggestingTitle || isContinuing || isImproving;

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl flex items-center gap-2"><PencilRuler /> Create Your Story</CardTitle>
        <CardDescription>Fill in the details below and use our AI assistant to help you write a masterpiece.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
                <div>
                  <Label htmlFor="title" className="text-lg font-semibold">Title</Label>
                  <Input id="title" placeholder="Your story's title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="description" className="text-lg font-semibold">Description</Label>
                  <Textarea id="description" placeholder="A short, catchy description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2" />
                </div>
            </div>
            <div className="space-y-2">
                 <Label htmlFor="thumbnail" className="text-lg font-semibold">Thumbnail</Label>
                 <div 
                    className="aspect-video w-full rounded-md border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {thumbnailPreview ? (
                      <Image src={thumbnailPreview} alt="Thumbnail preview" width={300} height={169} className="object-cover h-full w-full rounded-md" />
                    ) : (
                      <div className="text-center text-muted-foreground p-4">
                        <ImageIcon className="mx-auto h-12 w-12" />
                        <p className="mt-2 text-sm">Click to upload an image</p>
                        <p className="text-xs">Recommended: 16:9</p>
                      </div>
                    )}
                 </div>
                 <Input ref={fileInputRef} id="thumbnail" type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
            </div>
        </div>

        <div>
          <Label htmlFor="content" className="text-lg font-semibold">Content</Label>
          <Textarea
            id="content"
            placeholder="Once upon a time..."
            className="mt-2 min-h-[300px] text-base"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <Card className="bg-secondary/50">
            <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center gap-2"><Sparkles className="text-primary"/> AI Assistant</CardTitle>
                <CardDescription>Overcome writer's block with a little help from our AI.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
                <Button onClick={handleSuggestTitle} disabled={isAiBusy} variant="outline">
                    {isSuggestingTitle ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                    Suggest Title
                </Button>
                <Button onClick={handleContinueWriting} disabled={isAiBusy} variant="outline">
                    {isContinuing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PencilRuler className="mr-2 h-4 w-4" />}
                    Continue Writing
                </Button>
                <Button onClick={handleImproveWriting} disabled={isAiBusy} variant="outline">
                    {isImproving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Improve Writing
                </Button>
            </CardContent>
        </Card>
      </CardContent>
      <CardFooter>
        <Button size="lg" className="w-full font-bold">Submit for Approval</Button>
      </CardFooter>
    </Card>
  );
}
