@echo off
echo FIXING GIT REPOSITORY AND CONNECTING TO GITHUB
echo ==============================================
echo.

echo Initializing Git repository...
"C:\Program Files\Git\bin\git.exe" init

echo Setting Git user...
"C:\Program Files\Git\bin\git.exe" config user.email "bobidk91-ops@users.noreply.github.com"
"C:\Program Files\Git\bin\git.exe" config user.name "bobidk91-ops"

echo Adding all files...
"C:\Program Files\Git\bin\git.exe" add .

echo Creating commit...
"C:\Program Files\Git\bin\git.exe" commit -m "Complete Telegram MCP server implementation with official SDK structure"

echo Adding remote origin...
"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/bobidk91-ops/telegram-mcp-server.git

echo Setting main branch...
"C:\Program Files\Git\bin\git.exe" branch -M main

echo Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push -u origin main

if %errorlevel% equ 0 (
    echo SUCCESS: Connected to GitHub repository!
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
    echo ERROR: Failed to push to GitHub
    echo Please check your repository access rights
)

echo.
pause
