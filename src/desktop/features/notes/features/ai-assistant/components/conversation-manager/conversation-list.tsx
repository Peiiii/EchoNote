import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Archive, Trash2, Edit, Search } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Badge } from "@/common/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/common/components/ui/dropdown-menu";
import { useAIConversationStore } from "@/core/stores/ai-conversation.store";
import { AIConversation } from "@/common/types/ai-conversation";

interface ConversationListProps {
  onSelectConversation: (conversationId: string) => void;
  onEditConversation: (conversation: AIConversation) => void;
  onDeleteConversation: (conversationId: string) => void;
  onArchiveConversation: (conversationId: string, isArchived: boolean) => void;
  selectedConversationId?: string;
  channelId?: string;
}

export function ConversationList({
  onSelectConversation,
  onEditConversation,
  onDeleteConversation,
  onArchiveConversation,
  selectedConversationId,
  channelId
}: ConversationListProps) {
  const { conversations, loading, filters, setFilters } = useAIConversationStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(conversation => {
    const matchesChannel = !channelId || conversation.channelId === channelId;
    const matchesSearch = !searchQuery || 
      conversation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilters = !filters.isArchived || conversation.isArchived === filters.isArchived;
    
    return matchesChannel && matchesSearch && matchesFilters;
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleArchiveToggle = (conversation: AIConversation) => {
    onArchiveConversation(conversation.id, !conversation.isArchived);
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filters.isArchived === undefined ? "default" : "outline"}
            size="sm"
            onClick={() => setFilters({ ...filters, isArchived: undefined })}
          >
            All
          </Button>
          <Button
            variant={filters.isArchived === false ? "default" : "outline"}
            size="sm"
            onClick={() => setFilters({ ...filters, isArchived: false })}
          >
            Active
          </Button>
          <Button
            variant={filters.isArchived === true ? "default" : "outline"}
            size="sm"
            onClick={() => setFilters({ ...filters, isArchived: true })}
          >
            Archived
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No conversations found</p>
            {searchQuery && (
              <p className="text-sm">Try adjusting your search terms</p>
            )}
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <Card
              key={conversation.id}
              className={`cursor-pointer transition-colors hover:bg-accent ${
                selectedConversationId === conversation.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium truncate">
                      {conversation.title}
                    </CardTitle>
                    {conversation.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {conversation.description}
                      </p>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditConversation(conversation)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleArchiveToggle(conversation)}>
                        <Archive className="h-4 w-4 mr-2" />
                        {conversation.isArchived ? "Unarchive" : "Archive"}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteConversation(conversation.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>{conversation.messageCount} messages</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(conversation.lastMessageAt, { addSuffix: true })}
                    </span>
                  </div>
                  
                  {conversation.tags && conversation.tags.length > 0 && (
                    <div className="flex gap-1">
                      {conversation.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {conversation.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{conversation.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
