import http from 'http';

async function testMCP() {
    console.log('=== Testing MCP Telegram Server ===\n');

    // Test 1: Health Check
    console.log('Test 1: Health Check');
    await makeRequest({ path: '/health', method: 'GET' });

    // Test 2: MCP Info
    console.log('\nTest 2: MCP Info');
    await makeRequest({ path: '/mcp', method: 'GET' });

    // Test 3: MCP Initialize
    console.log('\nTest 3: MCP Initialize');
    await makeRequest({ 
        path: '/', 
        method: 'POST',
        data: {
            jsonrpc: '2.0',
            method: 'initialize',
            params: {},
            id: 1
        }
    });

    // Test 4: MCP Tools List
    console.log('\nTest 4: MCP Tools List');
    await makeRequest({ 
        path: '/', 
        method: 'POST',
        data: {
            jsonrpc: '2.0',
            method: 'tools/list',
            params: {},
            id: 2
        }
    });

    // Test 5: Send Message
    console.log('\nTest 5: Send Message to Telegram');
    await makeRequest({ 
        path: '/', 
        method: 'POST',
        data: {
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                name: 'send_message',
                arguments: {
                    text: 'Test message from HTTP MCP test'
                }
            },
            id: 3
        }
    });

    // Test 6: Get Channel Info
    console.log('\nTest 6: Get Channel Info');
    await makeRequest({ 
        path: '/', 
        method: 'POST',
        data: {
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                name: 'get_channel_info',
                arguments: {}
            },
            id: 4
        }
    });

    console.log('\n=== All Tests Completed ===');
}

function makeRequest(options) {
    return new Promise((resolve, reject) => {
        const opts = {
            hostname: 'localhost',
            port: 8080,
            path: options.path,
            method: options.method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(opts, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`Status: ${res.statusCode}`);
                try {
                    const json = JSON.parse(data);
                    console.log('Response:', JSON.stringify(json, null, 2));
                } catch (e) {
                    console.log('Response:', data.substring(0, 500));
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error('ERROR:', e.message);
            reject(e);
        });

        if (options.data) {
            req.write(JSON.stringify(options.data));
        }
        req.end();
    });
}

testMCP().catch(console.error);
