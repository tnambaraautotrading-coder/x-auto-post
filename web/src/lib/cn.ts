import { clsx, type ClassValue } from "clsx";

/** 条件付きクラス名を結合するユーティリティ。 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
