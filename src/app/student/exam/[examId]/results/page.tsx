"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowLeft, Send, AlertTriangle, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Student, Submission, Exam, Appeal } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import withAuth from '@/components/withAuth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { app } from '@/firebase/config';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';


function AppealDialog({ exam, question, student, existingAppeal, onAppealSubmitted }: { exam: Exam, question: Exam['questions'][0], student: Student, existingAppeal: Appeal | undefined, onAppealSubmitted: () => void }) {
    const [justification, setJustification] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const db = getFirestore(app);

    const handleSubmit = async () => {
        if (!justification.trim()) {
            toast({ variant: 'destructive', title: 'İzah boş ola bilməz' });
            return;
        }
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'appeals'), {
                examId: exam.id,
                studentId: student.id,
                questionId: question.id,
                studentJustification: justification,
                status: 'pending',
                createdAt: new Date().toISOString(),
                examTitle: exam.title,
                questionText: question.text,
                studentName: student.name,
            });
            toast({ title: 'Apelyasiya göndərildi', description: 'Müraciətiniz müəllim tərəfindən yoxlanılacaq.' });
            onAppealSubmitted();
        } catch (error) {
            console.error("Error submitting appeal:", error);
            toast({ variant: 'destructive', title: 'Xəta', description: 'Müraciət göndərilərkən problem yarandı.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (existingAppeal) {
        return (
             <DialogContent>
                <DialogHeader>
                    <DialogTitle>Apelyasiya Vəziyyəti</DialogTitle>
                    <DialogDescription>
                        Bu sual üçün müraciətinizin vəziyyəti.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Sizin Müraciətiniz</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{existingAppeal.studentJustification}</p>
                        </CardContent>
                    </Card>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Vəziyyət:</span>
                        <Badge variant={existingAppeal.status === 'pending' ? 'outline' : existingAppeal.status === 'approved' ? 'default' : 'destructive'}>
                            {existingAppeal.status === 'pending' ? 'Gözlənilir' : existingAppeal.status === 'approved' ? 'Təsdiqləndi' : 'Rədd edildi'}
                        </Badge>
                    </div>
                     {existingAppeal.status === 'rejected' && existingAppeal.teacherResponse && (
                         <Card className="bg-destructive/10 border-destructive">
                            <CardHeader>
                                <CardTitle className="text-base text-destructive">Müəllimin Rəyi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{existingAppeal.teacherResponse}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        )
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Apelyasiya Müraciəti: Sual {exam.questions.findIndex(q => q.id === question.id) + 1}</DialogTitle>
                <DialogDescription>
                    Niyə cavabınızın düzgün olduğunu düşünürsünüz? Fikrinizi əsaslandırın.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
                <Label htmlFor="justification">Əsaslandırma</Label>
                <Textarea
                    id="justification"
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Məsələn, düşünürəm ki, bu düstur..."
                    className="min-h-[120px]"
                />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="ghost">Ləğv et</Button>
                </DialogClose>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting && <Send className="animate-pulse" />}
                    Göndər
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}

function ExamResultsPage() {
  const params = useParams();
  const examId = params.examId as string;
  const db = getFirestore(app);
  
  const [student, setStudent] = useState<Student | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async (studentId: string) => {
    setLoading(true);
    try {
      const examRef = doc(db, "exams", examId);
      const examSnap = await getDoc(examRef);
      if (examSnap.exists()) {
        setExam({ id: examSnap.id, ...examSnap.data() } as Exam);
      }

      const submissionQuery = query(collection(db, "submissions"), where("examId", "==", examId), where("studentId", "==", studentId));
      
      const unsubSubmissions = onSnapshot(submissionQuery, (snapshot) => {
          if (!snapshot.empty) {
            const subDoc = snapshot.docs[0];
            setSubmission({ id: subDoc.id, ...subDoc.data() } as Submission);
          }
      });
      
      const appealsQuery = query(collection(db, 'appeals'), where('examId', '==', examId), where('studentId', '==', studentId));
      const unsubAppeals = onSnapshot(appealsQuery, (snapshot) => {
          setAppeals(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}) as Appeal));
      });

      return () => {
          unsubSubmissions();
          unsubAppeals();
      };

    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const studentData = localStorage.getItem('currentStudent');
    if (studentData) {
      const parsedStudent = JSON.parse(studentData);
      setStudent(parsedStudent);
      const unsubscribe = fetchAllData(parsedStudent.id);
      return () => {
        unsubscribe.then(unsub => unsub && unsub());
      }
    } else {
        setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, db]);

  const handleAppealSubmitted = () => {
    if (student) {
        fetchAllData(student.id);
    }
  }


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

  const score = submission.score ?? -1;
  const totalQuestions = exam.questions.length;
  const totalPossibleScore = totalQuestions * exam.pointsPerQuestion;
  const percentage = totalPossibleScore > 0 && score >= 0 ? (score / totalPossibleScore) * 100 : 0;
  const correctCount = score >= 0 ? score / exam.pointsPerQuestion : 0;


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
                {score < 0 ? (
                    <p className="text-lg font-bold text-muted-foreground">Yoxlanılır</p>
                ): (
                    <>
                        <p className="text-3xl font-bold text-primary">{score} / {totalPossibleScore}</p>
                        <p className="text-muted-foreground">{percentage.toFixed(0)}% ({totalQuestions}-dən {correctCount} düz)</p>
                    </>
                )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {submission.cheatingDetected && (
             <Card className="bg-destructive/10 border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle/> Köçürmə Aşkarlandı</CardTitle>
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
                const existingAppeal = appeals.find(a => a.questionId === q.id);

                return (
                  <Card key={q.id}>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Sual {index + 1}</CardTitle>
                             {score >= 0 && (
                               <Badge variant={isCorrect ? 'default' : 'destructive'} className="bg-green-500 hover:bg-green-600 text-white data-[variant=destructive]:bg-red-500 data-[variant=destructive]:hover:bg-red-600">
                                {isCorrect ? <CheckCircle className="mr-2" /> : <XCircle className="mr-2" />}
                                {isCorrect ? `+${exam.pointsPerQuestion} Bal` : '+0 Bal'}
                               </Badge>
                            )}
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
                         {!isCorrect && score >= 0 && (
                            <div>
                                <p className="font-semibold mb-1">Düzgün Cavab:</p>
                                <p className="p-3 bg-green-100 dark:bg-green-900/50 rounded-md">{q.correctAnswer}</p>
                            </div>
                        )}
                         {!isCorrect && score >= 0 && !submission.cheatingDetected && (
                             <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="mt-4">
                                         {existingAppeal ? <Info className="mr-2"/> : <Send className="mr-2" />}
                                         {existingAppeal ? 'Apelyasiya Vəziyyətinə Bax' : 'Apelyasiya Müraciəti Göndər'}
                                    </Button>
                                </DialogTrigger>
                                <AppealDialog exam={exam} question={q} student={student} existingAppeal={existingAppeal} onAppealSubmitted={handleAppealSubmitted} />
                            </Dialog>
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
