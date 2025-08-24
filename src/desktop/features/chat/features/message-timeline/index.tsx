// Message Timeline Feature
// Main feature component that provides message timeline functionality

import { MessageTimeline } from '@/desktop/features/chat/features/message-timeline/components';

export const MessageTimelineFeature = () => {
  return (
    <div className="message-timeline-feature">
      <MessageTimeline onOpenThread={() => {}} messages={[]} />
    </div>
  );
};
