"use client";

import { CreateExamForm } from '@/components/create-exam-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import withAuth from '@/components/withAuth';


function CreateExamPage() {
  return (
      <div className="container py-12">
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
            <CardTitle className="font-headline text-4xl">Yeni İmtahan Yarat</CardTitle>
            <CardDescription>
                İmtahanınızı tərtib etmək üçün aşağıdakı məlumatları doldurun. Fərqli tiplərdə çoxsaylı suallar əlavə edə bilərsiniz.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <CreateExamForm />
            </CardContent>
        </Card>
      </div>
  );
}

export default withAuth(CreateExamPage, ['teacher']);
