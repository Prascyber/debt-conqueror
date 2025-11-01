import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { initialize, isInitialized } = useDataStore();

  useEffect(() => {
    if (isAuthenticated && !isInitialized) {
      initialize();
    }
  }, [isAuthenticated, isInitialized, initialize]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
