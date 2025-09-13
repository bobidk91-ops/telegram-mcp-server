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
  console.error('❌ TELEGRAM_BOT_TOKEN is not set in environment variables.');
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

// Create MCP server
const server = new Server(
  {
    name: 'telegram-mcp-server',
    version: '2.0.0',
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
              description: 'Parse mode for the message (HTML or Markdown)',
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
              minItems: 2,
              maxItems: 10,
              description: 'Poll options (2-10 items)',
            },
            is_anonymous: {
              type: 'boolean',
              description: 'Whether the poll is anonymous (default: true)',
            },
            type: {
              type: 'string',
              enum: ['quiz', 'regular'],
              description: 'Poll type (default: regular)',
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
              description: 'Emoji to send as reaction (e.g., 👍, ❤️, 😂)',
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
      {
        name: 'send_document',
        description: 'Send a document to the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            document_url: {
              type: 'string',
              description: 'URL of the document to send',
            },
            caption: {
              type: 'string',
              description: 'Document caption',
            },
            parse_mode: {
              type: 'string',
              enum: ['HTML', 'Markdown'],
              description: 'Parse mode for the caption',
            },
          },
          required: ['document_url'],
        },
      },
      {
        name: 'send_video',
        description: 'Send a video to the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            video_url: {
              type: 'string',
              description: 'URL of the video to send',
            },
            caption: {
              type: 'string',
              description: 'Video caption',
            },
            parse_mode: {
              type: 'string',
              enum: ['HTML', 'Markdown'],
              description: 'Parse mode for the caption',
            },
          },
          required: ['video_url'],
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
              text: `✅ Message sent successfully!\n\n📱 Channel: ${CHANNEL_ID}\n📝 Message ID: ${result.message_id}\n📄 Text: ${result.text}\n📅 Date: ${new Date(result.date * 1000).toLocaleString()}`,
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
              text: `✅ Photo sent successfully!\n\n📱 Channel: ${CHANNEL_ID}\n📝 Message ID: ${result.message_id}\n📷 Photo: ${result.photo?.[0]?.file_id}\n📄 Caption: ${caption || 'No caption'}`,
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
        
        if (options.length < 2 || options.length > 10) {
          throw new Error('Poll must have between 2 and 10 options');
        }
        
        const result = await bot.sendPoll(CHANNEL_ID, question, options, {
          is_anonymous,
          type: type as any,
        });
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Poll created successfully!\n\n📱 Channel: ${CHANNEL_ID}\n📝 Message ID: ${result.message_id}\n❓ Question: ${question}\n📊 Options: ${options.length}\n🔒 Anonymous: ${is_anonymous ? 'Yes' : 'No'}\n📋 Type: ${type}`,
            },
          ],
        };
      }

      case 'send_reaction': {
        const { message_id, emoji } = args as {
          message_id: number;
          emoji: string;
        };
        
        await bot.setMessageReaction(CHANNEL_ID, message_id, {
          reaction: [{ type: 'emoji', emoji: emoji as any }],
        });
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Reaction sent successfully!\n\n📱 Channel: ${CHANNEL_ID}\n📝 Message ID: ${message_id}\n😀 Emoji: ${emoji}`,
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
              text: `✅ Message edited successfully!\n\n📱 Channel: ${CHANNEL_ID}\n📝 Message ID: ${message_id}\n📄 New Text: ${text}`,
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
              text: `✅ Message deleted successfully!\n\n📱 Channel: ${CHANNEL_ID}\n📝 Message ID: ${message_id}`,
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
              text: `📱 Channel Information:\n\n🏷️ Title: ${chat.title}\n🆔 ID: ${chat.id}\n📝 Type: ${chat.type}\n👤 Username: ${chat.username || 'Not set'}\n📄 Description: ${chat.description || 'No description'}\n👥 Members: ${(chat as any).member_count || 'Unknown'}`,
            },
          ],
        };
      }

      case 'send_document': {
        const { document_url, caption, parse_mode = 'HTML' } = args as {
          document_url: string;
          caption?: string;
          parse_mode?: string;
        };
        
        const result = await bot.sendDocument(CHANNEL_ID, document_url, {
          caption,
          parse_mode: parse_mode as any,
        });
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Document sent successfully!\n\n📱 Channel: ${CHANNEL_ID}\n📝 Message ID: ${result.message_id}\n📄 Document: ${result.document?.file_id}\n📄 Caption: ${caption || 'No caption'}`,
            },
          ],
        };
      }

      case 'send_video': {
        const { video_url, caption, parse_mode = 'HTML' } = args as {
          video_url: string;
          caption?: string;
          parse_mode?: string;
        };
        
        const result = await bot.sendVideo(CHANNEL_ID, video_url, {
          caption,
          parse_mode: parse_mode as any,
        });
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Video sent successfully!\n\n📱 Channel: ${CHANNEL_ID}\n📝 Message ID: ${result.message_id}\n🎥 Video: ${result.video?.file_id}\n📄 Caption: ${caption || 'No caption'}`,
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
          text: `❌ Error executing tool "${name}":\n\n${error.message}\n\nPlease check your input and try again.`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  try {
    // Test bot connection
    const botInfo = await bot.getMe();
    console.log(`🤖 Bot connected: @${botInfo.username}`);
    console.log(`📱 Target channel: ${CHANNEL_ID}`);
    
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.log('🚀 Telegram MCP Server v2.0.0 running on stdio');
    console.log('✅ Ready for ChatGPT and Make.com integration!');
    console.log('📋 Available tools: send_message, send_photo, send_poll, send_reaction, edit_message, delete_message, get_channel_info, send_document, send_video');
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
