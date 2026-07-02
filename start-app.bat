@echo off
cd /d "%~dp0"

set FRONTEND_URL=http://localhost:3001
set BACKEND_URL=http://localhost:3002

start "Backend" cmd /k "npm install && node backend/server.js"

timeout /t 3 /nobreak > nul
start "Frontend" cmd /k "npm run dev"

timeout /t 5 /nobreak > nul

where chrome >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  start "Chrome" chrome "%FRONTEND_URL%"
) else (
  start "Browser" "%FRONTEND_URL%"
)

echo.
echo Frontend: %FRONTEND_URL%
echo Backend: %BACKEND_URL%
echo.
pause
