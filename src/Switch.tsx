import type { ReactNode } from 'react'
import { cx } from './cx'

/**
 * La couleur d'une piste allumée : `accent` pour un réglage qu'on choisit, `positive`
 * pour quelque chose qui **tourne** — le vert des comptes « en marche ».
 */
export type SwitchTone = 'accent' | 'positive'

const TRACK_ON: Record<SwitchTone, string> = {
  accent: 'bg-accent',
  positive: 'bg-positive',
}

/**
 * Le rail d'un interrupteur, sans interaction.
 *
 * Séparé du bouton parce qu'il a deux hôtes : `SwitchRow`, où toute la ligne est le
 * bouton et où le rail ne peut donc pas en être un second, et `Switch`, où il est
 * seul. Deux copies de ces quatre classes auraient divergé au premier changement de
 * teinte.
 */
export function SwitchTrack({ checked, tone = 'accent' }: { checked: boolean; tone?: SwitchTone }) {
  return (
    <span
      aria-hidden
      className={cx(
        'flex h-5 w-8 shrink-0 items-center rounded-full p-0.5 transition-colors',
        checked ? cx('justify-end', TRACK_ON[tone]) : 'bg-line-strong',
      )}
    >
      <span className="size-4 rounded-full bg-surface" />
    </span>
  )
}

const SIZES = {
  cell: 'min-h-11 px-1',
  row: 'h-8 pointer-coarse:h-11',
  tile: 'h-11 gap-2 px-1.5 text-xs text-ink-soft hover:bg-surface-high hover:text-ink md:h-9 pointer-coarse:h-11',
} as const

/**
 * Un interrupteur seul, pour les endroits où l'intitulé est déjà porté par la ligne
 * ou par l'en-tête de colonne — une cellule de tableau, typiquement.
 *
 * Ailleurs, c'est `SwitchRow` qu'il faut : un interrupteur sans phrase à côté de lui
 * n'apprend pas ce que l'allumer change, et son `label` ne sert alors qu'au lecteur
 * d'écran. La cible fait 44 px de haut, le rail n'en faisant que 20.
 *
 * Deux tailles s'ajoutent pour les listes et les tuiles, où il dit l'état d'une chose
 * qui tourne plus qu'il ne règle une préférence : `row`, la piste seule à la hauteur
 * d'une ligne (32 px, 44 au doigt), et `tile`, la piste suivie de `text` — l'état
 * écrit, « En marche » — à la hauteur d'un `Button size="sm"`.
 */
export function Switch({
  checked,
  onCheckedChange,
  label,
  disabled = false,
  tone,
  size = 'cell',
  text,
  className,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  /** Nom accessible : obligatoire, puisque rien n'est écrit à côté. */
  label: string
  disabled?: boolean
  tone?: SwitchTone
  size?: keyof typeof SIZES
  /** L'état écrit à côté de la piste, en taille `tile`. Le nom accessible reste `label`. */
  text?: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cx(
        'flex shrink-0 items-center rounded-md transition-colors',
        SIZES[size],
        'focus-visible:outline-2 focus-visible:outline-accent',
        'disabled:pointer-events-none disabled:opacity-45',
        className,
      )}
    >
      <SwitchTrack checked={checked} tone={tone} />
      {text}
    </button>
  )
}
