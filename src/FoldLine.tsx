import { ChevronRight } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { cx } from './cx'

/**
 * Une ligne de liste qui se déplie : un chevron, un titre, sa mention courte, et dessous
 * le contenu qu'on ne lit qu'à la demande — un fichier, une note, un détail.
 *
 * Une ligne sans contenu ne se déplie pas et le dit : pas de chevron, la place gardée,
 * pour que les titres d'une même liste restent alignés. Les lignes se séparent d'un
 * filet, sans surface à elles : elles vivent dans celle de leur groupe.
 */
export function FoldLine({
  title,
  meta,
  children,
  defaultOpen = false,
  className,
}: {
  title: ReactNode
  /** La mention qui suit le titre, en petit : « absent », « 12 lignes ». Tronquée si elle manque de place. */
  meta?: ReactNode
  /** Ce que la ligne déplie. Absent, elle reste fermée. */
  children?: ReactNode
  defaultOpen?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  const body = useId()
  const foldable = children !== undefined && children !== null && children !== false
  const shown = open && foldable
  return (
    <li className={cx('border-t border-line first:border-t-0', className)}>
      <button
        type="button"
        disabled={!foldable}
        aria-expanded={foldable ? shown : undefined}
        aria-controls={shown ? body : undefined}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-11 w-full min-w-0 items-center gap-2 py-2 text-left focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-default md:min-h-10"
      >
        {foldable ? (
          <ChevronRight
            size={13}
            aria-hidden
            className={cx('shrink-0 text-ink-faint transition-transform', shown && 'rotate-90')}
          />
        ) : (
          <span aria-hidden className="w-[13px] shrink-0" />
        )}
        <span className="shrink-0 text-sm text-ink">{title}</span>
        {meta !== undefined && meta !== null && meta !== '' ? (
          <span className="min-w-0 truncate text-xs text-ink-faint">{meta}</span>
        ) : null}
      </button>
      {shown ? (
        <div id={body} className="pb-3 pl-[21px]">
          {children}
        </div>
      ) : null}
    </li>
  )
}
