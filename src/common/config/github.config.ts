// GitHub OAuth application configuration
export const GITHUB_CONFIG = {
  // OAuth application configuration
  oauth: {
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
    redirectUri: import.meta.env.VITE_GITHUB_REDIRECT_URI || 'http://localhost:3000/#/github/auth/callback',
    scopes: ['repo', 'user', 'workflow'], // Required permission scopes
  },
  
  // Default storage configuration
  storage: {
    defaultBranch: 'main',
    basePath: 'data', // Base path for data storage
  },
  
  // API configuration
  api: {
    baseUrl: 'https://api.github.com',
    timeout: 30000, // 30 seconds timeout
  },
  
  // Feature flags
  features: {
    autoSync: true, // Auto synchronization
    conflictResolution: true, // Conflict resolution
    backupEnabled: true, // Backup functionality
  }
};

// 验证配置是否完整
export function validateGitHubConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!GITHUB_CONFIG.oauth.clientId) {
    errors.push('GitHub Client ID not configured');
  }
  
  if (!GITHUB_CONFIG.oauth.redirectUri) {
    errors.push('GitHub Redirect URI not configured');
  }
  
  // Note: Storage configuration is now user-configurable, not required in initial config
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// 获取环境变量配置说明
export function getGitHubConfigInstructions(): string {
  return `
# GitHub配置说明

请在项目根目录创建 .env.local 文件，并添加以下配置：

## 必需配置
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_GITHUB_DEFAULT_OWNER=your_github_username

## Optional configuration
VITE_GITHUB_REDIRECT_URI=http://localhost:3000/#/github/auth/callback
VITE_GITHUB_DEFAULT_REPO=echonote-data

## Steps to get GitHub Client ID:
1. Visit https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in application information:
   - Application name: EchoNote
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/#/github/auth/callback
4. Get Client ID after registration

## 权限说明：
- repo: 访问私有仓库
- user: 读取用户信息
- workflow: 管理GitHub Actions工作流
  `;
}

// Development environment configuration check
export function checkDevelopmentConfig(): void {
  if (import.meta.env.DEV) {
    const config = validateGitHubConfig();
    if (!config.isValid) {
      console.warn('⚠️ GitHub configuration incomplete, some features may not work:');
      config.errors.forEach(error => console.warn(`  - ${error}`));
      console.log(getGitHubConfigInstructions());
    }
  }
}
