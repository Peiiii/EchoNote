export interface BackgroundSwitcherProps {
  currentBackground?: {
    type: "color" | "image";
    value?: string;
  };
  currentBackgroundType?: "color" | "image";
  onBackgroundChange: ({ type, value }: { type: "color" | "image"; value: string }) => void;
  onRemoveBackground: () => void;
  buttonClassName?: string;
}

export type BackgroundType = "color" | "image" | "gradient";
