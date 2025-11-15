import { Textarea } from "@/common/components/ui/textarea";
import { useGroupedMessages } from "@/common/features/notes/hooks/use-grouped-messages";
import { firebaseNotesService } from "@/common/services/firebase/firebase-notes.service";
import { Channel, Message } from "@/core/stores/notes-data.store";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { PublicMessageTimeline } from "../components/public-message-timeline";
import { Send, Loader2 } from "lucide-react";

export function PublicSpacePage() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [channel, setChannel] = useState<{ channel: Channel; userId: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const loadMessages = async () => {
    if (!shareToken || !channel) return;
    try {
      const messagesResult = await firebaseNotesService.fetchInitialMessagesAllSenders(
        channel.userId,
        channel.channel.id,
        100
      );
      setMessages(messagesResult.messages);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  useEffect(() => {
    if (channel) {
      loadMessages();
    }
  }, [channel, shareToken]);

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !shareToken || !channel || isSending) return;

    setIsSending(true);
    try {
      await firebaseNotesService.createMessageForPublicSpace(shareToken, {
        content: messageContent.trim(),
        sender: "user",
        channelId: channel.channel.id,
      });
      setMessageContent("");
      await loadMessages();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [messageContent]);

  const groupedMessages = useGroupedMessages(messages, { latestFirst: true });
  const isAppendOnly = channel?.channel.shareMode === "append-only";

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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-8 py-8 w-full flex flex-col min-h-screen">
        <div className="flex-1 space-y-8 w-full max-w-full overflow-x-hidden">
          <div className="relative w-full max-w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl" />
            <div className="relative bg-card border border-border/50 rounded-2xl p-8 shadow-sm w-full max-w-full overflow-hidden">
              <div className="flex items-start gap-4 mb-4">
                {channel.channel.emoji && (
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center text-4xl shadow-sm">
                    {channel.channel.emoji}
                  </div>
                )}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <h1 className="text-3xl font-bold mb-2 leading-tight break-words">{channel.channel.name}</h1>
                  {channel.channel.description && (
                    <p className="text-muted-foreground text-base leading-relaxed break-words">{channel.channel.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-full overflow-x-hidden">
            <PublicMessageTimeline groupedMessages={groupedMessages} />
          </div>
        </div>

        {isAppendOnly && (
          <div className="sticky bottom-0 bg-background border-t border-border/60 mt-8 w-full max-w-full overflow-x-hidden">
            <div className="w-full max-w-full py-3">
              <div className="relative w-full max-w-full">
                <Textarea
                  ref={textareaRef}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message... (Ctrl/Cmd+Enter to send)"
                  className="min-h-[80px] max-h-[200px] resize-none w-full bg-background border border-border/60 rounded-lg focus:border-border transition-colors pr-12"
                  disabled={isSending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageContent.trim() || isSending}
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-150 text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  aria-label="Send message"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

