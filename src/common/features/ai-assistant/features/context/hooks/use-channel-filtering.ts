import { useMemo, useState } from "react";
import type { Channel } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";

export function useChannelFiltering(channels: Channel[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const currentChannelId = useNotesViewStore(s => s.currentChannelId);

  const filteredChannels = useMemo(() => {
    let filtered = channels;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = channels.filter(ch => 
        ch.name.toLowerCase().includes(query) || 
        ch.description?.toLowerCase().includes(query)
      );
    }
    
    return filtered.sort((a, b) => {
      // Current channel always comes first
      if (currentChannelId) {
        if (a.id === currentChannelId && b.id !== currentChannelId) return -1;
        if (b.id === currentChannelId && a.id !== currentChannelId) return 1;
      }
      
      // Then sort by message count
      if (a.messageCount !== b.messageCount) {
        return b.messageCount - a.messageCount;
      }
      
      // Finally sort by name
      return a.name.localeCompare(b.name);
    });
  }, [channels, searchQuery, currentChannelId]);

  return {
    searchQuery,
    setSearchQuery,
    filteredChannels
  };
}
