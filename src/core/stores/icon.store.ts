import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Bookmark,
  Bot,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Cog,
  Download,
  Edit,
  FileText,
  Folder,
  Github,
  Heart,
  HelpCircle,
  Home,
  Info,
  LogOut,
  Menu,
  MessageSquare,
  Minus,
  Monitor,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Share,
  Star,
  Sun,
  Trash,
  Upload,
  User,
  Users,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { create } from "zustand";

export interface IconState {
  // Icon mapping
  icons: Record<string, LucideIcon>;
  // Add icon
  addIcon: (id: string, icon: LucideIcon) => () => void;
  addIcons: (icons: Record<string, LucideIcon>) => () => void;
  // Remove icon
  removeIcon: (id: string) => void;
  // Get icon
  getIcon: (id: string) => LucideIcon | undefined;
  // Reset
  reset: () => void;
}

// Default icon mapping
const defaultIcons: Record<string, LucideIcon> = {
  // Basic icons
  message: MessageSquare,
  users: Users,
  settings: Settings,
  github: Github,
  home: Home,
  search: Search,
  file: FileText,
  folder: Folder,
  calendar: Calendar,
  star: Star,
  heart: Heart,
  bookmark: Bookmark,
  bot: Bot,

  // Action icons
  download: Download,
  upload: Upload,
  share: Share,
  edit: Edit,
  trash: Trash,
  plus: Plus,
  minus: Minus,
  check: Check,
  x: X,

  // Navigation icons
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-up": ChevronUp,
  "chevron-down": ChevronDown,
  menu: Menu,
  "more-horizontal": MoreHorizontal,
  "more-vertical": MoreVertical,

  // Theme icons
  sun: Sun,
  moon: Moon,
  monitor: Monitor,

  // User related icons
  bell: Bell,
  user: User,
  "log-out": LogOut,
  cog: Cog,

  // Status icons
  "help-circle": HelpCircle,
  info: Info,
  "alert-circle": AlertCircle,
  "alert-triangle": AlertTriangle,
  "check-circle": CheckCircle,
  "x-circle": XCircle,
};

export const useIconStore = create<IconState>()((set, get) => ({
  icons: defaultIcons,

  addIcon: (id: string, icon: LucideIcon) => {
    set((state) => ({
      icons: {
        ...state.icons,
        [id]: icon,
      },
    }));
    return () => {
      get().removeIcon(id);
    };
  },

  addIcons: (icons: Record<string, LucideIcon>) => {
    set((state) => {
      return {
        icons: {
          ...state.icons,
          ...icons,
        },
      };
    });
    return () => {
      Object.keys(icons).forEach((key) => {
        get().removeIcon(key);
      });
    };
  },

  removeIcon: (id: string) => {
    set((state) => {
      const newIcons = { ...state.icons };
      delete newIcons[id];
      return {
        icons: newIcons,
      };
    });
  },

  getIcon: (id: string) => {
    return get().icons[id];
  },

  reset: () => {
    set({
      icons: defaultIcons,
    });
  },
}));

export const useIcon = (id: string) => useIconStore((state) => state.icons[id]);
