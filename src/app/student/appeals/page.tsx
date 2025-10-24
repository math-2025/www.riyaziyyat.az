"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader, FileQuestion } from "lucide-react";
import { Appeal, Student } from "@/lib/types";
import { format } from "date-fns";
import { az } from "date-fns/locale";
import withAuth from "@/components/withAuth";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { app } from "@/firebase/config";

function StudentAppealsPage() {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const db = getFirestore(app);

  useEffect(() => {
    const studentData = localStorage.getItem('currentStudent');
    if (studentData) {
      const parsedStudent = JSON.parse(studentData) as Student;
      setStudent(parsedStudent);

      setLoading(true);
      const appealsQuery = query(collection(db, "appeals"), where("studentId", "==", parsedStudent.id));
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
    } else {
      setLoading(false);
    }
  }, [db]);

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <FileQuestion className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold">Apelyasiya Müraciətlərim</h1>
          <p className="text-muted-foreground text-lg">Müraciətlərinizin vəziyyətini buradan izləyin.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader className="h-8 w-8 animate-spin" />
          <p className="ml-4 text-lg">Müraciətlər yüklənir...</p>
        </div>
      ) : appeals.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Heç bir apelyasiya müraciətiniz yoxdur.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {appeals.map((appeal) => (
            <Card key={appeal.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{appeal.examTitle}</CardTitle>
                        <CardDescription>
                            Tarix: {format(new Date(appeal.createdAt), 'd MMMM yyyy, HH:mm', { locale: az })}
                        </CardDescription>
                    </div>
                     <Badge variant={appeal.status === 'pending' ? 'outline' : appeal.status === 'approved' ? 'default' : 'destructive'}>
                        {appeal.status === 'pending' ? 'Gözlənilir' : appeal.status === 'approved' ? 'Təsdiqləndi' : 'Rədd edildi'}
                    </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-sm">Sual:</p>
                  <p className="p-2 bg-muted/50 rounded-md text-sm">{appeal.questionText}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Mənim İzahım:</p>
                  <p className="p-2 bg-muted/50 rounded-md text-sm">{appeal.studentJustification}</p>
                </div>
                {appeal.status === 'rejected' && appeal.teacherResponse && (
                  <div>
                    <p className="font-semibold text-sm text-destructive">Müəllimin Rəyi:</p>
                    <p className="p-2 bg-destructive/10 border border-destructive/20 rounded-md text-sm">{appeal.teacherResponse}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(StudentAppealsPage, ['student']);
