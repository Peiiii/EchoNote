import { Button } from "@/common/components/ui/button";
import { useChatDataStore } from "@/core/stores/chat-data.store";
import { Tool, ToolResult } from "@agent-labs/agent-chat";
import { ToolInvocation } from "@ai-sdk/ui-utils";
import { useState } from "react";

// Independent search form component
const SearchForm = ({ 
  toolInvocation, 
  onResult,
  channelId
}: { 
  toolInvocation: ToolInvocation; 
  onResult: (result: ToolResult) => void;
  channelId: string;
}) => {
  const [query, setQuery] = useState(toolInvocation.args.query || '');
  const [limit, setLimit] = useState(toolInvocation.args.limit || 5);
  
  const handleSearch = () => {
    const state = useChatDataStore.getState();
    const messages = state.messages.filter(msg => msg.channelId === channelId);
    
    const searchResults = messages
      .filter(msg => msg.content.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit)
      .map(msg => ({
        id: msg.id,
        content: msg.content.substring(0, 100) + '...',
        timestamp: new Date(msg.timestamp).toLocaleString()
      }));
    
    const result = `Found ${searchResults.length} messages matching "${query}":\n\n${searchResults.map(msg => `- ${msg.content} (${msg.timestamp})`).join('\n')}`;
    
    onResult({
      toolCallId: toolInvocation.toolCallId,
      result,
      state: 'result' as const
    });
  };
  
  return (
    <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-900/20">
      <h3 className="font-medium mb-2">Search Messages</h3>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter search query"
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="number"
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
        placeholder="Result limit"
        className="w-full p-2 border rounded mb-2"
      />
      <Button
        onClick={handleSearch}
        className="w-full"
        size="sm"
      >
        Search
      </Button>
    </div>
  );
};

export const createSearchMessagesTool = (channelId: string): Tool => ({
  name: 'searchMessages',
  description: 'Search for messages in the current channel',
  parameters: {
    type: 'object',
    properties: {
      query: { 
        type: 'string', 
        description: 'Search query' 
      },
      limit: { 
        type: 'number', 
        description: 'Maximum number of results' 
      }
    },
    required: ['query']
  },
  render: (toolInvocation: ToolInvocation, onResult: (result: ToolResult) => void) => {
    return (
      <SearchForm 
        toolInvocation={toolInvocation} 
        onResult={onResult}
        channelId={channelId}
      />
    );
  }
});
