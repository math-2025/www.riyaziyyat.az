'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { mockStudents } from '@/lib/mock-data';
import { type Student } from '@/types';

async function getStudents(): Promise<Student[]> {
  // TODO: Replace with Firestore call
  console.log('Fetching students...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Students fetched.');
  return Promise.resolve(mockStudents);
}

export function StudentsTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    getStudents().then(data => {
      setStudents(data);
      setLoading(false);
    });
  });

  const getStatusVariant = (status: 'active' | 'inactive') => {
    return status === 'active' ? 'default' : 'secondary';
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center">
            <div className="flex justify-center items-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Siyahı yüklənir...
            </div>
          </TableCell>
        </TableRow>
      );
    }
    
    if (students.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                    Heç bir şagird tapılmadı.
                </TableCell>
            </TableRow>
        );
    }

    return students.map((student) => (
      <TableRow key={student.id}>
        <TableCell className="font-medium">{student.fullName}</TableCell>
        <TableCell>{student.group}</TableCell>
        <TableCell>{student.username}</TableCell>
        <TableCell>
          <Badge variant={getStatusVariant(student.status)}>
            {student.status === 'active' ? 'Aktiv' : 'Deaktiv'}
          </Badge>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menyu aç</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Əməliyyatlar</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => console.log(`Editing ${student.id}`)}>
                Düzəliş et
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Şagird Siyahısı</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="students">
          <TabsList>
            <TabsTrigger value="students">Şagirdlər</TabsTrigger>
            <TabsTrigger value="transferred">Köçürənlər</TabsTrigger>
          </TabsList>
          <TabsContent value="students">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Tam Ad</TableHead>
                        <TableHead>Qrup</TableHead>
                        <TableHead>İstifadəçi Adı</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Əməliyyatlar</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renderTableContent()}
                    </TableBody>
                </Table>
            </div>
          </TabsContent>
          <TabsContent value="transferred">
             <div className="rounded-md border">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Tam Ad</TableHead>
                        <TableHead>Qrup</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2} className="h-24 text-center">
                                Köçürülən şagird yoxdur.
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
