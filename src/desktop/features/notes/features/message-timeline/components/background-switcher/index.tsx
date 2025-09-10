import { useState, useRef, useEffect } from 'react';
import { Button } from '@/common/components/ui/button';
import { RefinedPopover } from '@/common/components/refined-popover';
import { Palette, X, Palette as ColorIcon, Image as ImageIcon } from 'lucide-react';
import { BackgroundSwitcherProps } from './types';
import { ColorSelector } from './color-selector';
import { ImageSelector } from './image-selector';
import { BackgroundOption } from './background-options';

export function BackgroundSwitcher({
  currentBackground,
  onBackgroundChange,
  onRemoveBackground,
  buttonClassName = "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 hover:scale-105"
}: BackgroundSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'images'>('colors');
  const [originalBackground, setOriginalBackground] = useState<{ type: 'color' | 'image'; value?: string } | undefined>(currentBackground);
  const isOpenRef = useRef(false);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setOriginalBackground(currentBackground);
    }
    setIsOpen(open);
  };

  const handleBackgroundSelect = (option: BackgroundOption) => {
    if (option.type === 'gradient' || option.type === 'color') {
      onBackgroundChange({ type: 'color', value: option.value });
    } else if (option.type === 'image') {
      onBackgroundChange({ type: 'image', value: option.value });
    }
  };

  const handleResetBackground = () => {
    if (originalBackground) {
      console.log('🎨 [BackgroundSwitcher] Resetting background to:', { originalBackground });
      onBackgroundChange({ type: originalBackground.type, value: originalBackground.value || '' });
    } else {
      onRemoveBackground();
    }
  };

  return (
    <RefinedPopover
      open={isOpen}
      onOpenChange={handleOpenChange}
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
      <RefinedPopover.Content
        width="w-80"
        onInteractOutside={(e: Event) => {
          e.preventDefault();
        }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Background</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex space-x-1 mb-4">
            <Button
              variant={activeTab === 'colors' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setActiveTab('colors')}
            >
              <ColorIcon className="h-4 w-4 mr-2" />
              Colors
            </Button>
            <Button
              variant={activeTab === 'images' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setActiveTab('images')}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Images
            </Button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {activeTab === 'colors' ? (
              <ColorSelector
                currentBackground={currentBackground?.value}
                onBackgroundSelect={handleBackgroundSelect}
              />
            ) : (
              <ImageSelector
                currentBackground={currentBackground?.value}
                onBackgroundSelect={handleBackgroundSelect}
              />
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex flex-col space-y-2">
              <p className="text-xs text-muted-foreground text-center">
                Choose a background to personalize your channel
              </p>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-3 text-xs"
                  onClick={handleResetBackground}
                  title="Reset to original background"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </RefinedPopover.Content>
    </RefinedPopover>
  );
}
