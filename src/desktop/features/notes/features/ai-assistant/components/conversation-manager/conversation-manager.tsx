import { useState, useEffect } from "react";
import { Plus, MessageSquare, Archive } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/common/components/ui/tabs";
import { useAIConversationStore } from "@/core/stores/ai-conversation.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { ConversationList } from "./conversation-list";
import { ConversationEditor } from "./conversation-editor";
import { AIConversation } from "@/common/types/ai-conversation";

interface ConversationManagerProps {
  channelId?: string;
  onSelectConversation?: (conversationId: string) => void;
  selectedConversationId?: string;
}

export function ConversationManager({
  channelId,
  onSelectConversation,
  selectedConversationId
}: ConversationManagerProps) {
  const { 
    conversations, 
    error, 
    loadConversations, 
    createConversation, 
    updateConversation, 
    deleteConversation, 
    archiveConversation,
    clearError 
  } = useAIConversationStore();
  
  const { userId } = useNotesDataStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingConversation, setEditingConversation] = useState<AIConversation | null>(null);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    if (userId) {
      loadConversations(userId, { 
        channelId,
        isArchived: activeTab === "archived" 
      });
    }
  }, [userId, channelId, activeTab, loadConversations]);

  const handleCreateConversation = () => {
    setEditingConversation(null);
    setIsEditorOpen(true);
  };

  const handleEditConversation = (conversation: AIConversation) => {
    setEditingConversation(conversation);
    setIsEditorOpen(true);
  };

  const handleSaveConversation = async (conversationData: Partial<AIConversation>) => {
    if (!userId) return;

    try {
      if (editingConversation) {
        await updateConversation(userId, editingConversation.id, conversationData);
      } else {
        await createConversation(
          userId,
          channelId || "default",
          conversationData.title!,
          conversationData.description,
          conversationData.metadata
        );
      }
    } catch (error) {
      console.error("Failed to save conversation:", error);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!userId) return;

    if (confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) {
      try {
        await deleteConversation(userId, conversationId);
      } catch (error) {
        console.error("Failed to delete conversation:", error);
      }
    }
  };

  const handleArchiveConversation = async (conversationId: string, isArchived: boolean) => {
    if (!userId) return;

    try {
      await archiveConversation(userId, conversationId, isArchived);
    } catch (error) {
      console.error("Failed to archive conversation:", error);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    onSelectConversation?.(conversationId);
  };

  const activeConversations = conversations.filter(c => !c.isArchived);
  const archivedConversations = conversations.filter(c => c.isArchived);

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive mb-2">Error loading conversations</p>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={clearError} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Conversations
          </h2>
          <Button onClick={handleCreateConversation} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Conversation
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Active ({activeConversations.length})
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Archived ({archivedConversations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            <ConversationList
              onSelectConversation={handleSelectConversation}
              onEditConversation={handleEditConversation}
              onDeleteConversation={handleDeleteConversation}
              onArchiveConversation={handleArchiveConversation}
              selectedConversationId={selectedConversationId}
              channelId={channelId}
            />
          </TabsContent>

          <TabsContent value="archived" className="mt-4">
            <ConversationList
              onSelectConversation={handleSelectConversation}
              onEditConversation={handleEditConversation}
              onDeleteConversation={handleDeleteConversation}
              onArchiveConversation={handleArchiveConversation}
              selectedConversationId={selectedConversationId}
              channelId={channelId}
            />
          </TabsContent>
        </Tabs>
      </div>

      <ConversationEditor
        conversation={editingConversation}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveConversation}
      />
    </div>
  );
}
