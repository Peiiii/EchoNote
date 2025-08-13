import React from 'react';
import { AiQuickTest } from '../components/ai-quick-test';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Sparkles } from 'lucide-react';

export const AiQuickTestDemoPage: React.FC = () => {
  return (
    <div className="h-screen overflow-y-auto">
      <div className="w-full px-6 py-6">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-purple-500 text-white">
              <Sparkles className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">AI快速测试演示</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            快速测试AI功能和响应，验证AI系统的正常工作状态
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">AI快速测试</CardTitle>
          </CardHeader>
          <CardContent>
            <AiQuickTest />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
