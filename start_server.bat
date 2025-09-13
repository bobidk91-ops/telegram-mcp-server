@echo off
echo ========================================
echo   STARTING TELEGRAM BOT API SERVER
echo ========================================
echo.

echo Step 1: Stopping any running Node.js processes...
taskkill /f /im node.exe 2>nul

echo Step 2: Starting server with environment variables...
set TELEGRAM_BOT_TOKEN=8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0
set TELEGRAM_CHANNEL_ID=@mymcptest
set NODE_ENV=development

echo Step 3: Starting server...
npm run dev:make

echo.
echo Server should be running on http://localhost:8080
echo Press Ctrl+C to stop the server
