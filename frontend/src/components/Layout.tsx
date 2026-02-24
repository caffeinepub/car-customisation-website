import React from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Car, Wrench, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { login, clear, loginStatus, identity, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();
  const router = useRouter();

  const isAuthenticated = !!identity;
  const currentPath = router.state.location.pathname;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="relative z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-sm bg-amber flex items-center justify-center glow-amber-sm">
                <Car className="w-4 h-4 text-matte-black" />
              </div>
              <span className="font-display text-xl font-bold tracking-wider text-foreground group-hover:text-amber transition-colors">
                CAR<span className="text-amber">FORGE</span>
              </span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-medium tracking-wide transition-colors hover:text-amber ${
                  currentPath === '/' ? 'text-amber' : 'text-muted-foreground'
                }`}
              >
                HOME
              </Link>
              <Link
                to="/customize"
                className={`text-sm font-medium tracking-wide transition-colors hover:text-amber flex items-center gap-1.5 ${
                  currentPath === '/customize' ? 'text-amber' : 'text-muted-foreground'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                CONFIGURATOR
              </Link>
            </nav>

            {/* Auth */}
            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="w-3.5 h-3.5" />
                  <span className="font-mono">
                    {identity?.getPrincipal().toString().slice(0, 8)}...
                  </span>
                </div>
              )}
              <Button
                onClick={handleAuth}
                disabled={isLoggingIn}
                variant="outline"
                size="sm"
                className="border-border hover:border-amber hover:text-amber transition-all gap-2"
              >
                {isLoggingIn ? (
                  <span className="animate-pulse">Connecting...</span>
                ) : isAuthenticated ? (
                  <>
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Login</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-sm bg-amber flex items-center justify-center">
                <Car className="w-3 h-3 text-matte-black" />
              </div>
              <span className="font-display text-sm font-bold tracking-wider">
                CAR<span className="text-amber">FORGE</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} CarForge. Built with{' '}
              <span className="text-amber">♥</span> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'carforge')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <div className="text-xs text-muted-foreground">
              Premium Car Configurator
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
