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

// CORS middleware
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

// MCP Server Info
app.get('/mcp', (req, res) => {
  res.json({
    name: 'Telegram MCP Server',
    version: '1.0.0',
    description: 'MCP Server for Telegram Bot API with blogging features',
    protocol: 'MCP',
    transport: 'HTTP',
    capabilities: {
      tools: {}
    },
    tools: [
      {
        name: 'send_message',
        description: 'Send a text message to the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            text: { type: 'string', description: 'Message text to send' },
            parse_mode: { type: 'string', enum: ['HTML', 'Markdown', 'MarkdownV2'] }
          },
          required: ['text']
        }
      },
      {
        name: 'send_photo',
        description: 'Send a photo to the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            photo: { type: 'string', description: 'Photo URL or file path' },
            caption: { type: 'string', description: 'Photo caption' },
            parse_mode: { type: 'string', enum: ['HTML', 'Markdown', 'MarkdownV2'] }
          },
          required: ['photo']
        }
      },
      {
        name: 'send_poll',
        description: 'Create and send a poll to the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            question: { type: 'string', description: 'Poll question' },
            options: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 10 },
            is_anonymous: { type: 'boolean', default: true },
            type: { type: 'string', enum: ['quiz', 'regular'], default: 'regular' }
          },
          required: ['question', 'options']
        }
      },
      {
        name: 'send_reaction',
        description: 'Send a reaction to a message',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: { type: 'number', description: 'Message ID to react to' },
            emoji: { type: 'string', description: 'Emoji to send as reaction' }
          },
          required: ['message_id', 'emoji']
        }
      },
      {
        name: 'edit_message',
        description: 'Edit an existing message',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: { type: 'number', description: 'Message ID to edit' },
            text: { type: 'string', description: 'New message text' },
            parse_mode: { type: 'string', enum: ['HTML', 'Markdown', 'MarkdownV2'] }
          },
          required: ['message_id', 'text']
        }
      },
      {
        name: 'delete_message',
        description: 'Delete a message from the channel',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: { type: 'number', description: 'Message ID to delete' }
          },
          required: ['message_id']
        }
      },
      {
        name: 'get_channel_info',
        description: 'Get information about the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ]
  });
});

// MCP Tools List
app.post('/mcp/tools/list', async (req, res) => {
  try {
    const tools = [
      {
        name: 'send_message',
        description: 'Send a text message to the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            text: { type: 'string', description: 'Message text to send' },
            parse_mode: { type: 'string', enum: ['HTML', 'Markdown', 'MarkdownV2'] }
          },
          required: ['text']
        }
      },
      {
        name: 'send_photo',
        description: 'Send a photo to the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            photo: { type: 'string', description: 'Photo URL or file path' },
            caption: { type: 'string', description: 'Photo caption' },
            parse_mode: { type: 'string', enum: ['HTML', 'Markdown', 'MarkdownV2'] }
          },
          required: ['photo']
        }
      },
      {
        name: 'send_poll',
        description: 'Create and send a poll to the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            question: { type: 'string', description: 'Poll question' },
            options: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 10 },
            is_anonymous: { type: 'boolean', default: true },
            type: { type: 'string', enum: ['quiz', 'regular'], default: 'regular' }
          },
          required: ['question', 'options']
        }
      },
      {
        name: 'send_reaction',
        description: 'Send a reaction to a message',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: { type: 'number', description: 'Message ID to react to' },
            emoji: { type: 'string', description: 'Emoji to send as reaction' }
          },
          required: ['message_id', 'emoji']
        }
      },
      {
        name: 'edit_message',
        description: 'Edit an existing message',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: { type: 'number', description: 'Message ID to edit' },
            text: { type: 'string', description: 'New message text' },
            parse_mode: { type: 'string', enum: ['HTML', 'Markdown', 'MarkdownV2'] }
          },
          required: ['message_id', 'text']
        }
      },
      {
        name: 'delete_message',
        description: 'Delete a message from the channel',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: { type: 'number', description: 'Message ID to delete' }
          },
          required: ['message_id']
        }
      },
      {
        name: 'get_channel_info',
        description: 'Get information about the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ];
    
    res.json({ tools });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// MCP Tool Call
app.post('/mcp/tools/call', async (req, res) => {
  try {
    const { name, arguments: args } = req.body;

    switch (name) {
      case 'send_message':
        const messageResult = await bot.sendMessage(CHANNEL_ID, args.text, {
          parse_mode: args.parse_mode || 'HTML',
        });
        res.json({
          content: [
            {
              type: 'text',
              text: `Message sent successfully! Message ID: ${messageResult.message_id}`,
            },
          ],
        });
        break;

      case 'send_photo':
        const photoResult = await bot.sendPhoto(CHANNEL_ID, args.photo, {
          caption: args.caption,
          parse_mode: args.parse_mode || 'HTML',
        });
        res.json({
          content: [
            {
              type: 'text',
              text: `Photo sent successfully! Message ID: ${photoResult.message_id}`,
            },
          ],
        });
        break;

      case 'send_poll':
        const pollResult = await bot.sendPoll(CHANNEL_ID, args.question, args.options, {
          is_anonymous: args.is_anonymous !== false,
          type: args.type || 'regular',
        });
        res.json({
          content: [
            {
              type: 'text',
              text: `Poll created successfully! Message ID: ${pollResult.message_id}`,
            },
          ],
        });
        break;

      case 'send_reaction':
        await bot.setMessageReaction(CHANNEL_ID, args.message_id, [{ 
          type: 'emoji', 
          emoji: args.emoji 
        }] as any);
        res.json({
          content: [
            {
              type: 'text',
              text: `Reaction sent successfully!`,
            },
          ],
        });
        break;

      case 'edit_message':
        await bot.editMessageText(args.text, {
          chat_id: CHANNEL_ID,
          message_id: args.message_id,
          parse_mode: args.parse_mode || 'HTML',
        });
        res.json({
          content: [
            {
              type: 'text',
              text: `Message edited successfully!`,
            },
          ],
        });
        break;

      case 'delete_message':
        await bot.deleteMessage(CHANNEL_ID, args.message_id);
        res.json({
          content: [
            {
              type: 'text',
              text: `Message deleted successfully!`,
            },
          ],
        });
        break;

      case 'get_channel_info':
        const chatInfo = await bot.getChat(CHANNEL_ID);
        res.json({
          content: [
            {
              type: 'text',
              text: `Channel Info:\nTitle: ${chatInfo.title}\nType: ${chatInfo.type}\nID: ${chatInfo.id}`,
            },
          ],
        });
        break;

      default:
        res.status(400).json({ error: `Unknown tool: ${name}` });
    }
  } catch (error: any) {
    res.status(500).json({ 
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Telegram MCP Server',
    version: '1.0.0',
    status: 'running',
    description: 'MCP Server for Telegram Bot API with blogging features',
    mcp_endpoint: '/mcp',
    health: '/health'
  });
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Telegram MCP Server running on port ${port}`);
  console.log(`MCP endpoint: http://localhost:${port}/mcp`);
  console.log(`Health check: http://localhost:${port}/health`);
});
