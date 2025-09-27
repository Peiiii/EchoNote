import type { AssistantMessage, Message, ToolCall, ToolMessage } from '@ag-ui/client'
import type { TextUIPart, ToolInvocation, ToolInvocationUIPart, UIMessage } from '@agent-labs/agent-chat'

export const toolCallToToolInvocation = (toolCall: ToolCall): ToolInvocation => {
    return {
        toolCallId: toolCall.id,
        toolName: toolCall.function.name,
        args: JSON.parse(toolCall.function.arguments),
        state: "call",
    }
}

/**
 * 将 Message 数组转换为 UIMessage 数组
 * @param messages 原始消息数组
 * @returns 转换后的 UIMessage 数组
 */
export const convertMessagesToUIMessages = (
    messages: Message[],
): UIMessage[] => {
    // 创建一个 Map 来存储工具调用和它们的 ID
    const toolCallMap = new Map<string, ToolInvocation>()

    // 首先处理所有消息，收集工具调用和更新工具调用结果
    messages.forEach((message) => {
        if (message.role === 'assistant') {
            const assistantMessage = message as AssistantMessage
            if (assistantMessage.toolCalls && assistantMessage.toolCalls.length > 0) {
                assistantMessage.toolCalls.forEach((toolCall: ToolCall) => {
                    let parsedArgs: Record<string, unknown> | null = null;
                    try {
                        if (typeof toolCall.function.arguments === 'string') {
                            parsedArgs = JSON.parse(toolCall.function.arguments);
                        } else {
                            parsedArgs = toolCall.function.arguments;
                        }
                    } catch (_e) {
                        parsedArgs = { error: 'Invalid JSON', raw: toolCall.function.arguments };
                    }
                    toolCallMap.set(toolCall.id, {
                        state: 'call' as const,
                        toolCallId: toolCall.id,
                        toolName: toolCall.function.name,
                        args: parsedArgs,
                    })
                })
            }
        } else if (message.role === 'tool') {
            const toolMessage = message as ToolMessage
            const toolInvocation = toolCallMap.get(toolMessage.toolCallId)
            if (toolInvocation) {
                // 更新工具调用的状态为结果
                let parsedResult: Record<string, unknown> | null = null;
                try {
                    if (typeof toolMessage.content === 'string') {
                        parsedResult = JSON.parse(toolMessage.content);
                    } else {
                        parsedResult = toolMessage.content;
                    }
                } catch (_e) {
                    // 解析失败时，保留原始内容并标记错误
                    parsedResult = { error: 'Invalid JSON', raw: toolMessage.content };
                }
                toolCallMap.set(toolMessage.toolCallId, {
                    ...toolInvocation,
                    state: 'result' as const,
                    result: parsedResult,
                })
            }
        }
    })

    // 然后处理所有消息，生成最终的 UIMessage，但过滤掉 role === 'tool' 的消息
    return messages
        .filter((message) => message.role !== 'tool')
        .map((message) => {
            const parts: Array<TextUIPart | ToolInvocationUIPart> = []

            // 添加文本内容
            if (message.content) {
                parts.push({
                    type: 'text',
                    text: message.content,
                })
            }

            // 处理助手消息的工具调用
            if (message.role === 'assistant') {
                const assistantMessage = message as AssistantMessage
                if (assistantMessage.toolCalls && assistantMessage.toolCalls.length > 0) {
                    assistantMessage.toolCalls.forEach((toolCall: ToolCall) => {
                        const toolInvocation = toolCallMap.get(toolCall.id)
                        if (toolInvocation) {
                            parts.push({
                                type: 'tool-invocation',
                                toolInvocation,
                            })
                        }
                    })
                }
            }

            return {
                ...message,
                parts,
            } as UIMessage
        })
}


const mergeAssistantMessages = (params: {
    messages: (Message & { role: "assistant" | "tool" })[],
    assistantMessageId: string,
}): Message[] => {
    const { messages, assistantMessageId } = params
    const toolCalls: ToolCall[] = messages.filter((message): message is Message & { role: "assistant", toolCalls: ToolCall[] } => message.role === "assistant" && !!message.toolCalls).map((message) => message.toolCalls).flat()
    const content = messages.filter(message => message.role === "assistant").map(message => message.content).join('\n')
    const toolResultMessages = messages.filter(message => message.role === "tool")
    return [{
        id: assistantMessageId,
        role: "assistant",
        content,
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    }, ...toolResultMessages]
}

export const convertMessageToMessages = (
    message: UIMessage & { role: "system" | "assistant" | "user" },
    part: UIMessage["parts"][number],
    index: number,
): Message[] => {
    const { id: groupId, role } = message
    const messages: Message[] = []
    const partId = `${groupId}-${index}`
    if (part.type === 'text') {
        messages.push({
            id: partId,
            role,
            content: part.text,
        })
    }
    else if (part.type === 'tool-invocation') {
        const toolCallMessage: AssistantMessage = {
            id: `${partId}-tool-call`,
            role: "assistant",
            content: "",
            toolCalls: [
                {
                    id: part.toolInvocation.toolCallId,
                    type: 'function',
                    function: {
                        name: part.toolInvocation.toolName,
                        arguments: JSON.stringify(part.toolInvocation.args),
                    }
                },
            ],
        }
        if (part.toolInvocation.state !== "result") {
            messages.push(toolCallMessage)
        } else {
            const toolResultMessage: ToolMessage = {
                id: `${partId}-tool-result`,
                role: 'tool',
                toolCallId: part.toolInvocation.toolCallId,
                content: JSON.stringify(part.toolInvocation.result),
            }
            messages.push(toolCallMessage, toolResultMessage)
        }
    }
    return role === "assistant" ? mergeAssistantMessages({
        messages: messages as (Message & { role: "assistant" | "tool" })[],
        assistantMessageId: groupId,
    }) : messages
}

export const convertUIMessagesToMessages = (
    messages: UIMessage[],
): Message[] => {
    return messages.filter(message => message.role !== "data").map(message => {
        return message.parts.map((part, index) => {
            return convertMessageToMessages(message as UIMessage & { role: "system" | "assistant" | "user" }, part, index)
        }).flat()
    }).flat()
}