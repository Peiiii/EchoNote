import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';

interface GitHubNoteSyncSectionProps {
  noteTitle: string;
  noteContent: string;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastSync: string;
  onNoteTitleChange: (title: string) => void;
  onNoteContentChange: (content: string) => void;
  onSyncNote: () => void;
}

export function GitHubNoteSyncSection({
  noteTitle,
  noteContent,
  syncStatus,
  lastSync,
  onNoteTitleChange,
  onNoteContentChange,
  onSyncNote
}: GitHubNoteSyncSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">📝</Badge>
          Note Synchronization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Note Title</label>
          <Input
            placeholder="Enter note title..."
            value={noteTitle}
            onChange={(e) => onNoteTitleChange(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Note Content</label>
          <Textarea
            placeholder="Enter note content..."
            value={noteContent}
            onChange={(e) => onNoteContentChange(e.target.value)}
            rows={6}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={onSyncNote}
            disabled={!noteTitle.trim() || !noteContent.trim() || syncStatus === 'syncing'}
            className="flex items-center gap-2"
          >
            {syncStatus === 'syncing' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Syncing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 4.624-5.479 4.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Sync to GitHub
              </>
            )}
          </Button>

          {syncStatus === 'success' && (
            <Badge variant="secondary" className="text-green-600">
              ✅ Sync Successful
            </Badge>
          )}

          {syncStatus === 'error' && (
            <Badge variant="destructive">
              ❌ Sync Failed
            </Badge>
          )}
        </div>

        {lastSync && (
          <p className="text-sm text-gray-500">
            Last sync time: {lastSync}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
