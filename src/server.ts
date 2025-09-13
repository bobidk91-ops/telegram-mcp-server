#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import express from 'express';

// Load environment variables
dotenv.config();

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || '', { polling: false });
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@mymcptest';

// Create Express app for HTTP API
const app = express();
app.use(express.json());

// Create MCP Server
const server = new Server(
  {
    name: 'telegram-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'send_message',
        description: 'Send a text message to the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Message text to send',
            },
            parse_mode: {
              type: 'string',
              description: 'Parse mode (HTML, Markdown, or MarkdownV2)',
              enum: ['HTML', 'Markdown', 'MarkdownV2'],
            },
          },
          required: ['text'],
        },
      },
      {
        name: 'send_photo',
        description: 'Send a photo to the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            photo: {
              type: 'string',
              description: 'Photo URL or file path',
            },
            caption: {
              type: 'string',
              description: 'Photo caption',
            },
            parse_mode: {
              type: 'string',
              description: 'Parse mode for caption',
              enum: ['HTML', 'Markdown', 'MarkdownV2'],
            },
          },
          required: ['photo'],
        },
      },
      {
        name: 'send_poll',
        description: 'Create and send a poll to the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description: 'Poll question',
            },
            options: {
              type: 'array',
              items: { type: 'string' },
              description: 'Poll options (2-10 items)',
              minItems: 2,
              maxItems: 10,
            },
            is_anonymous: {
              type: 'boolean',
              description: 'Whether the poll is anonymous',
              default: true,
            },
            type: {
              type: 'string',
              description: 'Poll type',
              enum: ['quiz', 'regular'],
              default: 'regular',
            },
          },
          required: ['question', 'options'],
        },
      },
      {
        name: 'send_reaction',
        description: 'Send a reaction to a message',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: {
              type: 'number',
              description: 'Message ID to react to',
            },
            emoji: {
              type: 'string',
              description: 'Emoji to send as reaction',
            },
          },
          required: ['message_id', 'emoji'],
        },
      },
      {
        name: 'edit_message',
        description: 'Edit an existing message',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: {
              type: 'number',
              description: 'Message ID to edit',
            },
            text: {
              type: 'string',
              description: 'New message text',
            },
            parse_mode: {
              type: 'string',
              description: 'Parse mode for new text',
              enum: ['HTML', 'Markdown', 'MarkdownV2'],
            },
          },
          required: ['message_id', 'text'],
        },
      },
      {
        name: 'delete_message',
        description: 'Delete a message from the channel',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: {
              type: 'number',
              description: 'Message ID to delete',
            },
          },
          required: ['message_id'],
        },
      },
      {
        name: 'get_channel_info',
        description: 'Get information about the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'send_message':
        const messageResult = await bot.sendMessage(CHANNEL_ID, args.text, {
          parse_mode: args.parse_mode || 'HTML',
        });
        return {
          content: [
            {
              type: 'text',
              text: `Message sent successfully! Message ID: ${messageResult.message_id}`,
            },
          ],
        };

      case 'send_photo':
        const photoResult = await bot.sendPhoto(CHANNEL_ID, args.photo, {
          caption: args.caption,
          parse_mode: args.parse_mode || 'HTML',
        });
        return {
          content: [
            {
              type: 'text',
              text: `Photo sent successfully! Message ID: ${photoResult.message_id}`,
            },
          ],
        };

      case 'send_poll':
        const pollResult = await bot.sendPoll(CHANNEL_ID, args.question, args.options, {
          is_anonymous: args.is_anonymous !== false,
          type: args.type || 'regular',
        });
        return {
          content: [
            {
              type: 'text',
              text: `Poll created successfully! Message ID: ${pollResult.message_id}`,
            },
          ],
        };

      case 'send_reaction':
        await bot.setMessageReaction(CHANNEL_ID, args.message_id, [{ 
          type: 'emoji', 
          emoji: args.emoji 
        }] as any);
        return {
          content: [
            {
              type: 'text',
              text: `Reaction sent successfully!`,
            },
          ],
        };

      case 'edit_message':
        await bot.editMessageText(args.text, {
          chat_id: CHANNEL_ID,
          message_id: args.message_id,
          parse_mode: args.parse_mode || 'HTML',
        });
        return {
          content: [
            {
              type: 'text',
              text: `Message edited successfully!`,
            },
          ],
        };

      case 'delete_message':
        await bot.deleteMessage(CHANNEL_ID, args.message_id);
        return {
          content: [
            {
              type: 'text',
              text: `Message deleted successfully!`,
            },
          ],
        };

      case 'get_channel_info':
        const chatInfo = await bot.getChat(CHANNEL_ID);
        return {
          content: [
            {
              type: 'text',
              text: `Channel Info:\nTitle: ${chatInfo.title}\nType: ${chatInfo.type}\nID: ${chatInfo.id}`,
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// HTTP API endpoints
app.get('/', (req, res) => {
  res.json({
    name: 'Telegram MCP Server',
    version: '1.0.0',
    status: 'running',
    description: 'MCP Server for Telegram Bot API with blogging features',
    endpoints: {
      health: '/health',
      tools: '/tools',
      send_message: 'POST /api/send_message',
      send_photo: 'POST /api/send_photo',
      send_poll: 'POST /api/send_poll',
      send_reaction: 'POST /api/send_reaction',
      edit_message: 'POST /api/edit_message',
      delete_message: 'POST /api/delete_message',
      get_channel_info: 'GET /api/channel_info'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/tools', async (req, res) => {
  try {
    // Return available tools directly
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

// API endpoints for direct HTTP access
app.post('/api/send_message', async (req, res) => {
  try {
    const { text, parse_mode } = req.body;
    const result = await bot.sendMessage(CHANNEL_ID, text, {
      parse_mode: parse_mode || 'HTML',
    });
    res.json({ success: true, message_id: result.message_id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/send_photo', async (req, res) => {
  try {
    const { photo, caption, parse_mode } = req.body;
    const result = await bot.sendPhoto(CHANNEL_ID, photo, {
      caption,
      parse_mode: parse_mode || 'HTML',
    });
    res.json({ success: true, message_id: result.message_id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/send_poll', async (req, res) => {
  try {
    const { question, options, is_anonymous, type } = req.body;
    const result = await bot.sendPoll(CHANNEL_ID, question, options, {
      is_anonymous: is_anonymous !== false,
      type: type || 'regular',
    });
    res.json({ success: true, message_id: result.message_id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/send_reaction', async (req, res) => {
  try {
    const { message_id, emoji } = req.body;
    await bot.setMessageReaction(CHANNEL_ID, message_id, [{ 
      type: 'emoji', 
      emoji: emoji 
    }] as any);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/edit_message', async (req, res) => {
  try {
    const { message_id, text, parse_mode } = req.body;
    await bot.editMessageText(text, {
      chat_id: CHANNEL_ID,
      message_id: message_id,
      parse_mode: parse_mode || 'HTML',
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/delete_message', async (req, res) => {
  try {
    const { message_id } = req.body;
    await bot.deleteMessage(CHANNEL_ID, message_id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/channel_info', async (req, res) => {
  try {
    const chatInfo = await bot.getChat(CHANNEL_ID);
    res.json({
      success: true,
      channel: {
        title: chatInfo.title,
        type: chatInfo.type,
        id: chatInfo.id
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
async function main() {
  const port = process.env.PORT || 8080;
  
  // Start HTTP server
  app.listen(port, () => {
    console.log(`HTTP server running on port ${port}`);
    console.log(`Visit: http://localhost:${port}`);
  });

  // Start MCP server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Telegram MCP Server started');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});