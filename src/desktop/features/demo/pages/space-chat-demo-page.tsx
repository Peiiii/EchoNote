import React, { useState } from 'react';
import { SpaceAwareChat } from '@/desktop/features/demo/features/space-aware-chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { Badge } from '@/common/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import { Briefcase, BookOpen, User, Plus } from 'lucide-react';

const availableSpaces = [
  { id: 'work', name: '工作空间', icon: Briefcase, description: '工作相关的记录和任务' },
  { id: 'study', name: '学习空间', icon: BookOpen, description: '学习笔记和知识积累' },
  { id: 'personal', name: '个人空间', icon: User, description: '个人生活和兴趣爱好' }
];

export const SpaceChatDemoPage: React.FC = () => {
  const [selectedSpace, setSelectedSpace] = useState('work');

  return (
    <div className="h-screen overflow-y-auto">
      <div className="w-full px-6 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          空间感知AI聊天演示
        </h1>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          这个功能展示了AI助手如何感知特定空间的所有记录，并基于这些上下文信息与用户进行智能对话。
          AI助手能够理解空间内容、分析进度、提供建议等。
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* 左侧：空间选择 */}
        <div className="xl:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">选择空间</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableSpaces.map((space) => {
                const Icon = space.icon;
                return (
                  <Button
                    key={space.id}
                    variant={selectedSpace === space.id ? 'default' : 'outline'}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setSelectedSpace(space.id)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">{space.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {space.description}
                      </div>
                    </div>
                  </Button>
                );
              })}
              
              <Button variant="outline" className="w-full justify-start h-auto p-3">
                <Plus className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">创建新空间</div>
                  <div className="text-xs text-muted-foreground">
                    添加自定义空间
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">功能说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">🎯 空间感知</h4>
                <p className="text-muted-foreground">
                  AI助手能够自动获取并理解指定空间的所有记录内容
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">💬 智能对话</h4>
                <p className="text-muted-foreground">
                  基于空间上下文进行自然语言对话，无需重复解释背景
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">🔍 内容分析</h4>
                <p className="text-muted-foreground">
                  能够总结、分析、建议，帮助用户更好地理解和管理空间内容
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：聊天界面 */}
        <div className="xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">{selectedSpace}</Badge>
                <span>AI聊天助手</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpaceAwareChat 
                spaceId={selectedSpace}
                placeholder={`向AI助手询问关于 ${availableSpaces.find(s => s.id === selectedSpace)?.name} 的问题...`}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 使用示例 */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">使用示例</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="work" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="work">工作空间</TabsTrigger>
                <TabsTrigger value="study">学习空间</TabsTrigger>
                <TabsTrigger value="personal">个人空间</TabsTrigger>
              </TabsList>
              
              <TabsContent value="work" className="space-y-3 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">📊 进度查询</h4>
                    <p className="text-sm text-muted-foreground">
                      "当前项目进度如何？"<br/>
                      "还有哪些任务需要完成？"
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">📝 内容总结</h4>
                    <p className="text-sm text-muted-foreground">
                      "总结一下这个月的工作内容"<br/>
                      "分析一下工作重点和难点"
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="study" className="space-y-3 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">📚 学习建议</h4>
                    <p className="text-sm text-muted-foreground">
                      "基于我的学习记录，有什么建议？"<br/>
                      "哪些知识点需要重点复习？"
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">🔗 知识连接</h4>
                    <p className="text-sm text-muted-foreground">
                      "这些知识点之间有什么联系？"<br/>
                      "如何构建知识体系？"
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="personal" className="space-y-3 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">🎯 目标管理</h4>
                    <p className="text-sm text-muted-foreground">
                      "我的个人目标进展如何？"<br/>
                      "有什么改进建议？"
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">📈 习惯分析</h4>
                    <p className="text-sm text-muted-foreground">
                      "分析一下我的生活习惯"<br/>
                      "如何建立更好的习惯？"
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};
