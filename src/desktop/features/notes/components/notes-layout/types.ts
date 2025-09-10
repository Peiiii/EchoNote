import { ReactNode } from "react";

export interface NotesLayoutProps {
    sidebar?: ReactNode;
    content?: ReactNode;
    rightSidebar?: ReactNode; // Right sidebar
    className?: string;
}

export interface SidebarLayoutProps {
    children: ReactNode;
    className?: string;
}

export interface ContentAreaProps {
    children: ReactNode;
    rightSidebar?: ReactNode;
    className?: string;
}

export interface RightSidebarProps {
    children: ReactNode;
    className?: string;
}
