import type { ReactNode } from 'react'
import { Button } from './Button'
import { cx } from './cx'

/**
 * La barre des modifications en attente d'une page de réglages : flottante, centrée en
 * bas de son conteneur, elle dit combien de changements dorment dans le brouillon et offre les deux
 * gestes qui en sortent, Annuler et Enregistrer.
 *
 * Elle ne paraît que lorsqu'il y a quelque chose à dire : `count` à zéro et pas de
 * `notice`, elle ne rend rien. Après l'enregistrement, `notice` prend sa place, au même
 * endroit, le temps que l'appelant juge bon : le retour se lit là où l'œil attendait la
 * barre.
 *
 * Le décompte et sa phrase restent à l'appelant (`labels.pending`) : le pluriel est une
 * affaire de langue, pas de primitive.
 *
 * Posée en absolu : le conteneur est `relative` et ne défile pas lui-même — la page
 * défile dans un enfant, la barre reste en place au-dessus. Centrée sur la page et non
 * sur la fenêtre, elle ne glisse pas sous une barre latérale.
 */
export function SaveBar({
  count,
  labels,
  notice,
  busy = false,
  saveDisabled = false,
  onCancel,
  onSave,
  className,
}: {
  count: number
  labels: {
    /** La phrase du décompte, accordée par l'appelant : « 2 modifications non enregistrées ». */
    pending: ReactNode
    cancel: string
    save: string
  }
  /** Le retour bref qui suit l'enregistrement ; montré quand `count` est à zéro. */
  notice?: ReactNode
  /** L'enregistrement part : les deux gestes attendent. */
  busy?: boolean
  /** Le brouillon ne peut pas partir tel quel (un nom vidé) : Annuler reste offert. */
  saveDisabled?: boolean
  onCancel: () => void
  onSave: () => void
  /** La position, si la page a quelque chose à enjamber en bas. */
  className?: string
}) {
  if (count === 0 && !notice) return null
  return (
    <div
      className={cx(
        'pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center px-4',
        className,
      )}
    >
      {count > 0 ? (
        <div
          aria-live="polite"
          className="surface pointer-events-auto flex max-w-full flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-line px-4 py-2.5 shadow-pop"
        >
          <span className="min-w-0 text-sm text-ink">{labels.pending}</span>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="ghost" disabled={busy} onClick={onCancel}>
              {labels.cancel}
            </Button>
            <Button size="sm" disabled={busy || saveDisabled} onClick={onSave}>
              {labels.save}
            </Button>
          </div>
        </div>
      ) : (
        <div
          role="status"
          className="surface pointer-events-auto rounded-xl border border-line px-4 py-2.5 text-sm text-ink-soft shadow-pop"
        >
          {notice}
        </div>
      )}
    </div>
  )
}
