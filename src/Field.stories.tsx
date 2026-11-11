import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search } from 'lucide-react'
import { Field } from './Field'

const meta = {
  title: 'Primitives/Field',
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          "Un champ texte avec son intitulé, son aide, son erreur et `aria-describedby` déjà câblé.\n\nL'erreur **remplace** l'aide, elle ne s'y ajoute pas : les deux à la fois feraient lire une consigne et son échec sur deux lignes qui se contredisent.\n\nTout ce qui n'est pas listé part sur l'`input` — sauf `id`, qui est généré pour relier l'intitulé.",
      },
    },
  },
  args: { label: 'Chemin du dépôt' },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Bac: Story = {
  args: { hint: 'Chemin absolu sur la machine hôte.', placeholder: '/home/…' },
}

export const Etats: Story = {
  name: 'États',
  render: () => (
    <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
      <Field label="Avec icône" icon={<Search size={16} />} placeholder="Rechercher…" />
      <Field label="Avec aide" hint="Chemin absolu sur la machine hôte." defaultValue="/home" />
      <Field label="En erreur" error="Le dossier n'existe pas." defaultValue="/nope" />
      <Field label="Désactivé" defaultValue="/home" disabled />
    </div>
  ),
}

/**
 * Dans une rangée de réglages, le libellé est dit à gauche : `hideLabel` le garde pour
 * les lecteurs d'écran sans le redire au-dessus du champ.
 */
export const SansLibelle: Story = {
  name: 'Libellé à côté',
  render: () => (
    <div className="grid max-w-2xl grid-cols-[12rem_1fr] items-center gap-4">
      <span className="text-sm font-medium text-ink">Nom</span>
      <Field label="Nom" hideLabel defaultValue="Nimbus" />
    </div>
  ),
}
