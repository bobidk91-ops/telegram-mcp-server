import https from 'https';

async function testYandexWordstat() {
    console.log('=== Testing Yandex Wordstat API ===\n');

    // Wait for Railway deployment
    await new Promise(resolve => setTimeout(resolve, 30000));

    const baseUrl = 'worker-production-f73d.up.railway.app';

    // Test 1: Search keyword statistics
    console.log('Test 1: Search keyword "iphone 15"');
    await makeRequest(baseUrl, '/', 'POST', {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
            name: 'yandex_wordstat_search',
            arguments: {
                phrases: ['iphone 15', 'samsung galaxy'],
                geo_ids: [225] // Russia
            }
        },
        id: 1
    });

    // Test 2: Get keyword suggestions
    console.log('\nTest 2: Get keywords for "remont kvartir"');
    await makeRequest(baseUrl, '/', 'POST', {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
            name: 'yandex_wordstat_keywords',
            arguments: {
                phrase: 'remont kvartir',
                geo_ids: [213] // Moscow
            }
        },
        id: 2
    });

    // Test 3: Get related queries
    console.log('\nTest 3: Get related queries for "dostavka edy"');
    await makeRequest(baseUrl, '/', 'POST', {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
            name: 'yandex_wordstat_related',
            arguments: {
                phrase: 'dostavka edy'
            }
        },
        id: 3
    });

    console.log('\n=== Yandex Wordstat Tests Completed ===');
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
                    console.log('Raw response:', responseData.substring(0, 500));
                }
                console.log('');
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

testYandexWordstat().catch(console.error);
