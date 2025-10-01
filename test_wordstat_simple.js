import https from 'https';

async function testWordstat() {
    console.log('=== Testing Yandex Wordstat API ===\n');

    const baseUrl = 'worker-production-f73d.up.railway.app';

    // Test 1: Search keyword statistics
    console.log('Test 1: Search keyword "iphone"');
    await makeRequest(baseUrl, '/', 'POST', {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
            name: 'yandex_wordstat_search',
            arguments: {
                phrases: ['iphone'],
                geo_ids: [225]
            }
        },
        id: 1
    });

    console.log('\n=== Test Completed ===');
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
                try {
                    const json = JSON.parse(responseData);
                    if (json.result && json.result.content) {
                        const content = JSON.parse(json.result.content[0].text);
                        console.log('Response:', JSON.stringify(content, null, 2));
                    } else {
                        console.log('Response:', JSON.stringify(json, null, 2));
                    }
                } catch (e) {
                    console.log('Raw response:', responseData);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error('ERROR:', e.message);
            reject(e);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

testWordstat().catch(console.error);
