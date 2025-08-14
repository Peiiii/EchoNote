import { getGitHubAuthService } from "@/common/services/github-auth.service";
import { useGitHubConfigStore } from "@/core/stores/github-config.store";

// Handle OAuth callback
export const handleOAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
        try {
            const authService = getGitHubAuthService();
            const result = await authService.handleCallback(window.location.href);
            console.log('[handleOAuthCallback] result', result);

            // Store authentication result in the store
            const { setAuthInfo } = useGitHubConfigStore.getState();
            setAuthInfo(result);

            // Clear URL and redirect
            const cleanUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, document.title, cleanUrl);
            window.location.hash = '#/github';
        } catch (error) {
            console.error('OAuth callback failed:', error);
            // const cleanUrl = window.location.pathname + window.location.hash;
            // window.history.replaceState({}, document.title, cleanUrl);
            // window.location.hash = '#/github';
        }
    }
};

