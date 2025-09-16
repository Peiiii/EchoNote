import { AgentChatCore, IAgent, Tool, useAgentSessionManager, useAgentSessionManagerState, useParseTools } from "@agent-labs/agent-chat";
import { Bot } from "lucide-react";
import { v4 } from "uuid";

interface AIAssistantCoreProps {
    isOpen: boolean;
    channelName?: string;
    agent: IAgent;
    tools: Tool[];
    contexts: Array<{ description: string; value: string }>;
    className?: string;
    showHeader?: boolean;
    showFooter?: boolean;
    variant?: 'sidebar' | 'fullscreen';
    extra?: React.ReactNode;
}

export function AIAssistantCore({
    isOpen,
    channelName,
    agent,
    tools,
    contexts,
    className = "",
    showHeader = true,
    showFooter = true,
    variant = 'sidebar',
    extra
}: AIAssistantCoreProps) {

    const { toolDefs, toolExecutors, toolRenderers } = useParseTools(tools);
    const agentSessionManager = useAgentSessionManager({
        agent,
        getToolDefs: () => toolDefs,
        getContexts: () => contexts,
        initialMessages: [],
        getToolExecutor: (name: string) => toolExecutors[name],
    });
    const { messages, isAgentResponding, threadId } = useAgentSessionManagerState(agentSessionManager);
    console.log("[AIAssistantCore] messages", { messages, isAgentResponding, threadId });
    if (!isOpen) return null;

    const containerClasses = variant === 'sidebar'
        ? "h-full flex flex-col bg-card dark:bg-card w-full"
        : "h-full flex flex-col bg-background w-full";

    const headerClasses = variant === 'sidebar'
        ? "flex items-center justify-between p-4 border-b border-border flex-shrink-0"
        : "flex items-center justify-start p-4 border-b border-border flex-shrink-0";

    const footerClasses = variant === 'sidebar'
        ? "p-3 border-t border-border bg-accent flex-shrink-0"
        : "p-3 border-t border-border bg-muted flex-shrink-0";

    return (
        <div className={`${containerClasses} ${className}`}>
            {/* Header */}
            {showHeader && (
                <div className={headerClasses}>
                    <div className="flex items-center gap-2 min-w-0">
                        <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <h3 className="font-semibold text-foreground truncate">
                            AI Assistant
                        </h3>
                        {channelName && (
                            <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex-shrink-0 truncate max-w-32">
                                {channelName}
                            </span>
                        )}
                    </div>
                    {/* Custom header content (e.g., close button) */}
                    {extra}
                </div>
            )}

            {/* AI Chat Interface */}
            <div className="flex-1 overflow-hidden w-full">
                <div
                    className="h-full w-full"
                    style={{
                        maxWidth: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <AgentChatCore
                        agentSessionManager={agentSessionManager}
                        toolRenderers={toolRenderers}
                        className="h-full w-full max-w-full"
                        messageItemProps={{
                            showAvatar: false,
                        }}
                        promptsProps={{
                            items: [
                                {
                                    id: "prompt-1",
                                    prompt: "聊聊吧",
                                },
                                {
                                    id: "prompt-2",
                                    prompt: "帮我总结一下",
                                },
                                {
                                    id: "prompt-3",
                                    prompt: "你有啥建议吗",
                                },
                                {
                                    id: "prompt-4",
                                    prompt: "我接下来该做什么呢？",
                                },
                                {
                                    id: "prompt-5",
                                    prompt: "有什么很重要但是被我忽略的东西？",
                                },
                                {
                                    id: "prompt-6",
                                    prompt: "接下来一周的建议",
                                }

                            ],
                            onItemClick: ({ prompt }) => {
                                agentSessionManager.handleAddMessages([{
                                    id: v4(),
                                    role: "user",
                                    parts: [{
                                        type: "text",
                                        text: prompt,
                                    }],
                                }])
                            }
                        }}
                    />
                </div>
            </div>

            {/* Footer */}
            {showFooter && (
                <div className={footerClasses}>
                    <div className="text-xs text-muted-foreground text-center">
                        <p className="truncate">
                            {channelName
                                ? `AI Assistant understands channel "${channelName}"`
                                : "AI Assistant is ready to help"
                            }
                        </p>
                        <p className="truncate">Ask questions or use available tools</p>
                    </div>
                </div>
            )}
        </div>
    );
}
