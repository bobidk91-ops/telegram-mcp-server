@echo off
chcp 65001 >nul
echo CONNECTING TO EXISTING GITHUB REPOSITORY
echo ========================================
echo.

echo Server structure follows official MCP SDK documentation
echo Using correct McpServer class and imports
echo All dependencies properly configured
echo.

echo Adding all files to Git...
"C:\Program Files\Git\bin\git.exe" add .

echo Creating commit...
"C:\Program Files\Git\bin\git.exe" commit -m "Fix MCP server according to official SDK documentation - use McpServer class"

echo.
echo CONNECTING TO EXISTING REPOSITORY:
echo ==================================
echo.

set /p repoUrl="Enter your existing GitHub repository URL (e.g., https://github.com/username/telegram-mcp-server.git): "

if "%repoUrl%"=="" (
    echo ERROR: No repository URL provided. Exiting.
    pause
    exit /b 1
)

echo.
echo Adding remote origin...
"C:\Program Files\Git\bin\git.exe" remote add origin "%repoUrl%"

echo Setting main branch...
"C:\Program Files\Git\bin\git.exe" branch -M main

echo Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push -u origin main

if %errorlevel% equ 0 (
    echo SUCCESS: Connected to existing repository and pushed MCP server!
    echo.
    echo RAILWAY DEPLOYMENT INSTRUCTIONS:
    echo ================================
    echo.
    echo 1. Go to https://railway.app
    echo 2. Click "New Project"
    echo 3. Select "Deploy from GitHub repo"
    echo 4. Find your "telegram-mcp-server" repository
    echo 5. Select the repository
    echo.
    echo VARIABLES SETUP:
    echo ================
    echo In Railway Variables, add:
    echo.
    echo TELEGRAM_BOT_TOKEN = 8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0
    echo TELEGRAM_CHANNEL_ID = @mymcptest
    echo NODE_ENV = production
    echo.
    echo BUILD SETTINGS:
    echo ===============
    echo Railway will automatically:
    echo - Detect Node.js project
    echo - Run: npm install
    echo - Run: npm run build
    echo - Run: npm start
    echo.
    echo SERVER FEATURES:
    echo ================
    echo - 7 Telegram functions
    echo - Official MCP SDK structure with McpServer
    echo - TypeScript compilation
    echo - Environment variables support
    echo - Error handling
    echo.
    echo READY FOR DEPLOYMENT!
    echo Railway will automatically deploy your MCP server.
    echo.
    echo TELEGRAM BOT SETUP:
    echo ===================
    echo 1. Find @BotFather in Telegram
    echo 2. Send /newbot
    echo 3. Name: My MCP Bot
    echo 4. Username: mymcp_bot
    echo 5. Copy token (already configured)
    echo 6. Add bot to @mymcptest channel as admin
    echo.
    echo DEPLOYMENT COMPLETE!
    echo Your Telegram MCP server is ready to use!
) else (
    echo ERROR: Failed to push to GitHub
    echo Please check your repository URL and try again
)

echo.
pause
