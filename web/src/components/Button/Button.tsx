import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 見た目のバリアント。 */
  variant?: ButtonVariant;
  /** サイズ。 */
  size?: ButtonSize;
  /** 横幅いっぱいに広げる。 */
  fullWidth?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-content-inverse hover:bg-accent-strong border border-transparent",
  secondary:
    "bg-surface-0 text-content-strong border border-line-strong hover:bg-surface-1",
  ghost:
    "bg-transparent text-accent border border-transparent hover:bg-surface-2",
  danger:
    "bg-status-failed text-content-inverse border border-transparent hover:opacity-90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-md text-caption gap-xs",
  md: "h-10 px-lg text-body gap-sm",
  lg: "h-12 px-xl text-title gap-sm",
};

/** デザインシステムの基本ボタン。 */
export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
