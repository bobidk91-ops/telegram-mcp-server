import https from 'https';

async function testRailwayPexels() {
    console.log('=== Testing Pexels on Railway ===\n');

    const baseUrl = 'worker-production-f73d.up.railway.app';

    // Test 1: Search Photos
    console.log('Test 1: Search Photos on Railway');
    await makeRequest(baseUrl, '/', 'POST', {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
            name: 'pexels_search_photos',
            arguments: {
                query: 'cats',
                per_page: 2
            }
        },
        id: 1
    });

    // Test 2: Curated Photos
    console.log('\nTest 2: Curated Photos on Railway');
    await makeRequest(baseUrl, '/', 'POST', {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
            name: 'pexels_curated_photos',
            arguments: {
                per_page: 2
            }
        },
        id: 2
    });

    console.log('\n=== Railway Pexels Test Completed ===');
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
                        if (json.result && json.result.content) {
                            const content = JSON.parse(json.result.content[0].text);
                            console.log('Success:', content.success);
                            if (content.photos) {
                                console.log(`Photos found: ${content.photos.length}`);
                                console.log(`Total results: ${content.total_results}`);
                            }
                        }
                    } catch (e) {
                        console.log('Response:', responseData.substring(0, 200));
                    }
                } else {
                    console.log('Error:', responseData);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error('ERROR:', e.message);
            resolve();
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

testRailwayPexels().catch(console.error);
