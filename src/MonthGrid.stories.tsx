import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { MonthGrid, startOfDay } from './MonthGrid'

const meta = {
  title: 'Primitives/MonthGrid',
  parameters: {
    docs: {
      description: {
        component:
          "Un mois, pour **choisir un jour** ou **montrer des jours** — les passages à venir d'une planification. Jours passés atténués, aujourd'hui cerclé, un jour choisi ou marqué en aplat d'accent, un compte au-delà d'un passage en exposant.\n\nLes noms du mois et des jours viennent d'`Intl`, dans la langue du document ; la semaine commence le lundi (`weekStartsOn`). Les flèches parcourent les jours, Tab entre sur le jour choisi ou sur aujourd'hui. Au doigt, les cellules passent à 44 px.",
      },
    },
  },
} satisfies Meta<typeof MonthGrid>

export default meta
type Story = StoryObj<typeof meta>

/** Le jour des captures : le 11 novembre 2026, à 10 h. */
const TODAY = new Date(2026, 10, 11, 10).getTime()
const day = (date: number, month = 10) => startOfDay(new Date(2026, month, date).getTime())

function Pick() {
  const [pick, setPick] = useState(day(14))
  return <MonthGrid today={TODAY} pick={pick} onPick={setPick} />
}

/** Choisir un jour : les jours passés ne se choisissent pas. */
export const Choisir: Story = {
  name: 'Choisir un jour',
  render: () => <Pick />,
}

/** Montrer : les passages d'une règle « lundi, mercredi et vendredi », deux le vendredi. */
export const Montrer: Story = {
  name: 'Montrer des passages',
  render: () => {
    const marked = new Map<number, number>()
    for (let date = 11; date <= 30; date += 1) {
      const weekday = new Date(2026, 10, date).getDay()
      if (weekday === 1 || weekday === 3) marked.set(day(date), 1)
      if (weekday === 5) marked.set(day(date), 2)
    }
    return (
      <MonthGrid
        today={TODAY}
        marked={marked}
        markedLabel={(count) => (count > 1 ? `${count} passages` : '1 passage')}
      />
    )
  },
}
