# Design system de Solera

Le paquet `@solera/ui` : les primitives d'interface, les jetons dont elles sont faites,
et le Storybook qui les documente. Solera le consomme depuis ce dépôt, épinglé à un
commit (voir `README.md`).

## La référence, et une seule

**Les pages de `docs/*.mdx`** sont les règles de l'interface : `Principes.mdx`, les
*Fondations*, les *Gabarits*. Du markdown, lisible sans ouvrir un navigateur. **À lire
avant de toucher à une primitive**, et à modifier dans le même commit quand on change
une règle : si le code et les pages divergent, c'est le code qui est en dette — sauf si
le code a raison, auquel cas on change la page d'abord.

**Une valeur se change dans `src/tokens.ts`, et nulle part ailleurs.** Le bloc `@theme`
des échelles statiques en est généré :

```sh
pnpm tokens         # réécrit src/styles/scales.generated.css
pnpm tokens:check   # échoue si le CSS commité a dérivé — en CI
```

Les **couleurs** n'y sont pas et ne peuvent pas y être : elles sont calculées à
l'exécution en `oklch()` depuis `--sg-hue`, `--sg-tint` et `--sg-lift`.

## Les primitives ne savent rien du produit

Pas de CLI, pas de projet, pas de conversation, pas de copie : les deux libellés que les
primitives portent sont fournis par l'application (`src/labels.tsx`). Ce dépôt n'importe
rien de Solera, et n'en a pas les moyens : Solera n'y est pas installé.

Les composants d'une application — ceux qui connaissent son domaine — ont leurs stories
**dans son dépôt**, avec son propre Storybook, qui compose celui-ci par ses `refs`. Ils
n'ont rien à faire ici.

## Les stories

À côté de ce qu'elles montrent, sous `src/` : une primitive renommée casse sa story au
`typecheck`. **Une primitive ajoutée reçoit sa story dans le même commit.**

`docs/` porte les pages, leurs spécimens (`specimens.tsx`, les grilles sans prose) et les
motifs non alignés.

## Ce que Solera lit dans `.storybook/main.ts`

Deux lignes, à garder : `features.componentsManifest`, d'où Solera tire la liste des
composants qu'il sert à ses agents, et l'`export default` conditionnel sur
`SOLERA_STORYBOOK`, par lequel il y ajoute leurs prototypes. Une story qui ne doit pas
être proposée aux agents porte le tag `!manifest`.

## Vérifier

```sh
pnpm tokens:check && pnpm typecheck && pnpm lint && pnpm build
```

Le paquet est livré en sources : une modification ne part dans Solera qu'une fois
commitée, poussée, et le commit épinglé dans son `package.json`.
