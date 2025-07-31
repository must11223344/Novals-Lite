import { config } from 'dotenv';
config();

import '@/ai/flows/content-continuation.ts';
import '@/ai/flows/improve-writing.ts';
import '@/ai/flows/suggest-story-title.ts';
import '@/ai/flows/generate-thumbnail.ts';
import '@/ai/flows/text-to-speech.ts';
