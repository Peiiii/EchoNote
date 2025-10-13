interface EmptyPaneProps {
  onCreate: () => void;
}

export function AIConversationEmptyPane({ onCreate }: EmptyPaneProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">AI Note Agent</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            I can see all your notes in this space and help you manage them. Ask me to analyze, organize, create, or update your notes. 
            I'll help you discover insights and connections in your thoughts.
          </p>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Try asking:</p>
            <p>"What are the main themes in my notes?"</p>
            <p>"Help me organize these ideas better"</p>
            <p>"Create a summary note of key insights"</p>
          </div>
        </div>
        
        <button
          onClick={onCreate}
          className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Start Conversation
        </button>
      </div>
    </div>
  );
}
