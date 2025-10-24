import Link from "next/link";
import { Calculator } from "lucide-react";
import { UserNav } from "./user-nav";

export async function Header() {
  // User session is no longer handled on the server.
  // We can pass some placeholder/default data or manage state on the client.
  const user = {
    email: 'anar@muellim.com',
    name: 'Anar M.',
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Calculator className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold">Riyaziyyat Testi</span>
        </Link>
        {/* We assume the user is logged in if they are seeing this header */}
        <UserNav email={user.email} name={user.name} />
      </div>
    </header>
  );
}
