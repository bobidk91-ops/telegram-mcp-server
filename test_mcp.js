const http = require('http');

// Test function to make HTTP requests
function makeRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });
        
        req.on('error', reject);
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    console.log('🚀 Testing MCP Telegram Server...\n');
    
    // Test 1: Basic server info
    console.log('1. Testing basic server info...');
    try {
        const response = await makeRequest({
            hostname: 'localhost',
            port: 8080,
            path: '/',
            method: 'GET'
        });
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}\n`);
    } catch (error) {
        console.log(`   Error: ${error.message}\n`);
    }
    
    // Test 2: Health check
    console.log('2. Testing health check...');
    try {
        const response = await makeRequest({
            hostname: 'localhost',
            port: 8080,
            path: '/health',
            method: 'GET'
        });
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}\n`);
    } catch (error) {
        console.log(`   Error: ${error.message}\n`);
    }
    
    // Test 3: MCP Initialize
    console.log('3. Testing MCP Initialize...');
    try {
        const response = await makeRequest({
            hostname: 'localhost',
            port: 8080,
            path: '/',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            jsonrpc: '2.0',
            method: 'initialize',
            params: {},
            id: 1
        });
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}\n`);
    } catch (error) {
        console.log(`   Error: ${error.message}\n`);
    }
    
    // Test 4: MCP Tools List
    console.log('4. Testing MCP Tools List...');
    try {
        const response = await makeRequest({
            hostname: 'localhost',
            port: 8080,
            path: '/',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            jsonrpc: '2.0',
            method: 'tools/list',
            params: {},
            id: 2
        });
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}\n`);
    } catch (error) {
        console.log(`   Error: ${error.message}\n`);
    }
    
    // Test 5: Send Message
    console.log('5. Testing Send Message...');
    try {
        const response = await makeRequest({
            hostname: 'localhost',
            port: 8080,
            path: '/',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                name: 'send_message',
                arguments: {
                    text: 'Test message from Node.js script'
                }
            },
            id: 3
        });
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}\n`);
    } catch (error) {
        console.log(`   Error: ${error.message}\n`);
    }
    
    // Test 6: Get Channel Info
    console.log('6. Testing Get Channel Info...');
    try {
        const response = await makeRequest({
            hostname: 'localhost',
            port: 8080,
            path: '/',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                name: 'get_channel_info',
                arguments: {}
            },
            id: 4
        });
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}\n`);
    } catch (error) {
        console.log(`   Error: ${error.message}\n`);
    }
    
    // Test 7: Send Photo
    console.log('7. Testing Send Photo...');
    try {
        const response = await makeRequest({
            hostname: 'localhost',
            port: 8080,
            path: '/',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                name: 'send_photo',
                arguments: {
                    photo: 'https://via.placeholder.com/300x200/0066CC/FFFFFF?text=Test+Photo',
                    caption: 'Test photo from Node.js script'
                }
            },
            id: 5
        });
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}\n`);
    } catch (error) {
        console.log(`   Error: ${error.message}\n`);
    }
    
    console.log('✅ Testing completed!');
}

runTests().catch(console.error);
