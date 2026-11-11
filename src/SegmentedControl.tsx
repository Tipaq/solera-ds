import type { ReactNode } from 'react'
import { cx } from './cx'

export interface Segment<T extends string> {
  value: T
  label: string
  icon?: ReactNode
  /** Un compte en regard de l'intitulé (« Actives 12 · Archivées 40 ») : un inventaire,
      à l'encre atténuée. `undefined` n'occupe pas de place. */
  count?: number
}

/**
 * Un choix exclusif entre deux ou trois états d'une même zone — écrire ou prévisualiser,
 * le projet ou le global. Les options reposent dans un rail creusé, l'option retenue est
 * la seule à remonter en surface.
 *
 * Trois copies de ce motif coexistaient, au même habillage à la taille des entrées près,
 * avec deux défauts communs : `shadow-sm`, l'ombre brute de Tailwind, qui ne disparaît
 * donc pas sur le thème contrasté alors que c'est la règle (§7) ; et une trentaine de
 * pixels de haut pour un contrôle qu'on touche, sous la cible tactile de 44 px (§11).
 * Les segments font ici 44 px au doigt et 32 au pointeur fin.
 *
 * Sémantique de groupe de boutons radio, pas de boutons pressés : les options
 * s'excluent, et un lecteur d'écran doit l'annoncer comme tel — c'est le raisonnement
 * de `ChoiceList`, dont celui-ci est la forme repliée. Au-delà de trois segments ou
 * quand les options demandent une explication, c'est `ChoiceList` qu'il faut.
 *
 * Les segments se partagent la largeur du rail (`flex-1`) : un `className="flex w-full"`
 * l'étire sur toute sa ligne, dans un menu par exemple, sans autre option.
 */
export function SegmentedControl<T extends string>({
  label,
  value,
  segments,
  onChange,
  className,
}: {
  label: string
  value: T
  segments: Segment<T>[]
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cx('inline-flex gap-1 rounded-lg bg-sunken p-1', className)}
    >
      {segments.map((segment) => {
        const selected = segment.value === value
        return (
          <button
            key={segment.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(segment.value)}
            className={cx(
              'flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md px-3 text-sm whitespace-nowrap',
              'transition-[background,color] duration-150 md:h-8 pointer-coarse:h-11',
              selected ? 'surface text-ink shadow-card' : 'text-ink-faint hover:text-ink',
            )}
          >
            {segment.icon}
            {segment.label}
            {segment.count === undefined ? null : (
              <span className="tabular-nums text-ink-faint">{segment.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
