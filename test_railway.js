import https from 'https';

async function testRailway() {
    console.log('=== Testing Railway Deployment ===\n');

    const baseUrl = 'telegram-mcp-server-production.up.railway.app';

    // Test 1: Health Check
    console.log('Test 1: Health Check');
    await makeRequest(baseUrl, '/health', 'GET');

    // Test 2: MCP Info
    console.log('\nTest 2: MCP Info');
    await makeRequest(baseUrl, '/mcp', 'GET');

    // Test 3: Get Channel Info
    console.log('\nTest 3: Get Channel Info (MCP Protocol)');
    await makeRequest(baseUrl, '/', 'POST', {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
            name: 'get_channel_info',
            arguments: {}
        },
        id: 1
    });

    console.log('\n=== Railway Test Completed ===');
}

function makeRequest(hostname, path, method, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: hostname,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                console.log(`Status: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(responseData);
                        console.log('Response:', JSON.stringify(json, null, 2));
                    } catch (e) {
                        console.log('Response:', responseData.substring(0, 500));
                    }
                } else {
                    console.log('Error:', responseData);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error('ERROR:', e.message);
            console.log('Server might be down or URL incorrect');
            resolve();
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

testRailway().catch(console.error);
