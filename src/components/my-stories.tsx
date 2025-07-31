
'use client';

import { stories } from '@/lib/data';
import type { Story } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { BookUp, Edit } from 'lucide-react';
import type { WritingEditorState } from './writing-editor';


interface MyStoriesProps {
    onEditStory: (story: WritingEditorState) => void;
}

export function MyStories({ onEditStory }: MyStoriesProps) {

    const myStories = stories.filter(s => s.author === 'Alex Doe');

    const handleEditClick = (story: Story) => {
        onEditStory({
            id: story.id,
            title: story.title,
            description: story.description,
            content: story.content,
            thumbnailUrl: story.thumbnailUrl,
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookUp /> My Stories</CardTitle>
                <CardDescription>Here are all the stories you have written. You can edit them from here.</CardDescription>
            </CardHeader>
            <CardContent>
                {myStories.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Thumbnail</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Reads</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {myStories.map((story) => (
                                <TableRow key={story.id}>
                                    <TableCell>
                                        <Image src={story.thumbnailUrl} alt={story.title} width={40} height={60} className="rounded-sm object-cover" />
                                    </TableCell>
                                    <TableCell className="font-medium">{story.title}</TableCell>
                                    <TableCell><Badge variant="secondary">Approved</Badge></TableCell>
                                    <TableCell>{story.reads.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(story)}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <h3 className="text-xl font-semibold">You haven't written any stories yet.</h3>
                        <p className="text-muted-foreground mt-2">Go to the "Studio" tab to start your first story!</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
