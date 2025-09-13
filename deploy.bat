y@echo off
echo 🚀 Telegram MCP Server Deployment Script
echo =====================================
echo.

echo Checking Git installation...
git --version >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git not found. Please install Git first:
    echo 1. Go to https://git-scm.com/download/win
    echo 2. Download and install Git
    echo 3. Restart Command Prompt and run this script again
    pause
    exit /b 1
)

echo ✅ Git found
echo.

echo 📁 Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo ❌ Failed to initialize Git repository
    pause
    exit /b 1
)
echo ✅ Git repository initialized
echo.

echo 📝 Adding files to Git...
git add .
if %errorlevel% neq 0 (
    echo ❌ Failed to add files to Git
    pause
    exit /b 1
)
echo ✅ Files added to Git
echo.

echo 💾 Committing files...
git commit -m "Initial commit: Telegram MCP Server"
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
git remote add origin %repoUrl%
if %errorlevel% neq 0 (
    echo ❌ Failed to add remote origin
    pause
    exit /b 1
)
echo ✅ Remote origin added
echo.

echo 🌿 Setting main branch...
git branch -M main
if %errorlevel% neq 0 (
    echo ❌ Failed to set main branch
    pause
    exit /b 1
)
echo ✅ Main branch set
echo.

echo ⬆️ Pushing to GitHub...
git push -u origin main
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

