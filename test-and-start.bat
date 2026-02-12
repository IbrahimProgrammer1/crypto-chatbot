@echo off
echo ========================================
echo   Testing API After Enabling...
echo ========================================
echo.
node test-v1-api.js
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo   SUCCESS! Starting your chatbot...
    echo ========================================
    echo.
    timeout /t 2 /nobreak >nul
    npm run dev
) else (
    echo ========================================
    echo   API not working yet. Please:
    echo   1. Make sure you enabled the API
    echo   2. Wait 1-2 minutes
    echo   3. Run this script again
    echo ========================================
    pause
)
