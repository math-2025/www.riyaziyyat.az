"use client";

import { CreateExamForm } from '@/components/create-exam-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import withAuth from '@/components/withAuth';
import { GenerateQuestionsFromPdf } from '@/components/generate-questions-from-pdf';
import { useState } from 'react';
import { Question } from '@/lib/types';


function CreateExamPage() {
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);

  return (
      <div className="container py-12">
        <GenerateQuestionsFromPdf onQuestionsGenerated={setGeneratedQuestions} />
        <Card className="max-w-4xl mx-auto mt-8">
            <CardHeader>
            <CardTitle className="font-headline text-4xl">Yeni İmtahan Yarat</CardTitle>
            <CardDescription>
                İmtahanınızı tərtib etmək üçün aşağıdakı məlumatları doldurun. Fərqli tiplərdə çoxsaylı suallar əlavə edə bilərsiniz və ya PDF-dən avtomatik yarada bilərsiniz.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <CreateExamForm initialQuestions={generatedQuestions} />
            </CardContent>
        </Card>
      </div>
  );
}

export default withAuth(CreateExamPage, ['teacher']);
