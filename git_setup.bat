@echo off
chcp 65001 >nul
echo Setting up Git and creating commit...

"C:\Program Files\Git\bin\git.exe" config --global user.email "user@example.com"
"C:\Program Files\Git\bin\git.exe" config --global user.name "Telegram MCP User"
"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Initial commit: Telegram MCP Server"

echo Git setup complete!
pause

