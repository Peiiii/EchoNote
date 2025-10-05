import { channelMessageService } from '@/core/services/channel-message.service';
import { Message } from '@/core/stores/notes-data.store';
import { useNotesViewStore } from '@/core/stores/notes-view.store';
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
    const { currentChannelId } = useNotesViewStore();
    const slice = useMemo(() => createSlice(channelMessageService.dataContainer, `messageByChannel.${currentChannelId}`), [currentChannelId]);

    const { value: {
        messages = [],
        loading,
        hasMore,
        loadingMore
    } = {}, get: getChannelState } = useDataContainerState(slice);

    useEffect(() => channelMessageService.moreMessageLoadedEvent$.listen(({ messages }) => onHistoryMessagesChange?.(messages)), []);
    useEffect(() => {
        return channelMessageService.connectToRequestWorkflow();
    }, []);
    useEffect(() => {
        if (currentChannelId) {
            channelMessageService.requestLoadInitialMessages$.next({ channelId: currentChannelId });
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
