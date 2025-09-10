export interface BackgroundSwitcherProps {
  currentBackground?: string;
  currentBackgroundType?: 'color' | 'image';
  onBackgroundChange: (type: 'color' | 'image', value: string) => void;
  onRemoveBackground: () => void;
  buttonClassName?: string;
}

export type BackgroundType = 'color' | 'image' | 'gradient';
