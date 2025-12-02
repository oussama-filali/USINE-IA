@echo off
echo ========================================
echo   USINE-IA Immersive Brain
echo   Build Production
echo ========================================
echo.

cd /d "%~dp0"

echo Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe ou n'est pas dans le PATH
    pause
    exit /b 1
)

echo Node.js detecte!
echo.

echo Lancement du build production...
echo.

call npm run build

if errorlevel 1 (
    echo.
    echo ERREUR lors du build!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   BUILD TERMINE!
echo ========================================
echo.
echo Les fichiers sont dans le dossier: dist\
echo.
echo INSTRUCTIONS POUR IONOS:
echo 1. Supprimez tout le contenu de la RACINE sur IONOS
echo 2. Uploadez TOUT le contenu de dist\ a la RACINE
echo 3. Verifiez que .htaccess est bien uploade
echo 4. Testez: http://usineiaclub.store/
echo.
echo ========================================

pause
