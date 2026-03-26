@echo off
cd /d C:\wamp64\www\USINE-IA
git add immersive-brain/src/components/Intro.tsx immersive-brain/src/components/SpaceBoiLoader.tsx immersive-brain/src/components/SpaceStationScene.tsx
git commit -m "fix(intro): amélioration visibilité space_boi et éclairage scene

- Augmentation taille et position space_boi pour meilleure immersion
- Caméra centrée avec FOV optimisé (60deg)
- Lumières renforcées (ambient, directional, point lights)
- Overlay noir réduit (0.2/0.45) pour garder scene visible
- Tone mapping boosté à 1.8 pour couleurs éclatantes
- Matériaux améliorés (metalness 0.95, emissive)
- Auto-rotation activée pour UX dynamique

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
