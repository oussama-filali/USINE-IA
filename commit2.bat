@echo off
cd /d C:\wamp64\www\USINE-IA
git add immersive-brain/src/components/FlipText.tsx immersive-brain/src/App.tsx
git commit -m "feat(hero): ajout effet flip lettre par lettre sur titre

- Nouveau composant FlipText avec animation 3D rotate
- Flip graduel lettre par lettre (80ms délai)
- Loop automatique toutes les 5s
- Appliqué sur 'Intelligence' et 'Artificielle'
- Transition smooth 500ms avec preserve-3d

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
