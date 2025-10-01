import http from 'http';

async function testPexels() {
    console.log('=== Testing Pexels Integration ===\n');

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test 1: Search Photos
    console.log('Test 1: Search Photos for "nature"');
    await makeRequest({
        path: '/',
        method: 'POST',
        data: {
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                name: 'pexels_search_photos',
                arguments: {
                    query: 'nature',
                    per_page: 3
                }
            },
            id: 1
        }
    });

    // Test 2: Get Curated Photos
    console.log('\nTest 2: Get Curated Photos');
    await makeRequest({
        path: '/',
        method: 'POST',
        data: {
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                name: 'pexels_curated_photos',
                arguments: {
                    per_page: 2
                }
            },
            id: 2
        }
    });

    // Test 3: Search Videos
    console.log('\nTest 3: Search Videos for "ocean"');
    await makeRequest({
        path: '/',
        method: 'POST',
        data: {
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                name: 'pexels_search_videos',
                arguments: {
                    query: 'ocean',
                    per_page: 2
                }
            },
            id: 3
        }
    });

    console.log('\n=== Pexels Tests Completed ===');
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
                    if (json.result && json.result.content) {
                        const content = JSON.parse(json.result.content[0].text);
                        console.log('Response:', JSON.stringify(content, null, 2));
                    } else {
                        console.log('Response:', JSON.stringify(json, null, 2));
                    }
                } catch (e) {
                    console.log('Raw response:', data.substring(0, 500));
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

testPexels().catch(console.error);
