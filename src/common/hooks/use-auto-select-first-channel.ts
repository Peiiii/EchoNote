import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useEffect } from "react";
import { useBehaviorSubjectFromState } from "rx-nested-bean";
import { filter, take, withLatestFrom } from "rxjs";

export const useAutoSelectFirstChannel = () => {
    const channels = useNotesDataStore((s) => s.channels);
    const channels$ = useBehaviorSubjectFromState(channels);
    const setCurrentChannel = useNotesViewStore(s => s.setCurrentChannel);
    const currentChannelId = useNotesViewStore(s => s.currentChannelId);
    const currentChannelId$ = useBehaviorSubjectFromState(currentChannelId);

    useEffect(() => {
        const sub = channels$.pipe(
            filter(channels => channels.length > 0),
            take(1),
            withLatestFrom(currentChannelId$),
        ).subscribe(([channels, currentChannelId]) => {
            console.log('🔔 [useAutoSelectFirstChannel][subscribe]', { channels, currentChannelId })
            if (channels.length > 0 && !currentChannelId) {
                console.log('🔔 [useAutoSelectFirstChannel] setCurrentChannel', channels[0].id)
                setCurrentChannel(channels[0].id);
            }
        })
        return () => sub.unsubscribe();
    }, [channels$, currentChannelId$, setCurrentChannel])
};