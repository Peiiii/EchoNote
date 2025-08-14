import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GitHubStorageConfig {
  owner: string;
  repo: string;
  branch: string;
  basePath: string;
}

interface GitHubConfigState {
  storageConfig: GitHubStorageConfig;
  setStorageConfig: (config: Partial<GitHubStorageConfig>) => void;
  resetStorageConfig: () => void;
  isStorageConfigured: () => boolean;
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
      }
    }),
    {
      name: 'github-config-storage',
      partialize: (state) => ({ storageConfig: state.storageConfig })
    }
  )
);
