'use server';

/**
 * @fileOverview A story title suggestion AI agent.
 * 
 * - suggestStoryTitle - A function that handles the story title suggestion process.
 * - SuggestStoryTitleInput - The input type for the suggestStoryTitle function.
 * - SuggestStoryTitleOutput - The return type for the suggestStoryTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestStoryTitleInputSchema = z.object({
  storyContent: z
    .string()
    .describe('The content of the story for which a title is to be suggested.'),
});
export type SuggestStoryTitleInput = z.infer<typeof SuggestStoryTitleInputSchema>;

const SuggestStoryTitleOutputSchema = z.object({
  suggestedTitle: z
    .string()
    .describe('The suggested title for the story based on its content.'),
});
export type SuggestStoryTitleOutput = z.infer<typeof SuggestStoryTitleOutputSchema>;

export async function suggestStoryTitle(input: SuggestStoryTitleInput): Promise<SuggestStoryTitleOutput> {
  return suggestStoryTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestStoryTitlePrompt',
  input: {schema: SuggestStoryTitleInputSchema},
  output: {schema: SuggestStoryTitleOutputSchema},
  prompt: `You are a creative title generator for stories. Based on the content of the story provided, suggest an engaging title for the story.\n\nStory Content: {{{storyContent}}}`,
});

const suggestStoryTitleFlow = ai.defineFlow(
  {
    name: 'suggestStoryTitleFlow',
    inputSchema: SuggestStoryTitleInputSchema,
    outputSchema: SuggestStoryTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
