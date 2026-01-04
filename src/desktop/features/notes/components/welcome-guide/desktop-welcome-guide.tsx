import { Button } from "@/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { Bot, FileText, Lightbulb, Plus, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export const DesktopWelcomeGuide = () => {
  const { t } = useTranslation();
  const { addChannel } = useNotesDataStore();

  const handleCreateFirstChannel = async () => {
    try {
      await addChannel({
        name: t('desktop.welcomeGuide.firstSpaceName'),
        emoji: "🚀",
        description: t('desktop.welcomeGuide.firstSpaceDescription'),
      });
    } catch (error) {
      console.error("Failed to create first channel:", error);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{t('desktop.welcomeGuide.title')}</h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            {t('desktop.welcomeGuide.description')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-base">{t('desktop.welcomeGuide.feature1.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {t('desktop.welcomeGuide.feature1.description')}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Bot className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-base">{t('desktop.welcomeGuide.feature2.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {t('desktop.welcomeGuide.feature2.description')}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-base">{t('desktop.welcomeGuide.feature3.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {t('desktop.welcomeGuide.feature3.description')}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <Button
            onClick={handleCreateFirstChannel}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('desktop.welcomeGuide.createFirstSpace')}
          </Button>
          <p className="text-sm text-muted-foreground">
            {t('desktop.welcomeGuide.createMoreHint')}
          </p>
        </div>
      </div>
    </div>
  );
};
