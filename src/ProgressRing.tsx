import type { ReactNode } from 'react'
import { cx } from './cx'

/**
 * Un anneau d'avancement : la part faite en accent sur une piste discrète, et ce que
 * l'appelant pose au centre (le pourcentage, un compte). Il suit le thème : la piste et
 * le trait sont des jetons, pas des couleurs.
 *
 * `value` va de 0 à 1 ; au-delà, il est ramené dans l'intervalle. `label` est ce
 * qu'entend le lecteur d'écran à la place de l'anneau (« 3 cartes faites sur 5 ») ;
 * sans lui, l'anneau est décoratif et le centre parle seul.
 */
export function ProgressRing({
  value,
  size = 64,
  stroke = 6,
  label,
  className,
  children,
}: {
  value: number
  /** Le diamètre, en pixels. */
  size?: number
  /** L'épaisseur du trait, en pixels. */
  stroke?: number
  label?: string
  className?: string
  children?: ReactNode
}) {
  const share = Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0))
  const radius = (size - stroke) / 2
  const length = 2 * Math.PI * radius
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      className={cx('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg aria-hidden width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className="stroke-surface-high" />
        {share > 0 ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${length * share} ${length}`}
            className="stroke-accent motion-safe:transition-[stroke-dasharray]"
          />
        ) : null}
      </svg>
      {children ? <span className="absolute inset-0 flex items-center justify-center">{children}</span> : null}
    </span>
  )
}
