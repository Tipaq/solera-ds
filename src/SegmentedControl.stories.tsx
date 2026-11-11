import type { Meta, StoryObj } from '@storybook/react-vite'
import { Eye, Pencil } from 'lucide-react'
import { useState } from 'react'
import { SegmentedControl, type Segment } from './SegmentedControl'

const MODES: [Segment<string>, ...Segment<string>[]] = [
  { value: 'write', label: 'Écrire', icon: <Pencil size={14} /> },
  { value: 'preview', label: 'Aperçu', icon: <Eye size={14} /> },
]

const SCOPES: [Segment<string>, ...Segment<string>[]] = [
  { value: 'project', label: 'Ce projet' },
  { value: 'global', label: 'Tous les projets' },
]

const ARCHIVE: [Segment<string>, ...Segment<string>[]] = [
  { value: 'active', label: 'Actives', count: 12 },
  { value: 'archived', label: 'Archivées', count: 40 },
]

const PERIODS: [Segment<string>, ...Segment<string>[]] = [
  { value: 'day', label: 'Jour' },
  { value: 'week', label: 'Semaine' },
]

const meta = {
  title: 'Primitives/SegmentedControl',
  parameters: {
    docs: {
      description: {
        component:
          "Un choix exclusif entre deux ou trois états d'une même zone. Les options reposent dans un rail creusé, l'option retenue est la seule à remonter en surface.\n\nTrois copies de ce motif coexistaient, au même habillage à la taille des entrées près, avec deux défauts communs : `shadow-sm`, l'ombre brute de Tailwind, qui ne disparaît donc pas sur le thème contrasté alors que c'est la règle (§7) ; et une trentaine de pixels de haut pour un contrôle qu'on touche, sous la cible tactile de 44 px (§11).\n\nSémantique de groupe de boutons radio : les options s'excluent. C'est la forme repliée de `ChoiceList` — au-delà de trois segments, ou quand les options demandent une explication, c'est `ChoiceList` qu'il faut.",
      },
    },
  },
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

function Demo({ segments, label, className }: {
  segments: [Segment<string>, ...Segment<string>[]]
  label: string
  className?: string
}) {
  const [value, setValue] = useState(segments[0].value)
  return <SegmentedControl label={label} value={value} segments={segments} onChange={setValue} className={className} />
}

/** Avec icône : la bascule d'un éditeur vers son aperçu. */
export const AvecIcone: Story = {
  name: 'Avec icône',
  render: () => <Demo label="Mode d'édition" segments={MODES} />,
}

/** Sans icône : la portée d'un réglage. */
export const Nu: Story = {
  name: 'Sans icône',
  render: () => <Demo label="Portée" segments={SCOPES} />,
}

/** Avec compte : une portée qui dit combien chaque côté en tient. Un inventaire, donc gris. */
export const AvecCompte: Story = {
  name: 'Avec compte',
  render: () => <Demo label="Sessions" segments={ARCHIVE} />,
}

/** Pleine largeur : un choix exclusif posé dans un menu, qui en prend toute la ligne. */
export const PleineLargeur: Story = {
  name: 'Pleine largeur',
  render: () => (
    <div className="surface w-64 rounded-xl border border-line p-3 shadow-pop">
      <Demo label="Période" segments={PERIODS} className="flex w-full" />
    </div>
  ),
}
