import https from 'https';

async function searchHorseInMountains() {
    console.log('=== Searching: Horse in Mountains ===\n');

    const baseUrl = 'worker-production-f73d.up.railway.app';

    await makeRequest(baseUrl, '/', 'POST', {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
            name: 'pexels_search_photos',
            arguments: {
                query: 'horse mountains',
                per_page: 5
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
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(responseData);
                        if (json.result && json.result.content) {
                            const content = JSON.parse(json.result.content[0].text);
                            
                            if (content.success) {
                                console.log(`✅ Success! Found ${content.total_results} results\n`);
                                console.log(`📸 Showing ${content.photos.length} photos:\n`);
                                
                                content.photos.forEach((photo, index) => {
                                    console.log(`${index + 1}. ID: ${photo.id}`);
                                    console.log(`   Photographer: ${photo.photographer}`);
                                    console.log(`   Size: ${photo.width}x${photo.height}`);
                                    console.log(`   URL: ${photo.url}`);
                                    console.log(`   Original: ${photo.src.original}`);
                                    console.log(`   Large: ${photo.src.large}`);
                                    console.log(`   Description: ${photo.alt || 'No description'}`);
                                    console.log('');
                                });
                            } else {
                                console.log('❌ Error:', content.error);
                            }
                        }
                    } catch (e) {
                        console.log('Parse error:', e.message);
                        console.log('Response:', responseData.substring(0, 500));
                    }
                } else {
                    console.log('HTTP Error:', responseData);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error('❌ Request Error:', e.message);
            resolve();
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

searchHorseInMountains().catch(console.error);
