import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'modern-normalize/modern-normalize.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
            <Toaster position="top-center" />
        </QueryClientProvider>
    </React.StrictMode>
);