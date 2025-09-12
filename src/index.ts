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
              description: 'Caption for the document',
            },
            parse_mode: {
              type: 'string',
              enum: ['HTML', 'Markdown', 'MarkdownV2'],
              description: 'Parse mode for the caption',
              default: 'HTML',
            },
          },
          required: ['document_url'],
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
        name: 'unpin_message',
        description: 'Unpin a message in the channel',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: {
              type: 'number',
              description: 'ID of the message to unpin',
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
      {
        name: 'send_media_group',
        description: 'Send multiple photos/videos as an album',
        inputSchema: {
          type: 'object',
          properties: {
            media: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['photo', 'video'] },
                  media: { type: 'string', description: 'URL or file_id of the media' },
                  caption: { type: 'string', description: 'Caption for this media item' },
                },
                required: ['type', 'media'],
              },
              minItems: 2,
              maxItems: 10,
              description: 'Array of media items (2-10 items)',
            },
          },
          required: ['media'],
        },
      },
      {
        name: 'edit_message',
        description: 'Edit a previously sent message',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: {
              type: 'number',
              description: 'ID of the message to edit',
            },
            text: {
              type: 'string',
              description: 'New text content',
            },
            parse_mode: {
              type: 'string',
              enum: ['HTML', 'Markdown', 'MarkdownV2'],
              description: 'Parse mode for the message',
              default: 'HTML',
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
              description: 'ID of the message to delete',
            },
          },
          required: ['message_id'],
        },
      },
      {
        name: 'send_venue',
        description: 'Send information about a venue',
        inputSchema: {
          type: 'object',
          properties: {
            latitude: {
              type: 'number',
              description: 'Latitude of the venue',
            },
            longitude: {
              type: 'number',
              description: 'Longitude of the venue',
            },
            title: {
              type: 'string',
              description: 'Name of the venue',
            },
            address: {
              type: 'string',
              description: 'Address of the venue',
            },
            foursquare_id: {
              type: 'string',
              description: 'Foursquare identifier of the venue',
            },
          },
          required: ['latitude', 'longitude', 'title', 'address'],
        },
      },
      {
        name: 'send_contact',
        description: 'Send a contact',
        inputSchema: {
          type: 'object',
          properties: {
            phone_number: {
              type: 'string',
              description: 'Contact phone number',
            },
            first_name: {
              type: 'string',
              description: 'Contact first name',
            },
            last_name: {
              type: 'string',
              description: 'Contact last name',
            },
            vcard: {
              type: 'string',
              description: 'Additional data about the contact in the form of a vCard',
            },
          },
          required: ['phone_number', 'first_name'],
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

      case 'send_document':
        const documentResult = await bot.sendDocument(CHANNEL_ID, args.document_url, {
          caption: args.caption,
          parse_mode: args.parse_mode || 'HTML',
        });
        return {
          content: [
            {
              type: 'text',
              text: `Document sent successfully! Message ID: ${documentResult.message_id}`,
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

      case 'unpin_message':
        await bot.unpinChatMessage(CHANNEL_ID, args.message_id);
        return {
          content: [
            {
              type: 'text',
              text: `Message unpinned successfully!`,
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

      case 'send_media_group':
        const mediaGroupResult = await bot.sendMediaGroup(CHANNEL_ID, args.media);
        return {
          content: [
            {
              type: 'text',
              text: `Media group sent successfully! Message IDs: ${mediaGroupResult.map(m => m.message_id).join(', ')}`,
            },
          ],
        };

      case 'edit_message':
        const editResult = await bot.editMessageText(args.text, {
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

      case 'send_venue':
        const venueResult = await bot.sendVenue(CHANNEL_ID, args.latitude, args.longitude, args.title, args.address, {
          foursquare_id: args.foursquare_id,
        });
        return {
          content: [
            {
              type: 'text',
              text: `Venue sent successfully! Message ID: ${venueResult.message_id}`,
            },
          ],
        };

      case 'send_contact':
        const contactResult = await bot.sendContact(CHANNEL_ID, args.phone_number, args.first_name, {
          last_name: args.last_name,
          vcard: args.vcard,
        });
        return {
          content: [
            {
              type: 'text',
              text: `Contact sent successfully! Message ID: ${contactResult.message_id}`,
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

// Health check endpoint for Railway
const port = process.env.PORT || 3000;
const app = express();

app.get('/health', (req: any, res: any) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Health check server running on port ${port}`);
});

// Start MCP Server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('Telegram MCP Server started');
}

main().catch(console.error);
