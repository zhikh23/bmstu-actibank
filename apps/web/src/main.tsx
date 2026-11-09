import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './app'
import {PrimeReactProvider} from "primereact/api";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={ queryClient }>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
