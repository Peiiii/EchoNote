import { ActionButtonProps } from "../types";

export function ActionButton({ icon: Icon, onClick, title, disabled, active }: ActionButtonProps) {
    return (
        <button
            onClick={() => onClick?.()}
            disabled={disabled}
            className={`p-2 transition-all duration-200 rounded-lg hover:scale-105 ${
                active 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                    : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
            } ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            title={title}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
}
