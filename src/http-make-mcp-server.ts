import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import TelegramBot from 'node-telegram-bot-api';

const app = express();
app.use(express.json());
app.use(cors());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@mymcptest';

if (!TELEGRAM_BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN is not set in environment variables.');
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

// MCP Server Info
const serverInfo = {
  name: 'telegram-mcp-server',
  version: '1.0.0',
  capabilities: {
    tools: {}
  }
};

// Available tools
const tools = [
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
];

// Root endpoint - MCP Server Info
app.get('/', (req, res) => {
  res.json(serverInfo);
});

// MCP Server Info endpoint
app.get('/mcp', (req, res) => {
  res.json(serverInfo);
});

// List tools endpoint
app.get('/mcp/tools/list', (req, res) => {
  res.json({ tools });
});

// Call tool endpoint
app.post('/mcp/tools/call', async (req, res) => {
  try {
    const { name, arguments: args } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'Tool name is required',
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: 'Tool name is required',
            }),
          },
        ],
        isError: true,
      });
    }

    let result;

    switch (name) {
      case 'send_message': {
        const { text, parse_mode = 'HTML' } = args || {};
        
        if (!text) {
          throw new Error('Text is required for send_message');
        }
        
        const response = await bot.sendMessage(CHANNEL_ID, text, {
          parse_mode: parse_mode as any,
        });
        
        result = {
          success: true,
          message_id: response.message_id,
          text: response.text,
          date: response.date,
          channel: CHANNEL_ID,
        };
        break;
      }

      case 'send_photo': {
        const { photo_url, caption, parse_mode = 'HTML' } = args || {};
        
        if (!photo_url) {
          throw new Error('Photo URL is required for send_photo');
        }
        
        const response = await bot.sendPhoto(CHANNEL_ID, photo_url, {
          caption,
          parse_mode: parse_mode as any,
        });
        
        result = {
          success: true,
          message_id: response.message_id,
          photo: response.photo,
          caption: response.caption,
          channel: CHANNEL_ID,
        };
        break;
      }

      case 'send_poll': {
        const { question, options, is_anonymous = true, type = 'regular' } = args || {};
        
        if (!question || !options) {
          throw new Error('Question and options are required for send_poll');
        }
        
        const response = await bot.sendPoll(CHANNEL_ID, question, options, {
          is_anonymous,
          type: type as any,
        });
        
        result = {
          success: true,
          message_id: response.message_id,
          poll: response.poll,
          channel: CHANNEL_ID,
        };
        break;
      }

      case 'send_reaction': {
        const { message_id, emoji } = args || {};
        
        if (!message_id || !emoji) {
          throw new Error('Message ID and emoji are required for send_reaction');
        }
        
        await bot.setMessageReaction(CHANNEL_ID, message_id, {
          reaction: [{ type: 'emoji', emoji: emoji as any }],
        });
        
        result = {
          success: true,
          message_id,
          emoji,
          channel: CHANNEL_ID,
        };
        break;
      }

      case 'edit_message': {
        const { message_id, text, parse_mode = 'HTML' } = args || {};
        
        if (!message_id || !text) {
          throw new Error('Message ID and text are required for edit_message');
        }
        
        const response = await bot.editMessageText(text, {
          chat_id: CHANNEL_ID,
          message_id,
          parse_mode: parse_mode as any,
        });
        
        result = {
          success: true,
          message_id,
          text: typeof response === 'object' && response !== null ? (response as any).text : text,
          channel: CHANNEL_ID,
        };
        break;
      }

      case 'delete_message': {
        const { message_id } = args || {};
        
        if (!message_id) {
          throw new Error('Message ID is required for delete_message');
        }
        
        const response = await bot.deleteMessage(CHANNEL_ID, message_id);
        
        result = {
          success: true,
          message_id,
          deleted: response,
          channel: CHANNEL_ID,
        };
        break;
      }

      case 'get_channel_info': {
        const chat = await bot.getChat(CHANNEL_ID);
        
        result = {
          success: true,
          channel: CHANNEL_ID,
          title: chat.title,
          type: chat.type,
          description: chat.description,
          username: chat.username,
        };
        break;
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    res.json({
      content: [
        {
          type: 'text',
          text: JSON.stringify(result),
        },
      ],
    });

  } catch (error: any) {
    console.error('Tool execution error:', error);
    res.status(500).json({
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message,
            tool: req.body.name,
          }),
        },
      ],
      isError: true,
    });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const botInfo = await bot.getMe();
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      channel: CHANNEL_ID,
      bot_connected: !!botInfo,
      version: '1.0.0',
      mcp_server: true
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      version: '1.0.0',
      mcp_server: true
    });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('🚀 Telegram MCP HTTP Server v1.0.0 running on port', port);
  console.log(`📱 Channel: ${CHANNEL_ID}`);
  console.log(`🌐 API URL: http://localhost:${port}`);
  console.log(`📖 MCP Info: http://localhost:${port}/mcp`);
  console.log(`🔧 Tools: http://localhost:${port}/mcp/tools/list`);
  console.log('✅ Ready for Make.com integration!');
});
