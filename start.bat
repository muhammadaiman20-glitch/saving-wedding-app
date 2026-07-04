@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

set "FRONTEND_URL=http://localhost:3001"
set "BACKEND_URL=http://localhost:3002"

title Saving Wedding App

echo Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    pause
    exit /b 1
)

node --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js failed to run.
    pause
    exit /b 1
)

echo Ensuring dependencies...
call npm install --no-audit --no-fund
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed.
    pause
    exit /b 1
)

call :is_port_in_use 3002
if errorlevel 1 (
    echo Starting backend...
    start "" /b node "backend\server.js"
) else (
    echo Backend already running at !BACKEND_URL!
)

call :is_port_in_use 3001
if errorlevel 1 (
    echo Starting frontend...
    start "" /b npm run dev
) else (
    echo Frontend already running at !FRONTEND_URL!
)

echo Waiting for servers to start...
timeout /t 5 /nobreak > nul

echo Opening browser...
start "" "!FRONTEND_URL!"

echo.
echo Frontend: !FRONTEND_URL!
echo Backend: !BACKEND_URL!
echo.

if /I "%SKIP_PAUSE%"=="1" (
    exit /b 0
)
pause
exit /b 0

:is_port_in_use
netstat -ano | findstr /R /C:":%~1 " >nul
if %ERRORLEVEL% EQU 0 (
    exit /b 0
) else (
    exit /b 1
)