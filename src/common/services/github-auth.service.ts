import { GitAuth, GitHubProvider, generateState, parseAuthCode } from '@dimstack/git-auth';

export interface GitHubAuthConfig {
    clientId: string;
    redirectUri: string;
    scopes?: string[];
}

export interface GitHubAuthResult {
    accessToken: string;
    refreshToken?: string;
    tokenType: string;
    expiresIn: number;
    scope: string;
    user: {
        login: string;
        id: number;
        avatar_url?: string;
        name?: string;
        email?: string;
    };
    platform: string;
    createdAt: number;
}

export class GitHubAuthService {
    private auth: GitAuth;

    constructor(config: GitHubAuthConfig) {
        const githubProvider = new GitHubProvider();

        this.auth = new GitAuth(githubProvider, {
            clientId: config.clientId,
            redirectUri: config.redirectUri,
            scopes: config.scopes || ['repo', 'user']
        });
    }

    /**
 * Start GitHub authentication flow
 */
    async startAuth(): Promise<string> {
        const state = generateState(32);

        // Store state parameter in sessionStorage (prevent CSRF attacks)
        sessionStorage.setItem('github_auth_state', state);

        // Generate authentication URL
        const authUrl = await this.auth.startAuth({ state });

        return authUrl;
    }

    /**
 * Handle authentication callback
 */
    async handleCallback(url: string): Promise<GitHubAuthResult> {
        const { code, state: receivedState, error } = parseAuthCode(url);
        console.log('[GitHubAuthService][handleCallback] code', { code, url });

        if (error) {
            throw new Error(`GitHub authentication failed: ${error}`);
        }

        if (!code) {
            throw new Error('Authorization code not received');
        }

        // Validate state parameter
        const originalState = sessionStorage.getItem('github_auth_state');
        if (!originalState || receivedState !== originalState) {
            throw new Error('State parameter validation failed, possible CSRF attack');
        }

        try {
            // Handle authentication callback
            const result = await this.auth.handleCallback(code, receivedState);

            // Clean up temporary state
            sessionStorage.removeItem('github_auth_state');

            // Store authentication result
            this.saveAuthResult(result);

            return result;
        } catch (error) {
            throw new Error(`Failed to handle authentication callback: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
 * Get current authentication status
 */
    getAuthStatus(): GitHubAuthResult | null {
        const authData = localStorage.getItem('github_auth');
        if (!authData) return null;

        try {
            const result = JSON.parse(authData) as GitHubAuthResult;

            // Check if token is expired
            const now = Date.now();
            const expiresAt = result.createdAt + (result.expiresIn * 1000);

            if (now >= expiresAt) {
                // Token expired, clear storage
                this.clearAuth();
                return null;
            }

            return result;
        } catch {
            // Parse failed, clear storage
            this.clearAuth();
            return null;
        }
    }

    /**
 * Check if authenticated
 */
    isAuthenticated(): boolean {
        return this.getAuthStatus() !== null;
    }

    /**
 * Get access token
 */
    getAccessToken(): string | null {
        const auth = this.getAuthStatus();
        return auth?.accessToken || null;
    }

    /**
 * Get user information
 */
    getUserInfo() {
        const auth = this.getAuthStatus();
        return auth?.user || null;
    }

    /**
 * Logout
 */
    logout(): void {
        this.clearAuth();
    }

    /**
 * Save authentication result
 */
    private saveAuthResult(result: GitHubAuthResult): void {
        localStorage.setItem('github_auth', JSON.stringify(result));
    }

    /**
 * Clear authentication data
 */
    private clearAuth(): void {
        localStorage.removeItem('github_auth');
        sessionStorage.removeItem('github_auth_state');
    }
}

// Create default instance (needs to be configured at app startup)
export let githubAuthService: GitHubAuthService;

/**
 * Initialize GitHub authentication service
 */
export function initializeGitHubAuth(config: GitHubAuthConfig): void {
    githubAuthService = new GitHubAuthService(config);
}

/**
 * Get GitHub authentication service instance
 */
export function getGitHubAuthService(): GitHubAuthService {
    if (!githubAuthService) {
        throw new Error('GitHub authentication service not initialized, please call initializeGitHubAuth first');
    }
    return githubAuthService;
}
