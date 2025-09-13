# Test script for MCP Telegram Server
Write-Host "Testing MCP Telegram Server..." -ForegroundColor Green

# Test 1: Basic server info
Write-Host "`n1. Testing basic server info..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Health check
Write-Host "`n2. Testing health check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/health" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: MCP Initialize
Write-Host "`n3. Testing MCP Initialize..." -ForegroundColor Yellow
try {
    $body = @{
        jsonrpc = "2.0"
        method = "initialize"
        params = @{}
        id = 1
    } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "http://localhost:8080/" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: MCP Tools List
Write-Host "`n4. Testing MCP Tools List..." -ForegroundColor Yellow
try {
    $body = @{
        jsonrpc = "2.0"
        method = "tools/list"
        params = @{}
        id = 2
    } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "http://localhost:8080/" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Send Message
Write-Host "`n5. Testing Send Message..." -ForegroundColor Yellow
try {
    $body = @{
        jsonrpc = "2.0"
        method = "tools/call"
        params = @{
            name = "send_message"
            arguments = @{
                text = "Test message from PowerShell script"
            }
        }
        id = 3
    } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "http://localhost:8080/" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Get Channel Info
Write-Host "`n6. Testing Get Channel Info..." -ForegroundColor Yellow
try {
    $body = @{
        jsonrpc = "2.0"
        method = "tools/call"
        params = @{
            name = "get_channel_info"
            arguments = @{}
        }
        id = 4
    } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "http://localhost:8080/" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTesting completed!" -ForegroundColor Green
