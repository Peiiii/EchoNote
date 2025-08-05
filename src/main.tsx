import { BreakpointProvider } from '@/common/components/breakpoint-provider'
import { ModalProvider } from '@/common/components/modal/provider'
import { ThemeProvider } from '@/common/components/theme/context'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BreakpointProvider>
      <ThemeProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </ThemeProvider>
    </BreakpointProvider>
  </StrictMode>,
)
