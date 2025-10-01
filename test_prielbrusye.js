import https from 'https';

async function testPrielbrusye() {
    console.log('=== Testing Wordstat: "пойти в приэльбрусье" ===\n');

    const baseUrl = 'worker-production-f73d.up.railway.app';

    await makeRequest(baseUrl, '/', 'POST', {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
            name: 'yandex_wordstat_keywords',
            arguments: {
                phrase: 'пойти в приэльбрусье',
                geo_ids: [225]
            }
        },
        id: 1
    });
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
                console.log(`Status: ${res.statusCode}\n`);
                try {
                    const json = JSON.parse(responseData);
                    if (json.result && json.result.content) {
                        const content = JSON.parse(json.result.content[0].text);
                        if (content.success) {
                            console.log('✅ SUCCESS!\n');
                            console.log('Phrase:', content.phrase);
                            console.log('Geo IDs:', content.geo_ids);
                            console.log('\nFull Response:');
                            console.log(JSON.stringify(content, null, 2));
                        } else {
                            console.log('❌ Error:', content.error);
                        }
                    } else {
                        console.log('Response:', JSON.stringify(json, null, 2));
                    }
                } catch (e) {
                    console.log('Parse error:', e.message);
                    console.log('Raw:', responseData);
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

testPrielbrusye().catch(console.error);
