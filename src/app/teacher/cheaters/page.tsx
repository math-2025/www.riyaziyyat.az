"use client";

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ShieldAlert, Trash2 } from 'lucide-react';
import { Exam, Submission, Student } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import withAuth from '@/components/withAuth';
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { app } from '@/firebase/config';


type CheaterInfo = {
    submissionId: string;
    studentName: string;
    studentGroup: string;
    examTitle: string;
    submittedAt: string;
}

function CheatersPage() {
    const [cheaters, setCheaters] = useState<CheaterInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const db = getFirestore(app);

    useEffect(() => {
        setLoading(true);

        const submissionsQuery = query(collection(db, "submissions"), where("cheatingDetected", "==", true));

        const unsubscribe = onSnapshot(submissionsQuery, async (snapshot) => {
            const cheatersList: CheaterInfo[] = [];

            for (const subDoc of snapshot.docs) {
                const submission = { id: subDoc.id, ...subDoc.data() } as Submission;

                const studentRef = doc(db, "students", submission.studentId);
                const studentSnap = await getDoc(studentRef);

                const examRef = doc(db, "exams", submission.examId);
                const examSnap = await getDoc(examRef);

                if (studentSnap.exists() && examSnap.exists()) {
                    const student = studentSnap.data() as Student;
                    const exam = examSnap.data() as Exam;
                    cheatersList.push({
                        submissionId: submission.id,
                        studentName: student.name,
                        studentGroup: student.group,
                        examTitle: exam.title,
                        submittedAt: new Date(submission.submittedAt).toLocaleString('az-AZ')
                    });
                }
            }
            setCheaters(cheatersList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching cheaters:", error);
            setLoading(false);
            toast({ variant: 'destructive', title: 'Xəta', description: 'Köçürmə hesabatları yüklənərkən problem yarandı.'});
        });

        return () => unsubscribe();
    }, [db, toast]);


    const handleRemoveCheater = async (submissionId: string) => {
       try {
         const submissionRef = doc(db, 'submissions', submissionId);
         await updateDoc(submissionRef, { cheatingDetected: false });
         toast({
            title: "Qeyd Silindi",
            description: "Köçürmə qeydi siyahıdan uğurla silindi.",
        });
       } catch (error) {
         console.error("Error removing cheater flag:", error);
         toast({ variant: 'destructive', title: 'Xəta', description: 'Qeyd silinərkən problem yarandı.'});
       }
    };

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
             <ShieldAlert className="h-10 w-10 text-destructive" />
            <div>
              <CardTitle className="font-headline text-4xl">Köçürmə Hesabatları</CardTitle>
              <CardDescription>
                İmtahanlar zamanı köçürməyə cəhd edən şagirdlərin siyahısı.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Şagirdin Adı</TableHead>
                <TableHead>Qrup</TableHead>
                <TableHead>İmtahan</TableHead>
                <TableHead>Tarix və Vaxt</TableHead>
                <TableHead className="text-right">Əməliyyatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        Hesabatlar yüklənir...
                    </TableCell>
                 </TableRow>
              ) : cheaters.length > 0 ? cheaters.map((cheater) => {
                return (
                  <TableRow key={cheater.submissionId} className="bg-destructive/5">
                    <TableCell className="font-medium">{cheater.studentName}</TableCell>
                    <TableCell>{cheater.studentGroup}</TableCell>
                    <TableCell>{cheater.examTitle}</TableCell>
                    <TableCell>{cheater.submittedAt}</TableCell>
                    <TableCell className="text-right">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                 <Button variant="destructive" size="icon" className="h-8 w-8">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Bu qeydi silməyə əminsiniz?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Bu əməliyyat bu köçürmə xəbərdarlığını siyahıdan siləcək. Bu, şagirdin təqdimatını və ya balını dəyişməyəcək.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRemoveCheater(cheater.submissionId)}>
                                    Bəli, Sil
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              }) : (
                 <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        Heç bir köçürmə hadisəsi qeydə alınmayıb.
                    </TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


export default withAuth(CheatersPage, ['teacher']);
