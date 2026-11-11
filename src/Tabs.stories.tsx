import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Tabs, type Tab } from './Tabs'

const SECTIONS: [Tab<string>, ...Tab<string>[]] = [
  { value: 'details', label: 'Détails' },
  { value: 'activity', label: 'Activité', count: 3 },
  { value: 'sessions', label: 'Sessions', count: 12 },
]

const FILTERS: [Tab<string>, ...Tab<string>[]] = [
  { value: 'all', label: 'Tout' },
  { value: 'awaiting', label: 'En attente', count: 2, tone: 'caution' },
  { value: 'unread', label: 'Non lus', count: 7 },
]

const PROJECT: [Tab<string>, ...Tab<string>[]] = [
  { value: 'overview', label: 'Aperçu' },
  { value: 'work', label: 'Travail', count: 2, tone: 'caution', countTitle: '2 t’attendent' },
  { value: 'board', label: 'Tableau', count: 14, countTitle: '14 cartes ouvertes' },
  { value: 'milestones', label: 'Jalons' },
  { value: 'actions', label: 'Actions', count: 3, tone: 'running', countTitle: '3 en marche' },
]

const meta = {
  title: 'Primitives/Tabs',
  parameters: {
    docs: {
      description: {
        component:
          "Une navigation entre les vues d'un même panneau.\n\nTrois copies de ce motif coexistaient dans l'application, avec **trois traitements de l'état actif** (`font-semibold`, `text-ink`, `text-accent`) et **trois hauteurs** (44, 44, 48 px) : la même mécanique sous trois apparences. Le soulignement d'accent suffit — souligner en accent *et* colorer le texte en accent dit deux fois la même chose, et le gras déplace les intitulés voisins au changement d'onglet.\n\nSémantique de liste d'onglets, pas de boutons pressés : le `tabindex` tourne, la flèche circule entre les onglets et `Tab` sort du groupe.\n\n`layout` est le seul paramètre libre : `fill` partage la largeur (panneau étroit, où les onglets tiennent lieu de filtre), `start` laisse les onglets à leur largeur naturelle (panneau large, où une rangée pleine serait démesurée).\n\n## Les trois rôles d'un compte\n\nUn compte d'onglet (`TabCount`) a **un rôle**, et sa couleur le dit — une seule règle, la même dans un panneau et dans la rangée d'un lieu :\n\n| ton | couleur | ce qu'il compte | exemple |\n| --- | --- | --- | --- |\n| `neutral` | gris | un **inventaire** : ce qui existe | *Tableau* 14 cartes ouvertes |\n| `caution` | ambre | ce qui **t'attend** : une demande | *Travail* 2 sessions qui attendent |\n| `running` | vert | ce qui **tourne** tout seul | *Actions* 3 services en marche |\n\nUn onglet n'a qu'un compte. Quand deux rôles s'y disputent la place, **l'ambre passe d'abord** : ce qui attend quelqu'un prime sur ce qui se contente de tourner.\n\n**Pas de compte à zéro** : l'appelant n'en passe pas, et l'onglet n'en montre pas. Un « 0 » gris occupe la place sans rien dire.\n\n`countTitle` dit ce que compte la pastille : en infobulle au survol, et au lecteur d'écran à la place du nombre seul (« Actions, 3 en marche »).",
      },
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

function Demo({ tabs, layout }: { tabs: [Tab<string>, ...Tab<string>[]]; layout?: 'fill' | 'start' }) {
  const [value, setValue] = useState(tabs[0].value)
  return (
    <div className="w-full max-w-xl">
      <Tabs label="Sections" value={value} tabs={tabs} onChange={setValue} layout={layout} className="px-5" />
      <p className="px-5 py-4 text-sm text-ink-soft">Contenu de l'onglet « {value} ».</p>
    </div>
  )
}

/** Largeur naturelle : le gabarit d'un panneau de fiche. */
export const Debut: Story = {
  name: 'Au début',
  render: () => <Demo tabs={SECTIONS} />,
}

/** Largeur partagée : les onglets d'un panneau étroit, qui filtrent une liste. */
export const Reparti: Story = {
  name: 'Réparti',
  render: () => <Demo tabs={FILTERS} layout="fill" />,
}

/** Les trois rôles d'un compte côte à côte : inventaire (gris), demande (ambre), en cours (vert). */
export const TroisRoles: Story = {
  name: "Trois rôles d'un compte",
  render: () => <Demo tabs={PROJECT} />,
}
