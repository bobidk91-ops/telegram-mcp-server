@echo off
chcp 65001 >nul
echo 🔍 Checking Git status...
echo.

"C:\Program Files\Git\bin\git.exe" status
echo.

echo 🔄 Pulling latest changes...
"C:\Program Files\Git\bin\git.exe" pull origin main

echo.
echo ⬆️ Pushing fixes...
"C:\Program Files\Git\bin\git.exe" push origin main

echo.
echo ✅ Done! Check Railway for automatic redeploy.
pause
