import type { ReactNode } from 'react'
import { useRef } from 'react'
import { cx } from './cx'

export interface Tab<T extends string> {
  value: T
  label: string
  icon?: ReactNode
  /** Compteur affiché après l'intitulé. `undefined` n'occupe pas de place. */
  count?: number
  /** Le rôle du compteur : voir `CountTone`. */
  tone?: CountTone
  /** Ce que compte le compteur, nombre compris (« 2 en marche ») : en infobulle, et lu à
      la place du nombre seul. Voir `TabCount`. */
  countTitle?: string
}

/**
 * Le rôle d'un compteur d'onglet, et non sa couleur — trois, et pas un de plus :
 *
 * - `neutral`, gris : un **inventaire**, ce qui existe (« 12 cartes ») ;
 * - `caution`, ambre : ce qui **t'attend**, une demande (« 2 à relire ») ;
 * - `running`, vert : ce qui **tourne** tout seul (« 3 en marche »).
 */
export type CountTone = 'neutral' | 'caution' | 'running'

const COUNT_TONES: Record<CountTone, string> = {
  neutral: 'bg-surface-high text-ink-soft',
  caution: 'bg-caution/10 text-caution',
  running: 'bg-positive/10 text-positive',
}

/**
 * Le compteur d'un onglet, après son intitulé.
 *
 * Exporté parce que le motif a **deux porteurs** : `Tabs`, qui bascule un état dans un
 * panneau, et la rangée de vues d'un projet, qui navigue — l'une est une liste
 * d'onglets au sens ARIA, l'autre une navigation de liens, et aucune ne peut jouer le
 * rôle de l'autre. Ce qu'elles partagent est l'apparence, et elle n'a qu'une source.
 */
export function TabCount({ count, tone = 'neutral', title }: {
  count: number
  tone?: CountTone
  /** Ce que compte le compteur. Infobulle au survol, et dit à la place du nombre seul
      au lecteur d'écran : « Actions 2 à relire » plutôt que « Actions 2 ». Il remplace
      le nombre, il doit donc le contenir. */
  title?: string
}) {
  return (
    <span title={title} className={cx('rounded px-1.5 py-0.5 text-xs tabular-nums', COUNT_TONES[tone])}>
      {title ? (
        <>
          <span aria-hidden>{count}</span>
          <span className="sr-only">{title}</span>
        </>
      ) : (
        count
      )}
    </span>
  )
}

/**
 * Les classes d'un élément de rangée, actif ou non.
 *
 * Le soulignement d'accent et rien d'autre : voir la note du composant. Une fonction
 * plutôt qu'un composant, parce que l'élément porteur diffère — `button[role=tab]` ici,
 * `NavLink` dans la rangée de vues.
 */
export function tabItemClass(selected: boolean, layout: 'fill' | 'start' = 'start'): string {
  return cx(
    'flex min-h-11 items-center gap-2 border-b-2 px-1 text-sm whitespace-nowrap',
    'transition-[border-color,color] duration-150',
    layout === 'fill' ? 'flex-1 justify-center' : '',
    selected ? 'border-accent text-ink' : 'border-transparent text-ink-faint hover:text-ink',
  )
}

/**
 * Une navigation entre les vues d'un même panneau, soulignée sous l'onglet actif.
 *
 * Trois copies de ce motif coexistaient dans l'application, avec trois traitements de
 * l'état actif (`font-semibold`, `text-ink`, `text-accent`) et trois hauteurs (44, 44,
 * 48 px) : la même mécanique de navigation sous trois apparences. **Le soulignement
 * d'accent suffit** — souligner en accent *et* colorer le texte en accent dit deux fois
 * la même chose, et le gras déplace les intitulés voisins quand on change d'onglet.
 *
 * Sémantique de liste d'onglets, pas de boutons pressés : un lecteur d'écran doit
 * annoncer « onglet 2 sur 3 » et non « bouton enfoncé ». D'où le `tabindex` tournant —
 * la flèche circule entre les onglets, `Tab` sort du groupe.
 *
 * `layout` est le seul paramètre libre : `fill` partage la largeur entre les onglets
 * (un panneau étroit, où ils tiennent lieu de filtre), `start` les laisse à leur
 * largeur naturelle (un panneau large, où une rangée pleine serait démesurée).
 */
export function Tabs<T extends string>({
  label,
  value,
  tabs,
  onChange,
  layout = 'start',
  className,
}: {
  label: string
  value: T
  tabs: Tab<T>[]
  onChange: (value: T) => void
  layout?: 'fill' | 'start'
  className?: string
}) {
  const list = useRef<HTMLDivElement>(null)

  // La flèche déplace la sélection *et* le focus : c'est ce qui distingue une liste
  // d'onglets d'une rangée de boutons, et ce que le lecteur d'écran annonce.
  function move(delta: number | 'first' | 'last') {
    const index = Math.max(tabs.findIndex((tab) => tab.value === value), 0)
    const next =
      delta === 'first' ? 0
      : delta === 'last' ? tabs.length - 1
      : (index + delta + tabs.length) % tabs.length
    const target = tabs[next]
    if (!target) return
    onChange(target.value)
    list.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
  }

  return (
    <div
      ref={list}
      role="tablist"
      aria-label={label}
      onKeyDown={(event) => {
        const delta =
          event.key === 'ArrowRight' ? 1
          : event.key === 'ArrowLeft' ? -1
          : event.key === 'Home' ? ('first' as const)
          : event.key === 'End' ? ('last' as const)
          : null
        if (delta === null) return
        event.preventDefault()
        move(delta)
      }}
      className={cx('flex shrink-0 border-b border-line', layout === 'fill' ? 'gap-1' : 'gap-5', className)}
    >
      {tabs.map((tab) => {
        const selected = tab.value === value
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.value)}
            className={tabItemClass(selected, layout)}
          >
            {tab.icon}
            {tab.label}
            {tab.count === undefined ? null : <TabCount count={tab.count} tone={tab.tone} title={tab.countTitle} />}
          </button>
        )
      })}
    </div>
  )
}
