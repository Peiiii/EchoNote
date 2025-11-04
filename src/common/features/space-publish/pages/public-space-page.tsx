import { PageContainer } from "@/common/components/page-container";
import { useGroupedMessages } from "@/common/features/notes/hooks/use-grouped-messages";
import { firebaseNotesService } from "@/common/services/firebase/firebase-notes.service";
import { Message } from "@/core/stores/notes-data.store";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PublicMessageTimeline } from "../components/public-message-timeline";

export function PublicSpacePage() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [channel, setChannel] = useState<{ channel: { id: string; name: string; description?: string; emoji?: string }; userId: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shareToken) {
      setError("Invalid share token");
      setLoading(false);
      return;
    }

    const loadSpace = async () => {
      try {
        setLoading(true);
        const result = await firebaseNotesService.findChannelByShareToken(shareToken);

        if (!result) {
          setError("Space not found");
          setLoading(false);
          return;
        }

        setChannel(result);

        const messagesResult = await firebaseNotesService.fetchInitialMessagesAllSenders(
          result.userId,
          result.channel.id,
          100
        );

        setMessages(messagesResult.messages);
      } catch (err) {
        console.error("Error loading public space:", err);
        setError("Failed to load space");
      } finally {
        setLoading(false);
      }
    };

    loadSpace();
  }, [shareToken]);

  const groupedMessages = useGroupedMessages(messages, { latestFirst: true });

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading space...</p>
        </div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold mb-2">Space Not Found</h1>
          <p className="text-muted-foreground">{error || "This space is not available."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full h-full overflow-auto">
      <PageContainer maxWidth="4xl" padding="lg" centered>
        <div className="space-y-6">
          <div className="border-b pb-6">
            <div className="flex items-center gap-3 mb-2">
              {channel.channel.emoji && (
                <span className="text-4xl">{channel.channel.emoji}</span>
              )}
              <h1 className="text-3xl font-bold">{channel.channel.name}</h1>
            </div>
            {channel.channel.description && (
              <p className="text-muted-foreground mt-2">{channel.channel.description}</p>
            )}
          </div>

          <PublicMessageTimeline groupedMessages={groupedMessages} />
        </div>
      </PageContainer>
    </div>
  );
}

