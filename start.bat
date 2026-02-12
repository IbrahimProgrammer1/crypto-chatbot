@echo off
echo ========================================
echo   CHATBOT SETUP VERIFICATION
echo ========================================
echo.
echo Testing your API key...
echo.
node verify-setup.js
echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo.
    echo SUCCESS! Starting dev server...
    echo.
    npm run dev
) else (
    echo.
    echo Please fix the errors above and try again.
    echo.
    pause
)
