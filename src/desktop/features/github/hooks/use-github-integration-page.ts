import { validateGitHubConfig } from '@/common/config/github.config';
import { getGitHubAuthService } from '@/common/services/github-auth.service';
import { getGitHubStorageService, initializeGitHubStorage } from '@/common/services/github-storage.service';
import { useGitHubConfigStore } from '@/core/stores/github-config.store';
import { useEffect, useState } from 'react';

interface GitHubUserInfo {
  login: string;
  id: number;
  avatar_url?: string;
  name?: string;
  email?: string;
}

export function useGitHubIntegrationPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<GitHubUserInfo | null>(null);
  const [storageService, setStorageService] = useState<unknown>(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSync, setLastSync] = useState<string>('');
  const [configErrors, setConfigErrors] = useState<string[]>([]);

  // Use store for storage configuration
  const { storageConfig, setStorageConfig, isStorageConfigured } = useGitHubConfigStore();

  useEffect(() => {
    checkAuthStatus();
    checkConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkConfig = () => {
    const config = validateGitHubConfig();
    setConfigErrors(config.errors);
  };

  const checkAuthStatus = () => {
    try {
      const authService = getGitHubAuthService();
      const auth = authService.getAuthStatus();

      if (auth) {
        setIsAuthenticated(true);
        setUserInfo(auth.user as unknown as GitHubUserInfo);
        initializeStorageService();
      }
    } catch {
      // Service not initialized, ignore error
    }
  };

  const initializeStorageService = async () => {
    try {
      if (!storageConfig.owner.trim()) {
        throw new Error('Please configure storage settings first');
      }

      initializeGitHubStorage({
        owner: storageConfig.owner,
        repo: storageConfig.repo,
        basePath: storageConfig.basePath
      });

      const storage = getGitHubStorageService();
      await storage.initialize();
      setStorageService(storage);
    } catch (error) {
      console.error('Failed to initialize storage service:', error);
    }
  };

  const handleSyncNote = async () => {
    if (!storageService || !noteTitle.trim() || !noteContent.trim()) {
      return;
    }

    try {
      setSyncStatus('syncing');

      const timestamp = new Date().toISOString();
      const fileName = `${noteTitle.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.md`;

      const markdownContent = `# ${noteTitle}

Created: ${timestamp}

${noteContent}

---
*This note was automatically synchronized to GitHub by EchoNote*
`;

      await (storageService as { storeMarkdown: (path: string, content: string, options: { message?: string }) => Promise<void> }).storeMarkdown(`notes/${fileName}`, markdownContent, {
        message: `Add note: ${noteTitle}`
      });

      setSyncStatus('success');
      setLastSync(new Date().toLocaleString());

      // Clear inputs
      setNoteTitle('');
      setNoteContent('');

      // Reset status after 3 seconds
      setTimeout(() => setSyncStatus('idle'), 3000);

    } catch (error) {
      setSyncStatus('error');
      console.error('Failed to sync note:', error);

      // Reset status after 5 seconds
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
  };

  const handleLogout = () => {
    try {
      const authService = getGitHubAuthService();
      authService.logout();
      setIsAuthenticated(false);
      setUserInfo(null);
      setStorageService(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    // State
    isAuthenticated,
    userInfo,
    noteContent,
    noteTitle,
    syncStatus,
    lastSync,
    configErrors,
    storageConfig,
    isStorageConfigured: isStorageConfigured(),
    
    // Actions
    setNoteContent,
    setNoteTitle,
    setStorageConfig,
    handleSyncNote,
    handleLogout
  };
}
