# USINE-IA Immersive Brain

**🌐 Site en ligne :** [usineiaclub.store](http://usineiaclub.store)

Expérience immersive 3D interactive présentant USINE-IA et ses agents d'Intelligence Artificielle Émotionnelle.

## ✨ Fonctionnalités

### 🎬 Navigation Immersive
- Scroll fluide entre les sections (desktop & mobile)
- Support tactile complet (swipe vertical)
- Transitions animées entre les slides
- Indicateurs de navigation adaptatifs

### 🚀 Scène 3D Interactive
- **Station spatiale 3D** en rotation continue
- Éclairage dynamique avec HDR environment
- Optimisations mobile (DPR adaptatif, low-power mode)
- Preload anticipé du modèle 3D
- Effets de brouillard et dégradés atmosphériques

### 📱 Responsive Design
- Interface adaptée desktop/mobile/tablette
- Hints contextuels (SCROLL/SWIPE)
- Optimisation des performances par appareil
- Layout flexible avec Tailwind CSS

### 🎨 Sections
- **Hero** : Présentation USINE-IA
- **From Marseille** : Origine du projet (2024)
- **L'Équipe** : Akram, Oussama, Yannis (animations directionnelles)
- **Notre Mission** : Vision et valeurs
- **Nos Agents** : Projets IA (Sophia, Dino Bot, etc.)
- **Valeurs** : Authenticité, Éthique, Évolution
- **Articles & Newsletter** : Contenu et abonnement

## 🚀 Installation & Lancement

### Développement Local
```bash
cd immersive-brain
npm install
npm run dev
```
Ouvre http://localhost:5173

### Build Production
```bash
npm run build
# ou double-clic sur build.bat (Windows)
```

Les fichiers sont générés dans `dist/`

## 🏗️ Déploiement

Le projet est configuré pour un déploiement à la racine du domaine (`base: '/'`).

### Upload sur serveur
1. Build le projet : `npm run build`
2. Upload le contenu de `dist/` à la racine du serveur
3. Vérifier que `.htaccess` est bien uploadé (fichier caché)
4. Tester : http://usineiaclub.store

### Configuration Apache (.htaccess)
```apache
RewriteEngine On
RewriteBase /

# SPA fallback
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]

# Types MIME
AddType application/javascript .js
AddType text/css .css
AddType model/gltf-binary .glb
```

## 📁 Structure

```
src/
├── App.tsx                              # App principale avec navigation
├── components/
│   ├── Intro.tsx                       # Écran de chargement
│   ├── SpaceStationScene.tsx           # Scène 3D + modèle GLB
│   ├── ProjectsSection.tsx             # Section Agents IA
│   ├── NewsletterSectionUpdated.tsx    # Articles + Newsletter
│   ├── TeamSectionUpdated.tsx          # Équipe (non utilisé)
│   └── ErrorBoundary.tsx               # Gestion d'erreurs
├── global.css                           # Styles globaux + animations
└── main.tsx                            # Entry point
```

## 🔧 Technologies

- **React 18** + TypeScript
- **Vite** (build ultra-rapide)
- **Three.js** via React Three Fiber & Drei
- **Tailwind CSS** (utility-first styling)
- **GLTF/GLB** (modèle 3D station spatiale)
- **Apache** (.htaccess pour SPA routing)

## 🌟 Coming Soon

### ⏳ Fonctionnalités en développement

- [ ] **Newsletter Backend** : API d'inscription fonctionnelle (actuellement en mode démo)
- [ ] **Articles détaillés** : Pages complètes pour chaque article
- [ ] **Animation du modèle 3D** : Interactions avancées avec la station spatiale
- [ ] **Mode sombre/clair** : Thème personnalisable
- [ ] **Multilingue** : Support FR/EN
- [ ] **Performances 3D** : Optimisations supplémentaires pour mobiles bas de gamme
- [ ] **Analytics** : Suivi des visites et interactions
- [ ] **SEO** : Meta tags et optimisation pour les moteurs de recherche

### 🐛 Correctifs prévus

- [ ] **Newsletter** : Connecter à un backend de production ou service tiers (Formspree, EmailJS)
- [ ] **Loading 3D** : Indicateur visuel de chargement du modèle
- [ ] **Gestion d'erreurs** : Fallback si le modèle 3D ne charge pas
- [ ] **Cache navigateur** : Optimisation du rechargement des assets

## 📝 Notes Techniques

### Navigation
- Desktop : Molette souris (wheel events)
- Mobile : Swipe vertical (touch events)
- Debouncing : 120ms entre les transitions
- Seuil tactile : 50px minimum pour déclencher

### Optimisations 3D
- **Desktop** : Antialiasing ON, DPR max 2x, high-performance
- **Mobile** : Antialiasing OFF, DPR 1x, low-power mode
- **Preload** : Modèle GLB chargé dès le début du script
- **Suspense** : Fallback null (pas de spinner pour l'instant)

### CSP (Content Security Policy)
```
connect-src 'self' https://cdn.jsdelivr.net https://raw.githack.com
script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'
img-src 'self' data: https: blob:
```

## 🎯 Crédits

**Développé par l'équipe USINE-IA**
- **Akram TOUMANI** : CTO, Architecture technique
- **Oussama HALIMA-FILALI** : Développeur, Directeur Artistique
- **Yannis ROUSSEL** : Chercheur, Sciences Cognitives

**2026** · Marseille, France

---

**🌐 Site en ligne :** [usineiaclub.store](http://usineiaclub.store)

