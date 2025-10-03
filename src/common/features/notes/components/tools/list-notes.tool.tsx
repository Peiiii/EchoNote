import { Alert, AlertDescription } from '@/common/components/ui/alert';
import { Badge } from '@/common/components/ui/badge';
import { Clock, FileText, Hash, List } from 'lucide-react';
import { ToolPanel } from './ui/tool-panel';

export interface NoteForDisplay {
    noteId: string;
    content: string;
    contentLength: number;
    timestamp: Date;
    timestampReadable: string;
}

// Enhanced render component with better UI
interface ListNotesToolRenderProps {
    limit: number;
    channelId: string;
    notes?: Array<NoteForDisplay>;
    isLoading?: boolean;
    error?: string;
}

export function ListNotesToolRender({ limit, notes, isLoading, error }: ListNotesToolRenderProps) {
    console.log("🔔 [ListNotesToolRender][props]:", { limit, notes, isLoading, error, notesType: typeof notes, isArray: Array.isArray(notes) });
    if (isLoading) {
        return (
            <ToolPanel
                icon={<List className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                title="List Notes"
                status="loading"
                statusText="Loading notes from channel..."
                headerCardClassName="border-blue-200 dark:border-blue-800"
            />
        );
    }

    if (error) {
        return (
            <ToolPanel
                icon={<FileText className="w-5 h-5 text-red-600 dark:text-red-400" />}
                title="List Notes"
                status="error"
                statusText="Failed to load notes"
                
                headerCardClassName="border-red-200 dark:border-red-800"
                contentCardClassName="border-red-200 dark:border-red-800 mt-2"
            >
                <Alert variant="destructive">
                    <AlertDescription>
                        {typeof error === 'string' ? error : 'An error occurred while loading notes'}
                    </AlertDescription>
                </Alert>
            </ToolPanel>
        );
    }

    if (!notes || !Array.isArray(notes) || notes.length === 0) {
        return (
            <ToolPanel
                icon={<FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
                title="List Notes"
                status="ready"
                statusText="No notes found"
                headerCardClassName="border-gray-200 dark:border-gray-800"
                contentCardClassName="border-gray-200 dark:border-gray-800 mt-2"
                expandable={false}
            >
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">No notes found in this channel</span>
                </div>
            </ToolPanel>
        );
    }
    

    return (
        <ToolPanel
            icon={<List className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            title="Notes in Channel"
            status="success"
            statusText={`Found ${Array.isArray(notes) ? notes.length : 0} note${Array.isArray(notes) && notes.length !== 1 ? 's' : ''}`}
            
            headerCardClassName="border-blue-200 dark:border-blue-800"
            contentCardClassName="border-gray-200 dark:border-gray-800 mt-2"
        >
            <div className="space-y-3">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Showing up to {limit} notes from the channel
                </div>
                {Array.isArray(notes) ? notes.map((note, index) => (
                    <div key={note.noteId || index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md border dark:border-gray-800">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                                <Hash className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                                <Badge variant="outline" className="text-xs font-mono">
                                    {note.noteId?.substring(0, 8)}...
                                </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>{note.timestampReadable}</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {note.content}
                        </p>
                        {note.contentLength > 60 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                ({note.contentLength} characters total)
                            </p>
                        )}
                    </div>
                )) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No valid notes data available
                    </div>
                )}
            </div>
        </ToolPanel>
    );
}
