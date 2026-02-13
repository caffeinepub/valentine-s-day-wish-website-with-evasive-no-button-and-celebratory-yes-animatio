import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from './components/layout/AppShell';
import { ValentinePage } from './features/valentine/ValentinePage';
import { SharedMemoriesPage } from './features/memories/SharedMemoriesPage';
import { Toaster } from '@/components/ui/sonner';
import { useMemo } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  // Detect share mode from URL
  const isShareMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('share') === 'true';
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {isShareMode ? (
        <SharedMemoriesPage />
      ) : (
        <AppShell>
          <ValentinePage />
        </AppShell>
      )}
      <Toaster />
    </QueryClientProvider>
  );
}
