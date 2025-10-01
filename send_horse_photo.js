import https from 'https';

async function sendHorsePhotoToTelegram() {
    console.log('=== Sending Horse Photo to Telegram ===\n');

    const baseUrl = 'worker-production-f73d.up.railway.app';
    
    // Используем фото #3 - величественная вздыбленная лошадь
    const photoUrl = 'https://images.pexels.com/photos/34026276/pexels-photo-34026276.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
    const caption = '🐴 Величественная лошадь в горах\n\nФото: Kemal Can\nИсточник: Pexels';

    await makeRequest(baseUrl, '/', 'POST', {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
            name: 'send_photo',
            arguments: {
                photo: photoUrl,
                caption: caption,
                parse_mode: 'HTML'
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
                                console.log('✅ Photo sent successfully!');
                                console.log(`📱 Message ID: ${content.message_id}`);
                                console.log(`📸 Channel: ${content.channel}`);
                                console.log(`⏰ Date: ${content.timestamp}`);
                                console.log(`\n🔗 Check your Telegram channel: ${content.channel}`);
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

sendHorsePhotoToTelegram().catch(console.error);
