// Implements the Genkit flow for the ContentContinuation story: As a writer, I want the AI to suggest content continuation for my stories so I can overcome writer's block and keep the story flowing.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting content continuation for stories.
 *
 * - contentContinuation - A function that suggests content continuation for a given story context.
 * - ContentContinuationInput - The input type for the contentContinuation function.
 * - ContentContinuationOutput - The return type for the contentContinuation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentContinuationInputSchema = z.object({
  context: z
    .string()
    .describe("The current context of the story.  This should be the last few sentences or paragraphs that the AI will use to generate the content continuation."),
});
export type ContentContinuationInput = z.infer<typeof ContentContinuationInputSchema>;

const ContentContinuationOutputSchema = z.object({
  continuation: z.string().describe('The AI-suggested continuation of the story.'),
});
export type ContentContinuationOutput = z.infer<typeof ContentContinuationOutputSchema>;

export async function contentContinuation(input: ContentContinuationInput): Promise<ContentContinuationOutput> {
  return contentContinuationFlow(input);
}

const contentContinuationPrompt = ai.definePrompt({
  name: 'contentContinuationPrompt',
  input: {schema: ContentContinuationInputSchema},
  output: {schema: ContentContinuationOutputSchema},
  prompt: `You are a creative writing assistant, skilled at suggesting compelling content continuations for stories.

  Given the following context, suggest the next part of the story. Be creative and engaging.

  Context:
  {{context}}
  `,
});

const contentContinuationFlow = ai.defineFlow(
  {
    name: 'contentContinuationFlow',
    inputSchema: ContentContinuationInputSchema,
    outputSchema: ContentContinuationOutputSchema,
  },
  async input => {
    const {output} = await contentContinuationPrompt(input);
    return output!;
  }
);
