import { InputAreaProps } from "../types";
import { useInputCollapse } from "../../../hooks/use-input-collapse";
import { RichEditorLite } from "@/common/components/RichEditorLite";
import { useComposerStateStore } from "@/core/stores/composer-state.store";
// Revert to simple textarea input (no WYSIWYG) per request

export function InputArea({
  message,
  onMessageChange,
  onKeyDown,
  placeholder,
  disabled,
  isFocusMode,
}: InputAreaProps & { isFocusMode?: boolean }) {
  const { handleExpandInput, inputCollapsed } = useInputCollapse();
  const composerExpanded = useComposerStateStore(s => s.expanded);
  
  const minHeight = isFocusMode ? 80 : 120;
  const maxHeight = isFocusMode ? 120 : 160;
  
  return (
    <div className="w-full">
      <div className={`relative ${isFocusMode ? "min-h-[80px]" : "min-h-[120px]"}`} onMouseDown={handleExpandInput}>
        <RichEditorLite
          value={message}
          onChange={onMessageChange}
          editable={!disabled}
          placeholder={placeholder}
          variant="frameless"
          hideToolbar
          minHeight={minHeight}
          maxHeight={maxHeight}
          enterSends
          suspended={inputCollapsed || composerExpanded}
          onSubmitEnter={() => {
            const syntheticEvent = {
              key: 'Enter',
              metaKey: true,
              ctrlKey: true,
              preventDefault: () => undefined,
            } as unknown as React.KeyboardEvent
            onKeyDown(syntheticEvent)
          }}
        />
      </div>
    </div>
  );
}
