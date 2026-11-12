import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlarmClock, Bot, Folder, FolderOpen, Hand, Server, Shield, SquareTerminal } from 'lucide-react'
import { useState } from 'react'
import { CheckCards, ChoiceCards, type CardChoice } from './ChoiceCards'

const meta = {
  title: 'Primitives/ChoiceCards',
  parameters: {
    docs: {
      description: {
        component:
          "Un choix exclusif en **cartes**, côte à côte quand la place le permet.\n\n`ChoiceList` empile ses options en lignes ; `ChoiceCards` les pose en grille, pour les deux ou trois décisions qui structurent un formulaire (« une commande ou un agent »). Deux tailles : `lg` pour la question qui ouvre le formulaire (icône dans un carré, coche à droite), `sm` pour une précision (icône seule, explication tronquée).\n\nLes colonnes suivent la largeur **du composant**, par requête de conteneur, et non celle de l'écran : la même carte se pose en deux colonnes dans un tiroir large et en une dans le panneau d'une conversation.\n\nUne option sans icône prend une **pastille radio** : c'est alors elle qui dit le choix. `badge` marque l'option conseillée ; `disabled` montre une option annoncée qu'on ne peut pas encore choisir (les flèches la sautent) ; `selectedExtra` déplie un réglage sous l'option choisie, et sous elle seule.\n\nSémantique de groupe radio : Tab entre dans le groupe sur l'option choisie, les flèches passent d'une option à l'autre.",
      },
    },
  },
} satisfies Meta<typeof ChoiceCards>

export default meta
type Story = StoryObj<typeof meta>

const WHAT: CardChoice<'command' | 'agent'>[] = [
  { value: 'command', label: 'Une commande', hint: 'Un script du dépôt. Pas d’agent, pas de jetons.', icon: <SquareTerminal size={16} /> },
  { value: 'agent', label: 'Un agent', hint: 'Un prompt confié à un CLI, dans une session que tu relis.', icon: <Bot size={16} /> },
]

const KIND: CardChoice<'task' | 'service'>[] = [
  { value: 'task', label: 'Tâche', hint: 'se termine, avec un code de sortie', icon: <SquareTerminal size={14} /> },
  { value: 'service', label: 'Service', hint: 'tourne en continu, a un port', icon: <Server size={14} /> },
]

const WHERE: CardChoice<'root' | 'worktree' | 'confined'>[] = [
  { value: 'root', label: 'Racine', hint: 'le dossier du projet', icon: <Folder size={14} /> },
  { value: 'worktree', label: 'Nouveau worktree', hint: 'une branche à lui', icon: <FolderOpen size={14} /> },
  { value: 'confined', label: 'Confiné', hint: 'sans demandes d’autorisation', icon: <Shield size={14} /> },
]

const PLACEMENT: CardChoice<'follow' | 'root' | 'branch' | 'per-tree'>[] = [
  { value: 'follow', label: 'Là d’où on le lance', hint: 'La racine ou le worktree de la session qui le démarre.', badge: 'conseillé' },
  { value: 'root', label: 'Toujours la racine', hint: 'Le dossier du projet, quelle que soit la session.' },
  { value: 'branch', label: 'Toujours une branche', hint: 'Fixé sur une branche, par exemple celle de dev.' },
  { value: 'per-tree', label: 'Une instance par worktree', hint: 'Chaque arbre a la sienne.', badge: 'à venir', disabled: true },
]

function Choice<T extends string>({ options, initial, size, columns }: {
  options: CardChoice<T>[]
  initial: T
  size?: 'lg' | 'sm'
  columns?: 2 | 3
}) {
  const [value, setValue] = useState(initial)
  return <ChoiceCards label="Choix" value={value} options={options} onChange={setValue} size={size} columns={columns} />
}

/** La question qui ouvre l'éditeur d'une action : deux grandes cartes. */
export const Grandes: Story = {
  name: 'Grandes cartes',
  render: () => (
    <div className="max-w-2xl">
      <Choice options={WHAT} initial="command" columns={2} />
    </div>
  ),
}

/**
 * Un conteneur plus étroit que les explications : la carte garde sa largeur et tronque
 * son explication au lieu de déborder (un panneau étroit, à côté d'un libellé de champ).
 */
export const Etroit: Story = {
  name: 'Conteneur étroit',
  render: () => (
    <div className="w-48 border border-dashed border-line p-2">
      <Choice options={PLACEMENT} initial="follow" size="sm" />
    </div>
  ),
}

/** Une précision : petites cartes, deux puis trois colonnes. */
export const Petites: Story = {
  name: 'Petites cartes',
  render: () => (
    <div className="flex max-w-2xl flex-col gap-4">
      <Choice options={KIND} initial="task" size="sm" columns={2} />
      <Choice options={WHERE} initial="worktree" size="sm" columns={3} />
    </div>
  ),
}

/**
 * Le même composant à deux largeurs de conteneur : trois colonnes à partir de 34rem
 * (deux à partir de 30rem), une seule en dessous ; la page n'a pas changé de taille.
 */
export const Conteneur: Story = {
  name: 'Selon la largeur du conteneur',
  render: () => (
    <div className="flex flex-col gap-6">
      {['20rem', '36rem'].map((width) => (
        <div key={width} style={{ width }} className="max-w-full">
          <p className="pb-1.5 text-xs text-ink-faint">{width}</p>
          <Choice options={WHERE} initial="root" size="sm" columns={3} />
        </div>
      ))}
    </div>
  ),
}

function Placement() {
  const [value, setValue] = useState<'follow' | 'root' | 'branch' | 'per-tree'>('branch')
  const [branch, setBranch] = useState('dev')
  return (
    <ChoiceCards
      label="Où tourne-t-il"
      value={value}
      options={PLACEMENT}
      onChange={setValue}
      selectedExtra={(choice) =>
        choice === 'branch' ? (
          <span className="flex flex-col gap-1.5">
            <select
              value={branch}
              onChange={(event) => setBranch(event.target.value)}
              className="h-9 w-full max-w-xs rounded-md border border-line bg-canvas px-2 font-mono text-xs text-ink"
            >
              <option>dev</option>
              <option>main</option>
            </select>
            <span className="text-xs text-ink-faint">La racine est sur cette branche : il y tournera.</span>
          </span>
        ) : null
      }
    />
  )
}

/**
 * Sans icône : la pastille radio, un badge sur l'option conseillée, une option annoncée
 * mais pas encore choisissable, et un réglage déplié sous l'option choisie.
 */
export const AvecReglage: Story = {
  name: 'Pastille, badge et réglage déplié',
  render: () => (
    <div className="max-w-xl">
      <Placement />
    </div>
  ),
}

function Checks() {
  const [values, setValues] = useState<('demand' | 'scheduled')[]>(['demand'])
  return (
    <CheckCards
      label="Quand"
      values={values}
      onChange={setValues}
      columns={2}
      options={[
        { value: 'demand', label: 'À la demande', hint: 'Un clic, ou un agent', icon: <Hand size={15} /> },
        { value: 'scheduled', label: 'Planifiée', hint: 'Part seule, à sa cadence', icon: <AlarmClock size={15} /> },
      ]}
    />
  )
}

/** `CheckCards` : des cartes cochables, indépendantes les unes des autres. */
export const Cochables: Story = {
  name: 'Cartes cochables',
  render: () => (
    <div className="max-w-2xl">
      <Checks />
    </div>
  ),
}
