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
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-primary/40 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Loading space</p>
            <p className="text-xs text-muted-foreground">Please wait a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <div className="text-center max-w-md px-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Space Not Found</h1>
            <p className="text-muted-foreground">{error || "This space is not available or has been removed."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 w-full h-full overflow-auto">
      <PageContainer maxWidth="4xl" padding="lg" centered>
        <div className="space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl" />
            <div className="relative bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                {channel.channel.emoji && (
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center text-4xl shadow-sm">
                    {channel.channel.emoji}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold mb-2 leading-tight">{channel.channel.name}</h1>
                  {channel.channel.description && (
                    <p className="text-muted-foreground text-base leading-relaxed">{channel.channel.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <PublicMessageTimeline groupedMessages={groupedMessages} />
        </div>
      </PageContainer>
    </div>
  );
}

