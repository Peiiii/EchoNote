import { ToolInvocationStatus } from '@agent-labs/agent-chat';
import { AlertTriangle, FileText } from 'lucide-react';
import { ReadNoteRenderProps } from '../types';
import { ToolPanel } from './tool-panel';
import { getParsedArgs } from '../utils/invocation-utils';
    



export function ReadNoteRenderUI({ invocation }: ReadNoteRenderProps) {
    console.log("🔔 [ReadNoteRenderUI] invocation:", invocation);
    const args = getParsedArgs<{ noteId: string }>(invocation);
    const noteId = args?.noteId;

    if (invocation.status === ToolInvocationStatus.PARTIAL_CALL) {
        return (
            <ToolPanel
                icon={<FileText className="h-5 w-5 text-blue-600" />}
                title="Read Note"
                status="loading"
                statusText="准备参数中..."
                headerCardClassName="border-blue-200"
            />
        );
    }

    if (invocation.status === ToolInvocationStatus.CALL) {
        return (
            <ToolPanel
                icon={<FileText className="w-5 h-5 text-blue-600" />}
                title="Read Note"
                status="loading"
                statusText={`Reading note ${noteId?.substring(0, 8) || 'unknown'}...`}
                headerCardClassName="border-blue-200"
            />
        );
    }

    if (invocation.status === ToolInvocationStatus.RESULT) {
        try {
            console.log("🔔 [ReadNoteRenderUI][result] parsing:", {
                result: invocation.result,
                type: typeof invocation.result
            });

            // Handle both string and object results
            const result = invocation.result!;

            if (!result.found) {
                return (
                    <ToolPanel
                        icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
                        title="Read Note"
                        status="error"
                        statusText="Note not found"
                        
                        headerCardClassName="border-red-200"
                        contentCardClassName="border-red-200 mt-2"
                    >
                        <div className="text-red-700 text-sm">
                            {typeof invocation.error === 'string' ? invocation.error : 'Note not found'}
                        </div>
                    </ToolPanel>
                );
            }

            return (
                <ToolPanel
                    icon={<FileText className="w-5 h-5 text-green-600" />}
                    title="Read Note"
                    status="success"
                    statusText="Note loaded successfully"
                    
                    headerCardClassName="border-green-200"
                    contentCardClassName="border-gray-200 mt-2"
                >
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="font-mono">{result.noteId}</span>
                            <span>{result.timestampReadable}</span>
                            <span>{result.contentLength} chars</span>
                        </div>
                        <div className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded-md border">
                            {result.content}
                        </div>
                    </div>
                </ToolPanel>
            );
        } catch (error) {
            console.error("🔔 [ReadNoteRenderUI][result] parse error:", error);
            return (
                <ToolPanel
                    icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
                    title="Read Note"
                    status="error"
                    statusText="Failed to parse data"
                    
                    headerCardClassName="border-red-200"
                    contentCardClassName="border-red-200 mt-2"
                >
                    <div className="text-red-700 text-sm">
                        Failed to parse note data: {error instanceof Error ? error.message : 'Unknown error'}
                    </div>
                </ToolPanel>
            );
        }
    }

    return (
        <ToolPanel
            icon={<FileText className="w-5 h-5 text-gray-500" />}
            title="Read Note"
            status="ready"
            statusText="Preparing to read note..."
            headerCardClassName="border-gray-200"
        />
    );
}
