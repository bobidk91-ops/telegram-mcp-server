@echo off
chcp 65001 >nul
echo 🚀 Auto Deploy Script for Telegram MCP Server
echo =============================================
echo.

set "GIT_PATH=C:\Program Files\Git\bin\git.exe"

if not exist "%GIT_PATH%" (
    echo ❌ Git not found in standard location
    echo Please install Git from https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git found at: %GIT_PATH%
echo.

echo 📁 Initializing Git repository...
"%GIT_PATH%" init
if %errorlevel% neq 0 (
    echo ❌ Failed to initialize Git repository
    pause
    exit /b 1
)
echo ✅ Git repository initialized
echo.

echo 📝 Adding files to Git...
"%GIT_PATH%" add .
if %errorlevel% neq 0 (
    echo ❌ Failed to add files to Git
    pause
    exit /b 1
)
echo ✅ Files added to Git
echo.

echo 💾 Committing files...
"%GIT_PATH%" commit -m "Initial commit: Telegram MCP Server"
if %errorlevel% neq 0 (
    echo ❌ Failed to commit files
    pause
    exit /b 1
)
echo ✅ Files committed
echo.

echo 🌐 Next steps:
echo 1. Go to https://github.com and create a new repository
echo 2. Name it 'telegram-mcp-server'
echo 3. Don't add README, .gitignore, or license (they already exist)
echo 4. Copy the repository URL
echo.

set /p repoUrl="Enter your GitHub repository URL (e.g., https://github.com/username/telegram-mcp-server.git): "

if "%repoUrl%"=="" (
    echo ❌ No repository URL provided. Exiting.
    pause
    exit /b 1
)

echo.
echo 🔗 Adding remote origin...
"%GIT_PATH%" remote add origin "%repoUrl%"
if %errorlevel% neq 0 (
    echo ❌ Failed to add remote origin
    pause
    exit /b 1
)
echo ✅ Remote origin added
echo.

echo 🌿 Setting main branch...
"%GIT_PATH%" branch -M main
if %errorlevel% neq 0 (
    echo ❌ Failed to set main branch
    pause
    exit /b 1
)
echo ✅ Main branch set
echo.

echo ⬆️ Pushing to GitHub...
"%GIT_PATH%" push -u origin main
if %errorlevel% neq 0 (
    echo ❌ Failed to push to GitHub
    echo Please check your repository URL and try again
    pause
    exit /b 1
)
echo ✅ Successfully pushed to GitHub!
echo.

echo 🎉 Repository successfully created and pushed to GitHub!
echo.
echo 🚂 Next: Deploy to Railway:
echo 1. Go to https://railway.app
echo 2. Click 'New Project'
echo 3. Select 'Deploy from GitHub repo'
echo 4. Find and select 'telegram-mcp-server'
echo 5. Railway will automatically deploy your project
echo.
echo ⚙️ Don't forget to set environment variables in Railway:
echo    TELEGRAM_BOT_TOKEN = 8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0
echo    TELEGRAM_CHANNEL_ID = @mymcptest
echo    NODE_ENV = production
echo.

pause
