/**
 * Utility para combinar classNames condicionalmente
 * Similar a classnames/clsx
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
