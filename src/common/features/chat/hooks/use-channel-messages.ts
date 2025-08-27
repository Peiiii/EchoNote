import { channelMessageService } from '@/core/services/channel-message.service';
import { Message } from '@/core/stores/chat-data.store';
import { useChatViewStore } from '@/core/stores/chat-view.store';
import { useMemoizedFn } from 'ahooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createSlice, useDataContainerState } from 'rx-nested-bean';

export const useStateWithRef = <T>(initialValue: T) => {
    const [value, _setValue] = useState(initialValue);
    const ref = useRef(initialValue);
    const setValue = useMemoizedFn((value: T) => {
        _setValue(value);
        ref.current = value;
    });
    return [value, setValue, ref] as const;
}

export interface UseChannelMessagesOptions {
    onHistoryMessagesChange?: (messages: Message[]) => void;
}





export const useChannelMessages = ({
    onHistoryMessagesChange,
}: UseChannelMessagesOptions) => {
    const { currentChannelId } = useChatViewStore();
    const slice = useMemo(() => createSlice(channelMessageService.dataContainer, `messageByChannel.${currentChannelId}`), [currentChannelId]);

    const { value: {
        messages = [],
        loading,
        hasMore,
        loadingMore
    } = {}, get: getChannelState } = useDataContainerState(slice);

    useEffect(() => channelMessageService.moreMessageLoadedEvent$.listen(({ messages }) => onHistoryMessagesChange?.(messages)), []);

    useEffect(() => {
        if (currentChannelId) {
            channelMessageService.loadInitialMessages({ channelId: currentChannelId, messagesLimit: 20 });
        }
    }, [currentChannelId]);

    return {
        messages,
        loading,
        hasMore,
        loadMore: channelMessageService.loadMoreHistory,
        loadingMore,
        getChannelState,
    };
};
