import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { mockExams } from '@/lib/mock-data';
import { type Exam } from '@/types';

async function getExams(): Promise<Exam[]> {
  // TODO: Replace this with a call to fetch exams from Firestore
  return Promise.resolve(mockExams);
}

export default async function DashboardPage() {
  const exams = await getExams();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">İmtahanlar</h1>
        <p className="text-muted-foreground">Biliklərinizi sınamaq üçün bir imtahan seçin.</p>
      </div>

      {exams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <Card key={exam.id} className="flex flex-col transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
              <CardHeader>
                <CardTitle>{exam.title}</CardTitle>
                <CardDescription className="line-clamp-3">{exam.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <div className="flex items-center">
                    <Clock className="mr-1.5 h-4 w-4" />
                    {exam.durationInMinutes} dəqiqə
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-1.5">{exam.questions.length}</span> sual
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/exam/${exam.id}`}>
                    İmtahana Başla <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-medium">Hələlik heç bir imtahan yoxdur</h3>
          <p className="text-muted-foreground mt-2">Yeni imtahanlar əlavə olunduqda burada göstəriləcək.</p>
        </div>
      )}
    </div>
  );
}
