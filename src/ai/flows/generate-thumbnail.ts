// Implements the Genkit flow for the GenerateThumbnail story: As a writer, I want the AI to generate thumbnail for my stories so I can have a beautiful cover for my story.
'use server';
/**
 * @fileOverview A story thumbnail generation AI agent.
 *
 * - generateStoryThumbnails - A function that handles the story thumbnail generation process.
 * - GenerateStoryThumbnailsInput - The input type for the generateStoryThumbnails function.
 * - GenerateStoryThumbnailsOutput - The return type for the generateStoryThumbnails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryThumbnailsInputSchema = z.object({
  title: z.string().describe('The title of the story.'),
  description: z
    .string()
    .describe('The description of the story. This will be used to generate the thumbnail.'),
});
export type GenerateStoryThumbnailsInput = z.infer<typeof GenerateStoryThumbnailsInputSchema>;

const GenerateStoryThumbnailsOutputSchema = z.object({
  thumbnails: z.array(z.string()).describe('An array of 4 base64 encoded image data URIs.'),
});
export type GenerateStoryThumbnailsOutput = z.infer<typeof GenerateStoryThumbnailsOutputSchema>;


export async function generateStoryThumbnails(
  input: GenerateStoryThumbnailsInput
): Promise<GenerateStoryThumbnailsOutput> {
  return generateStoryThumbnailsFlow(input);
}

const generateStoryThumbnailsFlow = ai.defineFlow(
  {
    name: 'generateStoryThumbnailsFlow',
    inputSchema: GenerateStoryThumbnailsInputSchema,
    outputSchema: GenerateStoryThumbnailsOutputSchema,
  },
  async ({title, description}) => {
    const generationPrompt = `Create a visually stunning and compelling book cover for a story titled "${title}". The story is about: "${description}". The cover should be in a vertical portrait orientation, suitable for a book. Do not include any text or titles on the image. Focus on creating a powerful and evocative image that captures the essence of the story.`;

    const imagePromises = Array(4)
      .fill(null)
      .map(async () => {
        const {media} = await ai.generate({
          model: 'googleai/gemini-2.0-flash-preview-image-generation',
          prompt: generationPrompt,
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
            aspectRatio: '9:16',
          },
        });
        return media.url;
      });

    const thumbnails = await Promise.all(imagePromises);

    return {
      thumbnails,
    };
  }
);
