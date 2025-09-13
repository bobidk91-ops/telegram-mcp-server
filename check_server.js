const http = require('http');

console.log('🔍 Checking MCP Telegram Server...\n');

// Test health endpoint
const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/health',
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('\n📊 Server Health:');
            console.log(`- Status: ${json.status}`);
            console.log(`- Bot Connected: ${json.bot_connected}`);
            console.log(`- Bot Username: ${json.bot_username}`);
            console.log(`- Channel: ${json.channel}`);
            console.log(`- Version: ${json.version}`);
            console.log(`- MCP Server: ${json.mcp_server}`);
        } catch (e) {
            console.log('Raw response:', data);
        }
    });
});

req.on('error', (e) => {
    console.error('❌ Error:', e.message);
});

req.end();
