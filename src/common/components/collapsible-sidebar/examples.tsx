import { CollapsibleSidebar } from "./collapsible-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const CollapsibleSidebarExamples = () => {
    return (
        <div className="space-y-8 p-6">
            <div>
                <h2 className="text-2xl font-bold mb-4">CollapsibleSidebar Examples</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Examples of how to use the CollapsibleSidebar component in different scenarios.
                </p>
            </div>

            {/* Basic Example */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Usage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 border rounded-lg relative">
                        <CollapsibleSidebar>
                            <CollapsibleSidebar.Header>
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Basic Sidebar</h3>
                                <CollapsibleSidebar.ToggleButton />
                            </CollapsibleSidebar.Header>
                            <CollapsibleSidebar.Content>
                                <div className="p-3 space-y-2">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">Menu Item 1</div>
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">Menu Item 2</div>
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">Menu Item 3</div>
                                </div>
                            </CollapsibleSidebar.Content>
                        </CollapsibleSidebar>
                        <div className="ml-80 p-4">
                            <p>Main content area. The sidebar can be collapsed to give more space.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Custom Width Example */}
            <Card>
                <CardHeader>
                    <CardTitle>Custom Width</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 border rounded-lg relative">
                        <CollapsibleSidebar width="w-96" collapsedWidth="w-0">
                            <CollapsibleSidebar.Header>
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Wide Sidebar</h3>
                                <CollapsibleSidebar.ToggleButton />
                            </CollapsibleSidebar.Header>
                            <CollapsibleSidebar.Content>
                                <div className="p-3 space-y-2">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">Wide Menu Item 1</div>
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">Wide Menu Item 2</div>
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">Wide Menu Item 3</div>
                                </div>
                            </CollapsibleSidebar.Content>
                        </CollapsibleSidebar>
                        <div className="ml-96 p-4">
                            <p>Content area with custom sidebar width (384px instead of 320px).</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Custom Styling Example */}
            <Card>
                <CardHeader>
                    <CardTitle>Custom Styling</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 border rounded-lg relative">
                        <CollapsibleSidebar
                            className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700"
                        >
                            <CollapsibleSidebar.Header className="bg-blue-100 dark:bg-blue-800 border-blue-200 dark:border-blue-600">
                                <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Custom Styled</h3>
                                <CollapsibleSidebar.ToggleButton />
                            </CollapsibleSidebar.Header>
                            <CollapsibleSidebar.Content className="bg-blue-50 dark:bg-blue-900">
                                <div className="p-3 space-y-2">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded">Custom Item 1</div>
                                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded">Custom Item 2</div>
                                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded">Custom Item 3</div>
                                </div>
                            </CollapsibleSidebar.Content>
                        </CollapsibleSidebar>
                        <div className="ml-80 p-4">
                            <p>Content area with custom styled sidebar using blue theme.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* With Callback Example */}
            <Card>
                <CardHeader>
                    <CardTitle>With State Callback</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 border rounded-lg relative">
                        <CollapsibleSidebar
                            onCollapseChange={(collapsed: boolean) => {
                                console.log('Sidebar collapsed:', collapsed);
                                // You can use this callback to sync state with parent component
                                // or trigger other actions when sidebar state changes
                            }}
                        >
                            <CollapsibleSidebar.Header>
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">With Callback</h3>
                                <CollapsibleSidebar.ToggleButton />
                            </CollapsibleSidebar.Header>
                            <CollapsibleSidebar.Content>
                                <div className="p-3 space-y-2">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">Callback Item 1</div>
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">Callback Item 2</div>
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">Callback Item 3</div>
                                </div>
                            </CollapsibleSidebar.Content>
                        </CollapsibleSidebar>
                        <div className="ml-80 p-4">
                            <p>Content area. Check console for collapse state changes.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
