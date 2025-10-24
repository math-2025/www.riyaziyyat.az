"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Student, Submission, Exam } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { getFirestore, getDoc, getDocs, collection, query, where, doc } from 'firebase/firestore';
import { app } from '@/firebase/config';
import withAuth from '@/components/withAuth';

function ExamResultsPage() {
  const params = useParams();
  const examId = params.examId as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  useEffect(() => {
    const studentData = localStorage.getItem('currentStudent');
    if (studentData) {
      const parsedStudent = JSON.parse(studentData);
      setStudent(parsedStudent);

      const fetchData = async () => {
        setLoading(true);
        // Fetch exam
        const examRef = doc(db, "exams", examId);
        const examSnap = await getDoc(examRef);
        if (examSnap.exists()) {
          setExam({ id: examSnap.id, ...examSnap.data() } as Exam);
        }

        // Fetch submission
        const submissionsRef = collection(db, "submissions");
        const q = query(submissionsRef, where("examId", "==", examId), where("studentId", "==", parsedStudent.id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const subDoc = querySnapshot.docs[0];
          setSubmission({ id: subDoc.id, ...subDoc.data() } as Submission);
        }
        
        setLoading(false);
      }
      fetchData();
    } else {
        setLoading(false);
    }
  }, [examId, db]);

  if (loading) {
    return (
       <div className="container py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
             <Skeleton className="h-10 w-3/4" />
             <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-8">
             <div>
              <h3 className="text-2xl font-bold mb-4 font-headline">Ətraflı Təhlil</h3>
               <div className="space-y-6">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-40 w-full" />
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!exam || !submission || !student) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold">Nəticələr tapılmadı</h1>
        <p>Bu imtahan üçün nəticələr tapılmadı və ya siz bu imtahanı verməmisiniz.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/student/dashboard">İdarə Panelinə Qayıt</Link>
        </Button>
      </div>
    );
  }

  let correctCount = 0;
  exam.questions.forEach(q => {
    if(submission.answers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()){
        correctCount++;
    }
  });
  const totalQuestions = exam.questions.length;
  const totalPossibleScore = totalQuestions * exam.pointsPerQuestion;
  const studentScore = correctCount * exam.pointsPerQuestion;
  const percentage = totalPossibleScore > 0 ? (studentScore / totalPossibleScore) * 100 : 0;

  return (
    <div className="container py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-4xl">İmtahan Nəticələri</CardTitle>
              <CardDescription className="text-lg">{exam.title}</CardDescription>
            </div>
            <div className="text-right">
                <p className="text-3xl font-bold text-primary">{studentScore} / {totalPossibleScore}</p>
                <p className="text-muted-foreground">{percentage.toFixed(0)}% ({totalQuestions}-dən {correctCount} düz)</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {submission.cheatingDetected && (
             <Card className="bg-destructive/10 border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Köçürmə Aşkarlandı</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-destructive/80">
                        Köçürmə cəhdiniz aşkarlandı və buna görə imtahanınız ləğv edildi. Müəlliminizə məlumat verilib.
                    </p>
                </CardContent>
             </Card>
          )}

          <div>
            <h3 className="text-2xl font-bold mb-4 font-headline">Ətraflı Təhlil</h3>
            <div className="space-y-6">
              {exam.questions.map((q, index) => {
                const studentAnswer = submission.answers[q.id] || 'Cavablandırılmayıb';
                const isCorrect = studentAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

                return (
                  <Card key={q.id}>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Sual {index + 1}</CardTitle>
                            <Badge variant={isCorrect ? 'default' : 'destructive'} className="bg-green-500 hover:bg-green-600 text-white data-[variant=destructive]:bg-red-500 data-[variant=destructive]:hover:bg-red-600">
                                {isCorrect ? <CheckCircle className="mr-2" /> : <XCircle className="mr-2" />}
                                {isCorrect ? `+${exam.pointsPerQuestion} Bal` : '+0 Bal'}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground pt-2">{q.text}</p>
                         {q.imageUrl && (
                          <div className="mt-4">
                            <div className="relative h-48 w-full">
                                <Image src={q.imageUrl} alt={`Sual ${index + 1} şəkli`} layout="fill" objectFit="contain" className="rounded-md" />
                            </div>
                          </div>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-semibold mb-1">Sizin Cavabınız:</p>
                            <p className="p-3 bg-muted rounded-md">{studentAnswer}</p>
                        </div>
                         {!isCorrect && (
                            <div>
                                <p className="font-semibold mb-1">Düzgün Cavab:</p>
                                <p className="p-3 bg-green-100 dark:bg-green-900/50 rounded-md">{q.correctAnswer}</p>
                            </div>
                        )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-8">
            <Button asChild>
              <Link href="/student/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                İdarə Panelinə Qayıt
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(ExamResultsPage, ['student']);
