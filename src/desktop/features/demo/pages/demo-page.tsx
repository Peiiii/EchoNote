import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Progress } from '@/common/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/common/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/common/components/ui/avatar';
import { PageContainer } from '@/common/components/page-container';
import { useActivityBarStore } from '@/core/stores/activity-bar.store';
import { useIconStore } from '@/core/stores/icon.store';
import { useRouteTreeStore } from '@/core/stores/route-tree.store';
import { useState, useEffect } from 'react';

export function DemoPage() {
  const [counter, setCounter] = useState(0);
  const [progress, setProgress] = useState(0);
  const activityBarItems = useActivityBarStore(state => state.items);
  const routes = useRouteTreeStore(state => state.routes);
  const icons = useIconStore(state => state.icons);

  // Simple progress effect
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleIncrement = () => {
    setCounter(prev => prev + 1);
  };

  const handleDecrement = () => {
    setCounter(prev => prev - 1);
  };

  const stats = [
    { label: 'Activity Items', value: activityBarItems.length, icon: '🎯' },
    { label: 'Routes', value: routes.length, icon: '🛣️' },
    { label: 'Icons', value: Object.keys(icons).length, icon: '🎨' },
    { label: 'Counter', value: counter, icon: '⚡' },
  ];

  return (
    <PageContainer>
      <TooltipProvider>
        <div className="min-h-screen bg-white dark:bg-slate-900">
          {/* Header Section */}
          <div className="border-b border-slate-200 dark:border-slate-700">
            <div className="px-6 py-8">
              <div className="max-w-4xl mx-auto">
                <div className="text-center space-y-4">
                  <Badge variant="outline" className="text-slate-600 dark:text-slate-300">
                    EchoNote Plugin Architecture
                  </Badge>
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                    Demo Dashboard
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Experience the power of our modern plugin architecture with this clean demonstration interface
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="px-6 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <Card key={stat.label} className="border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <span className="text-xl">{stat.icon}</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {stat.value.toLocaleString()}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 font-medium">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 pb-12">
            <div className="max-w-6xl mx-auto">
              <Tabs defaultValue="interactive" className="space-y-8">
                <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <TabsTrigger value="interactive" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white">
                    Interactive
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white">
                    Activity Bar
                  </TabsTrigger>
                  <TabsTrigger value="routes" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white">
                    Routes
                  </TabsTrigger>
                  <TabsTrigger value="architecture" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white">
                    Architecture
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="interactive" className="space-y-6">
                  <Card className="border border-slate-200 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                        Interactive Features Demo
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Test basic React component interaction functionality
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* Counter Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Counter Demo</h4>
                          <div className="flex items-center space-x-4">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={handleDecrement}
                                  variant="outline"
                                  size="sm"
                                  className="w-10 h-10 p-0"
                                >
                                  -
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Decrease counter</p>
                              </TooltipContent>
                            </Tooltip>
                            <div className="text-3xl font-bold px-6 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                              {counter}
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={handleIncrement}
                                  size="sm"
                                  className="w-10 h-10 p-0"
                                >
                                  +
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Increase counter</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Progress Demo</h4>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                  <Card className="border border-slate-200 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                        Activity Bar Status
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Currently registered activity bar items with detailed information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {activityBarItems.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <span className="text-2xl">📋</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400">No activity bar items registered</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {activityBarItems.map((item) => (
                            <div
                              key={item.id}
                              className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-10 h-10 bg-slate-200 dark:bg-slate-700">
                                    <AvatarFallback className="text-slate-600 dark:text-slate-300 font-semibold">
                                      {item.label.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white">{item.label}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">ID: {item.id}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {item.title && (
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                      {item.title}
                                    </Badge>
                                  )}
                                  {item.group && (
                                    <Badge variant="outline" className="border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300">
                                      {item.group}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="routes" className="space-y-6">
                  <Card className="border border-slate-200 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                        Route Status
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Currently registered route nodes with path information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {routes.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <span className="text-2xl">🛣️</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400">No route nodes registered</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {routes.map((route) => (
                            <div
                              key={route.id}
                              className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold">
                                    {route.id.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white">{route.id}</h4>
                                    <p className="text-sm font-mono text-slate-600 dark:text-slate-400">{route.path}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {route.order !== undefined && (
                                    <Badge variant="outline" className="border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300">
                                      Order: {route.order}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="architecture" className="space-y-6">
                  <Card className="border border-slate-200 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                        Plugin Architecture Overview
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Core components and features of EchoNote plugin architecture
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                              <span className="mr-2">⚙️</span>
                              Core Components
                            </h4>
                            <ul className="space-y-3">
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-white">Extension Manager</span>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Extension lifecycle management</p>
                                </div>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-white">Activity Bar Store</span>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Activity bar state management</p>
                                </div>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-white">Route Tree Store</span>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Route tree state management</p>
                                </div>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-white">Icon Store</span>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Icon state management</p>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                              <span className="mr-2">🚀</span>
                              Extension Features
                            </h4>
                            <ul className="space-y-3">
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-white">Dynamic Registration</span>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Activity bar items, routes, and icons</p>
                                </div>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-white">Bidirectional Mapping</span>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Routes and activity bar integration</p>
                                </div>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-white">State Management</span>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Centralized state with Zustand</p>
                                </div>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-white">Plugin Lifecycle</span>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Complete plugin management system</p>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </PageContainer>
  );
} 