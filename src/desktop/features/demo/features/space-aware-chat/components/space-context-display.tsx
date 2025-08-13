import { Badge } from '@/common/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { SpaceContext } from '@/desktop/features/demo/features/space-aware-chat/types';
import React from 'react';

interface SpaceContextDisplayProps {
  spaceContext: SpaceContext;
  spaceId: string;
}

export const SpaceContextDisplay: React.FC<SpaceContextDisplayProps> = ({
  spaceContext,
  spaceId
}) => {
  if (spaceContext.totalCount === 0) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">空间上下文</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">该空间暂无记录</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span>空间上下文</span>
          <Badge variant="secondary">{spaceId}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>总记录数：</span>
          <Badge variant="outline">{spaceContext.totalCount}</Badge>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">空间摘要：</p>
          <p className="text-sm text-muted-foreground">{spaceContext.summary}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">最近记录：</p>
          <div className="space-y-2">
            {spaceContext.records.slice(0, 3).map((record) => (
              <div key={record.id} className="text-sm p-2 bg-muted rounded-md">
                <p className="text-foreground">{record.content}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {new Date(record.timestamp).toLocaleString()}
                  </span>
                  {record.tags && record.tags.length > 0 && (
                    <div className="flex gap-1">
                      {record.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
