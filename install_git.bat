@echo off
echo Installing Git...
echo.

REM Check if winget is available
where winget >nul 2>nul
if %errorlevel% equ 0 (
    echo Using winget to install Git...
    winget install --id Git.Git -e --source winget
    goto :check_install
)

REM Check if chocolatey is available
where choco >nul 2>nul
if %errorlevel% equ 0 (
    echo Using chocolatey to install Git...
    choco install git -y
    goto :check_install
)

REM Manual download instructions
echo Git package manager not found.
echo Please install Git manually:
echo 1. Go to https://git-scm.com/download/win
echo 2. Download the installer
echo 3. Run the installer with default settings
echo 4. Restart PowerShell
goto :end

:check_install
echo.
echo Checking Git installation...
where git >nul 2>nul
if %errorlevel% equ 0 (
    echo Git installed successfully!
    git --version
) else (
    echo Git installation failed. Please install manually.
)

:end
echo.
echo Press any key to continue...
pause >nul
