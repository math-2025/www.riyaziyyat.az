import { AddStudentForm } from "./add-student-form";
import { StudentsTable } from "./students-table";
import { Suspense } from "react";

export default function StudentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Şagirdlər</h1>
        <p className="text-muted-foreground">Yeni şagirdlər əlavə edin və mövcud şagirdləri idarə edin.</p>
      </div>

      <AddStudentForm />

      <Suspense fallback={<div>Yüklənir...</div>}>
        <StudentsTable />
      </Suspense>
      
    </div>
  );
}
