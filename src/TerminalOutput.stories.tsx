import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { TerminalOutput } from './TerminalOutput'

const meta = {
  title: 'Primitives/TerminalOutput',
  parameters: {
    docs: {
      description: {
        component:
          "La sortie d'une commande, en monospace, sur le fond d'un terminal (`sunken`, comme le vrai terminal du panneau) — jamais un noir en dur, qui ignorerait le thème.\n\nAvec `follow`, elle **suit le direct** : collée en bas tant qu'on n'est pas remonté la lire ; elle s'y recolle quand on redescend. Sans `follow`, elle s'ouvre sur la fin et ne bouge plus.\n\nLe texte est montré tel quel : retirer les séquences ANSI ou garder les N dernières lignes est le travail de l'appelant. `label` nomme la zone, qui défile au clavier.",
      },
    },
  },
} satisfies Meta<typeof TerminalOutput>

export default meta
type Story = StoryObj<typeof meta>

const BUILD = `> solera@0.19.0 build
> pnpm -r build

apps/web build$ vite build
vite v6.0.7 building for production...
✓ 1873 modules transformed.
dist/index.html                   0.62 kB │ gzip:   0.38 kB
dist/assets/index-3f9a1c.css     84.11 kB │ gzip:  14.02 kB
dist/assets/index-b71e02.js     912.40 kB │ gzip: 268.55 kB
✓ built in 9.84s
apps/server build$ tsc -p tsconfig.build.json
apps/server build: Done`

/** Une sortie terminée : ouverte sur la fin. */
export const Terminee: Story = {
  name: 'Terminée',
  render: () => (
    <div className="max-w-xl">
      <TerminalOutput label="Sortie de pnpm build" text={BUILD} />
    </div>
  ),
}

function Live() {
  const [lines, setLines] = useState<string[]>(['$ pnpm test --watch'])
  useEffect(() => {
    const timer = setInterval(
      () => setLines((previous) => [...previous, `✓ test ${previous.length} (${Math.round(Math.random() * 40)} ms)`].slice(-200)),
      700,
    )
    return () => clearInterval(timer)
  }, [])
  return <TerminalOutput label="Sortie de pnpm test" text={lines.join('\n')} follow className="max-h-48" />
}

/**
 * En direct : une ligne toutes les 700 ms. Remonter arrête le suivi ; redescendre au bas
 * le reprend.
 */
export const EnDirect: Story = {
  name: 'En direct',
  render: () => (
    <div className="max-w-xl">
      <Live />
    </div>
  ),
}
