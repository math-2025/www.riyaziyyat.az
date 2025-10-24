'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { auth, db } from '@/lib/firebase/clientApp';
import { doc, setDoc } from "firebase/firestore"; 
import { createSession } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  username: z.string().min(3, { message: 'İstifadəçi adı ən azı 3 simvoldan ibarət olmalıdır.' }),
  email: z.string().email({ message: 'Düzgün e-poçt ünvanı daxil edin.' }),
  password: z.string().min(6, { message: 'Şifrə ən azı 6 simvoldan ibarət olmalıdır.' }),
});

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: values.username });
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: values.username,
        email: values.email,
        createdAt: new Date(),
      });
      
      const idToken = await user.getIdToken();
      const sessionResult = await createSession(idToken);

      if (sessionResult.success) {
        router.push('/dashboard');
      } else {
        throw new Error(sessionResult.error || 'Session could not be created.');
      }
    } catch (error: any) {
      console.error(error);
      let description = 'Bilinməyən xəta baş verdi. Zəhmət olmasa, yenidən cəhd edin.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'Bu e-poçt ünvanı artıq istifadə olunur.';
      }
      toast({
        variant: 'destructive',
        title: 'Qeydiyyat uğursuz oldu',
        description,
      });
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>İstifadəçi adı</FormLabel>
              <FormControl>
                <Input placeholder="istifadəçi adınız" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-poçt</FormLabel>
              <FormControl>
                <Input placeholder="siz@nümunə.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şifrə</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Hesab yarat
        </Button>
      </form>
    </Form>
  );
}
