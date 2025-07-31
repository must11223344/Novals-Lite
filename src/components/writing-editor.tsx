
'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2, Sparkles, PencilRuler, Image as ImageIcon, Upload, Bot, XCircle } from 'lucide-react';
import { suggestStoryTitle } from '@/ai/flows/suggest-story-title';
import { contentContinuation } from '@/ai/flows/content-continuation';
import { improveWriting } from '@/ai/flows/improve-writing';
import { generateStoryThumbnails } from '@/ai/flows/generate-thumbnail';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

export interface WritingEditorState {
    id: string;
    title: string;
    description: string;
    content: string;
    thumbnailUrl: string | null;
}

interface WritingEditorProps {
    storyToEdit?: WritingEditorState;
    onClear: () => void;
}

export function WritingEditor({ storyToEdit, onClear }: WritingEditorProps) {
  const [isSuggestingTitle, setIsSuggestingTitle] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);

  const [storyId, setStoryId] = useState<string | null>(storyToEdit?.id ?? null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  
  useEffect(() => {
    if (storyToEdit) {
      setStoryId(storyToEdit.id);
      setTitle(storyToEdit.title);
      setDescription(storyToEdit.description);
      setContent(storyToEdit.content);
      setThumbnailPreview(storyToEdit.thumbnailUrl);
    }
  }, [storyToEdit]);

  const handleSuggestTitle = async () => {
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
      console.error(error);
      toast({
        title: 'Error suggesting title',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggestingTitle(false);
    }
  };

  const handleContinueWriting = async () => {
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
      console.error(error);
      toast({
        title: 'Error continuing writing',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsContinuing(false);
    }
  };
  
  const handleImproveWriting = async () => {
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
       console.error(error);
       toast({
        title: 'Error improving writing',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsImproving(false);
    }
  };
  
  const handleGenerateThumbnails = async () => {
    setIsGeneratingThumbnails(true);
    setGeneratedThumbnails([]);
    if (!title || !description) {
        toast({
            title: 'Title or description is empty',
            description: 'Please provide a title and description before generating thumbnails.',
            variant: 'destructive',
        });
        setIsGeneratingThumbnails(false);
        return;
    }
    try {
        const result = await generateStoryThumbnails({ title, description });
        setGeneratedThumbnails(result.thumbnails);
        toast({ title: 'Thumbnails generated successfully!' });
    } catch (error) {
        console.error(error);
        toast({
            title: 'Error generating thumbnails',
            description: 'An unexpected error occurred.',
            variant: 'destructive',
        });
    } finally {
        setIsGeneratingThumbnails(false);
    }
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
  
  const clearForm = () => {
    setTitle('');
    setDescription('');
    setContent('');
    setThumbnailPreview(null);
    setStoryId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear();
  };

  const handleSubmit = () => {
    if (!title || !description || !content) {
      toast({
        variant: 'destructive',
        title: 'Incomplete Story',
        description: 'Please fill out the title, description, and content.',
      });
      return;
    }

    // In a real app, you'd send this to your backend.
    console.log('Story Submitted:', { id: storyId, title, description, content, thumbnail: thumbnailPreview });

    toast({
      title: storyId ? 'Story Updated!' : 'Story Submitted!',
      description: `Your story has been sent for approval. ${!storyId ? 'You earned 10 coins!' : ''}`,
    });

    clearForm();
  };

  const isAiBusy = isSuggestingTitle || isContinuing || isImproving || isGeneratingThumbnails;

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="font-headline text-3xl flex items-center gap-2"><PencilRuler /> {storyId ? 'Edit Your Story' : 'Create Your Story'}</CardTitle>
                <CardDescription>Fill in the details below and use our AI assistant to help you write a masterpiece.</CardDescription>
            </div>
            {storyToEdit && (
                 <Button variant="ghost" size="sm" onClick={clearForm}><XCircle className="mr-2" /> Clear Editor</Button>
            )}
        </div>
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
                    className="aspect-[9/16] w-full rounded-md border-2 border-dashed border-border flex items-center justify-center cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors relative group"
                  >
                    {thumbnailPreview ? (
                      <Image src={thumbnailPreview} alt="Thumbnail preview" fill className="object-cover rounded-md" />
                    ) : (
                      <div className="text-center text-muted-foreground p-4">
                        <ImageIcon className="mx-auto h-12 w-12" />
                        <p className="mt-2 text-sm">Upload or generate an image</p>
                      </div>
                    )}
                     <div 
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => fileInputRef.current?.click()}
                     >
                         <div className="text-white text-center">
                            <Upload className="mx-auto h-8 w-8" />
                            <p>Upload Image</p>
                         </div>
                     </div>
                 </div>
                 <Input ref={fileInputRef} id="thumbnail" type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                 
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-full" variant="outline" onClick={handleGenerateThumbnails} disabled={isGeneratingThumbnails}>
                            {isGeneratingThumbnails ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                            Generate with AI
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Choose a Thumbnail</DialogTitle>
                            <DialogDescription>Select one of the AI-generated thumbnails for your story.</DialogDescription>
                        </DialogHeader>
                        {isGeneratingThumbnails && (
                             <div className="flex items-center justify-center h-96">
                                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                             </div>
                        )}
                        {generatedThumbnails.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {generatedThumbnails.map((src, index) => (
                                    <DialogClose key={index} asChild>
                                        <div 
                                            className="aspect-[9/16] relative rounded-md overflow-hidden cursor-pointer group border-2 border-transparent hover:border-primary"
                                            onClick={() => setThumbnailPreview(src)}
                                        >
                                            <Image src={src} alt={`Generated Thumbnail ${index + 1}`} fill className="object-cover"/>
                                             <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white font-bold">Select</p>
                                             </div>
                                        </div>
                                    </DialogClose>
                                ))}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

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
        <Button size="lg" className="w-full font-bold" onClick={handleSubmit}>{storyId ? 'Update Story' : 'Submit for Approval'}</Button>
      </CardFooter>
    </Card>
  );
}
