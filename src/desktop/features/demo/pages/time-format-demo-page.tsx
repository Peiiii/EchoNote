import React from "react";
import { TimeFormatDemo } from "@/desktop/features/demo/components/time-format-demo";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Clock } from "lucide-react";

export const TimeFormatDemoPage: React.FC = () => {
  return (
    <div className="h-screen overflow-y-auto">
      <div className="w-full px-6 py-6">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-orange-500 text-white">
              <Clock className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">时间格式化演示</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            测试时间格式化和显示功能，体验不同的时间展示方式
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">时间格式化工具</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeFormatDemo />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
