import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Badge } from "@/common/components/ui/badge";
import { Bot, Clock, Brain, Sparkles, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DemoPage: React.FC = () => {
  const navigate = useNavigate();

  const demoFeatures = [
    {
      id: "space-chat",
      title: "空间感知AI聊天",
      description: "AI助手能够感知指定空间的所有记录，并基于上下文进行智能对话",
      icon: Brain,
      color: "bg-blue-500",
      path: "/demo/space-chat",
    },
    {
      id: "ai-object",
      title: "AI对象生成",
      description: "使用AI生成各种类型的对象和数据",
      icon: Bot,
      color: "bg-green-500",
      path: "/demo/ai-object",
    },
    {
      id: "ai-quick-test",
      title: "AI快速测试",
      description: "快速测试AI功能和响应",
      icon: Sparkles,
      color: "bg-purple-500",
      path: "/demo/ai-quick-test",
    },
    {
      id: "time-format",
      title: "时间格式化",
      description: "测试时间格式化和显示功能",
      icon: Clock,
      color: "bg-orange-500",
      path: "/demo/time-format",
    },
    {
      id: "svg-homepage",
      title: "SVG首页",
      description: "完全用SVG绘制的精美首页设计",
      icon: Home,
      color: "bg-emerald-500",
      path: "/demo/svg-homepage",
    },
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">StillRoot 功能演示</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          体验 StillRoot 的各种功能特性，了解如何构建智能笔记和AI助手应用
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {demoFeatures.map(feature => {
          const Icon = feature.icon;
          return (
            <Card key={feature.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {feature.id}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <Button onClick={() => navigate(feature.path)} className="w-full">
                  开始体验
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">关于 StillRoot</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          StillRoot 是一个智能笔记应用，通过AI助手帮助用户更好地组织和管理信息。
          它能够理解上下文、自动分类、提供洞察，让知识管理变得简单而高效。
        </p>
      </div>
    </div>
  );
};
