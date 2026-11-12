import type { Meta, StoryObj } from '@storybook/react-vite'
import { FoldLine } from './FoldLine'

const meta = {
  title: 'Primitives/FoldLine',
  component: FoldLine,
  parameters: {
    docs: {
      description: {
        component:
          "Une ligne de liste qui se déplie : un chevron, un titre, sa mention courte, et dessous le contenu qu'on ne lit qu'à la demande — un fichier, une note, un détail.\n\nUne ligne sans contenu ne se déplie pas : pas de chevron, mais sa place gardée, pour que les titres restent alignés. Les lignes se séparent d'un filet, sans surface à elles : elles vivent dans celle de leur groupe, dans un `<ul>`.",
      },
    },
  },
  args: { title: 'AGENTS.md' },
} satisfies Meta<typeof FoldLine>

export default meta
type Story = StoryObj<typeof meta>

const RAW = '# Consignes\n\n- Les tests se lancent avec `pnpm test`.\n- Ne jamais pousser sur main.'

/** Des fichiers, l'un présent et dépliable, l'autre absent. */
export const Liste: Story = {
  name: 'Une liste',
  render: () => (
    <ul className="flex w-[28rem] flex-col">
      <FoldLine title={<span className="font-mono">AGENTS.md</span>} meta="4 lignes" defaultOpen>
        <pre className="rounded-md bg-sunken px-3 py-2 font-mono text-xs whitespace-pre-wrap text-ink-soft">{RAW}</pre>
      </FoldLine>
      <FoldLine title={<span className="font-mono">CLAUDE.md</span>} meta="renvoie à AGENTS.md">
        <pre className="rounded-md bg-sunken px-3 py-2 font-mono text-xs text-ink-soft">Voir AGENTS.md</pre>
      </FoldLine>
      <FoldLine title={<span className="font-mono">GEMINI.md</span>} meta="absent" />
    </ul>
  ),
}

/** Une mention trop longue cède avant le titre. */
export const Etroite: Story = {
  name: 'Étroite',
  render: () => (
    <ul className="flex w-56 flex-col">
      <FoldLine title="feedback.md" meta="Ce que l'utilisateur a corrigé, et pourquoi">
        <p className="text-sm text-ink-soft">Le corps de la note.</p>
      </FoldLine>
    </ul>
  ),
}
