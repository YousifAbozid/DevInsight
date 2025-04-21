import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

import './globals.css';
import App from './App.tsx';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      // Set a higher stale time for all queries by default
      staleTime: 30 * 60 * 1000, // 30 minutes
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
    },
  },
});

// Create a persister that uses localStorage
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

// Setup persistence
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  // Only persist data after 10 seconds to avoid excessive writes
  buster: import.meta.env.PROD ? 'production-v1' : 'development-v1',
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
