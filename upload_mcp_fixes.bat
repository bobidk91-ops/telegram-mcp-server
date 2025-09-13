@echo off
chcp 65001 >nul
echo 📚 Uploading MCP documentation fixes...
echo.

echo 📝 Adding fixed files...
"C:\Program Files\Git\bin\git.exe" add src/server.ts package.json MCP_DOCUMENTATION_FIX.md

echo 💾 Creating commit...
"C:\Program Files\Git\bin\git.exe" commit -m "Fix MCP server according to official documentation - use McpServer class"

echo ⬆️ Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push origin main

if %errorlevel% equ 0 (
    echo ✅ Successfully pushed MCP documentation fixes to GitHub!
    echo.
    echo 🚂 Next steps in Railway:
    echo 1. Go to your Railway project
    echo 2. Settings → Build
    echo 3. Set Build Command: npm run build
    echo 4. Set Start Command: npm start
    echo 5. Save and Redeploy
    echo.
    echo 📚 Server now follows official MCP documentation structure!
) else (
    echo ❌ Failed to push to GitHub
    echo Please check your repository connection
)

echo.
pause
