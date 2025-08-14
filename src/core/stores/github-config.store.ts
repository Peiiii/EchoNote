import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GitHubStorageConfig {
  owner: string;
  repo: string;
  branch: string;
  basePath: string;
}

export interface GitHubUserInfo {
  login: string;
  id: number;
  avatar_url?: string;
  name?: string;
  email?: string;
}

export interface GitHubAuthInfo {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
  scope: string;
  user: GitHubUserInfo;
  platform: string;
  createdAt: number;
}

interface GitHubConfigState {
  storageConfig: GitHubStorageConfig;
  authInfo: GitHubAuthInfo | null;
  userInfo: GitHubUserInfo | null;
  isAuthenticated: boolean;
  
  // Storage config methods
  setStorageConfig: (config: Partial<GitHubStorageConfig>) => void;
  resetStorageConfig: () => void;
  isStorageConfigured: () => boolean;
  
  // Auth methods
  setAuthInfo: (authInfo: GitHubAuthInfo) => void;
  clearAuthInfo: () => void;
  setUserInfo: (userInfo: GitHubUserInfo) => void;
  clearUserInfo: () => void;
  setAuthenticated: (authenticated: boolean) => void;
}

const defaultStorageConfig: GitHubStorageConfig = {
  owner: '',
  repo: 'echonote-data',
  branch: 'main',
  basePath: 'data'
};

export const useGitHubConfigStore = create<GitHubConfigState>()(
  persist(
    (set, get) => ({
      storageConfig: defaultStorageConfig,
      authInfo: null,
      userInfo: null,
      isAuthenticated: false,
      
      setStorageConfig: (config: Partial<GitHubStorageConfig>) => {
        set((state) => ({
          storageConfig: { ...state.storageConfig, ...config }
        }));
      },
      
      resetStorageConfig: () => {
        set({ storageConfig: defaultStorageConfig });
      },
      
      isStorageConfigured: () => {
        const { storageConfig } = get();
        return storageConfig.owner.trim() !== '' && storageConfig.repo.trim() !== '';
      },
      
      setAuthInfo: (authInfo: GitHubAuthInfo) => {
        set({ 
          authInfo,
          userInfo: authInfo.user,
          isAuthenticated: true 
        });
      },
      
      clearAuthInfo: () => {
        set({ 
          authInfo: null,
          userInfo: null,
          isAuthenticated: false 
        });
      },
      
      setUserInfo: (userInfo: GitHubUserInfo) => {
        set({ userInfo });
      },
      
      clearUserInfo: () => {
        set({ userInfo: null });
      },
      
      setAuthenticated: (authenticated: boolean) => {
        set({ isAuthenticated: authenticated });
      }
    }),
    {
      name: 'github-config-storage',
      partialize: (state) => ({ 
        storageConfig: state.storageConfig,
        authInfo: state.authInfo,
        userInfo: state.userInfo,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
