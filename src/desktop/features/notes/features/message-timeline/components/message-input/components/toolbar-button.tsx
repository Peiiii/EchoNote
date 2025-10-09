import { ToolbarButtonProps } from "../types";

export function ToolbarButton({
  icon: Icon,
  onClick,
  title,
  disabled = false,
  className = "",
}: ToolbarButtonProps) {
  const baseClasses =
    "w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all duration-200";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      onClick={() => onClick?.()}
      disabled={disabled}
      className={`${baseClasses} ${disabledClasses} ${className}`}
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
