@echo off
chcp 65001 >nul
echo 🚀 Connecting to GitHub...
echo.

echo 📋 Current Git status:
"C:\Program Files\Git\bin\git.exe" status
echo.

echo 🌐 To complete the deployment:
echo 1. Go to https://github.com
echo 2. Create a new repository named 'telegram-mcp-server'
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
"C:\Program Files\Git\bin\git.exe" remote add origin "%repoUrl%"

echo 🌿 Setting main branch...
"C:\Program Files\Git\bin\git.exe" branch -M main

echo ⬆️ Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push -u origin main

if %errorlevel% equ 0 (
    echo ✅ Successfully pushed to GitHub!
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
) else (
    echo ❌ Failed to push to GitHub
    echo Please check your repository URL and try again
)

echo.
pause

