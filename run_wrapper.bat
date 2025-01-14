@echo off
setlocal enabledelayedexpansion
set BASE_DIR=C:\Users\lamao\Desktop\OllamaWrapper

REM python environment
echo environment...
call "%BASE_DIR%\env\Scripts\activate.bat"

REM backend
echo backend...
pushd "%BASE_DIR%\backend"
start cmd /c "run.bat"
set BACKEND_PID=!errorlevel!
popd

REM frontend
echo frontend...
pushd "%BASE_DIR%\frontend\frontend"
start cmd /c "npm start"
set FRONTEND_PID=!errorlevel!
popd

REM browser
echo browser
start http://localhost:3000

REM waiting for the processes to terminate
echo Backend (PID !BACKEND_PID!) and frontend (PID !FRONTEND_PID!) are running.
pause
