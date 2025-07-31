
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { WritingEditor, type WritingEditorState } from '@/components/writing-editor';
import { MyStories } from '@/components/my-stories';
import { Loader2, PencilRuler, Bot, TrendingUp, HandCoins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


function FeatureCard({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick?: () => void }) {
    return (
        <Card className="hover:bg-accent hover:border-primary/50 transition-all cursor-pointer" onClick={onClick}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="bg-primary/10 p-3 rounded-full">
                    {icon}
                </div>
                <CardTitle className="text-xl font-headline">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}


export default function WritePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('studio');
    const [storyToEdit, setStoryToEdit] = useState<WritingEditorState | undefined>(undefined);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);
    
    const handleEditStory = (story: WritingEditorState) => {
        setStoryToEdit(story);
        setActiveTab('studio');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!user) {
        return null;
    }

  return (
    <div className="container py-8 max-w-7xl">
         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
                <TabsTrigger value="studio">Studio</TabsTrigger>
                <TabsTrigger value="creation">My Stories</TabsTrigger>
                <TabsTrigger value="improve">Improve</TabsTrigger>
                <TabsTrigger value="earn">Earn</TabsTrigger>
            </TabsList>
            <TabsContent value="studio" className="mt-6">
                <WritingEditor key={storyToEdit?.id} storyToEdit={storyToEdit} onClear={() => setStoryToEdit(undefined)} />
            </TabsContent>
            <TabsContent value="creation" className="mt-6">
                <MyStories onEditStory={handleEditStory} />
            </TabsContent>
            <TabsContent value="improve" className="mt-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Improve Your Writing</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                       <FeatureCard
                            icon={<TrendingUp className="h-8 w-8 text-primary" />}
                            title="Analyze Readability"
                            description="Get feedback on how to make your story easier to read."
                        />
                         <FeatureCard
                            icon={<Bot className="h-8 w-8 text-primary" />}
                            title="AI Proofreader"
                            description="Let AI check your story for grammar and spelling mistakes."
                        />
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="earn" className="mt-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Earning Opportunities</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                       <FeatureCard
                            icon={<HandCoins className="h-8 w-8 text-primary" />}
                            title="Writing Contests"
                            description="Participate in contests and win exciting prizes."
                        />
                         <FeatureCard
                            icon={<TrendingUp className="h-8 w-8 text-primary" />}
                            title="Reader Engagement Bonus"
                            description="Earn extra coins when your stories get high engagement."
                        />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
