import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Separator } from '@/common/components/ui/separator';
import { PageContainer } from '@/common/components/page-container';
import { useActivityBarStore } from '@/core/stores/activity-bar.store';
import { useIconStore } from '@/core/stores/icon.store';
import { useRouteTreeStore } from '@/core/stores/route-tree.store';
import { useState } from 'react';

export function DemoPage() {
  const [counter, setCounter] = useState(0);
  const activityBarItems = useActivityBarStore(state => state.items);
  const routes = useRouteTreeStore(state => state.routes);
  const icons = useIconStore(state => state.icons);

  const handleIncrement = () => {
    setCounter(prev => prev + 1);
  };

  const handleDecrement = () => {
    setCounter(prev => prev - 1);
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">EchoNote Plugin Architecture Demo</h1>
          <p className="text-muted-foreground">
            This is a demonstration page for validating the plugin architecture usage
          </p>
        </div>

        <Separator />

        {/* Counter Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Features Demo</CardTitle>
            <CardDescription>
              Test basic React component interaction functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-lg">Counter: {counter}</span>
              <div className="flex space-x-2">
                <Button onClick={handleDecrement} variant="outline">-</Button>
                <Button onClick={handleIncrement}>+</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Bar Status */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Bar Status</CardTitle>
            <CardDescription>
              Currently registered activity bar items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activityBarItems.length === 0 ? (
                <p className="text-muted-foreground">No activity bar items</p>
              ) : (
                activityBarItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-2 p-2 border rounded">
                    <Badge variant="secondary">{item.id}</Badge>
                    <span>{item.label}</span>
                    {item.title && (
                      <span className="text-muted-foreground">({item.title})</span>
                    )}
                    {item.group && (
                      <Badge variant="outline">{item.group}</Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Route Status */}
        <Card>
          <CardHeader>
            <CardTitle>Route Status</CardTitle>
            <CardDescription>
              Currently registered route nodes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {routes.length === 0 ? (
                <p className="text-muted-foreground">No route nodes</p>
              ) : (
                routes.map(route => (
                  <div key={route.id} className="flex items-center space-x-2 p-2 border rounded">
                    <Badge variant="secondary">{route.id}</Badge>
                    <span className="font-mono">{route.path}</span>
                    {route.order !== undefined && (
                      <Badge variant="outline">order: {route.order}</Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Icon Status */}
        <Card>
          <CardHeader>
            <CardTitle>Icon Status</CardTitle>
            <CardDescription>
              Number of currently registered icons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                Registered Icons: {Object.keys(icons).length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Architecture Description */}
        <Card>
          <CardHeader>
            <CardTitle>Plugin Architecture Overview</CardTitle>
            <CardDescription>
              Core components of EchoNote plugin architecture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Core Components</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Extension Manager: Extension lifecycle management</li>
                  <li>• Activity Bar Store: Activity bar state management</li>
                  <li>• Route Tree Store: Route tree state management</li>
                  <li>• Icon Store: Icon state management</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Extension Features</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Dynamic activity bar item registration</li>
                  <li>• Dynamic route node registration</li>
                  <li>• Dynamic icon registration</li>
                  <li>• Bidirectional mapping between routes and activity bar</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
} 