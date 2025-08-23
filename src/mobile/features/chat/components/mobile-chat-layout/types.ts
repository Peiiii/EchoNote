import { ReactNode } from "react";

export interface MobileChatLayoutProps {
    sidebar: ReactNode;
    content: ReactNode;
    rightSidebar?: ReactNode; // Right sidebar for thread/AI assistant
    className?: string;
}

export interface MobileSidebarLayoutProps {
    children: ReactNode;
    className?: string;
}

export interface MobileContentAreaProps {
    children: ReactNode;
    rightSidebar?: ReactNode;
    className?: string;
}

export interface MobileRightSidebarProps {
    children: ReactNode;
    className?: string;
}
