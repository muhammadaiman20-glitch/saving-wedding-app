@echo off
title Saving Wedding App
cd /d "%~dp0"
color 0B

echo ============================================================
echo  Saving Wedding App
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
echo  Starting backend...
start "Saving Wedding App Backend" /B cmd.exe /c "node backend/server.js"

echo Waiting for backend on port 3002...
powershell.exe -Command "while(-not (Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue)){ Start-Sleep -Milliseconds 400 }"
echo Backend is up.

echo  Starting frontend...
start "Saving Wedding App Frontend" /B cmd.exe /c "npm run dev"

echo Waiting for frontend on port 3001...
powershell.exe -Command "while(-not (Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue)){ Start-Sleep -Milliseconds 600 }"
echo Frontend is up.

echo.
echo Launching in Google Chrome...
set "CHROME_URL=http://127.0.0.1:3001/"
where chrome >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  start "" chrome "%CHROME_URL%"
) else (
  start "" "%CHROME_URL%"
)

echo Close Chrome to stop services.
echo.

:MONITOR
timeout /t 5 >nul
powershell.exe -Command "if(-not (Get-Process chrome -ErrorAction SilentlyContinue)){ exit 0 } else { exit 1 }"
if %ERRORLEVEL% NEQ 0 goto MONITOR

echo Chrome closed. Shutting down backend and frontend...
powershell.exe -Command "Stop-Process -Name node -ErrorAction SilentlyContinue"
pause
