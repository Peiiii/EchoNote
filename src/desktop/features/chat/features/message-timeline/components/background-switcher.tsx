import { Button } from "@/common/components/ui/button";
import { RefinedPopover } from "@/common/components/refined-popover";
import { Palette, X } from "lucide-react";
import { useState } from "react";

interface BackgroundOption {
  id: string;
  name: string;
  type: 'color' | 'image' | 'gradient';
  value: string;
  preview: string;
}

interface BackgroundSwitcherProps {
  currentBackground?: string;
  currentBackgroundType?: 'color' | 'image';
  onBackgroundChange: (type: 'color' | 'image', value: string) => void;
  onRemoveBackground: () => void;
  buttonClassName?: string;
}

const backgroundOptions: BackgroundOption[] = [
  // Gradient backgrounds
  {
    id: 'gradient-1',
    name: 'Ocean Breeze',
    type: 'gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'gradient-2',
    name: 'Sunset Glow',
    type: 'gradient',
    value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 'gradient-3',
    name: 'Forest Mist',
    type: 'gradient',
    value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    preview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 'gradient-4',
    name: 'Warm Sand',
    type: 'gradient',
    value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    preview: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 'gradient-5',
    name: 'Purple Haze',
    type: 'gradient',
    value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    preview: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  {
    id: 'gradient-6',
    name: 'Midnight Sky',
    type: 'gradient',
    value: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    preview: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)'
  },
  // Solid colors
  {
    id: 'color-1',
    name: 'Soft Blue',
    type: 'color',
    value: '#e3f2fd',
    preview: '#e3f2fd'
  },
  {
    id: 'color-2',
    name: 'Warm Gray',
    type: 'color',
    value: '#f5f5f5',
    preview: '#f5f5f5'
  },
  {
    id: 'color-3',
    name: 'Mint Green',
    type: 'color',
    value: '#e8f5e8',
    preview: '#e8f5e8'
  },
  {
    id: 'color-4',
    name: 'Lavender',
    type: 'color',
    value: '#f3e5f5',
    preview: '#f3e5f5'
  },
  {
    id: 'color-5',
    name: 'Peach',
    type: 'color',
    value: '#fff3e0',
    preview: '#fff3e0'
  },
  {
    id: 'color-6',
    name: 'Rose',
    type: 'color',
    value: '#fce4ec',
    preview: '#fce4ec'
  }
];

export function BackgroundSwitcher({
  currentBackground,
  onBackgroundChange,
  onRemoveBackground,
  buttonClassName = "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 hover:scale-105"
}: BackgroundSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleBackgroundSelect = (option: BackgroundOption) => {
    if (option.type === 'gradient' || option.type === 'color') {
      onBackgroundChange('color', option.value);
    }
    setIsOpen(false);
  };

  const isCurrentBackground = (option: BackgroundOption) => {
    return currentBackground === option.value;
  };

  return (
    <RefinedPopover
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <RefinedPopover.Trigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={buttonClassName}
          title="Change background"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </RefinedPopover.Trigger>
      <RefinedPopover.Content width="w-80">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Background</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => {
                onRemoveBackground();
                setIsOpen(false);
              }}
              title="Remove background"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {backgroundOptions.map((option) => (
              <button
                key={option.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleBackgroundSelect(option);
                }}
                className={`relative aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
                  isCurrentBackground(option)
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ background: option.preview }}
                title={option.name}
              >
                {isCurrentBackground(option) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Choose a background to personalize your channel
            </p>
          </div>
        </div>
      </RefinedPopover.Content>
    </RefinedPopover>
  );
}
