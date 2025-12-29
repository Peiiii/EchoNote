import { ArrowDown } from "lucide-react";
import { SendButtonProps } from "../types";

export function SendButton({ onSend, disabled, message }: SendButtonProps) {
  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2">
      <button
        onClick={onSend}
        disabled={disabled}
        className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors duration-150 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 ${
          !message.trim() || disabled ? "opacity-40 cursor-not-allowed hover:bg-transparent" : ""
        }`}
        aria-label="Send note"
      >
        <ArrowDown className="w-4 h-4" />
      </button>
    </div>
  );
}
