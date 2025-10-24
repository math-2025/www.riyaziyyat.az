import { SiteHeader } from '@/components/site-header';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
    <SiteHeader userType="teacher" />
    <main className="flex-1">{children}</main>
    </div>
  );
}
