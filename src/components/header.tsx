import Link from "next/link";
import { BookCopy, Calculator, Users } from "lucide-react";
import { UserNav } from "./user-nav";
import { Button } from "./ui/button";

export async function Header() {
  const user = {
    email: 'anar.muellim@example.com',
    name: 'Anar müəllim',
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Calculator className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold hidden sm:inline-block">Riyaziyyat Testi</span>
          </Link>
          <nav className="flex items-center gap-4">
              <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                  <Link href="/dashboard">
                    <BookCopy />
                    <span className="ml-2">İmtahanlar</span>
                  </Link>
              </Button>
              <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                  <Link href="/dashboard/students">
                    <Users />
                    <span className="ml-2">Şagirdlər</span>
                  </Link>
              </Button>
          </nav>
        </div>
        <UserNav email={user.email} name={user.name} />
      </div>
    </header>
  );
}
