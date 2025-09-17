interface EmptyPaneProps {
  onCreate: () => void;
}

export function AIConversationEmptyPane({ onCreate }: EmptyPaneProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
        <p className="text-muted-foreground mb-4">Create a new conversation to start chatting</p>
        <button onClick={onCreate} className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90">
          Create Conversation
        </button>
      </div>
    </div>
  );
}
