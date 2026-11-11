import type { ReactNode } from 'react'
import { cx } from './cx'

/**
 * Le verdict d'un passage, et non sa couleur : `running` en accent (il bat), `positive`
 * réussi, `critical` échoué, `caution` interrompu ou hors délai, `neutral` sauté.
 */
export type RunTone = 'running' | 'positive' | 'critical' | 'caution' | 'neutral'

export interface StripRun {
  id: string
  tone: RunTone
  /** L'infobulle d'une pastille : la date, le verdict, la durée. */
  title: string
}

const TONES: Record<RunTone, string> = {
  running: 'bg-accent motion-safe:animate-pulse',
  positive: 'bg-positive',
  critical: 'bg-critical',
  caution: 'bg-caution',
  neutral: 'bg-line-strong',
}

const SIZES = {
  sm: 'h-3 w-1.5',
  md: 'h-5 w-2.5',
} as const

/** En `md`, sous cette largeur de conteneur, seuls les dix derniers passages restent. */
const NARROW_KEEP = 10

/**
 * La frise des derniers passages : une pastille par passage, **le plus récent à
 * droite**, la couleur pour le verdict.
 *
 * `sm` tient dans une ligne de liste ; `slots` y réserve la place des passages qui
 * n'ont pas encore eu lieu, pour que les frises d'une liste s'alignent. `md` est la frise
 * d'un détail : elle prend la largeur de son conteneur, ne garde que les dix derniers
 * quand il est étroit (le panneau d'une conversation), et montre `caption` quand il est
 * large.
 *
 * `label` est ce qu'entend le lecteur d'écran à la place des pastilles : un résumé
 * (« 8 réussis, 2 échoués »), que l'appelant compose.
 */
export function RunStrip({
  runs,
  label,
  size = 'sm',
  slots,
  caption,
  className,
}: {
  /** Du plus ancien au plus récent. */
  runs: StripRun[]
  label: string
  size?: keyof typeof SIZES
  /** Nombre de places : les vides se posent à gauche, les passages en trop tombent. */
  slots?: number
  caption?: ReactNode
  className?: string
}) {
  const shown = slots ? runs.slice(-slots) : runs
  const empty = slots ? slots - shown.length : 0
  const strip = (
    <span role="img" aria-label={label} className={cx('flex items-end', size === 'sm' ? 'gap-0.5' : 'gap-1')}>
      {Array.from({ length: empty }, (_, index) => (
        <span key={`empty-${index}`} className={cx('rounded-sm bg-surface-high', SIZES[size])} />
      ))}
      {shown.map((run, index) => (
        <span
          key={run.id}
          title={run.title}
          className={cx(
            'rounded-sm',
            SIZES[size],
            TONES[run.tone],
            size === 'md' && index < shown.length - NARROW_KEEP && 'hidden @min-[28rem]:block',
          )}
        />
      ))}
    </span>
  )
  if (size === 'sm') return <span className={cx('inline-flex', className)}>{strip}</span>
  return (
    <div className={cx('@container flex min-w-0 items-end gap-1.5', className)}>
      {strip}
      {caption ? <span className="hidden text-xs text-ink-faint @min-[28rem]:inline">{caption}</span> : null}
    </div>
  )
}
