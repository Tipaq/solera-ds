import { ChevronLeft, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { IconButton } from './Button'
import { cx } from './cx'
import { useUiLabels } from './labels'

/*
 * Le cadre d'un onglet du panneau : ligne d'outils, en-têtes de groupe, lignes, détail
 * en pile, état vide, bande de retour. Les mêmes mesures dans tous les onglets — les
 * règles sont dans la page « Panneau et tiroir ».
 */

/** Une ligne de liste : 36 px, 44 au doigt, un seul fond au survol. */
export const panelRowClass =
  'group flex h-11 w-full items-center gap-2.5 px-3 text-left transition-colors hover:bg-surface-high/50 md:h-9 pointer-coarse:h-11 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent'

/** Un geste de pied ou de détail, à la hauteur de `Button size="sm"`. */
export const panelGestureClass =
  'inline-flex h-11 items-center gap-1.5 rounded-md px-2.5 text-xs text-ink-soft hover:bg-surface-high hover:text-ink disabled:pointer-events-none disabled:opacity-45 md:h-9 pointer-coarse:h-11 focus-visible:outline-2 focus-visible:outline-accent'

/**
 * Un outil bordé de la ligne d'outils — « Affichage ▾ », un segment, une pastille — à la
 * hauteur de `Button size="sm"`. `pressed` le dit choisi.
 */
export const panelToolClass = (pressed = false) =>
  cx(
    'inline-flex h-11 shrink-0 items-center gap-1.5 rounded-md border px-2.5 text-xs transition-colors md:h-9 pointer-coarse:h-11 focus-visible:outline-2 focus-visible:outline-accent',
    pressed ? 'border-line-strong bg-surface-high text-ink' : 'border-line text-ink-soft hover:border-line-strong hover:text-ink',
  )

/**
 * La ligne d'outils en tête d'un onglet : 48 px, filet dessous. Le titre court et son
 * compte à gauche, les outils à droite. Elle est son propre conteneur : un outil peut
 * se replier en icône quand le panneau est étroit.
 *
 * `lead` pose des outils à gauche, juste après le titre : ce qui choisit ce que l'onglet
 * montre (« Affichage ▾ », des pastilles), avant les gestes. `foldTitle` retire le titre
 * et son compte sous 26 rem, quand l'onglet a mieux à faire de la place — la rangée des
 * onglets dit déjà où l'on est.
 */
export function PanelToolbar({
  title,
  meta,
  lead,
  foldTitle = false,
  children,
  className,
}: {
  title: ReactNode
  meta?: ReactNode
  /** Les outils posés à gauche, après le titre. */
  lead?: ReactNode
  /** Sous 26 rem de large, le titre et son compte s'effacent. */
  foldTitle?: boolean
  /** Les outils, posés à droite. */
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cx('@container flex h-12 shrink-0 items-center gap-1.5 border-b border-line px-3', className)}>
      <span className={cx('min-w-0 shrink items-baseline gap-1.5', foldTitle ? 'hidden @min-[26rem]:flex' : 'flex')}>
        <span className="truncate text-sm font-medium text-ink">{title}</span>
        {meta !== undefined && meta !== null && meta !== '' ? (
          <span className="truncate text-xs tabular-nums text-ink-faint">{meta}</span>
        ) : null}
      </span>
      {lead}
      <span className="flex-1" />
      {children}
    </div>
  )
}

/** L'en-tête d'un groupe de lignes : petites capitales, son compte, un geste à droite. */
export function PanelGroup({ title, count, aside }: { title: ReactNode; count?: number; aside?: ReactNode }) {
  return (
    <h3 className="flex min-h-7 items-center gap-1.5 px-3 pt-1.5 pb-1 text-meta font-medium tracking-wide text-ink-faint uppercase">
      <span className="min-w-0 truncate">{title}</span>
      {count !== undefined ? <span className="tabular-nums">{count}</span> : null}
      {aside ? <span className="ml-auto tracking-normal normal-case">{aside}</span> : null}
    </h3>
  )
}

/**
 * Le ton d'un point d'état — les mêmes rôles que les comptes d'onglet : `positive` ce
 * qui tourne, `caution` ce qui attend, `critical` ce qui a échoué, `accent` ce qui
 * travaille, `neutral` ce qui est arrêté.
 */
export type StatusTone = 'positive' | 'caution' | 'critical' | 'accent' | 'neutral'

const DOTS: Record<StatusTone, string> = {
  positive: 'bg-positive',
  caution: 'bg-caution',
  critical: 'bg-critical',
  accent: 'bg-accent',
  neutral: 'bg-line-strong',
}

/**
 * L'icône de nature d'une ligne, avec son point d'état posé dans son coin bas. Le point
 * est muet : la ligne dit l'état en toutes lettres quelque part, ou dans son nom
 * accessible. `pulse` le fait battre, pour ce qui est en train de tourner.
 *
 * Le prototype en avait deux rendus — un petit point en haut dans l'onglet Projet, un
 * plus gros en bas dans Actions ; celui d'Actions, la référence, vaut pour tous.
 */
export function PanelStatusIcon({ icon, dot, pulse = false }: { icon: ReactNode; dot?: StatusTone; pulse?: boolean }) {
  return (
    <span className="relative grid size-5 shrink-0 place-items-center text-ink-faint">
      {icon}
      {dot ? (
        <span
          aria-hidden
          className={cx(
            'absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-canvas',
            DOTS[dot],
            pulse && 'motion-safe:animate-pulse',
          )}
        />
      ) : null}
    </span>
  )
}

/**
 * L'en-tête d'un détail ouvert en pile dans le panneau : « ‹ Onglet » pour revenir, puis
 * ce qu'on regarde. Le détail remplace la liste ; il ne s'ouvre jamais dans un second
 * tiroir.
 */
export function StackHeader({
  back,
  onBack,
  title,
  meta,
  aside,
}: {
  /** Le nom de l'onglet où l'on revient. */
  back: string
  onBack: () => void
  title: ReactNode
  meta?: ReactNode
  aside?: ReactNode
}) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b border-line px-2">
      <button type="button" onClick={onBack} className={cx(panelGestureClass, 'shrink-0 gap-1 px-2')}>
        <ChevronLeft size={14} aria-hidden />
        {back}
      </button>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-ink">{title}</span>
        {meta ? <span className="truncate text-xs text-ink-faint">{meta}</span> : null}
      </span>
      {aside}
    </div>
  )
}

/** L'état vide d'un onglet ou d'un groupe : une ligne, et le geste utile à côté. */
export function PanelEmpty({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1.5 md:min-h-9 pointer-coarse:min-h-11">
      <p className="text-sm text-ink-faint">{children}</p>
      {action}
    </div>
  )
}

const NOTICE_TONES = {
  neutral: 'text-ink-soft',
  caution: 'text-caution',
  critical: 'text-critical',
} as const

/**
 * Le retour d'un geste ou une erreur : une bande fine sous la ligne d'outils, au même
 * endroit dans tous les onglets. `critical` est annoncé tout de suite (`alert`), le
 * reste poliment (`status`).
 */
export function PanelNotice({
  children,
  tone = 'neutral',
  onClose,
}: {
  children: ReactNode
  tone?: keyof typeof NOTICE_TONES
  onClose?: () => void
}) {
  const labels = useUiLabels()
  return (
    <div
      role={tone === 'critical' ? 'alert' : 'status'}
      className={cx('flex shrink-0 items-center gap-2 border-b border-line py-1 pl-3 text-xs', onClose ? 'pr-1' : 'pr-3', NOTICE_TONES[tone])}
    >
      <span className="min-w-0 flex-1 py-1">{children}</span>
      {onClose ? (
        <IconButton size="sm" label={labels.close} onClick={onClose}>
          <X size={14} />
        </IconButton>
      ) : null}
    </div>
  )
}
