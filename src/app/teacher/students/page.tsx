
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/lib/types";
import { PlusCircle, Users, Copy, Group, Trash2, UserX, UserCheck, KeyRound, Pencil, Loader } from "lucide-react";
import { nanoid } from "nanoid";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import withAuth from "@/components/withAuth";


// Schemas
const addStudentSchema = z.object({
  name: z.string().min(1, "Ad tələb olunur"),
  surname: z.string().min(1, "Soyad tələb olunur"),
  cls: z.string().min(1, "Sinif tələb olunur"),
  parentContact: z.string().optional(),
  group: z.string().min(1, "Qrup tələb olunur"),
});

const editStudentSchema = z.object({
  name: z.string().min(1, "Ad tələb olunur"),
  cls: z.string().min(1, "Sinif tələb olunur"),
  parent: z.string().optional(),
  group: z.string().min(1, "Qrup tələb olunur"),
  email: z.string().min(1, "İstifadəçi adı tələb olunur"),
  pass: z.string().min(6, "Şifrə ən azı 6 simvoldan ibarət olmalıdır"),
});

const addGroupSchema = z.object({
  groupName: z.string().min(1, "Qrup adı tələb olunur"),
});

function StudentManagementPage() {
  const { toast } = useToast();

  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [newStudentCreds, setNewStudentCreds] = useState<{email: string, pass: string} | null>(null);
  const [viewingCredsFor, setViewingCredsFor] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Data fetching removed
    setIsLoading(false);
  }, [toast]);

  // Add Student Form
  const addStudentForm = useForm<z.infer<typeof addStudentSchema>>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: { name: "", surname: "", cls: "", parentContact: "", group: "" },
  });

  // Edit Student Form
  const editStudentForm = useForm<z.infer<typeof editStudentSchema>>({
    resolver: zodResolver(editStudentSchema),
  });

  useEffect(() => {
    if (editingStudent) {
      editStudentForm.reset({
        name: editingStudent.name,
        cls: editingStudent.cls,
        parent: editingStudent.parent,
        group: editingStudent.group,
        email: editingStudent.email,
        pass: editingStudent.pass,
      });
    }
  }, [editingStudent, editStudentForm]);

  async function onAddStudent(data: z.infer<typeof addStudentSchema>) {
    const studentUsername = `${data.name.toLowerCase().replace(/\s/g, '')}${data.surname.toLowerCase().replace(/\s/g, '')}${Math.floor(10 + Math.random() * 90)}`;
    const studentPass = nanoid(8);

    const newStudent: Student = {
        id: nanoid(),
        name: `${data.name} ${data.surname}`,
        cls: data.cls,
        parent: data.parentContact,
        group: data.group,
        email: studentUsername,
        pass: studentPass,
        status: 'active',
    };
    
    setStudents(prev => [...prev, newStudent]);
    setNewStudentCreds({ email: studentUsername, pass: studentPass });
    addStudentForm.reset();
    toast({ title: "Şagird əlavə edildi", description: `${newStudent.name} əlavə edildi.` });

  }

  async function onEditStudent(data: z.infer<typeof editStudentSchema>) {
    if (!editingStudent) return;
    
    setStudents(prev => prev.map(s => s.id === editingStudent.id ? {...s, ...data} : s));
    setEditingStudent(null);
    toast({ title: "Şagird Yeniləndi", description: `${data.name} üçün məlumatlar yeniləndi.` });
  }

  // Group Form
  const groupForm = useForm<z.infer<typeof addGroupSchema>>({
    resolver: zodResolver(addGroupSchema),
    defaultValues: { groupName: "" },
  });

  async function onAddGroup(data: z.infer<typeof addGroupSchema>) {
    if (groups.includes(data.groupName)) {
        groupForm.setError("groupName", { type: "manual", message: "Qrup artıq mövcuddur."});
        return;
    }
    setGroups(prev => [...prev, data.groupName]);
    groupForm.reset();
    toast({ title: "Qrup əlavə edildi", description: `"${data.groupName}" qrupu yaradıldı.` });
  }

  const handleDeleteGroup = async (groupNameToDelete: string) => {
    const isGroupInUse = students.some(student => student.group === groupNameToDelete);

    if (isGroupInUse) {
      toast({
        variant: "destructive",
        title: "Qrupu Silmək Olmur",
        description: `"${groupNameToDelete}" qrupunda şagirdlər var. Zəhmət olmasa, silməzdən əvvəl şagirdləri başqa qrupa təyin edin.`,
      });
      return;
    }

    setGroups(prev => prev.filter(g => g !== groupNameToDelete));
    toast({ title: "Qrup Silindi", description: `"${groupNameToDelete}" qrupu silindi.` });
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Kopyalandı!", description: "Məlumatlar müvəffəqiyyətlə kopyalandı." });
  }

  const handleToggleStudentStatus = async (studentId: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const newStatus = s.status === 'active' ? 'disabled' : 'active';
        toast({
            title: `Şagird ${newStatus === 'active' ? 'Aktiv Edildi' : 'Deaktiv Edildi'}`,
            description: `${s.name} adlı şagirdin hesabı ${newStatus === 'active' ? 'aktiv edildi' : 'deaktiv edildi'}.`,
        });
        return {...s, status: newStatus};
      }
      return s;
    }));
  }

  const handleRemoveStudent = async (studentId: string) => {
    const studentToRemove = students.find((s) => s.id === studentId);
    if (!studentToRemove) return;
    
    setStudents(prev => prev.filter(s => s.id !== studentId));

    toast({
        variant: "destructive",
        title: "Şagird Silindi",
        description: `${studentToRemove.name} və bütün təqdimatları sistemdən tamamilə silindi.`,
    });
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-headline text-4xl font-bold">
            Şagird İdarəetməsi
          </h1>
          <p className="text-muted-foreground text-lg">
            Şagirdləri və qrupları əlavə edin, baxın və idarə edin.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sol sütun formlar üçün */}
        <div className="md:col-span-1 space-y-8">
            {/* Yeni Şagird Kartı */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users/> Yeni Şagird Əlavə Et</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...addStudentForm}>
                        <form onSubmit={addStudentForm.handleSubmit(onAddStudent)} className="space-y-4">
                             <FormField control={addStudentForm.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Ad</FormLabel><FormControl><Input placeholder="Şagirdin adı" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={addStudentForm.control} name="surname" render={({ field }) => (
                                <FormItem><FormLabel>Soyad</FormLabel><FormControl><Input placeholder="Şagirdin soyadı" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={addStudentForm.control} name="cls" render={({ field }) => (
                                <FormItem><FormLabel>Sinif</FormLabel><FormControl><Input placeholder="məs., 10a" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={addStudentForm.control} name="parentContact" render={({ field }) => (
                                <FormItem><FormLabel>Valideyn Əlaqəsi (İstəyə bağlı)</FormLabel><FormControl><Input placeholder="Valideynin telefon nömrəsi" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={addStudentForm.control} name="group" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qrup</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Bir qrup seçin" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {groups.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" className="w-full">
                                <PlusCircle className="mr-2"/> Şagird Əlavə Et
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Qrup İdarəetmə Kartı */}
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Group /> Qrupları İdarə Et</CardTitle>
                </CardHeader>
                <CardContent>
                     <Form {...groupForm}>
                        <form onSubmit={groupForm.handleSubmit(onAddGroup)} className="space-y-4">
                             <FormField control={groupForm.control} name="groupName" render={({ field }) => (
                                <FormItem><FormLabel>Yeni Qrup Adı</FormLabel><FormControl><Input placeholder="məs., 11S" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <Button type="submit" className="w-full">
                                <PlusCircle className="mr-2"/> Qrup Əlavə Et
                             </Button>
                        </form>
                    </Form>
                     <Separator className="my-6" />
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm">Mövcud Qruplar</h4>
                        <div className="space-y-2">
                            {groups.map(group => (
                                <div key={group} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                    <span>{group}</span>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Əminsiniz?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Yalnız heç bir şagirdi olmayan qrupları silə bilərsiniz. Bu əməliyyat geri qaytarıla bilməz.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteGroup(group)}>Qrupu Sil</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Sağ sütun cədvəl üçün */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Şagird Siyahısı</CardTitle>
              <CardDescription>
                Sistemdə qeydiyyatdan keçmiş bütün şagirdlərin siyahısı.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tam Ad</TableHead>
                    <TableHead>Qrup</TableHead>
                    <TableHead>İstifadəçi Adı</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Əməliyyatlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            <div className="flex justify-center items-center">
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Siyahı yüklənir...
                            </div>
                        </TableCell>
                    </TableRow>
                  ) : students.map((student) => (
                    <TableRow key={student.id} className={cn(student.status === 'disabled' && 'text-muted-foreground bg-muted/50')}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.group}</TableCell>
                      <TableCell>{student.email}</TableCell>
                       <TableCell>
                         <Badge variant={student.status === 'active' ? 'secondary' : 'outline'} className={cn(student.status === 'active' && 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300')}>
                           {student.status === 'active' ? 'Aktiv' : 'Deaktiv'}
                         </Badge>
                       </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setViewingCredsFor(student)}>
                           <KeyRound className="h-4 w-4" />
                        </Button>
                        
                        <Dialog open={editingStudent?.id === student.id} onOpenChange={(isOpen) => !isOpen && setEditingStudent(null)}>
                            <DialogTrigger asChild>
                                 <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setEditingStudent(student)}>
                                   <Pencil className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                             <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{student.name} adlı şagirdi redaktə et</DialogTitle>
                                </DialogHeader>
                                <Form {...editStudentForm}>
                                    <form onSubmit={editStudentForm.handleSubmit(onEditStudent)} className="space-y-4 py-4">
                                        <FormField control={editStudentForm.control} name="name" render={({ field }) => (
                                            <FormItem><FormLabel>Tam Ad</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={editStudentForm.control} name="email" render={({ field }) => (
                                            <FormItem><FormLabel>İstifadəçi Adı</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={editStudentForm.control} name="pass" render={({ field }) => (
                                            <FormItem><FormLabel>Şifrə</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={editStudentForm.control} name="cls" render={({ field }) => (
                                            <FormItem><FormLabel>Sinif</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={editStudentForm.control} name="parent" render={({ field }) => (
                                            <FormItem><FormLabel>Valideyn Əlaqəsi</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={editStudentForm.control} name="group" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Qrup</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                    <SelectContent>{groups.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <div className="flex justify-end gap-2 pt-4">
                                        <Button type="button" variant="ghost" onClick={() => setEditingStudent(null)}>Ləğv et</Button>
                                        <Button type="submit">Dəyişiklikləri Yadda Saxla</Button>
                                        </div>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant={student.status === 'active' ? 'outline' : 'secondary'} size="icon" className="h-8 w-8">
                              {student.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Tamamilə əminsiniz?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bu, {student.name} üçün hesabı {student.status === 'active' ? 'deaktiv edəcək' : 'aktiv edəcək'}. {student.status === 'active' ? 'Onlar sistemə daxil ola bilməyəcəklər.' : 'Onlar yenidən sistemə giriş əldə edəcəklər.'}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                              <AlertDialogAction onClick={() => { handleToggleStudentStatus(student.id); }}>
                                Davam et
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>                          
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Tamamilə əminsiniz?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bu əməliyyat geri qaytarıla bilməz. Bu, {student.name} üçün şagird hesabını və bütün əlaqəli məlumatları həmişəlik siləcək.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                              <AlertDialogAction onClick={() => { handleRemoveStudent(student.id); }}>
                                Davam et
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Yeni şagird məlumatları üçün dialoq */}
       <Dialog open={!!newStudentCreds} onOpenChange={() => setNewStudentCreds(null)}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Şagird Uğurla Yaradıldı!</DialogTitle>
                <DialogDescription>
                    Giriş edə bilməsi üçün aşağıdakı məlumatları şagirdlə paylaşın.
                </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-1">
                        <Label>İstifadəçi Adı</Label>
                        <div className="flex items-center gap-2">
                           <Input readOnly value={newStudentCreds?.email} />
                           <Button variant="outline" size="icon" onClick={() => copyToClipboard(newStudentCreds?.email || '')}><Copy className="h-4 w-4" /></Button>
                        </div>
                    </div>
                     <div className="space-y-1">
                        <Label>Şifrə</Label>
                        <div className="flex items-center gap-2">
                           <Input readOnly value={newStudentCreds?.pass} />
                           <Button variant="outline" size="icon" onClick={() => copyToClipboard(newStudentCreds?.pass || '')}><Copy className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        
      {/* Mövcud şagird məlumatlarına baxmaq üçün dialoq */}
       <Dialog open={!!viewingCredsFor} onOpenChange={() => setViewingCredsFor(null)}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>{viewingCredsFor?.name} üçün Giriş Məlumatları</DialogTitle>
                <DialogDescription>
                    Bu məlumatları şagirdlə paylaşmaq üçün kopyalaya bilərsiniz.
                </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-1">
                        <Label>İstifadəçi Adı</Label>
                        <div className="flex items-center gap-2">
                           <Input readOnly value={viewingCredsFor?.email} />
                           <Button variant="outline" size="icon" onClick={() => copyToClipboard(viewingCredsFor?.email || '')}><Copy className="h-4 w-4" /></Button>
                        </div>
                    </div>
                     <div className="space-y-1">
                        <Label>Şifrə</Label>
                        <div className="flex items-center gap-2">
                           <Input readOnly value={viewingCredsFor?.pass} />
                           <Button variant="outline" size="icon" onClick={() => copyToClipboard(viewingCredsFor?.pass || '')}><Copy className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}

export default withAuth(StudentManagementPage, ['teacher']);

    

    
