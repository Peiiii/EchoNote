import { FooterItemProps } from "../types";

export function FooterItem({ children, onClick, className = "" }: FooterItemProps) {
  const baseClasses =
    "hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200";
  const clickableClasses = onClick ? "cursor-pointer" : "";

  if (onClick) {
    return (
      <button onClick={onClick} className={`${baseClasses} ${clickableClasses} ${className}`}>
        {children}
      </button>
    );
  }

  return <span className={`${baseClasses} ${className}`}>{children}</span>;
}
