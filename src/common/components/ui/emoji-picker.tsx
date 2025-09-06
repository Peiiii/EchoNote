import { useState, useEffect } from "react";
import { RefinedPopover } from "@/common/components/refined-popover";
import EmojiPicker, { SkinTones, EmojiStyle, Theme } from "emoji-picker-react";

interface EmojiPickerProps {
  value?: string;
  onSelect: (emoji: string) => void;
  children: React.ReactNode;
}

export function EmojiPickerComponent({ onSelect, children }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  const handleEmojiClick = (emojiData: any) => {
    onSelect(emojiData.emoji);
    setIsOpen(false);
  };

  return (
    <RefinedPopover open={isOpen} onOpenChange={setIsOpen}>
      <RefinedPopover.Trigger asChild>
        {children}
      </RefinedPopover.Trigger>
      <RefinedPopover.Content align="start" sideOffset={8} className="p-0">
        <div className="w-80">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
            searchDisabled={false}
            skinTonesDisabled={false}
            width="100%"
            height={350}
            theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
            previewConfig={{
              showPreview: false
            }}
            searchPlaceHolder="Search emojis..."
            defaultSkinTone={SkinTones.NEUTRAL}
            emojiStyle={EmojiStyle.NATIVE}
            lazyLoadEmojis={true}
          />
        </div>
      </RefinedPopover.Content>
    </RefinedPopover>
  );
}
