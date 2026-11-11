import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ReactNode } from 'react'
import { SaveBar } from './SaveBar'

const meta = {
  title: 'Primitives/SaveBar',
  component: SaveBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "La barre des modifications en attente d'une page de réglages : flottante, centrée en bas de son conteneur (`relative`, qui ne défile pas lui-même), au-dessus du contenu qui défile.\n\nElle ne paraît qu'avec quelque chose à dire. `count` compte les changements du brouillon ; `labels.pending` en donne la phrase, accordée par l'appelant. Après l'enregistrement, `notice` prend sa place, au même endroit, le temps d'un retour bref.\n\nUn seul enregistrement pour toute la page : les réglages qui agissent tout de suite (une image envoyée, un fichier écrit) gardent leurs propres boutons et n'entrent pas dans le décompte.",
      },
    },
  },
  args: {
    count: 2,
    labels: { pending: '2 modifications non enregistrées', cancel: 'Annuler', save: 'Enregistrer' },
    onCancel: () => {},
    onSave: () => {},
  },
} satisfies Meta<typeof SaveBar>

export default meta
type Story = StoryObj<typeof meta>

function Frame({ children }: { children: ReactNode }) {
  return <div className="relative h-56 bg-canvas p-6 text-sm text-ink-faint">{children}</div>
}

/** Le brouillon diffère de l'enregistré : la barre paraît. */
export const EnAttente: Story = {
  name: 'Modifications en attente',
  render: (args) => (
    <Frame>
      Le contenu de la page défile dessous.
      <SaveBar {...args} />
    </Frame>
  ),
}

/** L'enregistrement part : les deux gestes attendent sa réponse. */
export const Occupee: Story = {
  name: 'Enregistrement en cours',
  args: { busy: true },
  render: (args) => (
    <Frame>
      <SaveBar {...args} />
    </Frame>
  ),
}

/** Annuler vide le brouillon ; Enregistrer laisse un retour bref à la même place. */
export const Parcours: Story = {
  name: 'Annuler, enregistrer',
  render: () => {
    function Demo() {
      const [count, setCount] = useState(3)
      const [notice, setNotice] = useState<string | null>(null)
      return (
        <Frame>
          <button type="button" className="underline" onClick={() => { setNotice(null); setCount((value) => value + 1) }}>
            Modifier un réglage
          </button>
          <SaveBar
            count={count}
            labels={{
              pending: `${count} modification${count > 1 ? 's' : ''} non enregistrée${count > 1 ? 's' : ''}`,
              cancel: 'Annuler',
              save: 'Enregistrer',
            }}
            notice={notice}
            onCancel={() => setCount(0)}
            onSave={() => {
              setNotice(`${count} réglage${count > 1 ? 's' : ''} enregistré${count > 1 ? 's' : ''}.`)
              setCount(0)
            }}
          />
        </Frame>
      )
    }
    return <Demo />
  },
}
