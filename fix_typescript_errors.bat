@echo off
echo FIXING TYPESCRIPT ERRORS
echo ========================
echo.

echo Problem: Railway shows TypeScript compilation errors
echo Solution: Fix imports, types, and remove conflicting files
echo.

echo Adding fixes to Git...
"C:\Program Files\Git\bin\git.exe" add .

echo Creating commit...
"C:\Program Files\Git\bin\git.exe" commit -m "Fix TypeScript errors - correct imports, types, and remove conflicting files"

echo Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push origin main

if %errorlevel% equ 0 (
    echo SUCCESS: TypeScript fixes pushed to GitHub!
    echo Railway will automatically redeploy with fixes.
    echo.
    echo FIXES APPLIED:
    echo ==============
    echo - Fixed McpServer import to Server
    echo - Added proper types for request parameter
    echo - Fixed Telegram API calls with proper types
    echo - Removed conflicting src/index.ts file
    echo.
    echo VARIABLES CHECK:
    echo ================
    echo Make sure these variables are set:
    echo TELEGRAM_BOT_TOKEN = 8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0
    echo TELEGRAM_CHANNEL_ID = @mymcptest
    echo NODE_ENV = production
    echo.
    echo READY FOR DEPLOYMENT!
    echo TypeScript compilation should now succeed.
) else (
    echo ERROR: Failed to push to GitHub
    echo Please check your repository connection
)

echo.
pause
