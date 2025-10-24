import { LoginForm } from './login-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Hesabınıza Daxil Olun</CardTitle>
        <CardDescription>
          Müəlliminiz tərəfindən verilən e-poçt və şifrə ilə daxil olun.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
