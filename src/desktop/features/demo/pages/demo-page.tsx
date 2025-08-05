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
  const [isAnimating, setIsAnimating] = useState(false);
  const activityBarItems = useActivityBarStore(state => state.items);
  const routes = useRouteTreeStore(state => state.routes);
  const icons = useIconStore(state => state.icons);

  // Animated progress effect
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleIncrement = () => {
    setIsAnimating(true);
    setCounter(prev => prev + 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleDecrement = () => {
    setIsAnimating(true);
    setCounter(prev => prev - 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const stats = [
    { label: 'Activity Items', value: activityBarItems.length, icon: '🎯', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { label: 'Routes', value: routes.length, icon: '🛣️', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { label: 'Icons', value: Object.keys(icons).length, icon: '🎨', color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { label: 'Counter', value: counter, icon: '⚡', color: 'bg-gradient-to-r from-orange-500 to-red-500' },
  ];

  return (
    <PageContainer>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          {/* Hero Section */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-3xl" />
            <div className="relative z-10 px-6 py-12">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <span className="text-sm font-medium text-white/90">✨ EchoNote Plugin Architecture</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                  Demo Dashboard
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Experience the power of our modern plugin architecture with this stunning demonstration interface
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="px-6 -mt-8 mb-12">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="group relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.color} text-white text-xl mb-4 shadow-lg`}>
                        {stat.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {stat.value.toLocaleString()}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 pb-12">
            <div className="max-w-6xl mx-auto">
              <Tabs defaultValue="interactive" className="space-y-8">
                <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-1 rounded-2xl">
                  <TabsTrigger value="interactive" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white transition-all duration-200">
                    Interactive
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white transition-all duration-200">
                    Activity Bar
                  </TabsTrigger>
                  <TabsTrigger value="routes" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white transition-all duration-200">
                    Routes
                  </TabsTrigger>
                  <TabsTrigger value="architecture" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white transition-all duration-200">
                    Architecture
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="interactive" className="space-y-6">
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Interactive Features Demo
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400 text-lg">
                        Test basic React component interaction functionality with beautiful animations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* Counter Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Counter Demo</h4>
                          <div className="flex items-center space-x-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={handleDecrement}
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full w-10 h-10 p-0 hover:scale-110 transition-transform duration-200"
                                >
                                  -
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Decrease counter</p>
                              </TooltipContent>
                            </Tooltip>
                            <div className={`text-3xl font-bold px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transition-all duration-300 ${isAnimating ? 'scale-110' : ''}`}>
                              {counter}
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={handleIncrement}
                                  size="sm"
                                  className="rounded-full w-10 h-10 p-0 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-110 transition-all duration-200"
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
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Animated Progress</h4>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{progress}%</span>
                        </div>
                        <div className="relative">
                          <Progress value={progress} className="h-3 bg-slate-200 dark:bg-slate-700" />
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Activity Bar Status
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400 text-lg">
                        Currently registered activity bar items with detailed information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {activityBarItems.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <span className="text-2xl">📋</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-lg">No activity bar items registered</p>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {activityBarItems.map((item, index) => (
                            <div
                              key={item.id}
                              className="group p-4 rounded-xl bg-gradient-to-r from-white/50 to-white/30 dark:from-slate-700/50 dark:to-slate-700/30 backdrop-blur-sm border border-white/20 dark:border-slate-600/30 hover:from-white/70 hover:to-white/50 dark:hover:from-slate-600/70 dark:hover:to-slate-600/50 transition-all duration-300 hover:scale-[1.02]"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500">
                                    <AvatarFallback className="text-white font-semibold">
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
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                      {item.title}
                                    </Badge>
                                  )}
                                  {item.group && (
                                    <Badge variant="outline" className="border-purple-200 text-purple-700 dark:border-purple-700 dark:text-purple-300">
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
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Route Status
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400 text-lg">
                        Currently registered route nodes with path information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {routes.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <span className="text-2xl">🛣️</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-lg">No route nodes registered</p>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {routes.map((route, index) => (
                            <div
                              key={route.id}
                              className="group p-4 rounded-xl bg-gradient-to-r from-white/50 to-white/30 dark:from-slate-700/50 dark:to-slate-700/30 backdrop-blur-sm border border-white/20 dark:border-slate-600/30 hover:from-white/70 hover:to-white/50 dark:hover:from-slate-600/70 dark:hover:to-slate-600/50 transition-all duration-300 hover:scale-[1.02]"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                    {route.id.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white">{route.id}</h4>
                                    <p className="text-sm font-mono text-slate-600 dark:text-slate-400">{route.path}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {route.order !== undefined && (
                                    <Badge variant="outline" className="border-orange-200 text-orange-700 dark:border-orange-700 dark:text-orange-300">
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
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        Plugin Architecture Overview
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400 text-lg">
                        Core components and features of EchoNote plugin architecture
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                            <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                              <span className="mr-2">⚙️</span>
                              Core Components
                            </h4>
                            <ul className="space-y-3">
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-white">Extension Manager</span>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Extension lifecycle management</p>
                                </div>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-white">Activity Bar Store</span>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Activity bar state management</p>
                                </div>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-white">Route Tree Store</span>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Route tree state management</p>
                                </div>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-white">Icon Store</span>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Icon state management</p>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                            <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
                              <span className="mr-2">🚀</span>
                              Extension Features
                            </h4>
                            <ul className="space-y-3">
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-white">Dynamic Registration</span>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Activity bar items, routes, and icons</p>
                                </div>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-white">Bidirectional Mapping</span>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Routes and activity bar integration</p>
                                </div>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-white">State Management</span>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Centralized state with Zustand</p>
                                </div>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
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