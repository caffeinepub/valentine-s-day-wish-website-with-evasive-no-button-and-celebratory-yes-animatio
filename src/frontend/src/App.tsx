import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ValentinePage } from './features/valentine/ValentinePage';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ValentinePage />
      <Toaster />
    </QueryClientProvider>
  );
}
