import React from 'react';
import { SpaceAwareChatProps } from './types';
import { useSpaceRecords } from './hooks/use-space-records';
import { useSpaceAIChat } from './hooks/use-space-ai-chat';
import { SpaceContextDisplay } from './components/space-context-display';
import { ChatMessage } from './components/chat-message';
import { ChatInput } from './components/chat-input';
import { Button } from '@/common/components/ui/button';
import { ScrollArea } from '@/common/components/ui/scroll-area';
import { RefreshCw, MessageSquare } from 'lucide-react';

export const SpaceAwareChat: React.FC<SpaceAwareChatProps> = ({
  spaceId,
  className = '',
  placeholder
}) => {
  const spaceContext = useSpaceRecords(spaceId);
  const { messages, isLoading, sendMessage, clearMessages } = useSpaceAIChat(spaceId, spaceContext);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 空间上下文显示 */}
      <SpaceContextDisplay spaceContext={spaceContext} spaceId={spaceId} />
      
      {/* 聊天区域 */}
      <div className="border rounded-lg p-4 bg-background">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            与AI助手聊天
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              disabled={messages.length === 0}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              清空对话
            </Button>
          </div>
        </div>
        
        {/* 消息列表 */}
        <ScrollArea className="h-96 mb-4">
          <div className="pr-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>开始与AI助手对话吧！</p>
                <p className="text-sm">AI助手已经了解了该空间的所有记录</p>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
          </div>
        </ScrollArea>
        
        {/* 输入框 */}
        <ChatInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
          placeholder={placeholder || `向AI助手询问关于 ${spaceId} 空间的问题...`}
        />
      </div>
      
      {/* 使用提示 */}
      <div className="text-xs text-muted-foreground text-center">
        <p>💡 提示：你可以询问AI助手关于该空间的任何问题，比如：</p>
        <p>"总结一下这个空间的内容"、"分析一下进度情况"、"有什么建议"</p>
      </div>
    </div>
  );
};
