import { BreakpointProvider } from '@/common/components/breakpoint-provider'
import { ModalProvider } from '@/common/components/modal/provider'
import { ThemeProvider } from '@/common/components/theme/context'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'
import { HashRouter } from 'react-router-dom'
import { TooltipProvider } from './common/components/ui/tooltip.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
    <BreakpointProvider>
      <ThemeProvider>
        <ModalProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </ModalProvider>
      </ThemeProvider>
    </BreakpointProvider>
    </TooltipProvider>
  </StrictMode>,
)
