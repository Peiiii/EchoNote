import { Button } from "@/common/components/ui/button";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { Bot, FileText, Lightbulb, Plus, Sparkles } from "lucide-react";

export const MobileWelcomeGuide = () => {
  const { addChannel } = useNotesDataStore();

  const handleCreateFirstChannel = async () => {
    try {
      await addChannel({
        name: "My First Space",
        emoji: "🚀",
        description: "Start your journey here",
      });
    } catch (error) {
      console.error("Failed to create first channel:", error);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-sm w-full space-y-6 text-center">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome to StillRoot</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your personal space for thoughts, ideas, and AI-powered conversations. Create your first
            thought space to get started.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Organize Thoughts</h3>
              <p className="text-xs text-muted-foreground">
                Create dedicated spaces for different topics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Get help from AI to explore ideas</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Spark Ideas</h3>
              <p className="text-xs text-muted-foreground">
                Capture inspiration and brainstorm solutions
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="space-y-3">
          <Button
            onClick={handleCreateFirstChannel}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Space
          </Button>
          <p className="text-xs text-muted-foreground">
            You can create more spaces later from the menu
          </p>
        </div>
      </div>
    </div>
  );
};
