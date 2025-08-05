import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ActivityItem {
  id: string;
  icon: string;
  label: string;
  title?: string;
  group?: string;
  /** the order of the item in the group , smaller is higher priority  */
  order?: number;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

const DEFAULT_ACTIVE_ID = 'chat';

export enum ActivityBarGroup {
  MAIN = 'main',
  FOOTER = 'footer',
}

export interface ActivityBarState {
  items: ActivityItem[];
  activeId?: string;
  expanded: boolean;
  addItem: (item: ActivityItem) => () => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<ActivityItem>) => void;
  setActiveId: (id: string) => void;
  toggleExpanded: () => void;
  setExpanded: (expanded: boolean) => void;
  reset: () => void;
}


export const useActivityBarStore = create<ActivityBarState>()(
  persist(
    (set) => ({
      items: [],
      activeId: undefined,
      expanded: false,

      addItem: (item: ActivityItem) => {
        set((state) => ({
          items: [...state.items, item],
        }));
        return () => {
          set((state) => ({
            items: state.items.filter((it) => it.id !== item.id),
          }));
        }
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          // If the deleted item is currently active, activate the first available item
          activeId: state.activeId === id
            ? state.items.find(item => item.id !== id)?.id || DEFAULT_ACTIVE_ID
            : state.activeId,
        }));
      },

      updateItem: (id: string, updates: Partial<ActivityItem>) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      setActiveId: (id: string) => {
        set((state) => {
          // Update both activeId and items in a single set operation
          const updatedItems = state.items.map((item) => ({
            ...item,
            isActive: item.id === id,
          }));
          return {
            activeId: id,
            items: updatedItems,
          };
        });
      },

      toggleExpanded: () => {
        set((state) => ({ expanded: !state.expanded }));
      },

      setExpanded: (expanded: boolean) => {
        set({ expanded });
      },

      reset: () => {
        set({
          items: [],
          activeId: DEFAULT_ACTIVE_ID,
          expanded: false,
        });
      },
    }),
    {
      name: 'activity-bar-store',
      partialize: (state) => ({ expanded: state.expanded }), // Only persist expanded
    }
  )
);

