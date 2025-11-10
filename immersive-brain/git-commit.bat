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
git commit -m "feat: Add immersive intro with Sketchfab brain viewer

- Created cinematic intro screen with loading animation
- Integrated Sketchfab 3D brain model (VR Brain UI Tilt Brush)
- Added binaural audio layer activated on scroll
- Implemented error boundary for robust error handling
- Added animated backgrounds with cyan/magenta glows
- Created complete documentation (README, QUICKSTART, CHANGELOG)
- Added Windows launcher script (start.bat)
- Fixed double intro issue with ui_loading=0 parameter

Features:
- 5-second intro with holographic effects
- Direct iframe integration for Sketchfab model
- Smooth transitions and fade effects
- Responsive design and performance optimization"

echo.
echo =============================================
echo   Commit termine !
echo =============================================
echo.

pause
