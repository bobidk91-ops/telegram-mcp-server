# Auto Deploy Script for Telegram MCP Server
Write-Host "🚀 Auto Deploy Script for Telegram MCP Server" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Add Git to PATH
$gitPath = "C:\Program Files\Git\bin"
if (Test-Path $gitPath) {
    $env:PATH += ";$gitPath"
    Write-Host "✅ Git added to PATH" -ForegroundColor Green
} else {
    Write-Host "❌ Git not found in standard location" -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/download/win" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Test Git
try {
    $gitVersion = & "$gitPath\git.exe" --version
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not working properly" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow

# Initialize Git repository
try {
    & "$gitPath\git.exe" init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to initialize Git repository" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Add all files
Write-Host "📝 Adding files to Git..." -ForegroundColor Yellow
try {
    & "$gitPath\git.exe" add .
    Write-Host "✅ Files added to Git" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to add files to Git" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Commit files
Write-Host "💾 Committing files..." -ForegroundColor Yellow
try {
    & "$gitPath\git.exe" commit -m "Initial commit: Telegram MCP Server"
    Write-Host "✅ Files committed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to commit files" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "🌐 Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to https://github.com and create a new repository" -ForegroundColor White
Write-Host "2. Name it 'telegram-mcp-server'" -ForegroundColor White
Write-Host "3. Don't add README, .gitignore, or license (they already exist)" -ForegroundColor White
Write-Host "4. Copy the repository URL" -ForegroundColor White
Write-Host ""

$repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/telegram-mcp-server.git)"

if ($repoUrl -eq "") {
    Write-Host "❌ No repository URL provided. Exiting." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Add remote origin
Write-Host "🔗 Adding remote origin..." -ForegroundColor Yellow
try {
    & "$gitPath\git.exe" remote add origin $repoUrl
    Write-Host "✅ Remote origin added" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to add remote origin" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Set main branch
Write-Host "🌿 Setting main branch..." -ForegroundColor Yellow
try {
    & "$gitPath\git.exe" branch -M main
    Write-Host "✅ Main branch set" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to set main branch" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Push to GitHub
Write-Host "⬆️ Pushing to GitHub..." -ForegroundColor Yellow
try {
    & "$gitPath\git.exe" push -u origin main
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Please check your repository URL and try again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "🎉 Repository successfully created and pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "🚂 Next: Deploy to Railway:" -ForegroundColor Cyan
Write-Host "1. Go to https://railway.app" -ForegroundColor White
Write-Host "2. Click 'New Project'" -ForegroundColor White
Write-Host "3. Select 'Deploy from GitHub repo'" -ForegroundColor White
Write-Host "4. Find and select 'telegram-mcp-server'" -ForegroundColor White
Write-Host "5. Railway will automatically deploy your project" -ForegroundColor White
Write-Host ""
Write-Host "⚙️ Don't forget to set environment variables in Railway:" -ForegroundColor Yellow
Write-Host "   TELEGRAM_BOT_TOKEN = 8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0" -ForegroundColor White
Write-Host "   TELEGRAM_CHANNEL_ID = @mymcptest" -ForegroundColor White
Write-Host "   NODE_ENV = production" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
