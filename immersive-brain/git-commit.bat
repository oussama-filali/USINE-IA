@echo off
echo =============================================
echo   USINE-IA Immersive Brain - Git Commit
echo =============================================
echo.

cd /d "%~dp0"

echo Ajout des fichiers au staging...
git add .

echo.
echo Commit des changements...
git commit -m "feat: Production deployment with mobile support and 3D optimizations

🚀 DÉPLOIEMENT EN PRODUCTION
- Site en ligne: http://usineiaclub.store
- Configuration racine (base: '/') pour IONOS
- Apache .htaccess avec SPA routing
- Build production optimisé

✅ NAVIGATION MULTI-PLATEFORME
- Desktop: Scroll fluide avec molette souris
- Mobile: Support complet swipe vertical tactile
- Hints adaptatifs (SCROLL/SWIPE selon appareil)
- Touch events natifs (touchstart/touchmove/touchend)
- Navigation unifiée wheel + touch

🎨 OPTIMISATIONS 3D
- Mobile: Antialiasing OFF, DPR 1x, low-power mode
- Desktop: Antialiasing ON, DPR 2x, high-performance
- Preload anticipé du modèle GLB (ligne 7)
- Fix crash 'P is not part of THREE namespace'
- Retrait LoadingFallback HTML incompatible Canvas

📱 RESPONSIVE DESIGN
- Layout adaptatif tous écrans
- Animations optimisées mobile
- Textes et espacements responsives
- Transitions fluides 800ms

📝 DOCUMENTATION
- README.md: Guide complet avec lien production
- CHANGELOG.md: Historique détaillé v1.0.0
- Section Coming Soon documentée (Newsletter, etc.)
- Instructions déploiement et optimisations

🐛 CORRECTIONS
- Fix navigation mobile bloquée (pas de touch handlers)
- Fix base path production (/ au lieu de /USINE-IA/)
- Fix .htaccess RewriteBase pour Apache
- Fix hints desktop/mobile incorrects
- Fix transitions et auto-advance trop lents

🚧 COMING SOON (documenté)
- Newsletter backend production
- Articles détaillés
- Mode sombre/clair
- Multilingue FR/EN
- Analytics et SEO

Technologies: React 18 + TypeScript + Three.js + Vite + Tailwind
Équipe: Akram TOUMANI, Oussama HALIMA-FILALI, Yannis ROUSSEL"

echo.
echo =============================================
echo   Commit termine !
echo =============================================
echo.

pause
