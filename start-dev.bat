@echo off
echo.
echo =========================================================
echo  AI Organ Availability Prediction
echo  IBM AI Builders Challenge - July 2025
echo =========================================================
echo.
echo Starting development servers...
echo.
echo Backend  -^>  http://localhost:5000
echo Frontend -^>  http://localhost:5173
echo.
echo Press Ctrl+C in each window to stop.
echo.

start "Backend - AI Organ Prediction API" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
start "Frontend - AI Organ Prediction UI" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers starting... Open http://localhost:5173 in your browser.
pause
