@echo off
echo ========================================
echo   FORCING RAILWAY REDEPLOY
echo ========================================
echo.

echo Step 1: Making a small change to force rebuild...
echo "// Force Railway redeploy - $(Get-Date)" >> src/make-api-server.ts

echo Step 2: Building project...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo Step 3: Committing changes...
"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Force Railway redeploy - Update Make.com API server"

echo Step 4: Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   REDEPLOY TRIGGERED! 🚀
    echo ========================================
    echo.
    echo Railway will now rebuild with the new Make.com API server.
    echo Wait 2-3 minutes and test the endpoints:
    echo.
    echo Test URLs:
    echo - https://worker-production-193e.up.railway.app/
    echo - https://worker-production-193e.up.railway.app/health
    echo - https://worker-production-193e.up.railway.app/send-message
    echo.
    echo Make.com should now work with these endpoints!
) else (
    echo.
    echo ========================================
    echo   PUSH FAILED! ❌
    echo ========================================
    echo.
    echo Please check your Git configuration and try again.
)

echo.
pause
