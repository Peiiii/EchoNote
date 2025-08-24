// AI Assistant Feature
// Main feature component that provides AI assistant functionality

import { AIAssistantSidebar } from './components/ai-assistant-sidebar';

export const AIAssistantFeature = () => {
  return (
    <div className="ai-assistant-feature">
      <AIAssistantSidebar isOpen={false} onClose={() => {}} channelId="" />
    </div>
  );
};
