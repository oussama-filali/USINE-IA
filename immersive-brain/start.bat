@echo off
echo ========================================
echo   USINE-IA Immersive Brain
echo   Demarrage du serveur de developpement
echo ========================================
echo.

cd /d "%~dp0"

echo Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe ou n'est pas dans le PATH
    echo Telecharge Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js detecte!
echo.

if not exist "node_modules" (
    echo Installation des dependances...
    call npm install
    if errorlevel 1 (
        echo ERREUR lors de l'installation des dependances
        pause
        exit /b 1
    )
    echo.
)

echo Lancement du serveur de developpement...
echo Ouvre ton navigateur sur http://localhost:5173
echo.
echo Appuie sur Ctrl+C pour arreter le serveur
echo.

call npm run dev

pause
