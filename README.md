# @solera/ui

Les primitives d'interface de Solera, et les jetons dont elles sont faites.

**Ce paquet ne sait rien du produit.** Pas de CLI, pas de projet, pas de conversation :
un bouton, un champ, un menu. La frontière n'est pas une convention écrite dans un
document : le design system vit dans son propre dépôt, et Solera n'y est même pas
installé. Il ne *peut pas* importer du code applicatif.

C'est ce qui a motivé l'extraction. Trois primitives franchissaient déjà la ligne sans
que rien ne l'empêche : `Select` et `ConfirmDialog` allaient chercher des libellés dans
le catalogue de traduction de l'application, et `Tooltip` un hook dans ses utilitaires.
Les deux premières prennent maintenant leurs libellés en props — **un design system ne
possède pas la copie du produit** — et le hook a été versé ici, où il est générique.

## Ce qu'il contient

| | |
| --- | --- |
| `src/*.tsx` | Les primitives, et leurs stories à côté |
| `src/tokens.ts` | Les échelles statiques — rayons, pas de texte, polices — avec leur rôle |
| `src/styles/scales.generated.css` | Généré depuis `tokens.ts` par `pnpm tokens`. Ne pas éditer |
| `src/styles/tokens.css` | Les jetons `--sg-*`, les trois thèmes, les dix palettes de syntaxe |
| `src/styles/index.css` | Le mapping vers Tailwind, les utilitaires et la base partagés |
| `docs/` | Les pages de règles (MDX), leurs spécimens, les motifs |
| `.storybook/` | Le Storybook : thème, palette et langue dans la barre d'outils |
| `scripts/tokens.mjs` | La génération des échelles |

Les **couleurs** ne sont pas dans `tokens.ts` et ne peuvent pas y être : elles sont
calculées à l'exécution en `oklch()` depuis `--sg-hue`, `--sg-tint` et `--sg-lift`, que
les réglages d'apparence déplacent. Qui veut en afficher la valeur la lit sur le document.

## S'en servir

Le paquet n'est publié sur aucun registre : une application le prend dans ce dépôt,
épinglé à un commit.

```jsonc
// package.json de l'application
"@solera/ui": "github:Tipaq/solera-ds#<commit>"
```

Il est livré en sources TypeScript, sans étape de build : c'est le bundler de
l'application qui le compile.

```ts
import { Button, Card, Field } from '@solera/ui'
import { RADII, TEXT_STEPS } from '@solera/ui/tokens'
```

```css
@import '@solera/ui/styles.css';
@source '../node_modules/@solera/ui/src'; /* chemin relatif à la feuille */
```

Tailwind ne scanne pas `node_modules` de lui-même : sans ce `@source`, aucune classe des
primitives n'est générée, et les boutons sortent sans style.

Pour essayer une modification dans une application avant de la fusionner, on la pousse
sur une branche et on épingle ce commit : n'importe quel commit poussé s'installe. Lier
le clone par `link:` ne marche pas : il apporterait son propre React, chargé à côté de
celui de l'application.

Le dépôt doit rester public. Privé, pnpm le clonerait au lieu de télécharger l'archive,
et le `#` du commit dans le chemin installé empêche Vite de résoudre les imports du
paquet.

## Le Storybook

```sh
pnpm install
pnpm dev            # http://localhost:6418
pnpm build          # storybook-static/
```

Il ne montre que le design system. Une application qui a ses propres composants a ses
propres stories, dans son dépôt, et son Storybook compose celui-ci par ses `refs`.

`.storybook/main.ts` porte deux lignes que Solera lit quand un projet est lié à ce
design system : `features.componentsManifest`, d'où il tire la liste des composants qu'il
sert à ses agents, et l'`export default` conditionnel, qui y ajoute leurs prototypes.

## La règle

Les règles de conception vivent dans les pages de `docs/*.mdx` — du markdown, lisible
sans ouvrir un navigateur. Les valeurs des échelles statiques vivent dans `src/tokens.ts`,
et nulle part ailleurs :

```sh
pnpm tokens         # réécrit src/styles/scales.generated.css
pnpm tokens:check   # échoue si le CSS commité a dérivé — en CI
```

Une primitive ajoutée ici reçoit sa story dans le même commit.
