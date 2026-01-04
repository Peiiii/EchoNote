import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CollapsibleSidebar } from "./collapsible-sidebar";
import { useTranslation } from "react-i18next";

export const CollapsibleSidebarExamples = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('components.collapsibleSidebar.examples.title')}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {t('components.collapsibleSidebar.examples.description')}
        </p>
      </div>

      {/* Basic Example */}
      <Card>
        <CardHeader>
          <CardTitle>{t('components.collapsibleSidebar.examples.basicUsage')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 border rounded-lg relative">
            <CollapsibleSidebar>
              <CollapsibleSidebar.Header>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('components.collapsibleSidebar.examples.basicSidebar')}
                </h3>
                <CollapsibleSidebar.ToggleButton />
              </CollapsibleSidebar.Header>
              <CollapsibleSidebar.Content>
                <div className="p-3 space-y-2">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">{t('components.collapsibleSidebar.examples.menuItem', { number: 1 })}</div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">{t('components.collapsibleSidebar.examples.menuItem', { number: 2 })}</div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">{t('components.collapsibleSidebar.examples.menuItem', { number: 3 })}</div>
                </div>
              </CollapsibleSidebar.Content>
            </CollapsibleSidebar>
            <div className="ml-80 p-4">
              <p>{t('components.collapsibleSidebar.examples.mainContent')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Width Example */}
      <Card>
        <CardHeader>
          <CardTitle>{t('components.collapsibleSidebar.examples.customWidth')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 border rounded-lg relative">
            <CollapsibleSidebar width="w-96" collapsedWidth="w-0">
              <CollapsibleSidebar.Header>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('components.collapsibleSidebar.examples.wideSidebar')}
                </h3>
                <CollapsibleSidebar.ToggleButton />
              </CollapsibleSidebar.Header>
              <CollapsibleSidebar.Content>
                <div className="p-3 space-y-2">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">{t('components.collapsibleSidebar.examples.wideMenuItem', { number: 1 })}</div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">{t('components.collapsibleSidebar.examples.wideMenuItem', { number: 2 })}</div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">{t('components.collapsibleSidebar.examples.wideMenuItem', { number: 3 })}</div>
                </div>
              </CollapsibleSidebar.Content>
            </CollapsibleSidebar>
            <div className="ml-96 p-4">
              <p>{t('components.collapsibleSidebar.examples.customWidthContent')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Styling Example */}
      <Card>
        <CardHeader>
          <CardTitle>{t('components.collapsibleSidebar.examples.customStyling')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 border rounded-lg relative">
            <CollapsibleSidebar className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700">
              <CollapsibleSidebar.Header className="bg-blue-100 dark:bg-blue-800 border-blue-200 dark:border-blue-600">
                <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {t('components.collapsibleSidebar.examples.customStyled')}
                </h3>
                <CollapsibleSidebar.ToggleButton />
              </CollapsibleSidebar.Header>
              <CollapsibleSidebar.Content className="bg-blue-50 dark:bg-blue-900">
                <div className="p-3 space-y-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded">{t('components.collapsibleSidebar.examples.customItem', { number: 1 })}</div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded">{t('components.collapsibleSidebar.examples.customItem', { number: 2 })}</div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded">{t('components.collapsibleSidebar.examples.customItem', { number: 3 })}</div>
                </div>
              </CollapsibleSidebar.Content>
            </CollapsibleSidebar>
            <div className="ml-80 p-4">
              <p>{t('components.collapsibleSidebar.examples.customStylingContent')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* With Callback Example */}
      <Card>
        <CardHeader>
          <CardTitle>{t('components.collapsibleSidebar.examples.withCallback')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 border rounded-lg relative">
            <CollapsibleSidebar
              // onCollapseChange={(collapsed: boolean) => {
              //   // You can use this callback to sync state with parent component
              //   // or trigger other actions when sidebar state changes
              // }}
            >
              <CollapsibleSidebar.Header>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('components.collapsibleSidebar.examples.withCallbackTitle')}
                </h3>
                <CollapsibleSidebar.ToggleButton />
              </CollapsibleSidebar.Header>
              <CollapsibleSidebar.Content>
                <div className="p-3 space-y-2">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">{t('components.collapsibleSidebar.examples.callbackItem', { number: 1 })}</div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">{t('components.collapsibleSidebar.examples.callbackItem', { number: 2 })}</div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">{t('components.collapsibleSidebar.examples.callbackItem', { number: 3 })}</div>
                </div>
              </CollapsibleSidebar.Content>
            </CollapsibleSidebar>
            <div className="ml-80 p-4">
              <p>{t('components.collapsibleSidebar.examples.callbackContent')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
