import Link from "next/link";
import { Calculator } from "lucide-react";
import { UserNav } from "./user-nav";
import { cookies, headers } from "next/headers";
import { getAdminApp } from "@/lib/firebase/adminApp";

async function getUser() {
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) return null;

    try {
        const adminApp = getAdminApp();
        const decodedClaims = await adminApp.auth().verifySessionCookie(sessionCookie, true);
        return decodedClaims;
    } catch (error) {
        return null;
    }
}


export async function Header() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Calculator className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold">Riyaziyyat Testi</span>
        </Link>
        {user && <UserNav email={user.email} name={user.name} />}
      </div>
    </header>
  );
}
