# 🚀 Guide de Démarrage Rapide

## Installation & Lancement

### Méthode 1 : Fichier Batch (Windows)
Double-cliquez sur `start.bat`

### Méthode 2 : Ligne de commande
```bash
npm install
npm run dev
```

Le site sera accessible sur **http://localhost:5173**

## 🎨 Ce qui a été créé

### ✅ Intro Cinématique
- Animation de chargement avec barre de progression
- Effets holographiques et grille animée
- Transition fluide vers la scène 3D
- Durée : ~5 secondes

### ✅ Scène 3D Interactive
- **Cerveau holographique** avec shader GLSL custom
- Génération procédurale (pas besoin de fichier GLB)
- Double couche : mesh principal + wireframe
- Rotation automatique + accélération au scroll
- Parallaxe souris réactive

### ✅ Particules Flottantes
- 150-220 particules selon la taille d'écran
- Animation organique avec mouvement sinusoïdal
- Rendu instancié pour les performances

### ✅ Audio Binaural
- Activation automatique au premier scroll
- Deux fréquences désaccordées (140Hz et 144Hz)
- Fade-in progressif
- Volume : 8%

### ✅ Effets Visuels
- Dégradés animés (cyan/magenta)
- Fog atmosphérique 3D
- Curseur crosshair personnalisé
- Scrollbar minimaliste

## 🎯 Interactions

| Action | Effet |
|--------|-------|
| **Scroll molette** | Accélère la rotation du cerveau + active l'audio |
| **Mouvement souris** | Rotation parallaxe (X et Z) |
| **Distance scroll cumulée** | Bob vertical du cerveau |

## 🎨 Personnalisation Rapide

### Changer les couleurs
Édite `src/components/BrainScene.tsx` lignes 20-21 :
```typescript
uColorA: { value: new THREE.Color('#00d4ff') }, // Cyan
uColorB: { value: new THREE.Color('#ff2fb6') }  // Magenta
```

### Modifier le nombre de particules
Édite `src/components/Particles.tsx` ligne 8 :
```typescript
const count = 220; // Augmente ou diminue
```

### Ajuster la vitesse de l'intro
Édite `src/components/Intro.tsx` ligne 25 :
```typescript
return prev + 2; // Augmente pour charger plus vite
```

### Changer le volume audio
Édite `src/components/AudioLayer.tsx` ligne 41 :
```typescript
gainRef.current.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 4);
//                                            ^^^^
//                                         Volume (0.0 à 1.0)
```

## 📱 Responsive

Le site s'adapte automatiquement :
- **Desktop** : 220 particules, DPR max 2x
- **Mobile** : 90 particules, performance optimisée
- Interface tactile compatible

## ⚡ Performance

- FPS cible : 60fps
- Draw calls : ~3 (cerveau + particules + wireframe)
- Memory footprint : ~50MB
- Bundle size : ~500KB (gzip)

## 🐛 Dépannage

### Le site ne se lance pas
1. Vérifie que Node.js est installé : `node --version`
2. Supprime `node_modules` et réinstalle : `npm install`

### Erreur "Cannot find module"
```bash
npm install
```

### Le cerveau n'apparaît pas
Ouvre la console (F12) et vérifie les erreurs WebGL

### L'audio ne démarre pas
- Scroll une fois pour activer (autoplay navigateur)
- Vérifie que le son n'est pas coupé

### FPS bas
- Réduis le nombre de particules dans `Particles.tsx`
- Désactive l'antialiasing dans `App.tsx` (ligne 37)

## 📦 Build Production

```bash
npm run build
```

Les fichiers seront dans `dist/`

Pour tester le build :
```bash
npm run preview
```

## 🎓 Technologies Utilisées

- **React 18** - Framework UI
- **Three.js** - Rendu 3D WebGL
- **@react-three/fiber** - React renderer pour Three.js
- **@react-three/drei** - Helpers Three.js
- **Vite** - Build tool ultra-rapide
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling utility-first
- **Web Audio API** - Audio binaural

## 📄 Fichiers Principaux

```
src/
├── App.tsx                 ← Point d'entrée principal
├── main.tsx               ← Setup React
├── global.css             ← Styles globaux
├── components/
│   ├── Intro.tsx          ← Écran de chargement
│   ├── BrainScene.tsx     ← Cerveau 3D + shader
│   ├── Particles.tsx      ← Système de particules
│   ├── AudioLayer.tsx     ← Audio binaural
│   └── ErrorBoundary.tsx  ← Gestion d'erreurs
└── hooks/
    └── useScrollReactive.ts ← Hook scroll
```

## 💡 Astuces

1. **Désactiver l'intro** : Commente les lignes 8-9 dans `App.tsx`
2. **Changer la géométrie** : Remplace `IcosahedronGeometry` par `SphereGeometry` dans `BrainScene.tsx`
3. **Ajouter du bloom** : Installe `@react-three/postprocessing`
4. **Mode debug** : Ajoute `<Stats />` de `@react-three/drei` dans le Canvas

## 🌐 Inspiration

Design inspiré de **vaalentin.github.io/2015**
- Esthétique cyber-holographique
- Couleurs néon
- Interactions fluides
- Ambiance immersive

---

**Questions ?** Vérifie le `README.md` complet ou ouvre une issue !
