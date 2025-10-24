
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Question } from '@/lib/types';
import { generateQuestionsFromPdf } from '@/ai/flows/generate-questions-from-pdf';

const formSchema = z.object({
  pdfFile: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, 'PDF faylı tələb olunur.'),
  questionCount: z.coerce
    .number()
    .min(1, 'Ən azı 1 sual yaradılmalıdır.')
    .max(50, 'Maksimum 50 sual yaradıla bilər.'),
});

type GenerateQuestionsFromPdfProps = {
  onQuestionsGenerated: (questions: Question[]) => void;
};

export function GenerateQuestionsFromPdf({
  onQuestionsGenerated,
}: GenerateQuestionsFromPdfProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionCount: 10,
    },
  });

  const fileRef = form.register('pdfFile');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    const file = values.pdfFile[0];

    try {
      const fileBuffer = await file.arrayBuffer();
      const base64String = Buffer.from(fileBuffer).toString('base64');
      const dataUri = `data:${file.type};base64,${base64String}`;

      toast({
        title: 'Suallar yaradılır...',
        description: 'AI sehrini işə salır. Bu bir neçə saniyə çəkə bilər.',
      });

      const result = await generateQuestionsFromPdf({
        pdfDataUri: dataUri,
        numQuestions: values.questionCount,
      });

      if (!result || result.questions.length === 0) {
        throw new Error('AI heç bir sual yarada bilmədi.');
      }
      
      const formattedQuestions = result.questions.map(q => ({...q, id: `q${Date.now()}-${Math.random()}`}));

      onQuestionsGenerated(formattedQuestions);

      toast({
        title: 'Uğurlu!',
        description: `${result.questions.length} sual uğurla yaradıldı və formaya əlavə edildi.`,
      });
    } catch (error: any) {
      console.error('Error generating questions:', error);
      toast({
        variant: 'destructive',
        title: 'Xəta baş verdi',
        description:
          error.message ||
          'PDF-dən suallar yaradılarkən bir problem oldu. Zəhmət olmasa, faylı yoxlayıb yenidən cəhd edin.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto bg-primary/5 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Wand2 className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="font-headline text-3xl">
              PDF-dən Avtomatik Sual Yarat
            </CardTitle>
            <CardDescription>
              Sualları əl ilə daxil etmək əvəzinə, PDF faylı yükləyin və qoyun
              AI sizin üçün imtahanı hazırlasın.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pdfFile"
                render={() => (
                  <FormItem>
                    <FormLabel>PDF Faylı</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf"
                        {...fileRef}
                        disabled={isGenerating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="questionCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sual Sayı</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="50"
                        {...field}
                        disabled={isGenerating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Yaradılır...
                </>
              ) : (
                'Sualları Yarat'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
