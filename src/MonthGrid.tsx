import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState, type KeyboardEvent } from 'react'
import { IconButton } from './Button'
import { cx } from './cx'
import { useUiLabels } from './labels'

/** Minuit, heure locale, du jour qui contient `ts`. */
export function startOfDay(ts: number): number {
  const date = new Date(ts)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

function startOfMonth(ts: number): number {
  const date = new Date(ts)
  return new Date(date.getFullYear(), date.getMonth(), 1).getTime()
}

/** La langue du document, quand l'appelant n'en donne pas : celle que l'application a posée. */
function documentLocale(): string | undefined {
  return typeof document === 'undefined' ? undefined : document.documentElement.lang || undefined
}

/** Les initiales des jours, à partir de `weekStartsOn` (1 : lundi). */
function weekHead(locale: string | undefined, weekStartsOn: 0 | 1): string[] {
  const format = new Intl.DateTimeFormat(locale, { weekday: 'narrow' })
  // Le 7 janvier 2024 est un dimanche : de là, sept jours d'affilée.
  return Array.from({ length: 7 }, (_, index) => format.format(new Date(2024, 0, 7 + weekStartsOn + index)))
}

const CELL = 'mx-auto grid size-8 place-items-center rounded-full text-xs tabular-nums pointer-coarse:size-11'

/**
 * Un mois, qui sert deux fois : **choisir un jour** (`onPick`) et **montrer des jours**
 * (`marked`, le nombre de passages de chacun). Cellules régulières, jours passés
 * atténués, aujourd'hui cerclé, un jour choisi ou marqué en aplat d'accent ; un compte
 * au-delà d'un passage se pose en exposant.
 *
 * Les jours sont des débuts de journée en heure locale (`startOfDay`). Les noms du mois
 * et des jours viennent d'`Intl`, dans `locale` ou la langue du document. Le mois
 * affiché se contrôle par `month` + `onMonth`, ou vit seul à partir du jour choisi.
 *
 * Pour choisir, les jours sont des boutons et les flèches s'y déplacent ; un jour passé
 * ne se choisit pas, sauf `pickPast`.
 */
export function MonthGrid({
  month: controlled,
  onMonth,
  pick,
  onPick,
  pickPast = false,
  marked,
  markedLabel,
  today: todayAt,
  locale = documentLocale(),
  weekStartsOn = 1,
}: {
  /** Un instant du mois affiché. */
  month?: number
  onMonth?: (month: number) => void
  pick?: number
  onPick?: (day: number) => void
  pickPast?: boolean
  /** Les jours à marquer, par début de journée, avec leur compte. */
  marked?: Map<number, number>
  /** Ce que dit un jour marqué, compte compris (« 2 passages »). */
  markedLabel?: (count: number) => string
  /** Aujourd'hui, pour les captures et les tests ; l'horloge sinon. */
  today?: number
  locale?: string
  weekStartsOn?: 0 | 1
}) {
  const labels = useUiLabels()
  const today = startOfDay(todayAt ?? Date.now())
  const [own, setOwn] = useState(() => startOfMonth(pick ?? today))
  const month = controlled !== undefined ? startOfMonth(controlled) : own
  const first = new Date(month)
  const shift = (delta: number) => {
    const next = new Date(first.getFullYear(), first.getMonth() + delta, 1).getTime()
    setOwn(next)
    onMonth?.(next)
  }
  const offset = (first.getDay() - weekStartsOn + 7) % 7
  const length = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const days = Array.from({ length }, (_, index) => new Date(first.getFullYear(), first.getMonth(), index + 1).getTime())
  const chosen = pick !== undefined ? startOfDay(pick) : undefined
  const pickable = (day: number) => pickPast || day >= today
  const dayLabel = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' })

  // Le jour qui prend le focus de Tab : le choisi, sinon aujourd'hui, sinon le premier choisissable.
  const entry =
    days.find((day) => day === chosen) ?? days.find((day) => day === today) ?? days.find(pickable)
  const grid = useRef<HTMLDivElement>(null)
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[event.key]
    const buttons = grid.current ? Array.from(grid.current.querySelectorAll<HTMLButtonElement>('button')) : []
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (!step || current < 0) return
    event.preventDefault()
    const index = Number(buttons[current]!.dataset.index) + step
    buttons.find((button) => Number(button.dataset.index) === index && !button.disabled)?.focus()
  }

  return (
    <div className="flex w-[15.5rem] flex-col gap-1.5 pointer-coarse:w-[19.25rem]">
      <div className="flex items-center justify-between">
        <span aria-live="polite" className="pl-1 text-sm font-medium text-ink first-letter:uppercase">
          {first.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
        </span>
        <span className="flex">
          <IconButton size="sm" label={labels.previousMonth} onClick={() => shift(-1)}>
            <ChevronLeft size={15} />
          </IconButton>
          <IconButton size="sm" label={labels.nextMonth} onClick={() => shift(1)}>
            <ChevronRight size={15} />
          </IconButton>
        </span>
      </div>
      <div ref={grid} onKeyDown={onPick ? onKeyDown : undefined} className="grid grid-cols-7">
        {weekHead(locale, weekStartsOn).map((day, index) => (
          <span key={index} aria-hidden className="grid h-7 place-items-center text-meta font-medium text-ink-faint">
            {day}
          </span>
        ))}
        {Array.from({ length: offset }, (_, index) => <span key={`offset-${index}`} />)}
        {days.map((day, index) => {
          const count = marked?.get(day) ?? 0
          const isChosen = day === chosen
          const filled = isChosen || count > 0
          const past = day < today
          const cell = cx(
            CELL,
            'relative transition-colors',
            // Passé en `ink-faint`, à venir en `ink` : l'écart se lit sans descendre sous le
            // contraste AA, qu'une encre de filet ne tiendrait pas.
            filled ? 'bg-accent font-medium text-accent-ink' : past ? 'text-ink-faint' : 'text-ink',
            day === today && !filled && 'ring-1 ring-ink-faint',
          )
          const label = dayLabel.format(day)
          if (onPick) {
            const enabled = pickable(day)
            return (
              <button
                key={day}
                type="button"
                data-index={index}
                disabled={!enabled}
                tabIndex={day === entry ? 0 : -1}
                aria-pressed={isChosen}
                aria-label={label}
                onClick={() => onPick(day)}
                className={cx(
                  cell,
                  enabled && !filled && 'hover:bg-surface-high hover:text-ink',
                  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent',
                )}
              >
                {index + 1}
              </button>
            )
          }
          const said = count && markedLabel ? `${label} · ${markedLabel(count)}` : undefined
          return (
            <span key={day} title={said} className={cell}>
              <span aria-hidden={said ? true : undefined}>{index + 1}</span>
              {said ? <span className="sr-only">{said}</span> : null}
              {count > 1 ? (
                <span
                  aria-hidden
                  className="absolute -top-0.5 -right-0.5 rounded-full bg-ink px-1 text-micro leading-tight text-canvas"
                >
                  {count}
                </span>
              ) : null}
            </span>
          )
        })}
      </div>
    </div>
  )
}
