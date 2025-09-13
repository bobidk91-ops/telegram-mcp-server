@echo off
echo ========================================
echo   CHECKING RAILWAY DEPLOYMENT STATUS
echo ========================================
echo.

echo Step 1: Checking Git status...
"C:\Program Files\Git\bin\git.exe" status

echo.
echo Step 2: Checking last commit...
"C:\Program Files\Git\bin\git.exe" log --oneline -1

echo.
echo Step 3: Checking remote repository...
"C:\Program Files\Git\bin\git.exe" remote -v

echo.
echo ========================================
echo   DEPLOYMENT CHECK COMPLETE
echo ========================================
echo.
echo NEXT STEPS:
echo ===========
echo 1. Go to Railway.com dashboard
echo 2. Find your project: telegram-mcp-server
echo 3. Check deployment status (should be SUCCESS)
echo 4. Copy the generated URL from Railway
echo 5. Use the URL to connect MCP clients
echo.
echo EXPECTED RAILWAY URL FORMAT:
echo https://telegram-mcp-server-production-xxxx.up.railway.app
echo.
echo If deployment failed:
echo - Check Railway logs for errors
echo - Verify environment variables are set
echo - Ensure Telegram bot token is valid
echo.

pause
