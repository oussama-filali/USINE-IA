# USINE-IA Immersive Brain

Expérience immersive 3D interactive inspirée de vaalentin.github.io/2015 avec un cerveau holographique, intro animée, et effets audio binauraux.

## ✨ Fonctionnalités

### 🎬 Intro Immersive
- Animation de chargement cinématique
- Barre de progression animée avec effets holographiques
- Transition fluide vers la scène 3D
- Effets de grille animée et décorations cyberpunk

### 🧠 Scène 3D Interactive
- **Cerveau procédural** généré avec Three.js (IcosahedronGeometry déformée)
- **Shader holographique** personnalisé avec effet Fresnel et scanlines animées
- **Double couche** : mesh principal + wireframe pour la profondeur
- Rotation automatique + accélération au scroll
- **Parallaxe souris** : rotation X/Z réactive au curseur
- Bob vertical subtil basé sur la distance de scroll

### ✨ Effets Visuels
- Nuage de **particules instanciées** (150-220 selon l'écran)
- Dégradés de fond animés (cyan/magenta/noir)
- Fog 3D pour la profondeur atmosphérique
- Antialiasing et DPR adaptatif pour la performance

### 🎵 Audio Binaural
- Activation au premier scroll (évite les restrictions autoplay)
- Deux oscillateurs légèrement désaccordés (140 Hz + 144 Hz)
- Fade-in progressif sur 4 secondes
- Indicateur visuel de l'état audio

### 📱 Responsive
- Adaptation du nombre de particules sur mobile
- DPR limité à 2x pour les performances
- Interface tactile optimisée

## 🚀 Installation & Lancement

```bash
cd immersive-brain
npm install
npm run dev
```

Ouvre http://localhost:5173

## 🏗️ Build Production

```bash
npm run build
npm run preview
```

## 🎨 Personnalisation

### Couleurs du Shader
Édite `BrainScene.tsx` :
```typescript
uColorA: { value: new THREE.Color('#00d4ff') }, // Cyan
uColorB: { value: new THREE.Color('#ff2fb6') }  // Magenta
```

### Particules
Dans `Particles.tsx`, modifie :
```typescript
const count = 220; // Nombre de particules
```

### Audio
Dans `AudioLayer.tsx` :
```typescript
const baseFreq = 140; // Fréquence de base
const beatOffset = 4; // Différence pour effet binaural
gainRef.current.gain.linearRampToValueAtTime(0.08, ...) // Volume
```

### Durée de l'Intro
Dans `Intro.tsx` :
```typescript
return prev + 2; // Vitesse de chargement (2% par frame)
```

## 📁 Structure

```
src/
├── App.tsx                    # App principale avec Canvas
├── components/
│   ├── Intro.tsx             # Écran d'intro avec loading
│   ├── BrainScene.tsx        # Cerveau 3D + shader holographique
│   ├── Particles.tsx         # Système de particules instanciées
│   ├── AudioLayer.tsx        # Audio binaural Web Audio API
│   └── SketchfabViewer.tsx   # (ancien, non utilisé)
├── hooks/
│   └── useScrollReactive.ts  # Hook pour vélocité/distance scroll
└── global.css                # Styles globaux + animations
```

## 🎯 Inspiration

Style visuel inspiré de **vaalentin.github.io/2015** :
- Esthétique cyber/holographique
- Couleurs néon (cyan + magenta)
- Intro cinématique
- Interactions fluides scroll/souris
- Ambiance immersive et méditative

## 🔧 Technologies

- **React 18** + TypeScript
- **Vite** (build ultra-rapide)
- **Three.js** via React Three Fiber & Drei
- **Tailwind CSS** (utility-first styling)
- **Web Audio API** (sons binauraux)
- **GLSL Shaders** (effets holographiques)

## 🌟 Prochaines Étapes

- [ ] Postprocessing (Bloom + Chromatic Aberration)
- [ ] Gestes mobile (pinch-to-zoom)
- [ ] Sections scrollables avec contenu
- [ ] Mode VR (WebXR)
- [ ] Préchargement lazy des assets audio
- [ ] Sauvegarde des préférences utilisateur

## 📝 Notes de Performance

- Instanced rendering pour les particules (1 draw call)
- Shaders optimisés (pas de boucles coûteuses)
- DPR adaptatif selon l'appareil
- Fog pour limiter la distance de rendu
- Pas de textures lourdes (tout procédural)

---

**Développé pour USINE-IA** · Expérience immersive de visualisation cérébrale

