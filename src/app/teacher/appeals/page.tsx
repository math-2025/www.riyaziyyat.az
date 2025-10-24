"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileQuestion, Loader } from "lucide-react";
import { Appeal } from "@/lib/types";
import { format } from "date-fns";
import { az } from "date-fns/locale";
import withAuth from "@/components/withAuth";
import { getFirestore, collection, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { app } from "@/firebase/config";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

function TeacherAppealsPage() {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherResponses, setTeacherResponses] = useState<Record<string, string>>({});
  const db = getFirestore(app);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const appealsQuery = collection(db, "appeals");
    const unsubscribe = onSnapshot(appealsQuery, (snapshot) => {
      const appealsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Appeal));
      appealsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setAppeals(appealsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching appeals:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  const handleUpdateStatus = async (appealId: string, status: 'approved' | 'rejected') => {
    try {
      const appealRef = doc(db, 'appeals', appealId);
      const updateData: any = { status };
      
      const teacherResponse = teacherResponses[appealId];
      if (status === 'rejected' && teacherResponse) {
        updateData.teacherResponse = teacherResponse;
      }
      
      await updateDoc(appealRef, updateData);

      if (status === 'approved') {
        // If approved, update the student's score
        const appealDoc = await getDoc(appealRef);
        const appeal = appealDoc.data() as Appeal;
        
        const submissionQuery = query(collection(db, 'submissions'), where('examId', '==', appeal.examId), where('studentId', '==', appeal.studentId));
        const submissionSnapshot = await getDocs(submissionQuery);
        
        if (!submissionSnapshot.empty) {
          const submissionDoc = submissionSnapshot.docs[0];
          const submissionRef = submissionDoc.ref;
          const examRef = doc(db, 'exams', appeal.examId);
          const examSnap = await getDoc(examRef);

          if (examSnap.exists()) {
              const exam = examSnap.data();
              const currentScore = submissionDoc.data().score || 0;
              const newScore = currentScore + exam.pointsPerQuestion;
              await updateDoc(submissionRef, { score: newScore });
          }
        }
      }

      toast({ title: 'Status Yeniləndi', description: `Müraciət ${status === 'approved' ? 'təsdiqləndi' : 'rədd edildi'}.` });
    } catch (error) {
      console.error("Error updating appeal status:", error);
      toast({ variant: 'destructive', title: 'Xəta', description: 'Status yenilənərkən problem yarandı.' });
    }
  };
  
  const filteredAppeals = (status: 'pending' | 'approved' | 'rejected') => {
      return appeals.filter(a => a.status === status);
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <FileQuestion className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold">Apelyasiya Müraciətləri</h1>
          <p className="text-muted-foreground text-lg">Şagirdlərin imtahan nəticələri ilə bağlı müraciətlərini idarə edin.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader className="h-8 w-8 animate-spin" />
          <p className="ml-4 text-lg">Müraciətlər yüklənir...</p>
        </div>
      ) : (
        <Accordion type="multiple" defaultValue={['pending']} className="w-full space-y-4">
          
          {/* Pending Appeals */}
          <Card>
            <CardHeader>
                <AccordionTrigger className="w-full p-0">
                    <CardTitle className="flex items-center gap-3">
                         <Badge variant="outline">{filteredAppeals('pending').length}</Badge>
                        Gözləyən Müraciətlər
                    </CardTitle>
                </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
                <CardContent>
                    {filteredAppeals('pending').length === 0 ? <p className="text-muted-foreground p-4 text-center">Gözləyən müraciət yoxdur.</p> :
                     filteredAppeals('pending').map(appeal => (
                        <Card key={appeal.id} className="mb-4">
                            <CardHeader>
                                <CardTitle className="text-lg">{appeal.examTitle}</CardTitle>
                                <CardDescription>
                                    Şagird: {appeal.studentName} | Tarix: {format(new Date(appeal.createdAt), 'd MMMM yyyy, HH:mm', { locale: az })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="font-semibold text-sm">Sual:</p>
                                    <p className="p-2 bg-muted/50 rounded-md text-sm">{appeal.questionText}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Şagirdin İzahı:</p>
                                    <p className="p-2 bg-muted/50 rounded-md text-sm">{appeal.studentJustification}</p>
                                </div>
                                 <div className="space-y-2">
                                     <label className="font-semibold text-sm">Rədd etmə səbəbi (istəyə bağlı)</label>
                                     <Textarea 
                                        placeholder="Məs., cavabınız yanlışdır, çünki..."
                                        value={teacherResponses[appeal.id] || ''}
                                        onChange={(e) => setTeacherResponses({...teacherResponses, [appeal.id]: e.target.value})}
                                     />
                                 </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button variant="destructive" onClick={() => handleUpdateStatus(appeal.id, 'rejected')}>Rədd et</Button>
                                    <Button onClick={() => handleUpdateStatus(appeal.id, 'approved')}>Təsdiqlə</Button>
                                </div>
                            </CardContent>
                        </Card>
                     ))
                    }
                </CardContent>
            </AccordionContent>
          </Card>
          
          {/* Approved Appeals */}
          <Card>
            <CardHeader>
                <AccordionTrigger className="w-full p-0">
                    <CardTitle className="flex items-center gap-3">
                         <Badge>{filteredAppeals('approved').length}</Badge>
                        Təsdiqlənmiş Müraciətlər
                    </CardTitle>
                </AccordionTrigger>
            </CardHeader>
             <AccordionContent>
                <CardContent>
                    {filteredAppeals('approved').length === 0 ? <p className="text-muted-foreground p-4 text-center">Təsdiqlənmiş müraciət yoxdur.</p> :
                        filteredAppeals('approved').map(appeal => (
                            <Card key={appeal.id} className="mb-4 bg-green-500/5">
                                 <CardHeader>
                                    <CardTitle className="text-lg">{appeal.examTitle}</CardTitle>
                                    <CardDescription>
                                        Şagird: {appeal.studentName} | Tarix: {format(new Date(appeal.createdAt), 'd MMMM yyyy, HH:mm', { locale: az })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                     <p><b>Sual:</b> {appeal.questionText}</p>
                                     <p><b>Şagirdin İzahı:</b> {appeal.studentJustification}</p>
                                </CardContent>
                            </Card>
                        ))
                    }
                </CardContent>
            </AccordionContent>
          </Card>
          
          {/* Rejected Appeals */}
           <Card>
            <CardHeader>
                <AccordionTrigger className="w-full p-0">
                     <CardTitle className="flex items-center gap-3">
                         <Badge variant="destructive">{filteredAppeals('rejected').length}</Badge>
                        Rədd Edilmiş Müraciətlər
                    </CardTitle>
                </AccordionTrigger>
            </CardHeader>
             <AccordionContent>
                <CardContent>
                    {filteredAppeals('rejected').length === 0 ? <p className="text-muted-foreground p-4 text-center">Rədd edilmiş müraciət yoxdur.</p> :
                        filteredAppeals('rejected').map(appeal => (
                            <Card key={appeal.id} className="mb-4 bg-destructive/5">
                                <CardHeader>
                                    <CardTitle className="text-lg">{appeal.examTitle}</CardTitle>
                                    <CardDescription>
                                        Şagird: {appeal.studentName} | Tarix: {format(new Date(appeal.createdAt), 'd MMMM yyyy, HH:mm', { locale: az })}
                                    </CardDescription>
                                </CardHeader>
                                 <CardContent className="space-y-4 text-sm">
                                     <p><b>Sual:</b> {appeal.questionText}</p>
                                     <p><b>Şagirdin İzahı:</b> {appeal.studentJustification}</p>
                                     {appeal.teacherResponse && <p className="font-semibold text-destructive"><b>Müəllimin Rəyi:</b> {appeal.teacherResponse}</p>}
                                </CardContent>
                            </Card>
                        ))
                    }
                </CardContent>
            </AccordionContent>
          </Card>

        </Accordion>
      )}
    </div>
  );
}

export default withAuth(TeacherAppealsPage, ['teacher']);
