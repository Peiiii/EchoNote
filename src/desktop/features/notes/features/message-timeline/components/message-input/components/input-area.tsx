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
    <div className="w-full">
      <div className="relative min-h-[48px]">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={e => onMessageChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="w-full min-h-[48px] max-h-[200px] resize-none px-4 py-2.5 bg-transparent border-0 text-sm leading-relaxed placeholder:text-muted-foreground/70 focus:outline-none focus:ring-0 outline-none shadow-none"
          disabled={disabled}
          style={{
            caretColor: "#3b82f6",
          }}
        />
      </div>
    </div>
  );
}
