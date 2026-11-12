import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressRing } from './ProgressRing'

const meta = {
  title: 'Primitives/ProgressRing',
  component: ProgressRing,
  parameters: {
    docs: {
      description: {
        component:
          "Un anneau d'avancement : la part faite en accent sur une piste `surface-high`, et au centre ce que l'appelant y pose. `value` va de 0 à 1. `label` est ce qu'entend le lecteur d'écran ; sans lui, l'anneau est décoratif et le centre parle seul.\n\nÀ réserver à **un** avancement qu'on regarde en premier (le jalon en cours) : dans une liste, une barre fine se lit mieux.",
      },
    },
  },
  args: { value: 0.6, size: 88, stroke: 8, label: '3 faites sur 5' },
} satisfies Meta<typeof ProgressRing>

export default meta
type Story = StoryObj<typeof meta>

/** Le pourcentage et le compte au centre, comme le jalon en cours de l'Aperçu. */
export const AvecCentre: Story = {
  name: 'Avec un centre',
  render: (args) => (
    <ProgressRing {...args}>
      <span className="flex flex-col items-center">
        <span className="text-heading font-semibold tabular-nums">60%</span>
        <span className="text-meta text-ink-faint tabular-nums">3/5</span>
      </span>
    </ProgressRing>
  ),
}

/** Des bornes : rien de fait, presque tout, tout. */
export const Bornes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {[0, 0.05, 0.95, 1].map((value) => (
        <ProgressRing key={value} value={value} size={48} stroke={5} label={`${Math.round(value * 100)} %`}>
          <span className="text-meta tabular-nums">{Math.round(value * 100)}%</span>
        </ProgressRing>
      ))}
    </div>
  ),
}
