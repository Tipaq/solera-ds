import * as RadixTooltip from '@radix-ui/react-tooltip'
import { createContext, useContext, useEffect, type ComponentPropsWithRef, type FocusEvent, type ReactElement, type ReactNode } from 'react'
import { useMediaQuery } from './use-media-query'

const TooltipEnabled = createContext(true)

/**
 * Ce que l'utilisateur a touché en dernier. `:focus-visible` ne suffit pas à le dire :
 * après un clic sur un élément de menu Radix, focalisé par script et jamais par la
 * souris, Chrome tient le focus suivant pour visible.
 */
let lastInput: 'keyboard' | 'pointer' = 'pointer'
const MODIFIERS = new Set(['Alt', 'Control', 'Meta', 'Shift'])

function onKeyDown(event: KeyboardEvent) {
  if (!MODIFIERS.has(event.key)) lastInput = 'keyboard'
}
function onPointerDown() {
  lastInput = 'pointer'
}

export function TooltipProvider({ children }: { children: ReactNode }) {
  // Le focus automatique des panneaux ne doit pas produire une aide collante au doigt.
  const enabled = useMediaQuery('(hover: hover) and (pointer: fine)')
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('pointerdown', onPointerDown, true)
    }
  }, [])
  return <TooltipEnabled.Provider value={enabled}>
    <RadixTooltip.Provider delayDuration={400} skipDelayDuration={150}>{children}</RadixTooltip.Provider>
  </TooltipEnabled.Provider>
}

/** Un dialogue ou un menu qui pose le focus sur un bouton après un clic ne doit pas en
    ouvrir l'aide : seul un focus venu du clavier l'ouvre. */
function onlyKeyboardFocus(event: FocusEvent<HTMLElement>) {
  if (lastInput !== 'keyboard') event.preventDefault()
}

/** Le portail évite de couper l'aide dans les panneaux et les listes défilantes. */
export function Tooltip({ label, children }: { label: string; children: ReactElement }) {
  const enabled = useContext(TooltipEnabled)
  if (!enabled) return children
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild onFocus={onlyKeyboardFocus}>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        {/* Le calque flottant ne capte pas le pointeur : voir la règle sur
            `[data-radix-popper-content-wrapper]` dans `styles/index.css`. */}
        <RadixTooltip.Content side="top" sideOffset={6} collisionPadding={8}
          className="surface z-[100] max-w-[min(22rem,calc(100vw-1rem))] rounded-md border border-line px-2.5 py-1.5 text-xs leading-relaxed text-ink shadow-pop">
          {label}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}

/** Conserve le style et la ref du bouton, notamment quand il ouvre un menu Radix. */
export function TooltipButton({ title, ...props }: ComponentPropsWithRef<'button'>) {
  const label = title ?? props['aria-label']
  const button = <button {...props} />
  return label ? <Tooltip label={label}>{button}</Tooltip> : button
}
