import { Heart } from 'lucide-react';
import { LoginButton } from '../auth/LoginButton';
import { ProfileSetupDialog } from '../auth/ProfileSetupDialog';
import { useGetCallerUserProfile } from '../../hooks/useUserProfile';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-valentine-accent" />
            <span className="font-serif text-lg font-semibold">Memories</span>
          </div>
          <div className="flex items-center gap-4">
            {identity && userProfile && (
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Welcome, {userProfile.name}
              </span>
            )}
            <LoginButton />
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <ProfileSetupDialog />
    </div>
  );
}
