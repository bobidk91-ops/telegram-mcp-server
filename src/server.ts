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
              description: 'The text message to send',
            },
            parse_mode: {
              type: 'string',
              enum: ['HTML', 'Markdown', 'MarkdownV2'],
              description: 'Parse mode for the message',
              default: 'HTML',
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
            photo_url: {
              type: 'string',
              description: 'URL of the photo to send',
            },
            caption: {
              type: 'string',
              description: 'Caption for the photo',
            },
            parse_mode: {
              type: 'string',
              enum: ['HTML', 'Markdown', 'MarkdownV2'],
              description: 'Parse mode for the caption',
              default: 'HTML',
            },
          },
          required: ['photo_url'],
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
              description: 'The poll question',
            },
            options: {
              type: 'array',
              items: { type: 'string' },
              minItems: 2,
              maxItems: 10,
              description: 'Array of poll options (2-10 options)',
            },
            is_anonymous: {
              type: 'boolean',
              description: 'Whether the poll is anonymous',
              default: true,
            },
            type: {
              type: 'string',
              enum: ['quiz', 'regular'],
              description: 'Type of poll',
              default: 'regular',
            },
            correct_option_id: {
              type: 'number',
              description: 'Correct option ID for quiz polls (0-based)',
            },
            explanation: {
              type: 'string',
              description: 'Explanation for quiz polls',
            },
          },
          required: ['question', 'options'],
        },
      },
      {
        name: 'send_reaction',
        description: 'Send a reaction (emoji) to a message',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: {
              type: 'number',
              description: 'ID of the message to react to',
            },
            emoji: {
              type: 'string',
              description: 'Emoji to send as reaction',
              default: '👍',
            },
          },
          required: ['message_id', 'emoji'],
        },
      },
      {
        name: 'pin_message',
        description: 'Pin a message in the channel',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: {
              type: 'number',
              description: 'ID of the message to pin',
            },
            disable_notification: {
              type: 'boolean',
              description: 'Whether to disable notification for pinned message',
              default: false,
            },
          },
          required: ['message_id'],
        },
      },
      {
        name: 'get_channel_info',
        description: 'Get information about the channel',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_chat_member_count',
        description: 'Get the number of members in the channel',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
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
        const photoResult = await bot.sendPhoto(CHANNEL_ID, args.photo_url, {
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
        const pollOptions: any = {
          question: args.question,
          options: args.options,
          is_anonymous: args.is_anonymous !== false,
          type: args.type || 'regular',
        };

        if (args.type === 'quiz' && args.correct_option_id !== undefined) {
          pollOptions.correct_option_id = args.correct_option_id;
          if (args.explanation) {
            pollOptions.explanation = args.explanation;
          }
        }

        const pollResult = await bot.sendPoll(CHANNEL_ID, pollOptions);
        return {
          content: [
            {
              type: 'text',
              text: `Poll created successfully! Message ID: ${pollResult.message_id}`,
            },
          ],
        };

      case 'send_reaction':
        await bot.setMessageReaction(CHANNEL_ID, args.message_id, [{ type: 'emoji', emoji: args.emoji }]);
        return {
          content: [
            {
              type: 'text',
              text: `Reaction sent successfully!`,
            },
          ],
        };

      case 'pin_message':
        await bot.pinChatMessage(CHANNEL_ID, args.message_id, {
          disable_notification: args.disable_notification || false,
        });
        return {
          content: [
            {
              type: 'text',
              text: `Message pinned successfully!`,
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

      case 'get_chat_member_count':
        const memberCount = await bot.getChatMemberCount(CHANNEL_ID);
        return {
          content: [
            {
              type: 'text',
              text: `Channel has ${memberCount} members`,
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start MCP Server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('Telegram MCP Server started');
}

main().catch(console.error);
