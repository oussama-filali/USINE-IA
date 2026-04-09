# UX — Chargement + Mobile-first (immersive-brain)

## Objectifs
- Afficher **SpaceBoi immédiatement** (éviter écran vide) pour réduire le risque d’abandon.
- Démarrer le **pré-chargement lourd (station + HDR) uniquement après** le premier rendu de l’intro.
- Éviter l’effet « **100%** puis attente longue ».
- Rendre l’écran **Agents** réellement utilisable en **mobile-first** (cards visibles, centrées, drag fluide).

## Changements implémentés

### 1) Intro: SpaceBoi visible tout de suite
Fichier: `immersive-brain/src/components/Intro.tsx`

- L’intro ne montre plus de fallback 3D « bulle » : `Suspense fallback={null}`.
  - Résultat: rien n’apparaît au centre avant SpaceBoi (pas d’artefact visuel).

Note: suppression des preloads au niveau module pour éviter un chargement avant l’affichage.
- `immersive-brain/src/main.tsx` (ancien preload global)
- `immersive-brain/src/components/SpaceBoiLoader.tsx` (ancien preload module)

### 2) Intro: preload station déclenché *après* le 1er rendu
Fichier: `immersive-brain/src/components/Intro.tsx`

- Le preload station/HDR (`PreloadStationAssets`) est activé **après un `requestAnimationFrame`**, via `preloadEnabled`.
  - Résultat: pas de requêtes lourdes avant que l’utilisateur voie SpaceBoi.

### 3) Intro: éviter « 100% bloqué »
Fichier: `immersive-brain/src/components/Intro.tsx`

- L’intro ne dépend plus de la station/HDR (trop lourds). Elle sort dès que **SpaceBoi est prêt**.
- L’affichage du % est plafonné avant la sortie (max ~92%), puis passe à `100%` juste avant le fade-out.

### 4) Intro: optimisation mobile WebGL
Fichier: `immersive-brain/src/components/Intro.tsx`

- Sur mobile:
  - `dpr` réduit (`[1,1]`)
  - `antialias` désactivé
  - `powerPreference` = `low-power`
  - lumières moins fortes

### 5) Station: suppression du preload au chargement du module
Fichier: `immersive-brain/src/components/SpaceStationScene.tsx`

- Suppression de `useGLTF.preload(...)` au niveau module (c’était la cause classique d’un chargement réseau trop tôt).

### 6) App: montage de la station pendant l’intro **uniquement desktop**
Fichier: `immersive-brain/src/App.tsx`

- La station est montée:
  - toujours après `introComplete`,
  - ou (desktop seulement) dès que l’intro a peint une première frame (`preloadStarted`), avec `frameloop='demand'`.
- Sur mobile, on évite d’ouvrir un second contexte WebGL pendant l’intro.

### 6bis) Station: fade-in uniquement quand prête
Fichiers:
- `immersive-brain/src/App.tsx`
- `immersive-brain/src/components/SpaceStationScene.tsx`

- Le background station n’est visible (`opacity: 1`) que lorsque le modèle station est réellement prêt.
  - Résultat: pas d’apparition partielle/flash si l’intro se termine plus tôt.

### 7) Mobile-first Agents: carousel recentré
Fichier: `immersive-brain/src/components/agents/useAgentsCarousel.ts`

- Sur petits écrans (<= 420px):
  - réduction du `liftYvh` (moins de décalage vertical)
  - suppression du `shiftXvw` (plus de décalage latéral)
  - viewport un peu plus haut (cards mieux visibles)

### 8) Mobile-first Agents: drag non intercepté par la navigation globale
Fichiers:
- `immersive-brain/src/components/agents/AgentsSection.tsx`
- `immersive-brain/src/App.tsx`

- Le stage du carousel porte `data-disable-slide-nav="true"`.
- La navigation touch globale ignore les gestes qui démarrent dans cette zone.
  - Résultat: le drag horizontal du carousel est plus fiable.

### 9) Mobile: indicateur de slides masqué
Fichier: `immersive-brain/src/App.tsx`

- Les points indicateurs en bas à droite sont masqués sur petits écrans (`hidden md:flex`).
  - Résultat: moins d’éléments superposés sur mobile.

## À vérifier / observer
- Sur mobile réel:
  - SpaceBoi ou fallback apparaît immédiatement.
  - Le pourcentage ne reste pas à 100% longtemps.
  - L’écran Agents ne coupe pas les cartes (centrage OK).
  - Le drag ne déclenche pas de changement de slide.

## Diagramme UX (flux)

```mermaid
flowchart TD
  A[Arrivée sur la page] --> B[Intro visible]
  B --> C[Frame 1 rendue: SpaceBoi ou fallback]
  C --> D[Déclenche preload station + HDR]
  D --> E{Loader prêt ?}
  E -- Non --> F[Afficher % (max 99%)] --> E
  E -- Oui --> G[Afficher 100% brièvement]
  G --> H[Fade-out Intro]
  H --> I[Slide 0 + Station en fond]
  I --> J[Navigation slides / Agents]
  J --> K[Drag carousel (zone exemptée)]
```

## Commandes utiles
- Dev: `cd immersive-brain; npm run dev`
- Build: `npm run build` (à la racine)
