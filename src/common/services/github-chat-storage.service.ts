import { GitHubStorageService } from './github-storage.service';

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
  channelSlug: string;
  tags?: string[];
  parentId?: string;
  threadId?: string;
}

export interface ChannelMetadata {
  slug: string;
  name: string;
  description: string;
  createdAt: string;
  lastUpdated: string;
  [key: string]: unknown;
}

export interface DailyMessages {
  date: string;
  channelSlug: string;
  messages: ChatMessage[];
  [key: string]: unknown;
}

export class GitHubChatStorageService {
  private storageService: GitHubStorageService;

  constructor(storageService: GitHubStorageService) {
    this.storageService = storageService;
  }

  // 存储频道元数据
  async storeChannelMetadata(channel: ChannelMetadata): Promise<void> {
    const path = `channels/${channel.slug}/metadata.json`;
    await this.storageService.storeJSON(path, channel);
  }

  // 读取频道元数据
  async loadChannelMetadata(channelSlug: string): Promise<ChannelMetadata | null> {
    try {
      const path = `channels/${channelSlug}/metadata.json`;
      return await this.storageService.readJSON<ChannelMetadata>(path);
    } catch {
      return null;
    }
  }

  // 存储每日消息
  async storeDailyMessages(channelSlug: string, date: string, messages: ChatMessage[]): Promise<void> {
    const path = `channels/${channelSlug}/messages/${date}.json`;
    const dailyData: DailyMessages = {
      date,
      channelSlug,
      messages
    };
    await this.storageService.storeJSON(path, dailyData);
  }

  // 读取每日消息
  async loadDailyMessages(channelSlug: string, date: string): Promise<ChatMessage[]> {
    try {
      const path = `channels/${channelSlug}/messages/${date}.json`;
      const dailyData = await this.storageService.readJSON<DailyMessages>(path);
      return dailyData.messages || [];
    } catch {
      return [];
    }
  }

  // 添加消息到指定日期
  async addMessage(channelSlug: string, date: string, message: ChatMessage): Promise<void> {
    const existingMessages = await this.loadDailyMessages(channelSlug, date);
    existingMessages.push(message);
    await this.storeDailyMessages(channelSlug, date, existingMessages);
  }

  // 获取频道所有消息（简单实现，按日期加载）
  async getChannelMessages(channelSlug: string, startDate?: string, endDate?: string): Promise<ChatMessage[]> {
    // 这里简化实现，实际应该通过索引快速定位
    const dates = this.getDateRange(startDate, endDate);
    const allMessages: ChatMessage[] = [];

    for (const date of dates) {
      const messages = await this.loadDailyMessages(channelSlug, date);
      allMessages.push(...messages);
    }

    return allMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // 简单的日期范围生成
  private getDateRange(startDate?: string, endDate?: string): string[] {
    const dates: string[] = [];
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 默认30天
    const end = endDate ? new Date(endDate) : new Date();

    const current = new Date(start);
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }
}

// 创建默认实例
export let githubChatStorageService: GitHubChatStorageService;

/**
 * 初始化 GitHub 聊天存储服务
 */
export function initializeGitHubChatStorage(storageService: GitHubStorageService): void {
  githubChatStorageService = new GitHubChatStorageService(storageService);
}

/**
 * 获取 GitHub 聊天存储服务实例
 */
export function getGitHubChatStorageService(): GitHubChatStorageService {
  if (!githubChatStorageService) {
    throw new Error('GitHub chat storage service not initialized, please call initializeGitHubChatStorage first');
  }
  return githubChatStorageService;
}
