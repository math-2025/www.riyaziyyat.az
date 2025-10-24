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
import { getFirestore, collection, onSnapshot, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { app } from '@/firebase/config';
import withAuth from '@/components/withAuth';


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

        const submissionsQuery = query(collection(db, 'submissions'), where('cheatingDetected', '==', true));

        const unsubscribe = onSnapshot(submissionsQuery, async (snapshot) => {
            const flaggedSubmissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
            
            const [studentsSnap, examsSnap] = await Promise.all([
                getDocs(collection(db, 'students')),
                getDocs(collection(db, 'exams'))
            ]);
            
            const students = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
            const exams = examsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exam));

            const cheaterDetails = flaggedSubmissions.map(sub => {
                const student = students.find(s => s.id === sub.studentId);
                const exam = exams.find(e => e.id === sub.examId);

                return {
                    submissionId: sub.id,
                    studentName: student?.name || 'Bilinməyən Şagird',
                    studentGroup: student?.group || 'N/A',
                    examTitle: exam?.title || 'Bilinməyən İmtahan',
                    submittedAt: new Date(sub.submittedAt).toLocaleString('az-AZ'),
                }
            });
            
            setCheaters(cheaterDetails.reverse());
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db]);


    const handleRemoveCheater = async (submissionId: string) => {
       const submissionRef = doc(db, "submissions", submissionId);
       try {
         await updateDoc(submissionRef, {
            cheatingDetected: false
         });
         toast({
            title: "Qeyd Silindi",
            description: "Köçürmə qeydi siyahıdan uğurla silindi.",
        });
       } catch (error) {
         console.error("Error updating submission: ", error);
         toast({
            title: "Xəta",
            description: "Qeydi silərkən xəta baş verdi.",
            variant: "destructive",
         });
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
