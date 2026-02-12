@echo off
cls
echo ═══════════════════════════════════════════════════════
echo   🚀 CRYPTO CHATBOT - QUICK START
echo ═══════════════════════════════════════════════════════
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo ❌ ERROR: .env.local file not found!
    echo.
    echo Please create .env.local from .env.example
    echo.
    pause
    exit /b 1
)

REM Check if COHERE_API_KEY is set
findstr /C:"COHERE_API_KEY=your_cohere_api_key_here" .env.local >nul
if %ERRORLEVEL% EQU 0 (
    echo ❌ ERROR: Cohere API key not configured!
    echo.
    echo Please follow these steps:
    echo.
    echo 1. Go to: https://dashboard.cohere.com/api-keys
    echo 2. Sign up and get your FREE API key
    echo 3. Open .env.local and replace:
    echo    COHERE_API_KEY=your_cohere_api_key_here
    echo    with your actual key
    echo.
    echo See COHERE_SETUP.txt for detailed instructions
    echo.
    pause
    exit /b 1
)

echo ✅ Configuration found!
echo.
echo 🧪 Testing Cohere API connection...
echo.

node test-cohere.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ API test failed. Please check your API key.
    echo.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════
echo   🎉 ALL TESTS PASSED! Starting your chatbot...
echo ═══════════════════════════════════════════════════════
echo.
timeout /t 2 /nobreak >nul

npm run dev
