import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BlinkUIProvider as UIProvider, Toaster } from '@blinkdotnew/ui'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <UIProvider theme="linear" darkMode="system">
          <Toaster />
          <div className="flex w-full flex-1 flex-col min-h-0">
            <App />
          </div>
        </UIProvider>
      </QueryClientProvider>
  </React.StrictMode>,
)
