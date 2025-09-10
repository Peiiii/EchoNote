import { useState, useEffect } from "react";
import { Plus, MessageSquare, Archive, Search } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { ScrollArea } from "@/common/components/ui/scroll-area";
import { useAIConversationStore } from "@/core/stores/ai-conversation.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { AIConversation } from "@/common/types/ai-conversation";
import { format } from "date-fns";

interface CompactConversationManagerProps {
  channelId?: string;
  onSelectConversation?: (conversationId: string) => void;
  selectedConversationId?: string;
}

export function CompactConversationManager({
  channelId,
  onSelectConversation,
  selectedConversationId
}: CompactConversationManagerProps) {
  const { 
    conversations, 
    error, 
    loadConversations, 
    createConversation, 
    archiveConversation,
  } = useAIConversationStore();
  
  const { userId } = useNotesDataStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (userId) {
      loadConversations(userId, { 
        channelId,
        isArchived: showArchived,
        searchQuery: searchQuery || undefined
      });
    }
  }, [userId, channelId, showArchived, searchQuery, loadConversations]);

  const handleCreateConversation = async () => {
    if (!userId || !channelId || isCreating) return;
    
    setIsCreating(true);
    try {
      const conversation = await createConversation(
        userId,
        channelId,
        "New Chat",
        ""
      );
      onSelectConversation?.(conversation.id);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectConversation = (conversation: AIConversation) => {
    onSelectConversation?.(conversation.id);
  };

  const handleArchiveConversation = async (conversationId: string) => {
    if (!userId) return;
    try {
      await archiveConversation(userId, conversationId, !showArchived);
    } catch (error) {
      console.error("Failed to archive conversation:", error);
    }
  };


  const filteredConversations = conversations.filter(conv => {
    if (showArchived !== conv.isArchived) return false;
    if (searchQuery && !conv.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Compact Header */}
      <div className="p-3 border-b">
        <div className="flex items-center gap-2 mb-3">
          <Button
            onClick={handleCreateConversation}
            disabled={isCreating}
            size="sm"
            className="h-7 px-2 text-xs flex-1"
          >
            <Plus className="h-3 w-3 mr-1" />
            {isCreating ? "Creating..." : "New Chat"}
          </Button>
          <Button
            onClick={() => setShowArchived(!showArchived)}
            variant={showArchived ? "default" : "outline"}
            size="sm"
            className="h-7 px-2"
          >
            <Archive className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="h-7 pl-7 text-xs"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {error && (
            <div className="text-xs text-red-500 mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
              {error}
            </div>
          )}
          
          {filteredConversations.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">
                {showArchived ? "No archived conversations" : "No conversations yet"}
              </p>
              {!showArchived && (
                <Button
                  onClick={handleCreateConversation}
                  disabled={isCreating}
                  size="sm"
                  variant="outline"
                  className="mt-2 h-6 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {isCreating ? "Creating..." : "Start First Chat"}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedConversationId === conversation.id
                      ? "bg-accent"
                      : "hover:bg-accent/50"
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xs font-medium truncate">
                        {conversation.title}
                      </h4>
                      {conversation.messageCount > 0 && (
                        <span className="text-xs text-muted-foreground">
                          ({conversation.messageCount})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conversation.description || "No description"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(conversation.lastMessageAt, "MMM d, HH:mm")}
                    </p>
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchiveConversation(conversation.id);
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <Archive className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
