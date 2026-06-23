import { cn } from "../../lib/cn";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps {
  /** 表示名。イニシャル生成と alt に使う。 */
  name: string;
  /** 画像 URL。未指定ならイニシャルを表示。 */
  src?: string;
  size?: AvatarSize;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-caption",
  md: "h-10 w-10 text-body",
  lg: "h-12 w-12 text-title",
};

function initials(name: string): string {
  return name.trim().slice(0, 2);
}

/** ユーザー/ブランドのアバター。 */
export function Avatar({ name, src, size = "md" }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-pill bg-brand font-semibold text-content-inverse",
        sizeClasses[size],
      )}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span aria-label={name}>{initials(name)}</span>
      )}
    </span>
  );
}
