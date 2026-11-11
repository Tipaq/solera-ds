import { useLayoutEffect, useRef } from 'react'
import { cx } from './cx'

/** En deçà de cette distance du bas, on tient le lecteur pour collé au direct. */
const STUCK = 24

/**
 * La sortie d'une commande, en monospace, sur le fond du terminal.
 *
 * Le fond est `sunken` et l'encre `ink`, comme le terminal du panneau : un noir en dur
 * ignorerait le thème et ferait deux terminaux différents dans la même page.
 *
 * Avec `follow`, elle reste collée en bas tant que le lecteur n'est pas remonté ; elle
 * s'y recolle dès qu'il redescend. Sans, elle s'ouvre sur la fin et ne bouge plus. Le
 * texte est rendu tel quel : retirer l'ANSI et tronquer sont l'affaire de l'appelant,
 * qui sait d'où il vient.
 */
export function TerminalOutput({
  text,
  label,
  follow = false,
  className,
}: {
  text: string
  /** Nom de la zone : elle défile, elle prend donc le focus au clavier. */
  label: string
  follow?: boolean
  /** La hauteur maximale passe par ici (`max-h-80` par défaut). */
  className?: string
}) {
  const box = useRef<HTMLPreElement>(null)
  const stuck = useRef(true)
  const opened = useRef(false)
  useLayoutEffect(() => {
    const element = box.current
    if (!element) return
    if (!opened.current || (follow && stuck.current)) element.scrollTop = element.scrollHeight
    opened.current = true
  }, [text, follow])
  return (
    <pre
      ref={box}
      tabIndex={0}
      aria-label={label}
      onScroll={(event) => {
        const element = event.currentTarget
        stuck.current = element.scrollHeight - element.scrollTop - element.clientHeight < STUCK
      }}
      className={cx(
        'max-h-80 overflow-auto rounded-md bg-sunken px-3 py-2 font-mono text-meta leading-relaxed whitespace-pre-wrap break-words text-ink',
        'focus-visible:outline-2 focus-visible:outline-accent',
        className,
      )}
    >
      {text || ' '}
    </pre>
  )
}
