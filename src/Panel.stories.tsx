import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bot, Play, Plus, RotateCw, Server, SquareTerminal } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Button, IconButton } from './Button'
import { cx } from './cx'
import {
  PanelEmpty,
  PanelGroup,
  PanelNotice,
  PanelStatusIcon,
  PanelToolbar,
  StackHeader,
  panelGestureClass,
  panelRowClass,
  type StatusTone,
} from './Panel'
import { RunStrip } from './RunStrip'
import { Switch } from './Switch'
import { TerminalOutput } from './TerminalOutput'

const meta = {
  title: 'Primitives/Panel',
  parameters: {
    docs: {
      description: {
        component:
          "Le cadre commun d'un onglet du panneau d'une conversation — Agent, Actions, Git, Terminaux, Recherche.\n\n- **`PanelToolbar`** : 48 px, filet dessous ; le titre court et son compte à gauche, les outils à droite à la hauteur de `Button size=\"sm\"`.\n- **`PanelGroup`** : petites capitales et compte.\n- **`panelRowClass`** : une ligne de 36 px, 44 au doigt ; l'icône de nature et son point d'état (`PanelStatusIcon`), le libellé, la méta grise à droite, un seul geste (`panelGestureClass`).\n- **`StackHeader`** : un détail s'ouvre **en pile**, à la place de la liste, avec « ‹ Onglet » pour revenir — jamais dans un second tiroir.\n- **`PanelEmpty`** : une ligne, et le geste utile à côté.\n- **`PanelNotice`** : le retour d'un geste ou une erreur, en bande fine sous la ligne d'outils, au même endroit dans tous les onglets.\n\nPas de cartes bordées : la couleur ne sert qu'aux points d'état.",
      },
    },
  },
} satisfies Meta<typeof PanelToolbar>

export default meta
type Story = StoryObj<typeof meta>

function Frame({ children }: { children: ReactNode }) {
  return <div className="flex h-[30rem] w-full max-w-sm flex-col overflow-hidden border-l border-line bg-canvas">{children}</div>
}

const ITEMS: { id: string; name: string; meta: string; icon: ReactNode; dot: StatusTone; service?: boolean }[] = [
  { id: 'web', name: 'Serveur web', meta: ':5173', icon: <Server size={15} />, dot: 'positive', service: true },
  { id: 'story', name: 'Storybook', meta: 'arrêté', icon: <Server size={15} />, dot: 'neutral', service: true },
  { id: 'test', name: 'Tests', meta: 'échoué · code 1', icon: <SquareTerminal size={15} />, dot: 'critical' },
  { id: 'deps', name: 'Relire les dépendances', meta: 'à relire', icon: <Bot size={15} />, dot: 'caution' },
]

function Row({ item, onOpen }: { item: (typeof ITEMS)[number]; onOpen: () => void }) {
  const [on, setOn] = useState(item.dot === 'positive')
  return (
    <div className={panelRowClass}>
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
        <PanelStatusIcon icon={item.icon} dot={item.service ? (on ? 'positive' : 'neutral') : item.dot} />
        <span className="min-w-0 flex-1 truncate text-sm text-ink">{item.name}</span>
        <span className="shrink-0 text-xs text-ink-faint">{item.service ? (on ? item.meta : 'arrêté') : item.meta}</span>
      </button>
      {item.service ? (
        <Switch size="row" tone="positive" checked={on} onCheckedChange={setOn} label={on ? `Arrêter ${item.name}` : `Démarrer ${item.name}`} />
      ) : (
        <button type="button" className={cx(panelGestureClass, 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100')}>
          <Play size={13} /> Lancer
        </button>
      )}
    </div>
  )
}

function ActionsTab() {
  const [open, setOpen] = useState<string | null>(null)
  const [notice, setNotice] = useState(true)
  const item = ITEMS.find((entry) => entry.id === open)
  if (item) {
    return (
      <Frame>
        <StackHeader
          back="Actions"
          onBack={() => setOpen(null)}
          title={item.name}
          meta={item.meta}
          aside={<IconButton size="sm" label="Relancer"><RotateCw size={14} /></IconButton>}
        />
        <div className="flex flex-col gap-3 p-3">
          <RunStrip
            size="md"
            label="5 derniers passages"
            runs={(['positive', 'positive', 'critical', 'positive', 'critical'] as const).map((tone, index) => ({ id: String(index), tone, title: tone }))}
          />
          <TerminalOutput label={`Sortie de ${item.name}`} text={'$ pnpm test\n✓ 212 tests\n✗ 1 test\n  expected 3, received 2'} />
        </div>
      </Frame>
    )
  }
  return (
    <Frame>
      <PanelToolbar title="Actions" meta="4">
        <Button size="sm" variant="ghost" icon={<Plus size={14} />}>Nouvelle</Button>
      </PanelToolbar>
      {notice ? (
        <PanelNotice tone="critical" onClose={() => setNotice(false)}>
          Tests a échoué : code 1.
        </PanelNotice>
      ) : null}
      <div className="flex flex-col overflow-y-auto py-1">
        <PanelGroup title="En marche" count={1} />
        {ITEMS.slice(0, 2).map((entry) => <Row key={entry.id} item={entry} onOpen={() => setOpen(entry.id)} />)}
        <PanelGroup title="À la demande" count={2} aside={<button type="button" className={panelGestureClass}>Tout voir</button>} />
        {ITEMS.slice(2).map((entry) => <Row key={entry.id} item={entry} onOpen={() => setOpen(entry.id)} />)}
        <PanelGroup title="Planifiées" count={0} />
        <PanelEmpty action={<button type="button" className={panelGestureClass}><Plus size={13} /> Planifier</button>}>
          Rien de planifié.
        </PanelEmpty>
      </div>
    </Frame>
  )
}

/**
 * Un onglet complet : ligne d'outils, bande d'erreur, groupes, lignes, état vide. Une
 * ligne ouvre son détail en pile ; « ‹ Actions » revient.
 */
export const Onglet: Story = {
  name: 'Un onglet',
  render: () => <ActionsTab />,
}

/** Les trois tons de la bande de retour, avec ou sans fermeture. */
export const Retours: Story = {
  name: 'Bandes de retour',
  render: () => (
    <Frame>
      <PanelToolbar title="Git" meta="feat/159" />
      <PanelNotice>Branche poussée sur origin.</PanelNotice>
      <PanelNotice tone="caution" onClose={() => {}}>Interrompu par un redémarrage du serveur.</PanelNotice>
      <PanelNotice tone="critical" onClose={() => {}}>Expression régulière invalide : parenthèse non fermée.</PanelNotice>
    </Frame>
  ),
}
