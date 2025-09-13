@echo off
echo SYNCING WITH GITHUB REPOSITORY
echo ==============================
echo.

echo Pulling changes from GitHub...
"C:\Program Files\Git\bin\git.exe" pull origin main --allow-unrelated-histories

echo Adding all files...
"C:\Program Files\Git\bin\git.exe" add .

echo Creating merge commit...
"C:\Program Files\Git\bin\git.exe" commit -m "Merge: Complete Telegram MCP server with official SDK structure"

echo Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push origin main

if %errorlevel% equ 0 (
    echo SUCCESS: Synced with GitHub repository!
    echo Your MCP server is now updated on GitHub.
    echo.
    echo RAILWAY DEPLOYMENT:
    echo ==================
    echo 1. Go to https://railway.app
    echo 2. Click "New Project"
    echo 3. Select "Deploy from GitHub repo"
    echo 4. Find "telegram-mcp-server" repository
    echo 5. Select the repository
    echo.
    echo VARIABLES SETUP:
    echo ================
    echo In Railway Variables, add:
    echo TELEGRAM_BOT_TOKEN = 8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0
    echo TELEGRAM_CHANNEL_ID = @mymcptest
    echo NODE_ENV = production
    echo.
    echo READY FOR DEPLOYMENT!
) else (
    echo ERROR: Failed to sync with GitHub
    echo Please check your repository access rights
)

echo.
pause
