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
}: InputAreaProps) {
  const { handleExpandInput, inputCollapsed } = useInputCollapse();
  const composerExpanded = useComposerStateStore(s => s.expanded);
  
  const minHeight = 80;
  const maxHeight = 120;
  
  return (
    <div className="w-full">
      <div className="relative min-h-[80px]" onMouseDown={handleExpandInput}>
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
