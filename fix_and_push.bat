@echo off
chcp 65001 >nul
echo 🔧 Fixing Railway build error...
echo.

echo 📝 Adding fixed files...
"C:\Program Files\Git\bin\git.exe" add nixpacks.toml .nvmrc package.json FIX_RAILWAY_ERROR.md

echo 💾 Creating commit...
"C:\Program Files\Git\bin\git.exe" commit -m "Fix Railway build configuration - add nixpacks.toml and .nvmrc"

echo ⬆️ Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push origin main

if %errorlevel% equ 0 (
    echo ✅ Successfully pushed fixes to GitHub!
    echo.
    echo 🚂 Next steps in Railway:
    echo 1. Go to your Railway project
    echo 2. Click "Redeploy" on the failed deployment
    echo 3. Wait for the build to complete
    echo 4. Check the health endpoint
) else (
    echo ❌ Failed to push to GitHub
    echo Please check your repository connection
)

echo.
pause
