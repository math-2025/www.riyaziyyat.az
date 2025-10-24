import { SiteHeader } from '@/components/site-header';
import { AppWrapper } from '@/firebase/app-wrapper';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppWrapper>
        <div className="relative flex min-h-screen flex-col">
        <SiteHeader userType="teacher" />
        <main className="flex-1">{children}</main>
        </div>
    </AppWrapper>
  );
}
