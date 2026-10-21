import type { Decorator, Preview } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { addons } from 'storybook/preview-api'
import { TooltipProvider, UiLabelsProvider, type UiLabels } from '../src'
import { SYNTAX_THEMES, THEMES } from '../src/tokens'
import '../docs/styles.css'

/**
 * Contexte du Storybook : ce que toute application installe autour des primitives, et
 * rien de plus.
 *
 * Une primitive montée sans ce contexte échouerait pour des raisons qui n'ont rien à
 * voir avec elle, comme une infobulle sans son `Provider`. À l'inverse, une primitive
 * qui ne tiendrait que parce qu'une application lui fournit autre chose se voit tout de
 * suite : cette chose n'est pas là.
 */

/**
 * Les libellés des primitives dans les deux langues de Solera.
 *
 * La langue compte pour la mise en page, pas seulement pour la lecture : le français
 * est plus long que l'anglais, et c'est lui qui fait déborder un libellé de bouton.
 */
const LABELS: Record<string, UiLabels> = {
  fr: { cancel: 'Annuler', selectPlaceholder: 'Choisir...' },
  en: { cancel: 'Cancel', selectPlaceholder: 'Choose...' },
}

/**
 * Thème, palette et langue posés sur `<html>`, comme dans une application. Sur la racine
 * et non sur un conteneur : les jetons sont définis par `:root[data-theme]`, et tout ce
 * qui part en portail — dialogue, menu, infobulle — se rend hors de l'arbre de la story.
 *
 * Par le canal des globals et non par un décorateur : un décorateur n'enveloppe que les
 * stories, et une page MDX qui n'en contient pas — la plupart des fondations — resterait
 * sans thème, ses spécimens lisant des jetons non définis.
 */
function applyGlobals(globals: Record<string, unknown>) {
  const root = document.documentElement
  root.dataset.theme = String(globals.theme ?? 'dark')
  const syntax = String(globals.syntax ?? 'solera')
  if (syntax === 'solera') delete root.dataset.syntax
  else root.dataset.syntax = syntax
  root.lang = String(globals.locale ?? 'fr')
}

const channel = addons.getChannel()
channel.on('setGlobals', ({ globals }: { globals: Record<string, unknown> }) => applyGlobals(globals))
channel.on('globalsUpdated', ({ globals }: { globals: Record<string, unknown> }) => applyGlobals(globals))

/** Ce que toute application installe autour des primitives : infobulles et libellés. */
function StoryFrame({ locale, children }: { locale: string; children: ReactNode }) {
  return (
    <UiLabelsProvider labels={LABELS[locale] ?? LABELS.fr!}>
      <TooltipProvider>{children}</TooltipProvider>
    </UiLabelsProvider>
  )
}

const withFrame: Decorator = (Story, context) => (
  <StoryFrame locale={String(context.globals.locale)}>
    <Story />
  </StoryFrame>
)

const preview: Preview = {
  decorators: [withFrame],

  globalTypes: {
    theme: {
      description: 'Thème',
      toolbar: {
        title: 'Thème',
        icon: 'paintbrush',
        items: THEMES.map((value) => ({ value, title: value })),
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Langue des libellés',
      toolbar: {
        title: 'Langue',
        icon: 'globe',
        items: Object.keys(LABELS).map((value) => ({ value, title: value })),
        dynamicTitle: true,
      },
    },
    syntax: {
      description: 'Palette de coloration syntaxique',
      toolbar: {
        title: 'Syntaxe',
        icon: 'markup',
        items: SYNTAX_THEMES.map((value) => ({ value, title: value })),
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: { theme: 'dark', syntax: 'solera', locale: 'fr' },

  parameters: {
    // Le fond du canevas suit le thème : un fond fixe aurait menti sur le contraste
    // dans deux thèmes sur trois.
    backgrounds: { disable: true },
    controls: { expanded: true },
    options: {
      // Les règles avant les composants, les motifs non alignés en dernier parce qu'ils
      // sont un chantier et non une référence.
      storySort: {
        order: ['Principes', 'Fondations', 'Primitives', 'Gabarits', 'Motifs'],
      },
    },
  },
}

export default preview
