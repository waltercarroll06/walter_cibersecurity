@echo off
setlocal
cd /d "%~dp0" || exit /b 1
if not exist "node_modules\astro\bin\astro.mjs" (
  call npm.cmd ci || goto error
)
call npm.cmd run dev -- --open /linux/
if errorlevel 1 goto error
exit /b 0

:error
echo No se pudo iniciar el laboratorio. Revisa el mensaje anterior.
pause
exit /b 1
