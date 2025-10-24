
"use client";

import { EditExamForm } from '@/components/edit-exam-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import withAuth from '@/components/withAuth';
import { AppWrapper } from '@/firebase/app-wrapper';

function EditExamPage() {
  return (
    <AppWrapper>
        <div className="container py-12">
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
            <CardTitle className="font-headline text-4xl">İmtahanı Redaktə Et</CardTitle>
            <CardDescription>
                Aşağıdakı məlumatları dəyişərək imtahanı yeniləyin. Dəyişikliklər dərhal təsirini göstərəcək.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <EditExamForm />
            </CardContent>
        </Card>
        </div>
    </AppWrapper>
  );
}

export default withAuth(EditExamPage, ['teacher']);
