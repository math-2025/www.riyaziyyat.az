
'use server';

/**
 * @fileOverview This file contains the Genkit flow for generating exam questions from a PDF.
 * - generateQuestionsFromPdf - The main function to call the flow.
 * - GenerateQuestionsInput - The input type for the flow.
 * - GenerateQuestionsOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const QuestionSchema = z.object({
  text: z.string().describe('The full text of the question.'),
  type: z
    .enum(['multiple-choice', 'free-form'])
    .describe('The type of the question.'),
  options: z
    .array(z.string())
    .optional()
    .describe(
      'An array of 5 potential answers if the type is "multiple-choice".'
    ),
  correctAnswer: z
    .string()
    .describe(
      'The correct answer. For multiple-choice, this must exactly match one of the strings in the options array.'
    ),
  imageUrl: z.string().optional().describe('A URL to an image for the question, if any.')
});

export const GenerateQuestionsInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The content of the PDF file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
  numQuestions: z
    .number()
    .int()
    .positive()
    .describe('The number of questions to generate from the PDF.'),
});
export type GenerateQuestionsInput = z.infer<
  typeof GenerateQuestionsInputSchema
>;

export const GenerateQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema),
});
export type GenerateQuestionsOutput = z.infer<
  typeof GenerateQuestionsOutputSchema
>;

// Main function to be called from the client
export async function generateQuestionsFromPdf(
  input: GenerateQuestionsInput
): Promise<GenerateQuestionsOutput> {
  return generateQuestionsFlow(input);
}

// Define the prompt for the AI model
const generateQuestionsPrompt = ai.definePrompt({
  name: 'generateQuestionsPrompt',
  input: { schema: GenerateQuestionsInputSchema },
  output: { schema: GenerateQuestionsOutputSchema },
  prompt: `You are an expert in creating educational materials. Your task is to analyze the provided PDF document and generate a list of exam questions based on its content.

Follow these instructions carefully:
1.  Generate exactly {{{numQuestions}}} questions.
2.  For each question, determine if it should be 'multiple-choice' or 'free-form' (open-ended).
3.  If a question is 'multiple-choice', you MUST provide an array of 5 distinct options. One of these options must be the correct answer.
4.  If a question is 'free-form', the 'options' array should be empty.
5.  Provide a 'correctAnswer' for every question. For multiple-choice questions, the 'correctAnswer' string must be an exact match to one of the provided options.
6.  Analyze the content of the document to formulate relevant questions, options, and correct answers.
7.  Do not generate questions about page numbers, headers, or footers. Focus on the main content.
8.  The entire response must be in the specified JSON format.

Here is the document:
{{media url=pdfDataUri}}
`,
});

// Define the Genkit flow
const generateQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuestionsFlow',
    inputSchema: GenerateQuestionsInputSchema,
    outputSchema: GenerateQuestionsOutputSchema,
  },
  async (input) => {
    const { output } = await generateQuestionsPrompt(input);
    if (!output) {
      throw new Error('AI model did not return any output.');
    }
    return output;
  }
);
