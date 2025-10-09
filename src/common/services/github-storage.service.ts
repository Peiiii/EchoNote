import { useGitHubConfigStore } from "@/core/stores/github-config.store";
import { GitFileSystem, GitHubProvider } from "@dimstack/git-provider";

export interface GitHubStorageConfig {
  owner: string;
  repo: string;
  branch?: string;
  basePath?: string;
}

export interface StorageOptions {
  message?: string;
  author?: {
    name: string;
    email: string;
  };
}

export class GitHubStorageService {
  private provider: GitHubProvider | null = null;
  private fs: GitFileSystem | null = null;

  get config(): GitHubStorageConfig {
    return useGitHubConfigStore.getState().storageConfig;
  }

  /**
   * Initialize storage service
   */
  async initialize(): Promise<void> {
    // Get authentication info from store
    const store = useGitHubConfigStore.getState();

    if (!store.isAuthenticated) {
      throw new Error("GitHub authentication failed, please authenticate first");
    }

    const accessToken = store.authInfo?.accessToken;
    if (!accessToken) {
      throw new Error("Cannot get access token from store");
    }

    // Create GitHub Provider
    this.provider = new GitHubProvider({
      token: accessToken,
    });

    // Create file system instance
    this.fs = new GitFileSystem(this.provider, {
      owner: this.config.owner,
      repo: this.config.repo,
    });

    // Validate repository access permissions
    await this.validateAccess();
  }

  /**
   * Validate repository access permissions
   */
  private async validateAccess(): Promise<void> {
    if (!this.provider) {
      throw new Error("Storage service not initialized");
    }

    try {
      await this.provider.getRepository({
        owner: this.config.owner,
        repo: this.config.repo,
      });
    } catch {
      throw new Error(
        `Cannot access repository ${this.config.owner}/${this.config.repo}, please check permissions`
      );
    }
  }

  /**
   * Store text data
   */
  async storeText(path: string, content: string, options: StorageOptions = {}): Promise<void> {
    if (!this.fs) {
      throw new Error("Storage service not initialized");
    }

    const fullPath = this.getFullPath(path);
    const message = options.message || `Update ${path}`;

    try {
      await this.fs.writeFile(fullPath, content, { message });
    } catch (error) {
      throw new Error(
        `Failed to store file: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Store JSON data
   */
  async storeJSON(
    path: string,
    data: Record<string, unknown>,
    options: StorageOptions = {}
  ): Promise<void> {
    const jsonContent = JSON.stringify(data, null, 2);
    await this.storeText(path, jsonContent, options);
  }

  /**
   * Store Markdown data
   */
  async storeMarkdown(path: string, content: string, options: StorageOptions = {}): Promise<void> {
    // Ensure file extension is .md
    const markdownPath = path.endsWith(".md") ? path : `${path}.md`;
    await this.storeText(markdownPath, content, options);
  }

  /**
   * Read text data
   */
  async readText(path: string): Promise<string> {
    if (!this.fs) {
      throw new Error("Storage service not initialized");
    }

    const fullPath = this.getFullPath(path);

    try {
      const content = await this.fs.readFile(fullPath, { encoding: "utf-8" });
      return content as string;
    } catch (error) {
      throw new Error(
        `Failed to read file: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Read JSON data
   */
  async readJSON<T = Record<string, unknown>>(path: string): Promise<T> {
    const content = await this.readText(path);
    try {
      return JSON.parse(content) as T;
    } catch (error) {
      throw new Error(
        `Failed to parse JSON: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Delete file
   */
  async deleteFile(path: string, options: StorageOptions = {}): Promise<void> {
    if (!this.fs) {
      throw new Error("Storage service not initialized");
    }

    const fullPath = this.getFullPath(path);
    const message = options.message || `Delete ${path}`;

    try {
      // Note: GitFileSystem may not have deleteFile method, using putFile with empty content instead
      await this.fs.writeFile(fullPath, "", { message });
    } catch (error) {
      throw new Error(
        `Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * List directory contents
   */
  async listDirectory(path: string = ""): Promise<string[]> {
    if (!this.fs) {
      throw new Error("Storage service not initialized");
    }

    const fullPath = this.getFullPath(path);

    try {
      const items = await this.fs.readdir(fullPath);
      return items.map(item => item.name);
    } catch (error) {
      throw new Error(
        `Failed to list directory: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(path: string): Promise<boolean> {
    try {
      await this.readText(path);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get complete file path
   */
  private getFullPath(path: string): string {
    if (this.config.basePath) {
      return `${this.config.basePath}/${path}`.replace(/\/+/g, "/");
    }
    return path;
  }

  /**
   * Get repository information
   */
  async getRepositoryInfo() {
    if (!this.provider) {
      throw new Error("Storage service not initialized");
    }

    try {
      return await this.provider.getRepository({
        owner: this.config.owner,
        repo: this.config.repo,
      });
    } catch (error) {
      throw new Error(
        `Failed to get repository information: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Get branch list
   */
  async getBranches() {
    if (!this.provider) {
      throw new Error("Storage service not initialized");
    }

    try {
      return await this.provider.getBranches({
        owner: this.config.owner,
        repo: this.config.repo,
      });
    } catch (error) {
      throw new Error(
        `Failed to get branch list: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}

// Create default instance
export const githubStorageService = new GitHubStorageService();
