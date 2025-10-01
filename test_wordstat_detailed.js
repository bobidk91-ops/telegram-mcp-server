import https from 'https';

async function testWordstatDetailed() {
    console.log('=== Testing Yandex Wordstat API - Detailed ===\n');

    const baseUrl = 'worker-production-f73d.up.railway.app';

    // Test 1: Search keyword
    console.log('Test 1: Search keyword "kupit telefon"');
    await makeRequest(baseUrl, '/', 'POST', {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
            name: 'yandex_wordstat_search',
            arguments: {
                phrases: ['kupit telefon'],
                geo_ids: [225]
            }
        },
        id: 1
    });

    // Test 2: Keywords
    console.log('\nTest 2: Keywords for "internet magazin"');
    await makeRequest(baseUrl, '/', 'POST', {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
            name: 'yandex_wordstat_keywords',
            arguments: {
                phrase: 'internet magazin'
            }
        },
        id: 2
    });

    // Test 3: Related
    console.log('\nTest 3: Related for "remont kvartir"');
    await makeRequest(baseUrl, '/', 'POST', {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
            name: 'yandex_wordstat_related',
            arguments: {
                phrase: 'remont kvartir'
            }
        },
        id: 3
    });

    console.log('\n=== All Tests Completed ===');
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
                        if (content.success) {
                            console.log('✅ Success!');
                            console.log('Data:', JSON.stringify(content.data || content, null, 2));
                        } else {
                            console.log('❌ Error:', content.error);
                        }
                    } else {
                        console.log('Response:', JSON.stringify(json, null, 2));
                    }
                } catch (e) {
                    console.log('Parse error:', e.message);
                    console.log('Raw:', responseData.substring(0, 1000));
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

testWordstatDetailed().catch(console.error);
