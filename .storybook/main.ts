import type { StorybookConfig } from '@storybook/react-vite'

/**
 * Le Storybook du design system de Solera : les primitives, les jetons, et les règles
 * qui disent quand s'en servir.
 *
 * Il ne montre que le design system. Les composants d'une application ont leurs stories
 * dans le dépôt de celle-ci, avec son propre Storybook, qui compose celui-ci par ses
 * `refs` : le design system ne connaît aucune application.
 *
 * Les stories restent **à côté de ce qu'elles montrent**, dans `src` : une primitive
 * renommée casse sa story au `typecheck`, ce qu'un dossier de stories tenu à part
 * n'aurait jamais vu venir. `docs` porte la documentation et les motifs.
 */
const config: StorybookConfig = {
  stories: ['../docs/**/*.mdx', '../docs/**/*.stories.@(ts|tsx)', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  // Outil de conception : rien ne part chez Storybook.
  core: { disableTelemetry: true },
  // Le manifeste de composants, que Solera lit pour servir ce design system à ses agents.
  features: { componentsManifest: true },

  framework: {
    name: '@storybook/react-vite',
    options: { builder: { viteConfigPath: '.storybook/vite.config.ts' } },
  },
}

// Lancé par Solera, le Storybook reçoit en plus les prototypes de ses agents.
export default process.env.SOLERA_STORYBOOK ? (await import(process.env.SOLERA_STORYBOOK)).default(config) : config
