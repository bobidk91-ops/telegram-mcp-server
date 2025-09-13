@echo off
echo FIXING RAILWAY BUILD ERROR
echo ==========================
echo.

echo Problem: Railway shows "error: undefined variable 'nom'"
echo Solution: Remove conflicting nixpacks.toml and update package.json
echo.

echo Adding fixes to Git...
"C:\Program Files\Git\bin\git.exe" add .

echo Creating commit...
"C:\Program Files\Git\bin\git.exe" commit -m "Fix Railway build error - remove nixpacks.toml, add postinstall script"

echo Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push origin main

if %errorlevel% equ 0 (
    echo SUCCESS: Fixes pushed to GitHub!
    echo Railway will automatically redeploy with fixes.
    echo.
    echo MANUAL FIX IN RAILWAY:
    echo ======================
    echo 1. Go to your Railway project
    echo 2. Settings → Build
    echo 3. Set Build Command: npm run build
    echo 4. Set Start Command: npm start
    echo 5. Save and Redeploy
    echo.
    echo VARIABLES CHECK:
    echo ================
    echo Make sure these variables are set:
    echo TELEGRAM_BOT_TOKEN = 8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0
    echo TELEGRAM_CHANNEL_ID = @mymcptest
    echo NODE_ENV = production
    echo.
    echo READY FOR DEPLOYMENT!
) else (
    echo ERROR: Failed to push to GitHub
    echo Please check your repository connection
)

echo.
pause
