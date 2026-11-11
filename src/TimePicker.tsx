import { useState } from 'react'
import { cx } from './cx'
import { useUiLabels } from './labels'

const pad = (value: number) => String(value).padStart(2, '0')

/** « 9 », « 9:30 », « 9h30 », « 0930 » : l'heure tapée, ou `null` si elle n'en est pas une. */
export function parseTime(typed: string, hoursOnly = false): { hour: number; minute: number } | null {
  const match = typed.trim().match(/^(\d{1,2})(?:[:hH. ]?(\d{2}))?$/)
  if (!match) return null
  const hour = Number(match[1])
  const minute = hoursOnly ? 0 : Number(match[2] ?? 0)
  if (hoursOnly && match[2] !== undefined && Number(match[2]) !== 0) return null
  return hour < 24 && minute < 60 ? { hour, minute } : null
}

const CELL =
  'h-7 rounded text-xs tabular-nums pointer-coarse:h-11 focus-visible:outline-2 focus-visible:outline-accent'

/**
 * Le choix d'une heure : un champ où la taper, une grille 00–23, puis les minutes
 * (les quarts d'heure par défaut). C'est le contenu d'un `Popover` ; le déclencheur,
 * qui affiche l'heure, appartient à l'appelant.
 *
 * `onChange` part à chaque choix ; `onDone` quand le choix est complet — les minutes
 * choisies, l'heure seule en `hoursOnly`, ou l'heure tapée et validée par Entrée —, pour
 * que l'appelant referme son panneau. Une heure tapée qui n'en est pas une reste dans le
 * champ, marquée invalide.
 */
export function TimePicker({
  hour,
  minute,
  onChange,
  onDone,
  hoursOnly = false,
  minutes = [0, 15, 30, 45],
  autoFocus = true,
}: {
  hour: number
  minute: number
  onChange: (hour: number, minute: number) => void
  onDone?: () => void
  hoursOnly?: boolean
  minutes?: number[]
  autoFocus?: boolean
}) {
  const labels = useUiLabels()
  const [typed, setTyped] = useState('')
  const [invalid, setInvalid] = useState(false)
  const commit = () => {
    if (!typed.trim()) return
    const time = parseTime(typed, hoursOnly)
    if (!time) {
      setInvalid(true)
      return
    }
    setTyped('')
    onChange(time.hour, time.minute)
    onDone?.()
  }
  return (
    <div className="flex flex-col gap-2">
      <input
        autoFocus={autoFocus}
        value={typed}
        inputMode="numeric"
        onChange={(event) => {
          setTyped(event.target.value)
          setInvalid(false)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            commit()
          }
        }}
        placeholder={hoursOnly ? '8' : '9:30'}
        aria-label={labels.typeTime}
        aria-invalid={invalid || undefined}
        className={cx(
          'h-8 rounded-md border bg-canvas px-2 text-sm tabular-nums text-ink outline-none pointer-coarse:h-11',
          'placeholder:text-ink-faint placeholder:italic focus:border-accent',
          invalid ? 'border-critical' : 'border-line',
        )}
      />
      <div className="grid grid-cols-6 gap-0.5">
        {Array.from({ length: 24 }, (_, h) => (
          <button
            key={h}
            type="button"
            aria-pressed={hour === h}
            onClick={() => {
              onChange(h, hoursOnly ? 0 : minute)
              if (hoursOnly) onDone?.()
            }}
            className={cx(
              CELL,
              hour === h ? 'bg-accent font-semibold text-accent-ink' : 'text-ink-soft hover:bg-surface-high hover:text-ink',
            )}
          >
            {pad(h)}
          </button>
        ))}
      </div>
      {hoursOnly ? null : (
        <div className="grid grid-cols-4 gap-0.5 border-t border-line pt-2">
          {minutes.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={minute === m}
              onClick={() => {
                onChange(hour, m)
                onDone?.()
              }}
              className={cx(
                CELL,
                minute === m ? 'bg-surface-high font-semibold text-ink' : 'text-ink-faint hover:bg-surface-high hover:text-ink',
              )}
            >
              :{pad(m)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
