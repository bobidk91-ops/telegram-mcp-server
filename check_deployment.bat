@echo off
echo ========================================
echo   CHECKING RAILWAY DEPLOYMENT STATUS
echo ========================================
echo.

echo Checking if Railway has deployed the new HTTP MCP server...
echo.

echo 1. Health check:
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://worker-production-193e.up.railway.app/health' -UseBasicParsing; Write-Host 'Status:' $response.StatusCode; Write-Host 'Content:' $response.Content } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 2. MCP endpoint check:
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://worker-production-193e.up.railway.app/mcp' -UseBasicParsing; Write-Host 'Status:' $response.StatusCode; Write-Host 'Content:' $response.Content } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo ========================================
echo   DEPLOYMENT CHECK COMPLETE
echo ========================================
echo.
echo If you see "WebSocket" in the MCP response, Railway hasn't deployed the new version yet.
echo If you see "HTTP" in the MCP response, the new version is deployed!
echo.
echo To force redeploy, go to Railway dashboard and click "Redeploy".
echo.

pause
