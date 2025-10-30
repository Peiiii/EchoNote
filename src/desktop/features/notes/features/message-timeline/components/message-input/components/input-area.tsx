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
  return (
    <div className="w-full">
      {/* Increase the clickable/minimum area height to 120px */}
      <div className="relative min-h-[120px]" onMouseDown={handleExpandInput}>
        <RichEditorLite
          value={message}
          onChange={onMessageChange}
          editable={!disabled}
          placeholder={placeholder}
          variant="frameless"
          hideToolbar
          // Requested: raise input area minHeight from 40 to 120
          minHeight={120}
          maxHeight={160}
          enterSends
          suspended={inputCollapsed || composerExpanded}
          onSubmitEnter={() => {
            // Simulate Shift+Enter send via parent keydown handler
            const e = { key: 'Enter', shiftKey: true } as unknown as React.KeyboardEvent
            onKeyDown(e)
          }}
        />
      </div>
    </div>
  );
}
