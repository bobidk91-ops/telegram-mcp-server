@echo off
echo ========================================
echo   TELEGRAM MCP SERVER DEPLOYMENT
echo ========================================
echo.

echo Step 1: Building project...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo ✅ Build successful!

echo.
echo Step 2: Initializing Git repository...
"C:\Program Files\Git\bin\git.exe" init
"C:\Program Files\Git\bin\git.exe" config user.email "user@example.com"
"C:\Program Files\Git\bin\git.exe" config user.name "Deploy User"

echo.
echo Step 3: Adding files to Git...
"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Deploy clean MCP server to Railway"

echo.
echo Step 4: Connecting to GitHub repository...
"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/bobidk91-ops/telegram-mcp-server.git

echo.
echo Step 5: Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   DEPLOYMENT SUCCESSFUL! 🚀
    echo ========================================
    echo.
    echo ✅ Project built successfully
    echo ✅ Git repository initialized
    echo ✅ Files committed and pushed to GitHub
    echo ✅ Railway will auto-deploy from GitHub
    echo.
    echo NEXT STEPS:
    echo ===========
    echo 1. Go to Railway.com dashboard
    echo 2. Connect your GitHub repository
    echo 3. Set environment variables:
    echo    - TELEGRAM_BOT_TOKEN = 8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0
    echo    - TELEGRAM_CHANNEL_ID = @mymcptest
    echo    - NODE_ENV = production
    echo 4. Deploy!
    echo.
    echo Your MCP server will be available at:
    echo https://your-project.railway.app
    echo.
) else (
    echo.
    echo ========================================
    echo   DEPLOYMENT FAILED! ❌
    echo ========================================
    echo.
    echo Please check the error messages above
    echo and try again.
    echo.
)

echo.
pause
