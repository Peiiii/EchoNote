import { ChatInputExtension } from "@agent-labs/agent-chat";
import { ConversationContextControl } from "../features/context/components/conversation-context-control";
import { ComposerDraft } from "@agent-labs/agent-chat";

export interface ContextSelectorExtensionProps {
  conversationId: string;
  fallbackChannelId: string;
  onActiveToolChannelChange?: (id: string | null) => void;
  activeToolChannelId?: string | null;
  className?: string;
  showModeNameInCompact?: boolean;
}

interface ContextSelectorRendererProps {
  draft: ComposerDraft;
  setDraft: (draft: ComposerDraft) => void;
  props: ContextSelectorExtensionProps;
}

const ContextSelectorRenderer = ({ props }: ContextSelectorRendererProps) => {
  return (
    <ConversationContextControl
      conversationId={props.conversationId}
      fallbackChannelId={props.fallbackChannelId}
      onActiveToolChannelChange={props.onActiveToolChannelChange}
      activeToolChannelId={props.activeToolChannelId}
      variant="compact"
      className={props.className}
      showModeNameInCompact={props.showModeNameInCompact}
    />
  );
};

export const createContextSelectorExtension = (
  props: ContextSelectorExtensionProps
): ChatInputExtension => ({
  id: "context-selector",
  placement: "bottom-left",
  render: ({ draft, setDraft }) => (
    <ContextSelectorRenderer draft={draft} setDraft={setDraft} props={props} />
  ),
});
