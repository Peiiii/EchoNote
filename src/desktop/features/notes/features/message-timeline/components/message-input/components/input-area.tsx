import { InputAreaProps } from "../types";

export function InputArea({
  message,
  onMessageChange,
  onKeyDown,
  placeholder,
  disabled,
  textareaRef,
}: InputAreaProps) {
  return (
    <div className="px-3 pb-2">
      <div className="w-full">
        <div className="relative min-h-[70px] bg-transparent">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={e => onMessageChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="w-full min-h-[70px] max-h-[200px] resize-none pr-12 pl-4 py-2 pt-0 bg-transparent border-0 rounded-none text-sm leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:text-sm focus:ring-0 focus:outline-none focus:border-0 shadow-none"
            disabled={disabled}
            style={{
              caretColor: "#3b82f6",
            }}
          />
        </div>
      </div>
    </div>
  );
}
