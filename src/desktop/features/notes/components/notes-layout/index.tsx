import { NotesLayoutProps } from "./types";
import { LeftSidebar } from "./left-sidebar";
import { ContentArea } from "./content-area";

export const NotesLayout = ({
  sidebar,
  content,
  rightSidebar,
  farRightSidebar,
  className = "",
}: NotesLayoutProps) => {
  return (
    <div className={`flex-1 flex flex-col bg-background ${className} overflow-hidden`}>
      <div className="flex-1 flex min-h-0 relative">
        {/* Left sidebar */}
        <LeftSidebar className="bg-card dark:bg-sidebar">{sidebar}</LeftSidebar>

        {/* Content area with optional right sidebar */}
        <ContentArea rightSidebar={rightSidebar} farRightSidebar={farRightSidebar}>{content}</ContentArea>
      </div>
    </div>
  );
};
