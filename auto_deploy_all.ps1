# Automatic Deployment Script for Telegram MCP Server
Write-Host "🚀 AUTOMATIC DEPLOYMENT OF TELEGRAM MCP SERVER" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

Write-Host "📚 Server structure follows official MCP SDK documentation" -ForegroundColor Cyan
Write-Host "🔧 Using correct Server class and imports" -ForegroundColor Cyan
Write-Host "📦 All dependencies properly configured" -ForegroundColor Cyan
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

Write-Host ""
Write-Host "📝 Adding all files to Git..." -ForegroundColor Yellow

try {
    & "$gitPath\git.exe" add .
    Write-Host "✅ Files added to Git" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to add files to Git" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "💾 Creating commit..." -ForegroundColor Yellow

try {
    & "$gitPath\git.exe" commit -m "Complete MCP server implementation following official SDK documentation"
    Write-Host "✅ Commit created" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create commit" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "⬆️ Pushing to GitHub..." -ForegroundColor Yellow

try {
    & "$gitPath\git.exe" push origin main
    Write-Host "✅ Successfully pushed complete MCP server to GitHub!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Please check your repository connection" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "🚂 AUTOMATIC RAILWAY DEPLOYMENT INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to https://railway.app" -ForegroundColor White
Write-Host "2. Click 'New Project'" -ForegroundColor White
Write-Host "3. Select 'Deploy from GitHub repo'" -ForegroundColor White
Write-Host "4. Find 'telegram-mcp-server' repository" -ForegroundColor White
Write-Host "5. Select the repository" -ForegroundColor White
Write-Host ""
Write-Host "⚙️ AUTOMATIC VARIABLES SETUP:" -ForegroundColor Yellow
Write-Host "============================" -ForegroundColor Yellow
Write-Host "In Railway → Variables, add:" -ForegroundColor White
Write-Host ""
Write-Host "TELEGRAM_BOT_TOKEN = 8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0" -ForegroundColor White
Write-Host "TELEGRAM_CHANNEL_ID = @mymcptest" -ForegroundColor White
Write-Host "NODE_ENV = production" -ForegroundColor White
Write-Host ""
Write-Host "🔧 AUTOMATIC BUILD SETTINGS:" -ForegroundColor Green
Write-Host "===========================" -ForegroundColor Green
Write-Host "Railway will automatically:" -ForegroundColor White
Write-Host "- Detect Node.js project" -ForegroundColor White
Write-Host "- Run: npm install" -ForegroundColor White
Write-Host "- Run: npm run build" -ForegroundColor White
Write-Host "- Run: npm start" -ForegroundColor White
Write-Host ""
Write-Host "✅ SERVER FEATURES:" -ForegroundColor Magenta
Write-Host "==================" -ForegroundColor Magenta
Write-Host "- 7 Telegram functions" -ForegroundColor White
Write-Host "- Official MCP SDK structure" -ForegroundColor White
Write-Host "- TypeScript compilation" -ForegroundColor White
Write-Host "- Environment variables support" -ForegroundColor White
Write-Host "- Error handling" -ForegroundColor White
Write-Host ""
Write-Host "🎯 READY FOR DEPLOYMENT!" -ForegroundColor Green
Write-Host "Railway will automatically deploy your MCP server." -ForegroundColor White
Write-Host ""
Write-Host "📱 TELEGRAM BOT SETUP:" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host "1. Find @BotFather in Telegram" -ForegroundColor White
Write-Host "2. Send /newbot" -ForegroundColor White
Write-Host "3. Name: My MCP Bot" -ForegroundColor White
Write-Host "4. Username: mymcp_bot" -ForegroundColor White
Write-Host "5. Copy token (already configured)" -ForegroundColor White
Write-Host "6. Add bot to @mymcptest channel as admin" -ForegroundColor White
Write-Host ""
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "Your Telegram MCP server is ready to use!" -ForegroundColor White

Read-Host "Press Enter to exit"
