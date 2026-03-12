# CHANGELOG - USINE-IA Immersive Brain

## [1.0.0] - 2024-12-02 - 🚀 DÉPLOIEMENT EN PRODUCTION

### 🌐 Déploiement
- ✅ **Site en ligne** : [usineiaclub.store](http://usineiaclub.store)
- ✅ Configuré pour déploiement à la racine (`base: '/'`)
- ✅ Optimisations Apache (.htaccess avec SPA routing)
- ✅ Build production optimisé (Vite)

### ✅ Nouvelles Fonctionnalités

#### Navigation Multi-plateforme
- ✅ **Desktop** : Navigation scroll fluide avec molette souris
- ✅ **Mobile** : Support complet du swipe vertical tactile
- ✅ Hints contextuels adaptés (SCROLL/SWIPE selon l'appareil)
- ✅ Debouncing et seuils de détection optimisés
- ✅ Navigation unifiée pour wheel et touch events

#### Scène 3D Optimisée
- ✅ **Station spatiale 3D** avec modèle GLB
- ✅ Rotation continue et éclairage dynamique
- ✅ **Optimisations mobiles** :
  - Antialiasing désactivé sur mobile
  - DPR adaptatif (1x mobile, 2x desktop)
  - Mode low-power pour économie batterie
- ✅ Preload anticipé du modèle 3D (ligne 7)
- ✅ HDR environment via CDN (jsDelivr)

#### Sections Complètes
- ✅ **Hero** : Présentation USINE-IA
- ✅ **From Marseille** : Origine 2024 avec effets circulaires
- ✅ **L'Équipe** : 3 membres avec animations directionnelles
- ✅ **Notre Mission** : Vision détaillée
- ✅ **Nos Agents** : ProjectsSection avec cartes interactives
- ✅ **Valeurs** : Authenticité, Éthique, Évolution
- ✅ **Articles & Newsletter** : NewsletterSectionUpdated

### 🐛 Corrections

#### Navigation
- ✅ Fix navigation mobile bloquée (pas de touch handlers)
- ✅ Fix hints desktop/mobile incorrects
- ✅ Fix transitions trop lentes (800ms au lieu de 1000ms)
- ✅ Fix auto-advance trop long (3s au lieu de 5s)

#### Modèle 3D
- ✅ Fix crash "P is not part of THREE namespace"
- ✅ Retrait du LoadingFallback HTML incompatible avec Canvas
- ✅ Simplification de la gestion d'erreur
- ✅ Optimisation du preload (déplacé en haut du fichier)

#### Configuration
- ✅ Fix base path pour production (`/` au lieu de `/USINE-IA/`)
- ✅ Fix .htaccess RewriteBase (`/` au lieu de `/USINE-IA/`)
- ✅ Fix CSP pour autoriser les CDNs nécessaires

### 📱 Responsive Design
- ✅ Layout adaptatif pour tous les écrans
- ✅ Textes et espacements responsives
- ✅ Animations performantes sur mobile
- ✅ Touch events natifs (pas de librairies externes)

### 🚧 Coming Soon (Documenté dans README)

#### Fonctionnalités
- [ ] **Newsletter Backend** : API production ou service tiers
- [ ] **Articles détaillés** : Pages individuelles
- [ ] **Mode sombre/clair** : Thème personnalisable
- [ ] **Multilingue** : Support FR/EN
- [ ] **Analytics** : Suivi des interactions
- [ ] **SEO** : Optimisation meta tags

#### Correctifs
- [ ] **Newsletter** : Backend fonctionnel (actuellement localhost:3001)
- [ ] **Loading 3D** : Indicateur visuel de chargement
- [ ] **Gestion d'erreurs 3D** : Fallback si modèle ne charge pas
- [ ] **Cache** : Optimisation rechargement assets

### 🔧 Modifications Techniques

#### Fichiers Modifiés
1. **vite.config.ts** : `base: '/'` pour déploiement racine
2. **public/.htaccess** : `RewriteBase /` pour Apache
3. **src/App.tsx** :
   - Ajout touch handlers (touchstart, touchmove, touchend)
   - Navigation unifiée avec fonction `navigateSlides()`
   - Hints adaptatifs desktop/mobile
4. **src/components/SpaceStationScene.tsx** :
   - Preload déplacé ligne 7
   - Suppression LoadingFallback HTML
   - Optimisations mobile (isMobile check)
   - Simplification gestion d'erreur

#### Nouveaux Fichiers
- **build.bat** : Script Windows pour build production
- **README.md** : Documentation complète mise à jour
- **CHANGELOG.md** : Ce fichier (historique des versions)

### 📦 Build & Deploy

```bash
# Build
npm run build
# ou
build.bat

# Structure dist/
dist/
├── index.html
├── .htaccess
├── assets/
│   ├── index-XXXXX.js
│   └── index-XXXXX.css
├── models/
│   └── space_station_3.glb
└── images/
```

### 🎯 Performance

- **Desktop** : 60 FPS constant, antialiasing ON
- **Mobile** : 30-60 FPS, antialiasing OFF, low-power mode
- **Bundle** : ~500KB JS minifié + gzipped
- **Modèle 3D** : Preload anticipé pour UX fluide

### 🙏 Crédits

**Équipe USINE-IA**
- Akram TOUMANI (CTO)
- Oussama HALIMA-FILALI (Dev & DA)
- Yannis ROUSSEL (Chercheur)

**Technologies**
- React 18 + TypeScript
- Three.js + React Three Fiber
- Vite + Tailwind CSS
- Apache + .htaccess

---

## [0.1.0] - 2024-11 - 🎨 VERSION INITIALE

### Fonctionnalités Initiales
- Structure de base React + Vite
- Intro animée avec loading
- Scène 3D basique
- Composants de base (Hero, Mission, etc.)

---

**🌐 Site actuel** : [usineiaclub.store](http://usineiaclub.store)
**📅 Dernière mise à jour** : 12 Mars 2026
