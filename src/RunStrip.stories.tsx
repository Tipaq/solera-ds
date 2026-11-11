import type { Meta, StoryObj } from '@storybook/react-vite'
import { RunStrip, type RunTone, type StripRun } from './RunStrip'

const meta = {
  title: 'Primitives/RunStrip',
  parameters: {
    docs: {
      description: {
        component:
          "La frise des derniers passages d'une action : une pastille par passage, **le plus récent à droite**, la couleur pour le verdict — `positive` réussi, `critical` échoué, `caution` hors délai, `neutral` sauté, `running` (accent, qui bat) en cours.\n\n`sm` tient dans une ligne de liste, et `slots` y réserve les places vides pour que les frises d'une liste s'alignent. `md` est la frise d'un détail : sous 28rem de conteneur, elle ne garde que les dix derniers passages.\n\nLe lecteur d'écran entend `label`, un résumé que l'appelant compose, à la place des pastilles.",
      },
    },
  },
} satisfies Meta<typeof RunStrip>

export default meta
type Story = StoryObj<typeof meta>

const SEQUENCE: RunTone[] = [
  'positive', 'positive', 'critical', 'positive', 'positive', 'neutral', 'positive', 'positive',
  'caution', 'positive', 'positive', 'positive', 'critical', 'critical', 'positive', 'positive',
  'positive', 'positive', 'positive', 'running',
]

const WORDS: Record<RunTone, string> = {
  positive: 'réussi',
  critical: 'échoué',
  caution: 'hors délai',
  neutral: 'sauté',
  running: 'en cours',
}

function runs(count: number): StripRun[] {
  return SEQUENCE.slice(-count).map((tone, index) => ({
    id: String(index),
    tone,
    title: `${10 + index} nov. 03:00 · ${WORDS[tone]}`,
  }))
}

/** Dans des lignes de liste : dix places, les vides à gauche. */
export const Ligne: Story = {
  name: 'Dans une ligne',
  render: () => (
    <ul className="flex w-96 flex-col divide-y divide-line/60 text-sm">
      {[
        ['Sauvegarde nocturne', runs(10)],
        ['Mise à jour des CLI', runs(4)],
        ['Relire les dépendances', []],
      ].map(([name, list]) => (
        <li key={name as string} className="flex h-9 items-center gap-3 px-3">
          <span className="min-w-0 flex-1 truncate">{name as string}</span>
          <RunStrip runs={list as StripRun[]} slots={10} label={`${(list as StripRun[]).length} derniers passages`} />
        </li>
      ))}
    </ul>
  ),
}

/**
 * La frise d'un détail, à deux largeurs de conteneur : vingt passages et la légende au
 * large, les dix derniers seulement à l'étroit.
 */
export const Detail: Story = {
  name: 'Dans un détail',
  render: () => (
    <div className="flex flex-col gap-6">
      {['36rem', '20rem'].map((width) => (
        <div key={width} style={{ width }} className="max-w-full">
          <p className="pb-1.5 text-xs text-ink-faint">{width}</p>
          <RunStrip size="md" runs={runs(20)} label="20 derniers passages : 15 réussis, 3 échoués" caption="le plus récent à droite" />
        </div>
      ))}
    </div>
  ),
}
