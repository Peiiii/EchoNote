import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/common/components/ui/popover";
import { Plus, X, Tag as TagIcon } from "lucide-react";
import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

export interface TagEditorPopoverProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  trigger?: React.ReactNode;
  maxTags?: number;
  placeholder?: string;
}

export function TagEditorPopover({
  tags,
  onTagsChange,
  trigger,
  maxTags = 10,
  placeholder,
}: TagEditorPopoverProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const defaultPlaceholder = placeholder || t('notes.tagEditor.placeholder');

  // Focus input when popover opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addTag = (tagName: string) => {
    const trimmedTag = tagName.trim().toLowerCase();

    if (!trimmedTag) return;

    // Check if tag already exists
    if (tags.includes(trimmedTag)) {
      setInputValue("");
      return;
    }

    // Check max tags limit
    if (tags.length >= maxTags) {
      return;
    }

    onTagsChange([...tags, trimmedTag]);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleAddClick = () => {
    addTag(inputValue);
  };

  const handleTagClick = (tag: string) => {
    setEditingTag(tag);
    setInputValue(tag);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleEditTag = () => {
    if (editingTag && inputValue.trim()) {
      const newTag = inputValue.trim().toLowerCase();
      if (newTag !== editingTag && !tags.includes(newTag)) {
        onTagsChange(tags.map(tag => (tag === editingTag ? newTag : tag)));
      }
      setEditingTag(null);
      setInputValue("");
    }
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setInputValue("");
  };

  const handleKeyPressEdit = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEditTag();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800"
          >
            <TagIcon className="h-4 w-4 mr-1" />
            {t('notes.tagEditor.tags')}
            {tags.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 rounded-full">
                {tags.length}
              </span>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" side="bottom">
        <div className="p-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <TagIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">{t('notes.tagEditor.editTags')}</h3>
          </div>

          {/* Input area */}
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={editingTag ? handleKeyPressEdit : handleKeyPress}
              placeholder={editingTag ? t('notes.tagEditor.editPlaceholder', { tag: editingTag }) : defaultPlaceholder}
              className="flex-1"
            />
            {editingTag ? (
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={handleCancelEdit} className="px-2">
                  <X className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleEditTag}
                  disabled={!inputValue.trim()}
                  className="px-2"
                >
                  ✓
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={handleAddClick}
                disabled={!inputValue.trim() || tags.length >= maxTags}
                className="px-2"
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Tags display */}
        <div className="p-3">
          {tags.length === 0 ? (
            <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
              {t('notes.tagEditor.noTags')}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                {t('notes.tagEditor.tagCount', { current: tags.length, max: maxTags })}
              </div>
              <div className="flex flex-wrap gap-1">
                {tags.map(tag => (
                  <div
                    key={tag}
                    className="group flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-md px-2 py-1 text-sm"
                  >
                    <span
                      className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </span>
                    <button
                      onClick={() => removeTag(tag)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
