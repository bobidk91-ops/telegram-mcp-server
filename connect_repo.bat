@echo off
echo CONNECTING TO EXISTING GITHUB REPOSITORY
echo ========================================
echo.

echo Current Git status:
"C:\Program Files\Git\bin\git.exe" status
echo.

echo Current remotes:
"C:\Program Files\Git\bin\git.exe" remote -v
echo.

echo Enter your existing GitHub repository URL:
echo Example: https://github.com/username/telegram-mcp-server.git
echo.

set /p repoUrl="Repository URL: "

if "%repoUrl%"=="" (
    echo ERROR: No repository URL provided.
    pause
    exit /b 1
)

echo.
echo Adding remote origin...
"C:\Program Files\Git\bin\git.exe" remote add origin "%repoUrl%"

echo Setting main branch...
"C:\Program Files\Git\bin\git.exe" branch -M main

echo Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push -u origin main

if %errorlevel% equ 0 (
    echo SUCCESS: Connected to existing repository!
    echo Your MCP server is now updated on GitHub.
) else (
    echo ERROR: Failed to push to GitHub
    echo Please check your repository URL and try again
)

echo.
pause
