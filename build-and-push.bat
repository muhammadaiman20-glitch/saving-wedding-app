@echo off
title Build and Deploy - Saving Wedding App
cd /d "%~dp0"
color 0B

echo ============================================================
echo  Build and Deploy - Saving Wedding App
echo ============================================================
echo.

echo  Checking Node.js...
node --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Node.js is not installed or not in PATH.
  pause
  exit /b 1
)

echo  Ensuring dependencies...
call npm install --no-audit --no-fund
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: npm install failed.
  pause
  exit /b 1
)

echo.
echo  Clearing cache...
if exist ".next\cache" rd /s /q ".next\cache"

echo  Building Next.js app...
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Build failed.
  pause
  exit /b 1
)

echo.
echo ============================================================
echo  Build complete.
echo  Output folder: %~dp0out
echo ============================================================
echo.
echo  Next: deploy the 'out' folder to GitHub Pages.
echo.
echo  Option A - Deploy to gh-pages branch (recommended):
echo    npm install -g gh-pages
echo    gh-pages -d out -b gh-pages
echo.
echo  Option B - Manual:
echo    1. Copy contents of 'out' to a 'docs' folder
echo    2. Commit and push
echo    3. Set GitHub Pages source to 'main /docs'
echo.
echo  Option C - Use the included GitHub Actions workflow (if configured)
echo.

where gh-pages >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  echo  gh-pages CLI detected. Deploying to gh-pages branch...
  gh-pages -d out -b gh-pages -t
  echo.
  echo  Deployment command finished.
  echo  If successful, your site will be at:
  echo  https://muhammadaiman20-glitch.github.io/saving-wedding-app/
) else (
  echo  gh-pages CLI not found. Skipping automatic deployment.
  echo  Install it with: npm install -g gh-pages
)

echo.
echo Done.
pause
