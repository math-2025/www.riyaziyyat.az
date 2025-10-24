import { SignupForm } from './signup-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Yeni Hesab Yaradın</CardTitle>
        <CardDescription>Biliklərinizi sınamağa başlamaq üçün qeydiyyatdan keçin.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Artıq hesabınız var?{' '}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Daxil olun
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
