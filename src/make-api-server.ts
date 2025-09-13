#!/usr/bin/env node

import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || '', { polling: false });
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@mymcptest';

// Create Express app
const app = express();
app.use(express.json());

// CORS middleware for Make.com
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Root endpoint - API documentation
app.get('/', (req, res) => {
  res.json({
    name: 'Telegram Bot API for Make.com',
    version: '1.0.0',
    description: 'Simple HTTP API for Telegram bot integration with Make.com',
    base_url: req.protocol + '://' + req.get('host'),
    endpoints: {
      health: 'GET /health',
      send_message: 'POST /send-message',
      send_photo: 'POST /send-photo',
      send_poll: 'POST /send-poll',
      send_reaction: 'POST /send-reaction',
      edit_message: 'POST /edit-message',
      delete_message: 'POST /delete-message',
      get_channel_info: 'GET /channel-info'
    },
    examples: {
      send_message: {
        url: '/send-message',
        method: 'POST',
        body: {
          text: 'Hello from Make.com!',
          parse_mode: 'HTML'
        }
      },
      send_photo: {
        url: '/send-photo',
        method: 'POST',
        body: {
          photo: 'https://example.com/image.jpg',
          caption: 'Photo from Make.com!'
        }
      },
      send_poll: {
        url: '/send-poll',
        method: 'POST',
        body: {
          question: 'How are you?',
          options: ['Great!', 'Good', 'Not bad', 'Bad']
        }
      }
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    channel: CHANNEL_ID,
    bot_connected: !!bot
  });
});

// Send text message
app.post('/send-message', async (req, res) => {
  try {
    const { text, parse_mode = 'HTML' } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        success: false, 
        error: 'Text is required' 
      });
    }

    const result = await bot.sendMessage(CHANNEL_ID, text, {
      parse_mode: parse_mode
    });

    res.json({
      success: true,
      message_id: result.message_id,
      text: result.text,
      date: result.date,
      channel: CHANNEL_ID
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Send photo
app.post('/send-photo', async (req, res) => {
  try {
    const { photo, caption, parse_mode = 'HTML' } = req.body;
    
    if (!photo) {
      return res.status(400).json({ 
        success: false, 
        error: 'Photo URL is required' 
      });
    }

    const result = await bot.sendPhoto(CHANNEL_ID, photo, {
      caption: caption,
      parse_mode: parse_mode
    });

    res.json({
      success: true,
      message_id: result.message_id,
      photo: result.photo,
      caption: result.caption,
      date: result.date,
      channel: CHANNEL_ID
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Send poll
app.post('/send-poll', async (req, res) => {
  try {
    const { 
      question, 
      options, 
      is_anonymous = true, 
      type = 'regular' 
    } = req.body;
    
    if (!question) {
      return res.status(400).json({ 
        success: false, 
        error: 'Question is required' 
      });
    }

    if (!options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ 
        success: false, 
        error: 'Options array with at least 2 items is required' 
      });
    }

    const result = await bot.sendPoll(CHANNEL_ID, question, options, {
      is_anonymous: is_anonymous,
      type: type
    });

    res.json({
      success: true,
      message_id: result.message_id,
      question: result.poll?.question,
      options: result.poll?.options,
      is_anonymous: result.poll?.is_anonymous,
      type: result.poll?.type,
      date: result.date,
      channel: CHANNEL_ID
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Send reaction
app.post('/send-reaction', async (req, res) => {
  try {
    const { message_id, emoji } = req.body;
    
    if (!message_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message ID is required' 
      });
    }

    if (!emoji) {
      return res.status(400).json({ 
        success: false, 
        error: 'Emoji is required' 
      });
    }

    await bot.setMessageReaction(CHANNEL_ID, message_id, [{ 
      type: 'emoji', 
      emoji: emoji 
    }] as any);

    res.json({
      success: true,
      message_id: message_id,
      emoji: emoji,
      channel: CHANNEL_ID
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Edit message
app.post('/edit-message', async (req, res) => {
  try {
    const { message_id, text, parse_mode = 'HTML' } = req.body;
    
    if (!message_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message ID is required' 
      });
    }

    if (!text) {
      return res.status(400).json({ 
        success: false, 
        error: 'Text is required' 
      });
    }

    await bot.editMessageText(text, {
      chat_id: CHANNEL_ID,
      message_id: message_id,
      parse_mode: parse_mode
    });

    res.json({
      success: true,
      message_id: message_id,
      text: text,
      channel: CHANNEL_ID
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Delete message
app.post('/delete-message', async (req, res) => {
  try {
    const { message_id } = req.body;
    
    if (!message_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message ID is required' 
      });
    }

    await bot.deleteMessage(CHANNEL_ID, message_id);

    res.json({
      success: true,
      message_id: message_id,
      channel: CHANNEL_ID
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get channel info
app.get('/channel-info', async (req, res) => {
  try {
    const chatInfo = await bot.getChat(CHANNEL_ID);
    
    res.json({
      success: true,
      channel: {
        id: chatInfo.id,
        title: chatInfo.title,
        type: chatInfo.type,
        username: chatInfo.username,
        description: chatInfo.description
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Error:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found',
    available_endpoints: [
      'GET /',
      'GET /health',
      'POST /send-message',
      'POST /send-photo',
      'POST /send-poll',
      'POST /send-reaction',
      'POST /edit-message',
      'POST /delete-message',
      'GET /channel-info'
    ]
  });
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Telegram Bot API Server running on port ${port}`);
  console.log(`📱 Channel: ${CHANNEL_ID}`);
  console.log(`🌐 API URL: http://localhost:${port}`);
  console.log(`📖 Documentation: http://localhost:${port}/`);
  console.log(`✅ Ready for Make.com integration!`);
});
"// Force Railway redeploy - $(Get-Date)" 
