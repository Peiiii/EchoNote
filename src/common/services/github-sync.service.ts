import { Channel, Message } from '@/core/stores/chat-data-store';
import { useChatDataStore } from '@/core/stores/chat-data-store';
import { useChatViewStore } from '@/core/stores/chat-view-store';
import { githubChatStorageService } from './github-chat-storage.service';

export class GitHubSyncService {
    private chatStorageService = githubChatStorageService;

    // 同步本地数据到 GitHub
    async syncToGitHub(): Promise<void> {
        console.log('[GitHubSyncService] syncToGitHub');
        
        const dataStore = useChatDataStore.getState();
        const viewStore = useChatViewStore.getState();
        
        if (!viewStore.isGitHubEnabled) {
            throw new Error('GitHub sync is not enabled');
        }

        // 同步频道元数据
        console.log('[GitHubSyncService] syncChannelToGitHub', dataStore.channels);
        for (const channel of dataStore.channels) {
            await this.syncChannelToGitHub(channel);
        }

        // 同步消息数据
        for (const message of dataStore.messages) {
            await this.syncMessageToGitHub(message);
        }
    }

    // 从 GitHub 加载数据到本地
    async loadFromGitHub(): Promise<void> {
        console.log('[GitHubSyncService] loadFromGitHub');
        
        const viewStore = useChatViewStore.getState();
        
        if (!viewStore.isGitHubEnabled) {
            throw new Error('GitHub sync is not enabled');
        }

        // 获取所有频道
        const globalIndex = await this.chatStorageService.loadGlobalChannelsIndex();
        if (!globalIndex) return;

        // 加载频道数据
        for (const channelSlug of Object.keys(globalIndex.channels)) {
            await this.loadChannelFromGitHub(channelSlug);
        }
    }

    // 同步单个频道到 GitHub
    private async syncChannelToGitHub(channel: Channel): Promise<void> {
        console.log('[GitHubSyncService] syncChannelToGitHub', channel);
        const channelMetadata = {
            slug: channel.id,
            name: channel.name,
            description: channel.description,
            createdAt: channel.createdAt.toISOString(),
            lastUpdated: new Date().toISOString()
        };

        await this.chatStorageService.storeChannelMetadata(channelMetadata);
    }

    // 同步单个消息到 GitHub
    private async syncMessageToGitHub(message: Message): Promise<void> {
        const date = message.timestamp.toISOString().split('T')[0];
        const channelSlug = message.channelId;

        const chatMessage = {
            id: message.id,
            content: message.content,
            sender: message.sender,
            timestamp: message.timestamp.toISOString(),
            channelSlug: message.channelId,
            tags: message.tags || [],
            parentId: message.parentId || undefined,
            threadId: message.threadId || undefined
        };

        await this.chatStorageService.addMessage(channelSlug, date, chatMessage);
    }

    // 从 GitHub 加载频道数据
    private async loadChannelFromGitHub(channelSlug: string): Promise<void> {
        const metadata = await this.chatStorageService.loadChannelMetadata(channelSlug);
        if (!metadata) return;

        // 检查频道是否已存在
        const dataStore = useChatDataStore.getState();
        const existingChannel = dataStore.channels.find(ch => ch.id === channelSlug);

        if (!existingChannel) {
            // 添加新频道
            const newChannel: Omit<Channel, "id" | "createdAt" | "messageCount"> = {
                name: metadata.name,
                description: metadata.description
            };
            dataStore.addChannel(newChannel);
        }

        // 加载频道消息
        await this.loadChannelMessagesFromGitHub(channelSlug);
    }

    // 从 GitHub 加载频道消息
    private async loadChannelMessagesFromGitHub(channelSlug: string): Promise<void> {
        const messages = await this.chatStorageService.getChannelMessages(channelSlug);
        const dataStore = useChatDataStore.getState();

        for (const chatMessage of messages) {
            // 检查消息是否已存在
            const existingMessage = dataStore.messages.find(msg => msg.id === chatMessage.id);
            if (existingMessage) continue;

            // 添加新消息
            const newMessage: Omit<Message, "id" | "timestamp"> = {
                content: chatMessage.content,
                sender: chatMessage.sender,
                channelId: chatMessage.channelSlug,
                tags: chatMessage.tags,
                parentId: chatMessage.parentId || undefined,
                threadId: chatMessage.threadId || undefined
            };

            dataStore.addMessage(newMessage);
        }
    }

    // 获取同步状态
    async getSyncStatus(): Promise<{
        isEnabled: boolean;
        lastSync: string | null;
        channelCount: number;
        messageCount: number;
    }> {
        try {
            const globalIndex = await this.chatStorageService.loadGlobalChannelsIndex();

            return {
                isEnabled: true,
                lastSync: globalIndex?.global.lastSync || null,
                channelCount: globalIndex?.global.totalChannels || 0,
                messageCount: globalIndex?.global.totalMessages || 0
            };
        } catch {
            return {
                isEnabled: false,
                lastSync: null,
                channelCount: 0,
                messageCount: 0
            };
        }
    }
}

// 创建默认实例
export const githubSyncService = new GitHubSyncService();
