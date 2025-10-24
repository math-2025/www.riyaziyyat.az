import { LoginForm } from './login-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Hesabınıza Daxil Olun</CardTitle>
        <CardDescription>
          Müəllim girişi üçün məlumatları daxil edin. Şagirdlər üçün giriş məlumatları müəllim tərəfindən verilir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
