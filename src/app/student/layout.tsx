import { SiteHeader } from '@/components/site-header';
import { AppWrapper } from '@/firebase/app-wrapper';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppWrapper>
        <div className="relative flex min-h-screen flex-col">
        <SiteHeader userType="student" />
        <main className="flex-1">{children}</main>
        </div>
    </AppWrapper>
  );
}
