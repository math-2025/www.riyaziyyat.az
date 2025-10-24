"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: ('teacher' | 'student')[]
) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const userRole = localStorage.getItem('userRole');
      
      if (!userRole || !allowedRoles.includes(userRole as any)) {
        router.replace('/');
      } else {
        setIsLoading(false);
      }
    }, [router]);

    if (isLoading) {
      return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center space-y-4 p-4">
          <Loader className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Yoxlanılır...</p>
        </main>
      );
    }

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;
