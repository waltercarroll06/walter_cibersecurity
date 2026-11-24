@echo off
setlocal
cd /d "%~dp0" || exit /b 1
set "linuxUrl=http://127.0.0.1:4321/linux/"
powershell.exe -NoProfile -Command "try { $page = Invoke-WebRequest -UseBasicParsing -Uri $env:linuxUrl -TimeoutSec 3 -ErrorAction Stop; if ($page.Content.Contains('linux-tutor')) { exit 0 } } catch {} exit 1"
if not errorlevel 1 (
  start "" "%linuxUrl%"
  exit /b 0
)
if not exist "node_modules\astro\bin\astro.mjs" (
  call npm.cmd ci || goto error
)
call npm.cmd run dev -- --ignore-lock --open /linux/
if errorlevel 1 goto error
exit /b 0

:error
echo No se pudo iniciar el laboratorio. Revisa el mensaje anterior.
pause
exit /b 1
