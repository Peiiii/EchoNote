import { githubStorageService, GitHubStorageService } from './github-storage.service';

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

export interface ChannelIndex {
  channelSlug: string;
  lastUpdated: string;
  totalMessages: number;
  totalDays: number;
  fileIndex: {
    [date: string]: {
      file: string;
      messageCount: number;
      firstMessage: string | null;
      lastMessage: string | null;
      firstTimestamp: string | null;
      lastTimestamp: string | null;
      size: string;
    };
  };
  threads: {
    [threadId: string]: {
      firstMessage: string;
      lastMessage: string;
      firstTimestamp: string;
      lastTimestamp: string;
      messageCount: number;
    };
  };
  [key: string]: unknown;
}

export interface ChannelOverview {
  id: string;
  slug: string;
  name: string;
  description: string;
  createdAt: string;
  lastUpdated: string;
  totalMessages: number;
  totalDays: number;
  status: string;
  priority: string;
  lastMessageId: string | null;
  lastMessageTimestamp: string;
}

export interface GlobalChannelsIndex {
  lastUpdated: string;
  channels: {
    [channelSlug: string]: ChannelOverview;
  };
  global: {
    totalChannels: number;
    totalMessages: number;
    totalDays: number;
    lastSync: string;
    storageSize: string;
  };
  [key: string]: unknown;
}

export class GitHubChatStorageService {
  private storageService: GitHubStorageService;

  constructor() {
    this.storageService = githubStorageService;
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

    // 自动更新频道索引
    await this.updateChannelIndex(channelSlug, date, existingMessages.length);

    // 自动更新全局频道索引
    await this.updateGlobalChannelsIndex(channelSlug);
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

  // 存储频道索引
  async storeChannelIndex(channelSlug: string, index: ChannelIndex): Promise<void> {
    const path = `channels/${channelSlug}/index.json`;
    await this.storageService.storeJSON(path, index);
  }

  // 读取频道索引
  async loadChannelIndex(channelSlug: string): Promise<ChannelIndex | null> {
    try {
      const path = `channels/${channelSlug}/index.json`;
      return await this.storageService.readJSON<ChannelIndex>(path);
    } catch {
      return null;
    }
  }

  // 更新频道索引（添加新消息后调用）
  async updateChannelIndex(channelSlug: string, date: string, messageCount: number): Promise<void> {
    let index = await this.loadChannelIndex(channelSlug);

    if (!index) {
      index = {
        channelSlug,
        lastUpdated: new Date().toISOString(),
        totalMessages: 0,
        totalDays: 0,
        fileIndex: {},
        threads: {}
      };
    }

    // 更新文件索引
    index.fileIndex[date] = {
      file: `messages/${date}.json`,
      messageCount,
      firstMessage: null, // 简化实现，暂时不记录具体消息ID
      lastMessage: null,
      firstTimestamp: null,
      lastTimestamp: null,
      size: "0KB" // 简化实现，暂时不计算文件大小
    };

    // 更新统计信息
    index.totalMessages = Object.values(index.fileIndex)
      .reduce((sum, file) => sum + file.messageCount, 0);
    index.totalDays = Object.keys(index.fileIndex).length;
    index.lastUpdated = new Date().toISOString();

    await this.storeChannelIndex(channelSlug, index);
  }

  // 获取频道概览信息
  async getChannelOverview(channelSlug: string): Promise<ChannelOverview | null> {
    const metadata = await this.loadChannelMetadata(channelSlug);
    const index = await this.loadChannelIndex(channelSlug);

    if (!metadata) return null;

    return {
      id: `channel-${channelSlug}`,
      slug: channelSlug,
      name: metadata.name,
      description: metadata.description,
      createdAt: metadata.createdAt,
      lastUpdated: metadata.lastUpdated,
      totalMessages: index?.totalMessages || 0,
      totalDays: index?.totalDays || 0,
      status: "active",
      priority: "high",
      lastMessageId: null, // 简化实现
      lastMessageTimestamp: index?.lastUpdated || metadata.lastUpdated
    };
  }

  // 存储全局频道索引
  async storeGlobalChannelsIndex(index: GlobalChannelsIndex): Promise<void> {
    const path = `global/channels-index.json`;
    await this.storageService.storeJSON(path, index);
  }

  // 读取全局频道索引
  async loadGlobalChannelsIndex(): Promise<GlobalChannelsIndex | null> {
    try {
      const path = `global/channels-index.json`;
      return await this.storageService.readJSON<GlobalChannelsIndex>(path);
    } catch {
      return null;
    }
  }

  // 更新全局频道索引
  async updateGlobalChannelsIndex(channelSlug: string): Promise<void> {
    const overview = await this.getChannelOverview(channelSlug);
    if (!overview) return;

    let globalIndex = await this.loadGlobalChannelsIndex();

    if (!globalIndex) {
      globalIndex = {
        lastUpdated: new Date().toISOString(),
        channels: {},
        global: {
          totalChannels: 0,
          totalMessages: 0,
          totalDays: 0,
          lastSync: new Date().toISOString(),
          storageSize: "0MB"
        }
      };
    }

    // 更新频道信息
    globalIndex.channels[channelSlug] = overview;

    // 重新计算全局统计
    const channels = Object.values(globalIndex.channels);
    globalIndex.global.totalChannels = channels.length;
    globalIndex.global.totalMessages = channels.reduce((sum, ch) => sum + ch.totalMessages, 0);
    globalIndex.global.totalDays = channels.reduce((sum, ch) => sum + ch.totalDays, 0);
    globalIndex.global.lastSync = new Date().toISOString();
    globalIndex.lastUpdated = new Date().toISOString();

    await this.storeGlobalChannelsIndex(globalIndex);
  }
}

// 创建默认实例
export const githubChatStorageService = new GitHubChatStorageService();

