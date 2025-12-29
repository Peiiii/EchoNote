import { ReactNode } from "react";

export interface NotesLayoutProps {
  sidebar?: ReactNode;
  content?: ReactNode;
  rightSidebar?: ReactNode; // Right sidebar (nearest to content)
  farRightSidebar?: ReactNode; // Second right sidebar (outermost)
  className?: string;
}

export interface SidebarLayoutProps {
  children: ReactNode;
  className?: string;
}

export interface ContentAreaProps {
  children: ReactNode;
  rightSidebar?: ReactNode;
  farRightSidebar?: ReactNode;
  className?: string;
}

export interface RightSidebarProps {
  children: ReactNode;
  className?: string;
}
