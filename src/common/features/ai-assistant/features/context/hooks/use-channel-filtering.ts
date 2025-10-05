import { useMemo, useState } from "react";
import type { Channel } from "@/core/stores/notes-data.store";

export function useChannelFiltering(channels: Channel[]) {
  const [searchQuery, setSearchQuery] = useState('');

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
      if (a.messageCount !== b.messageCount) {
        return b.messageCount - a.messageCount;
      }
      return a.name.localeCompare(b.name);
    });
  }, [channels, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredChannels
  };
}
