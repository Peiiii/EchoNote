import { AlertTriangle, FileText } from 'lucide-react';
import { ReadNoteRenderProps, ReadNoteRenderArgs, ReadNoteRenderResult } from '../types';
import { DisplayToolPanel } from './display-tool-panel';
import { getParsedArgs } from '../utils/invocation-utils';

export function ReadNoteRenderUI({ invocation }: ReadNoteRenderProps) {
    console.log("🔔 [ReadNoteRenderUI] invocation:", invocation);
    const args = getParsedArgs<ReadNoteRenderArgs>(invocation);
    const noteId = args?.noteId;

    return (
        <DisplayToolPanel<ReadNoteRenderArgs, ReadNoteRenderResult>
            invocation={invocation}
            icon={<FileText className="h-5 w-5 text-blue-600" />}
            title="Read Note"
            loadingText={`Reading note ${noteId?.substring(0, 8) || 'unknown'}...`}
            successIcon={<FileText className="h-5 w-5 text-green-600" />}
            errorIcon={<AlertTriangle className="w-5 h-5 text-red-600" />}
            successStatusText={() => "Note loaded successfully"}
            errorStatusText={(error) => {
                if (error && typeof error === 'object' && 'found' in error && !error.found) {
                    return "Note not found";
                }
                return "Failed to load note";
            }}
            readyStatusText="Preparing to read note..."
            contentScrollable={true}
            headerCardClassName="border-blue-200 dark:border-blue-900"
            contentCardClassName="border-gray-200 dark:border-gray-800 mt-2"
        >
            {(_args, result, error) => {
                if (error) {
                    return (
                        <div className="text-red-700 dark:text-red-300 text-sm">
                            {typeof error === 'string' ? error : 'An error occurred while loading the note'}
                        </div>
                    );
                }

                if (!result?.found) {
                    return (
                        <div className="text-red-700 dark:text-red-300 text-sm">
                            Note not found
                        </div>
                    );
                }

                return (
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-mono">{result.noteId}</span>
                            <span>{result.timestampReadable}</span>
                            <span>{result.contentLength} chars</span>
                        </div>
                        <div className="text-sm whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-3 rounded-md border dark:border-gray-800 dark:text-gray-200">
                            {result.content}
                        </div>
                    </div>
                );
            }}
        </DisplayToolPanel>
    );
}