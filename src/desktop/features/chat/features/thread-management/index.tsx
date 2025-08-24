// Thread Management Feature
// Main feature component that provides thread management functionality

import { ThreadSidebar } from './components/thread-sidebar';

export const ThreadManagementFeature = () => {
  return (
    <div className="thread-management-feature">
      <ThreadSidebar 
        isOpen={false} 
        onClose={() => {}} 
        parentMessage={null} 
        threadMessages={[]} 
        onSendMessage={() => {}} 
      />
    </div>
  );
};
