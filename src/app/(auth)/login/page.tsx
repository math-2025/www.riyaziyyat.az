import { LoginForm } from './login-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Hesabınıza Daxil Olun</CardTitle>
        <CardDescription>Riyaziyyat macərasına davam edin.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Hesabınız yoxdur?{' '}
          <Link href="/signup" className="font-medium text-accent hover:underline">
            Qeydiyyatdan keçin
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
