"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calculator } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Student } from '@/lib/types';


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const loginImage = PlaceHolderImages.find(img => img.id === 'login-hero');

  useEffect(() => {
    // Clear any existing session data on login page load
    localStorage.removeItem('currentStudent');
    localStorage.removeItem('userRole');
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (email === 'Anar' && password === 'Anar2025') {
      localStorage.setItem('userRole', 'teacher');
      toast({ title: 'Giriş uğurludur', description: 'Xoş gəlmisiniz, Müəllim!' });
      router.push('/teacher/dashboard');
      setIsLoading(false);
      return;
    }
    
    // NOTE: Student login is temporarily disabled as we removed direct DB dependency.
    // This part can be re-enabled with proper mock data or API layer later.
    toast({
        variant: 'destructive',
        title: 'Giriş alınmadı',
        description: 'Hazırda yalnız müəllim girişi aktivdir.',
    });

    setIsLoading(false);
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center p-4">
       {loginImage && (
        <Image
          src={loginImage.imageUrl}
          alt={loginImage.description}
          data-ai-hint={loginImage.imageHint}
          fill
          className="absolute inset-0 h-full w-full object-cover z-0 opacity-10"
        />
      )}
      <Card className="w-full max-w-sm z-10 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <Calculator className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Riyaziyyat İmtahanı Giriş</CardTitle>
          <CardDescription>Sistemə daxil olmaq üçün məlumatlarınızı daxil edin.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">İstifadəçi adı</Label>
              <Input
                id="email"
                type="text"
                placeholder="İstifadəçi adı"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifrə</Label>
              <Input
                id="password"
                type="password"
                placeholder="Şifrə"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Daxil olunur...' : 'Giriş'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
