#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || '', { polling: false });
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@mymcptest';

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
              text: `✅ Message sent successfully! Message ID: ${messageResult.message_id}`,
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
              text: `✅ Photo sent successfully! Message ID: ${photoResult.message_id}`,
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
              text: `✅ Poll created successfully! Message ID: ${pollResult.message_id}`,
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
              text: `✅ Reaction sent successfully!`,
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
              text: `✅ Message edited successfully!`,
            },
          ],
        };

      case 'delete_message':
        await bot.deleteMessage(CHANNEL_ID, args.message_id);
        return {
          content: [
            {
              type: 'text',
              text: `✅ Message deleted successfully!`,
            },
          ],
        };

      case 'get_channel_info':
        const chatInfo = await bot.getChat(CHANNEL_ID);
        return {
          content: [
            {
              type: 'text',
              text: `📱 Channel Info:\nTitle: ${chatInfo.title}\nType: ${chatInfo.type}\nID: ${chatInfo.id}`,
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
          text: `❌ Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🚀 Telegram MCP Server started (stdio mode)');
  console.error('📱 Channel:', CHANNEL_ID);
  console.error('✅ Ready for Claude Desktop connection!');
}

main().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
