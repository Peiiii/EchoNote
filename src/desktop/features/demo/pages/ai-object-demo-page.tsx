import React from 'react';
import { AiObjectDemo } from '@/desktop/features/demo/components/ai-object-demo';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Bot } from 'lucide-react';

export const AiObjectDemoPage: React.FC = () => {
  return (
    <div className="h-screen overflow-y-auto">
      <div className="w-full px-6 py-6">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-green-500 text-white">
              <Bot className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">AI对象生成演示</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            使用AI生成各种类型的对象和数据，体验AI的创造能力
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">AI对象生成器</CardTitle>
          </CardHeader>
          <CardContent>
            <AiObjectDemo />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
