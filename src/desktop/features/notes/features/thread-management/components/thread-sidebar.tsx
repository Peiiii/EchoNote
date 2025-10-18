import { useChannelMessages } from "@/common/features/notes/hooks/use-channel-messages";
import { Bot, ChevronDown, ChevronUp, MessageCircle, Send, User, X } from "lucide-react";
import { useState } from "react";
import { isModifierKeyPressed } from "@/common/lib/keyboard-shortcuts";

interface ThreadSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage?: (content: string) => void;
  currentThreadId?: string;
}

export const ThreadSidebar = ({
  isOpen,
  onClose,
  onSendMessage,
  currentThreadId,
}: ThreadSidebarProps) => {
  const { messages } = useChannelMessages({});
  const parentMessage = currentThreadId
    ? messages?.find(m => m.id === currentThreadId) || null
    : null;

  const threadMessages = currentThreadId
    ? messages?.filter(m => m.threadId === currentThreadId) || []
    : [];

  const [newMessage, setNewMessage] = useState("");
  const [isOriginalExpanded, setIsOriginalExpanded] = useState(false);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage?.(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isModifierKeyPressed(e)) {
      e.preventDefault();
      handleSend();
    }
  };

  // 计算内容截断
  const getTruncatedContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (!isOpen) return null;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900">
      {/* Header - 固定高度 */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Discussion</h3>
          {threadMessages.length > 0 && (
            <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
              {threadMessages.length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors duration-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 中间内容区域 - 可滚动，包含原始内容和讨论消息 */}
      <div className="flex-1 overflow-y-auto timeline-scroll">
        {/* Parent Message - 展开状态直接平铺 */}
        {parentMessage && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">
                  Original Thought
                </div>

                {/* 内容区域 - 展开状态直接平铺，收起状态截断 */}
                <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isOriginalExpanded
                    ? parentMessage.content
                    : getTruncatedContent(parentMessage.content)}
                </div>

                {/* 展开/收起按钮 */}
                {parentMessage.content.length > 200 && (
                  <button
                    onClick={() => setIsOriginalExpanded(!isOriginalExpanded)}
                    className="mt-2 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    {isOriginalExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        Show more
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Thread Messages */}
        <div className="p-4 space-y-4">
          {threadMessages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No replies yet. Start the discussion!
              </p>
            </div>
          ) : (
            threadMessages.map(message => (
              <div key={message.id} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === "user" ? "bg-blue-500" : "bg-slate-500"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">
                    {message.sender === "user" ? "You" : "AI Assistant"}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Input - 固定底部 */}
      <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add to discussion..."
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder:text-slate-500 resize-none focus:outline-none  focus:border-transparent"
              rows={2}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:text-blue-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
