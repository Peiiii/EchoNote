import { BreakpointProvider } from '@/common/components/breakpoint-provider'
import { ModalProvider } from '@/common/components/modal/provider'
import { ThemeProvider } from '@/common/components/theme/context'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'
import { HashRouter } from 'react-router-dom'
import { TooltipProvider } from './common/components/ui/tooltip.tsx'
import { initializeGitHubAuth } from '@/common/services/github-auth.service'
import { GITHUB_CONFIG, checkDevelopmentConfig } from '@/common/config/github.config'

// 初始化GitHub认证服务
try {
  if (GITHUB_CONFIG.oauth.clientId) {
    initializeGitHubAuth({
      clientId: GITHUB_CONFIG.oauth.clientId,
      redirectUri: GITHUB_CONFIG.oauth.redirectUri,
      scopes: GITHUB_CONFIG.oauth.scopes
    });
    console.log('✅ GitHub认证服务初始化成功');
  }
} catch (error) {
  console.warn('⚠️ GitHub认证服务初始化失败:', error);
}

// 检查开发环境配置
checkDevelopmentConfig();

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
