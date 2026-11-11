import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Popover } from './Popover'
import { TimePicker } from './TimePicker'

const meta = {
  title: 'Primitives/TimePicker',
  parameters: {
    docs: {
      description: {
        component:
          "Le choix d'une heure : un champ où la **taper** (« 9 », « 9:30 », « 9h30 », « 0930 »), la grille des heures 00–23, puis les quarts d'heure. C'est le contenu d'un `Popover` : le déclencheur, qui affiche l'heure, est à l'appelant, et `onDone` lui dit quand refermer.\n\nUne heure tapée qui n'en est pas une reste dans le champ, bordée de rouge. Au doigt, les cellules passent à 44 px.",
      },
    },
  },
} satisfies Meta<typeof TimePicker>

export default meta
type Story = StoryObj<typeof meta>

function Time({ hoursOnly = false }: { hoursOnly?: boolean }) {
  const [time, setTime] = useState({ hour: 3, minute: 0 })
  return (
    <div className="w-64 rounded-md border border-line p-2">
      <TimePicker
        hour={time.hour}
        minute={time.minute}
        hoursOnly={hoursOnly}
        placeholder={hoursOnly ? 'ex. 8' : 'ex. 9h30'}
        autoFocus={false}
        onChange={(hour, minute) => setTime({ hour, minute })}
      />
    </div>
  )
}

/** `TimePicker` : l'heure et les quarts, ou l'heure seule (`hoursOnly`). */
export const Heure: Story = {
  name: 'Heure',
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <Time />
      <Time hoursOnly />
    </div>
  ),
}

const pad = (value: number) => String(value).padStart(2, '0')

function InPopover() {
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState({ hour: 9, minute: 30 })
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label="Heure"
      side="bottom"
      className="w-64 p-2"
      trigger={
        <button type="button" className="inline-flex h-9 items-center rounded-md border border-line px-2.5 text-sm font-medium tabular-nums">
          {pad(time.hour)}:{pad(time.minute)}
        </button>
      }
    >
      <TimePicker
        hour={time.hour}
        minute={time.minute}
        onChange={(hour, minute) => setTime({ hour, minute })}
        placeholder="ex. 9h30"
        onDone={() => setOpen(false)}
      />
    </Popover>
  )
}

/** Dans son panneau : le déclencheur est à l'appelant, `onDone` referme. */
export const DansUnPanneau: Story = {
  name: 'Heure dans un Popover',
  render: () => <InPopover />,
}
