// Test script for extended Telegram MCP Server functions
import https from 'https';

const RAILWAY_URL = 'https://telegram-mcp-server-production.up.railway.app';

function makeRequest(url, body) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ status: res.statusCode, response });
        } catch (error) {
          resolve({ status: res.statusCode, response: data });
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function testFunction(functionName, args, description) {
  console.log(`\n🧪 Testing ${functionName}:`);
  console.log(`📝 ${description}`);
  
  try {
    const result = await makeRequest(RAILWAY_URL, {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: functionName,
        arguments: args
      },
      id: Date.now()
    });
    
    if (result.status === 200) {
      const content = result.response.result?.content?.[0]?.text;
      if (content) {
        const parsed = JSON.parse(content);
        if (parsed.success) {
          console.log(`✅ ${functionName} executed successfully!`);
          console.log(`📱 Message ID: ${parsed.message_id || 'N/A'}`);
          if (parsed.member_count) {
            console.log(`👥 Members: ${parsed.member_count}`);
          }
        } else {
          console.log(`❌ Error: ${parsed.error}`);
        }
      }
    } else {
      console.log(`❌ HTTP Error: ${result.status}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Testing Extended Telegram MCP Server Functions');
  console.log('================================================');
  
  // Test 1: Send a poll
  await testFunction('send_poll', {
    question: 'Какой ваш любимый язык программирования?',
    options: ['JavaScript', 'Python', 'TypeScript', 'Go', 'Rust'],
    is_anonymous: true,
    type: 'regular'
  }, 'Sending a poll to the channel');
  
  // Test 2: Send a photo with caption
  await testFunction('send_photo', {
    photo: 'https://picsum.photos/800/600',
    caption: '🖼️ <b>Красивое изображение</b> для тестирования MCP сервера!',
    parse_mode: 'HTML'
  }, 'Sending a photo with HTML caption');
  
  // Test 3: Get channel statistics
  await testFunction('get_channel_stats', {}, 'Getting channel statistics and member count');
  
  // Test 4: Send a regular message first to get message_id
  console.log('\n📨 Sending test message to get message_id...');
  const messageResult = await makeRequest(RAILWAY_URL, {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: 'send_message',
      arguments: {
        text: '🔧 Тестовое сообщение для проверки функций редактирования и реакций'
      }
    },
    id: Date.now()
  });
  
  let messageId = null;
  if (messageResult.status === 200) {
    const content = messageResult.response.result?.content?.[0]?.text;
    if (content) {
      const parsed = JSON.parse(content);
      if (parsed.success) {
        messageId = parsed.message_id;
        console.log(`✅ Test message sent with ID: ${messageId}`);
      }
    }
  }
  
  // Test 5: Send reaction (if we have message_id)
  if (messageId) {
    await testFunction('send_reaction', {
      message_id: messageId,
      emoji: '👍'
    }, 'Adding reaction to the test message');
  }
  
  // Test 6: Send a document
  await testFunction('send_document', {
    document: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    caption: '📄 Тестовый PDF документ'
  }, 'Sending a PDF document');
  
  console.log('\n✅ Extended functions testing completed!');
  console.log('📱 Check your Telegram channel @mymcptest for all the test content!');
}

main().catch(console.error);
