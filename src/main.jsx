import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './Routes/Router.jsx'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import AOS from 'aos';
import 'aos/dist/aos.css';
import AuthProvider from './Contexts/AuthProvider.jsx'

AOS.init();

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <RouterProvider router = {router}/>
    </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
