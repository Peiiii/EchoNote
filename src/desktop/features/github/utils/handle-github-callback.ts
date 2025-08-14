import { getGitHubAuthService } from "@/common/services/github-auth.service";

// Handle OAuth callback
export const handleOAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
        try {
            const authService = getGitHubAuthService();
            await authService.handleCallback(window.location.href);

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

