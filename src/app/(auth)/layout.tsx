import Link from "next/link";
import { Calculator } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-8">
        <Link href="/" className="flex items-center gap-2">
          <Calculator className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Riyaziyyat Testi</span>
        </Link>
      </div>
      {children}
    </div>
  );
}
