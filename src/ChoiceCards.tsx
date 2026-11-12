import { Check } from 'lucide-react'
import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from './cx'

export interface CardChoice<T extends string> {
  value: T
  label: string
  hint?: string
  icon?: ReactNode
  /** Une marque courte après le libellé : l'option conseillée, typiquement. */
  badge?: string
}

/**
 * Les colonnes d'une grille de cartes, par requête de conteneur. La grille part toujours
 * d'une colonne `minmax(0, 1fr)` : une colonne implicite prendrait la largeur de
 * l'explication sur une ligne, et la carte déborderait d'un conteneur étroit au lieu de
 * la tronquer.
 *
 * Deux paliers fixes plutôt qu'une largeur passée en prop : une classe Tailwind se lit
 * dans le source au build, et `@min-[${min}]` n'en produirait aucune. Les seuils sont
 * ceux où les libellés tiennent sur une ligne : 15rem par carte à deux, un peu moins à
 * trois, les petites cartes n'ayant qu'une explication tronquée.
 */
const COLUMNS = {
  1: '',
  2: '@min-[30rem]:grid-cols-2',
  3: '@min-[34rem]:grid-cols-3',
} as const

type Columns = keyof typeof COLUMNS

const CARD = 'rounded-md border transition-colors'
const CARD_ON = 'border-accent bg-accent-wash/40'
const CARD_OFF = 'border-line hover:border-line-strong'
/** Le réglage déplié s'aligne sur le libellé, au-delà de l'icône ou de la pastille. */
const EXTRA_INDENT = {
  lg: { icon: 'pl-14', dot: 'pl-[2.375rem]' },
  sm: { icon: 'pl-8', dot: 'pl-[2.125rem]' },
} as const

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Les flèches d'un groupe : elles déplacent le focus d'une carte à la suivante, en
 * boucle. Pour un groupe radio elles choisissent aussi, comme le fait le navigateur
 * pour ses propres boutons radio.
 */
function useArrows(onMove?: (index: number) => void) {
  const group = useRef<HTMLDivElement>(null)
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    if (!step || !group.current) return
    const items = Array.from(group.current.querySelectorAll<HTMLButtonElement>('[data-card]'))
    const current = items.indexOf(document.activeElement as HTMLButtonElement)
    if (current < 0) return
    event.preventDefault()
    const next = (current + step + items.length) % items.length
    items[next]!.focus()
    onMove?.(next)
  }
  return { group, onKeyDown }
}

/**
 * Un choix exclusif en cartes, côte à côte quand le conteneur le permet.
 *
 * `ChoiceList` empile ses options en lignes ; celles-ci se posent en grille, pour les
 * deux ou trois décisions qui structurent un formulaire. Les colonnes suivent la largeur
 * du composant et non celle de l'écran : la même grille tient en deux colonnes dans un
 * tiroir et en une dans un panneau étroit. Il prend donc toute la largeur offerte.
 *
 * Une option sans icône prend une pastille radio, qui dit alors le choix à elle seule.
 * `selectedExtra` déplie un réglage sous l'option choisie, et sous elle seule : il est
 * posé à côté du bouton, pas dedans, puisqu'il porte ses propres contrôles.
 */
export function ChoiceCards<T extends string>({
  label,
  value,
  options,
  onChange,
  size = 'lg',
  columns = 1,
  selectedExtra,
}: {
  /** Nom accessible du groupe. L'intitulé visible est celui du champ qui le porte. */
  label: string
  value: T
  options: CardChoice<T>[]
  onChange: (value: T) => void
  size?: 'lg' | 'sm'
  columns?: Columns
  selectedExtra?: (value: T) => ReactNode
}) {
  const { group, onKeyDown } = useArrows((index) => onChange(options[index]!.value))
  // Sans option choisie, la première reçoit le focus de Tab : sinon le groupe en sortirait.
  const entry = options.some((option) => option.value === value) ? value : options[0]?.value
  return (
    <div className="@container w-full min-w-0">
      <div
        ref={group}
        role="radiogroup"
        aria-label={label}
        onKeyDown={onKeyDown}
        className={cx('grid grid-cols-1 gap-2', COLUMNS[columns])}
      >
        {options.map((option) => {
          const selected = option.value === value
          const extra = selected ? selectedExtra?.(option.value) : null
          return (
            <div key={option.value} className={cx(CARD, selected ? CARD_ON : CARD_OFF)}>
              <button
                type="button"
                role="radio"
                data-card
                aria-checked={selected}
                tabIndex={option.value === entry ? 0 : -1}
                onClick={() => onChange(option.value)}
                className={cx(
                  // Une pastille se pose sur la première ligne, une icône au milieu.
                  'flex min-h-11 w-full text-left',
                  option.icon ? 'items-center' : 'items-start',
                  size === 'sm' ? 'gap-2 px-2.5 py-2' : option.icon ? 'gap-3 px-3 py-2.5' : 'gap-2.5 px-3 py-2.5',
                  FOCUS,
                  'rounded-md',
                )}
              >
                <Lead icon={option.icon} selected={selected} size={size} />
                <span className="flex min-w-0 flex-col">
                  <span className={cx('flex items-center gap-2 text-sm text-ink', size === 'lg' && 'font-medium')}>
                    {option.label}
                    {option.badge ? (
                      <span className="rounded bg-accent/15 px-1.5 py-px text-xs font-normal text-accent">
                        {option.badge}
                      </span>
                    ) : null}
                  </span>
                  {option.hint ? (
                    <span className={cx('text-xs text-ink-faint', size === 'sm' && 'truncate')}>{option.hint}</span>
                  ) : null}
                </span>
                {size === 'lg' && option.icon ? (
                  // Place réservée : la coche apparaissant au choix ne décale rien.
                  <span className="ml-auto w-4 shrink-0 text-accent">{selected ? <Check size={15} /> : null}</span>
                ) : null}
              </button>
              {extra ? (
                <div className={cx('pr-3 pb-2.5', EXTRA_INDENT[size][option.icon ? 'icon' : 'dot'])}>{extra}</div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Lead({ icon, selected, size }: { icon?: ReactNode; selected: boolean; size: 'lg' | 'sm' }) {
  if (!icon) {
    return (
      <span
        aria-hidden
        className={cx(
          'mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border',
          selected ? 'border-accent' : 'border-line-strong',
        )}
      >
        {selected ? <span className="size-2 rounded-full bg-accent" /> : null}
      </span>
    )
  }
  if (size === 'sm') return <span className={cx('shrink-0', selected ? 'text-accent' : 'text-ink-faint')}>{icon}</span>
  return (
    <span
      className={cx(
        'grid size-8 shrink-0 place-items-center rounded-md',
        selected ? 'bg-accent/15 text-accent' : 'bg-surface-high text-ink-soft',
      )}
    >
      {icon}
    </span>
  )
}

/**
 * Des cartes cochables, indépendantes : `CheckCards` dit « l'un, l'autre ou les deux »
 * là où `ChoiceCards` dit « l'un ou l'autre ». Une ligne par carte, 44 px.
 */
export function CheckCards<T extends string>({
  label,
  values,
  options,
  onChange,
  columns = 1,
}: {
  label: string
  values: T[]
  options: CardChoice<T>[]
  onChange: (values: T[]) => void
  columns?: Columns
}) {
  const { group, onKeyDown } = useArrows()
  const toggle = (value: T) =>
    onChange(values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value])
  return (
    <div className="@container w-full min-w-0">
      <div ref={group} role="group" aria-label={label} onKeyDown={onKeyDown} className={cx('grid grid-cols-1 gap-2', COLUMNS[columns])}>
        {options.map((option) => {
          const checked = values.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              role="checkbox"
              data-card
              aria-checked={checked}
              onClick={() => toggle(option.value)}
              className={cx(CARD, checked ? CARD_ON : CARD_OFF, FOCUS, 'flex h-11 min-w-0 items-center gap-2.5 px-3 text-left')}
            >
              <span
                aria-hidden
                className={cx(
                  'grid size-4 shrink-0 place-items-center rounded border',
                  checked ? 'border-accent bg-accent text-accent-ink' : 'border-line-strong',
                )}
              >
                {checked ? <Check size={11} /> : null}
              </span>
              {option.icon ? <span className="shrink-0 text-ink-faint">{option.icon}</span> : null}
              <span className="shrink-0 text-sm font-medium text-ink">{option.label}</span>
              {option.hint ? <span className="min-w-0 truncate text-xs text-ink-faint">{option.hint}</span> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
