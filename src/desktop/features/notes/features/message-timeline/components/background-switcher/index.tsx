import { useState, useRef, useEffect } from 'react';
import { Button } from '@/common/components/ui/button';
import { RefinedPopover } from '@/common/components/refined-popover';
import { Palette, Palette as ColorIcon, Image as ImageIcon, X } from 'lucide-react';
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
        align="center"
        side="bottom"
        onInteractOutside={(e: Event) => {
          e.preventDefault();
        }}
      >
        <RefinedPopover.Header>
          <Palette className="w-4 h-4 text-primary/80" />
          <div className="text-sm font-semibold text-foreground/90">Background</div>
          <RefinedPopover.Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 ml-auto"
            onClick={() => setIsOpen(false)}
            title="Close"
          >
            <X className="h-3 w-3" />
          </RefinedPopover.Button>
        </RefinedPopover.Header>
        
        <RefinedPopover.Body>

          <div className="flex space-x-1 mb-4">
            <RefinedPopover.Button
              variant={activeTab === 'colors' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setActiveTab('colors')}
            >
              <ColorIcon className="h-4 w-4 mr-2" />
              Colors
            </RefinedPopover.Button>
            <RefinedPopover.Button
              variant={activeTab === 'images' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setActiveTab('images')}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Images
            </RefinedPopover.Button>
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
                <RefinedPopover.Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-3 text-xs"
                  onClick={handleResetBackground}
                  title="Reset to original background"
                >
                  Reset
                </RefinedPopover.Button>
              </div>
            </div>
          </div>
        </RefinedPopover.Body>
      </RefinedPopover.Content>
    </RefinedPopover>
  );
}
