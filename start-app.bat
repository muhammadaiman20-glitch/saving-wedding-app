@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "FRONTEND_URL=http://localhost:3001"
set "BACKEND_URL=http://localhost:3002"

title Saving Wedding App

echo Starting app in one terminal window...
call npm install

call :check_port 3002
if errorlevel 1 (
  echo Starting backend...
  start "" /b cmd /c "node backend/server.js"
) else (
  echo Backend already running at %BACKEND_URL%
)

call :check_port 3001
if errorlevel 1 (
  echo Starting frontend...
  start "" /b cmd /c "npm run dev"
) else (
  echo Frontend already running at %FRONTEND_URL%
)

timeout /t 5 /nobreak > nul

where chrome >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  start "" chrome "%FRONTEND_URL%"
) else (
  start "" "%FRONTEND_URL%"
)

echo.
echo Frontend: %FRONTEND_URL%
echo Backend: %BACKEND_URL%
echo.
echo Both services are running from this single terminal window.

if /I "%SKIP_PAUSE%"=="1" (
  exit /b 0
)
pause

goto :eof

:check_port
for /f "tokens=2" %%A in ('netstat -ano ^| findstr /R /C:":%~1 "') do (
  if not "%%A"=="" exit /b 0
)
exit /b 1
