import { formatTimeForSocial } from "@/common/lib/time-utils";
import { Message, useChatDataStore } from "@/core/stores/chat-data-store";
import { Bookmark, Clock, Eye, Lightbulb, MessageCircle } from "lucide-react";
import { useState } from "react";

import { MoreActionsMenu } from "../more-actions-menu";
import { ThoughtRecordSparks } from "./thought-record-sparks";
import { MarkdownContent } from "./markdown-content";

interface ThoughtRecordProps {
    message: Message;
    isFirstInGroup: boolean;
    onReply?: () => void;
    onOpenThread?: (messageId: string) => void;
    threadCount?: number;
}

// 提取可复用的操作按钮组件
interface ActionButtonProps {
    icon: React.ComponentType<{ className?: string }>;
    onClick?: () => void;
    title: string;
    disabled?: boolean;
}

function ActionButton({ icon: Icon, onClick, title, disabled }: ActionButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 hover:scale-105"
            title={title}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
}

// 提取线程指示器组件
interface ThreadIndicatorProps {
    threadCount: number;
    onOpenThread?: (messageId: string) => void;
    messageId: string;
}

function ThreadIndicator({ threadCount, onOpenThread, messageId }: ThreadIndicatorProps) {
    const displayText = threadCount > 0 ? `${threadCount} replies` : 'Start discussion';
    
    return (
        <button
            onClick={() => onOpenThread?.(messageId)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-lg transition-all duration-200 cursor-pointer"
        >
            <MessageCircle className="w-3 h-3" />
            <span>{displayText}</span>
        </button>
    );
}

// 提取操作按钮组
interface ActionButtonsProps {
    onToggleAnalysis: () => void;
    onReply?: () => void;
    message: Message;
    onDelete: () => void;
}

function ActionButtons({ onToggleAnalysis, onReply, message, onDelete }: ActionButtonsProps) {
    const actionButtons = [
        { icon: Lightbulb, onClick: onToggleAnalysis, title: "Toggle sparks" },
        { icon: Eye, onClick: undefined, title: "View details" },
        { icon: Bookmark, onClick: undefined, title: "Bookmark" },
        { icon: MessageCircle, onClick: onReply, title: "Reply to thought" },
    ];

    return (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            {actionButtons.map(({ icon, onClick, title }) => (
                <ActionButton
                    key={title}
                    icon={icon}
                    onClick={onClick}
                    title={title}
                />
            ))}
            <MoreActionsMenu
                message={message}
                onDelete={onDelete}
                onCopy={() => navigator.clipboard.writeText(message.content)}
            />
        </div>
    );
}

export function ThoughtRecord({ 
    message, 
    onReply, 
    onOpenThread, 
    threadCount = 0 
}: Omit<ThoughtRecordProps, 'isFirstInGroup'>) {
    const [showAnalysis, setShowAnalysis] = useState(false);
    const deleteMessage = useChatDataStore(state => state.deleteMessage);

    const aiAnalysis = message.aiAnalysis;
    const hasSparks = Boolean(aiAnalysis?.insights?.length);

    // 如果消息已被删除，不显示内容
    if (message.isDeleted) {
        return null;
    }

    // 删除方法（使用原生 confirm）
    const handleDelete = async () => {
        const messagePreview = message.content.length > 100 
            ? `${message.content.substring(0, 100)}...` 
            : message.content;
            
        const confirmed = window.confirm(
            `🗑️ Delete Thought\n\n` +
            `"${messagePreview}"\n\n` +
            `⚠️ This action cannot be undone.\n` +
            `The thought will be moved to trash.\n\n` +
            `Are you sure you want to continue?`
        );
        
        if (confirmed) {
            try {
                await deleteMessage(message.id, false); // 软删除
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                alert(`❌ Failed to delete the message.\n\nError: ${errorMessage}\n\nPlease try again.`);
            }
        }
    };

    const handleToggleAnalysis = () => {
        setShowAnalysis(!showAnalysis);
    };

    return (
        <div className="w-full">
            {/* Thought Record Container */}
            <div className="group relative w-full px-8 py-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300 ease-out hover:shadow-sm">
                {/* Record Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 shadow-sm"></div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeForSocial(message.timestamp)}</span>
                        </div>
                    </div>

                    <ActionButtons
                        onToggleAnalysis={handleToggleAnalysis}
                        onReply={onReply}
                        message={message}
                        onDelete={handleDelete}
                    />
                </div>

                {/* Main Content */}
                <MarkdownContent content={message.content} />

                {/* Sparks Section */}
                <ThoughtRecordSparks
                    message={message}
                    showAnalysis={showAnalysis}
                    onToggleAnalysis={handleToggleAnalysis}
                />

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <div className="flex items-center gap-4">
                        <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer">
                            {message.content.length} characters
                        </span>
                        {hasSparks && (
                            <>
                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer">
                                    {aiAnalysis!.insights.length} sparks
                                </span>
                            </>
                        )}
                    </div>

                    {/* Thread indicator */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <ThreadIndicator
                            threadCount={threadCount}
                            onOpenThread={onOpenThread}
                            messageId={message.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
