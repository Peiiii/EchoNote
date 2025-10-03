import React from 'react';
import { channelMessageService } from '@/core/services/channel-message.service';

export function useNoteContent(noteId: string, channelId: string) {
  const [content, setContent] = React.useState<string>('');

  React.useEffect(() => {
    if (!noteId || !channelId) return;
    try {
      const channelState = channelMessageService.dataContainer.get().messageByChannel[channelId];
      const note = channelState?.messages.find(msg => msg.id === noteId);
      if (note) setContent(note.content);
    } catch (err) {
      console.error('Failed to fetch note content:', err);
    }
  }, [noteId, channelId]);

  return content;
}

