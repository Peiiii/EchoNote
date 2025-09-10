import { Send } from "lucide-react";
import { SendButtonProps } from "../types";

export function SendButton({ onSend, disabled, message }: SendButtonProps) {
    return (
        <div className="absolute bottom-2 right-2">
            <button
                onClick={onSend}
                disabled={disabled}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                    message.trim() && !disabled
                        ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                }`}
            >
                <Send className="w-4 h-4" />
            </button>
        </div>
    );
}
