@echo off
echo ========================================
echo   RESTARTING RAILWAY DEPLOYMENT
echo ========================================
echo.

echo Step 1: Building project...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo Step 2: Committing changes...
"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Force Railway restart - Update to v2.0.0"

echo Step 3: Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push

echo Step 4: Waiting for Railway to restart...
timeout /t 30 /nobreak

echo Step 5: Testing endpoints...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://worker-production-193e.up.railway.app/' -UseBasicParsing; Write-Host 'Status:' $response.StatusCode; Write-Host 'Content:' $response.Content } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo ========================================
echo   RAILWAY RESTART COMPLETE
echo ========================================
echo.
echo If you see version 2.0.0 in the response, Railway has restarted!
echo If not, wait another 2-3 minutes and try again.
echo.

pause
