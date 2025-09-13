import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import TelegramBot from 'node-telegram-bot-api';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@mymcptest';

if (!TELEGRAM_BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN is not set in environment variables.');
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

// Create MCP server
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

// List available tools
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
              enum: ['HTML', 'Markdown'],
              description: 'Parse mode for the message',
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
              description: 'Photo caption',
            },
            parse_mode: {
              type: 'string',
              enum: ['HTML', 'Markdown'],
              description: 'Parse mode for the caption',
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
              description: 'Poll question',
            },
            options: {
              type: 'array',
              items: { type: 'string' },
              description: 'Poll options (2-10 items)',
            },
            is_anonymous: {
              type: 'boolean',
              description: 'Whether the poll is anonymous',
            },
            type: {
              type: 'string',
              enum: ['quiz', 'regular'],
              description: 'Poll type',
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
              description: 'ID of the message to react to',
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
              description: 'ID of the message to edit',
            },
            text: {
              type: 'string',
              description: 'New message text',
            },
            parse_mode: {
              type: 'string',
              enum: ['HTML', 'Markdown'],
              description: 'Parse mode for the message',
            },
          },
          required: ['message_id', 'text'],
        },
      },
      {
        name: 'delete_message',
        description: 'Delete a message',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: {
              type: 'number',
              description: 'ID of the message to delete',
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
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'send_message': {
        const { text, parse_mode = 'HTML' } = args as {
          text: string;
          parse_mode?: string;
        };
        
        const result = await bot.sendMessage(CHANNEL_ID, text, {
          parse_mode: parse_mode as any,
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message_id: result.message_id,
                text: result.text,
                date: result.date,
                channel: CHANNEL_ID,
              }),
            },
          ],
        };
      }

      case 'send_photo': {
        const { photo_url, caption, parse_mode = 'HTML' } = args as {
          photo_url: string;
          caption?: string;
          parse_mode?: string;
        };
        
        const result = await bot.sendPhoto(CHANNEL_ID, photo_url, {
          caption,
          parse_mode: parse_mode as any,
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message_id: result.message_id,
                photo: result.photo,
                caption: result.caption,
                channel: CHANNEL_ID,
              }),
            },
          ],
        };
      }

      case 'send_poll': {
        const { question, options, is_anonymous = true, type = 'regular' } = args as {
          question: string;
          options: string[];
          is_anonymous?: boolean;
          type?: string;
        };
        
        const result = await bot.sendPoll(CHANNEL_ID, question, options, {
          is_anonymous,
          type: type as any,
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message_id: result.message_id,
                poll: result.poll,
                channel: CHANNEL_ID,
              }),
            },
          ],
        };
      }

      case 'send_reaction': {
        const { message_id, emoji } = args as {
          message_id: number;
          emoji: string;
        };
        
        const result = await bot.setMessageReaction(CHANNEL_ID, message_id, {
          reaction: [{ type: 'emoji', emoji: emoji as any }],
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message_id,
                emoji,
                channel: CHANNEL_ID,
              }),
            },
          ],
        };
      }

      case 'edit_message': {
        const { message_id, text, parse_mode = 'HTML' } = args as {
          message_id: number;
          text: string;
          parse_mode?: string;
        };
        
        const result = await bot.editMessageText(text, {
          chat_id: CHANNEL_ID,
          message_id,
          parse_mode: parse_mode as any,
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message_id,
                text: typeof result === 'object' && result !== null ? (result as any).text : text,
                channel: CHANNEL_ID,
              }),
            },
          ],
        };
      }

      case 'delete_message': {
        const { message_id } = args as { message_id: number };
        
        const result = await bot.deleteMessage(CHANNEL_ID, message_id);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message_id,
                deleted: result,
                channel: CHANNEL_ID,
              }),
            },
          ],
        };
      }

      case 'get_channel_info': {
        const chat = await bot.getChat(CHANNEL_ID);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                channel: CHANNEL_ID,
                title: chat.title,
                type: chat.type,
                description: chat.description,
                username: chat.username,
              }),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message,
            tool: name,
          }),
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
  console.log('🚀 Telegram MCP Server running on stdio');
  console.log(`📱 Channel: ${CHANNEL_ID}`);
  console.log('✅ Ready for Make.com integration!');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
