import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import TelegramBot from 'node-telegram-bot-api';
import { WordPressAPI, WordPressConfig } from './wordpress-api.js';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

// Get environment variables with fallback defaults for Railway
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0';
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@mymcptest';
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || 'j0CGX7JRiZOmEz1bEYvxZeRn1cS7qdFy5351PmDtZ01Wnby18AIeWt32';
const YANDEX_CLIENT_ID = process.env.YANDEX_CLIENT_ID || '11221f6ebd2d47649d42d9f4b282a876';
const YANDEX_CLIENT_SECRET = process.env.YANDEX_CLIENT_SECRET || 'eb793370893544d683bf277d14bfd842';
const YANDEX_LOGIN = process.env.YANDEX_LOGIN || 'bobi-dk91';
let YANDEX_OAUTH_TOKEN = process.env.YANDEX_OAUTH_TOKEN || '';

// WordPress Configuration
const WORDPRESS_URL = process.env.WORDPRESS_URL || '';
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME || '';
const WORDPRESS_PASSWORD = process.env.WORDPRESS_PASSWORD || '';
const WORDPRESS_APPLICATION_PASSWORD = process.env.WORDPRESS_APPLICATION_PASSWORD || '';

// Initialize WordPress API
let wordpressAPI: WordPressAPI | null = null;
if (WORDPRESS_URL && WORDPRESS_USERNAME && (WORDPRESS_PASSWORD || WORDPRESS_APPLICATION_PASSWORD)) {
  try {
    const wpConfig: WordPressConfig = {
      url: WORDPRESS_URL,
      username: WORDPRESS_USERNAME,
      password: WORDPRESS_PASSWORD,
      applicationPassword: WORDPRESS_APPLICATION_PASSWORD
    };
    wordpressAPI = new WordPressAPI(wpConfig);
    console.log('🌐 WordPress API initialized');
  } catch (error) {
    console.error('❌ Failed to initialize WordPress API:', error);
  }
}

// Log environment status
if (process.env.TELEGRAM_BOT_TOKEN) {
  console.log('🔧 Using TELEGRAM_BOT_TOKEN from environment variables');
} else {
  console.log('⚠️  Using default TELEGRAM_BOT_TOKEN (consider setting environment variable)');
}

if (process.env.TELEGRAM_CHANNEL_ID) {
  console.log('🔧 Using TELEGRAM_CHANNEL_ID from environment variables');
} else {
  console.log('⚠️  Using default TELEGRAM_CHANNEL_ID (consider setting environment variable)');
}

console.log('🔧 Environment variables:');
console.log('TELEGRAM_BOT_TOKEN:', TELEGRAM_BOT_TOKEN ? 'SET' : 'NOT SET');
console.log('TELEGRAM_CHANNEL_ID:', CHANNEL_ID);
console.log('PEXELS_API_KEY:', PEXELS_API_KEY ? 'SET' : 'NOT SET');
console.log('YANDEX_CLIENT_ID:', YANDEX_CLIENT_ID ? 'SET' : 'NOT SET');
console.log('YANDEX_OAUTH_TOKEN:', YANDEX_OAUTH_TOKEN ? 'SET' : 'NOT SET');
console.log('WORDPRESS_URL:', WORDPRESS_URL ? 'SET' : 'NOT SET');
console.log('WORDPRESS_USERNAME:', WORDPRESS_USERNAME ? 'SET' : 'NOT SET');
console.log('WORDPRESS_PASSWORD:', WORDPRESS_PASSWORD ? 'SET' : 'NOT SET');
console.log('WORDPRESS_APPLICATION_PASSWORD:', WORDPRESS_APPLICATION_PASSWORD ? 'SET' : 'NOT SET');

// Initialize Telegram Bot
let bot;
try {
  bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { 
    polling: false
  });
  console.log('🤖 Telegram Bot initialized');
} catch (error) {
  console.error('❌ Failed to initialize Telegram Bot:', error);
  bot = null;
}

// Pexels API helper functions
async function pexelsRequest(endpoint: string, params: any = {}) {
  const url = new URL(`https://api.pexels.com/v1${endpoint}`);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key].toString());
    }
  });

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': PEXELS_API_KEY,
      'User-Agent': 'Telegram-MCP-Server/2.1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Pexels API error: ${response.statusText}`);
  }

  return await response.json();
}

// Yandex Wordstat API helper functions
async function yandexWordstatRequest(method: string, params: any = {}) {
  if (!YANDEX_OAUTH_TOKEN) {
    throw new Error('Yandex OAuth token not set. Please authorize first using /yandex/auth endpoint');
  }

  const requestBody = {
    method: method,
    params: params
  };

  const response = await fetch('https://api.direct.yandex.com/json/v5/keywordsresearch', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${YANDEX_OAUTH_TOKEN}`,
      'Client-Login': YANDEX_LOGIN,
      'Content-Type': 'application/json',
      'Accept-Language': 'ru',
      'skipReportHeader': 'true',
      'skipColumnHeader': 'true'
    },
    body: JSON.stringify(requestBody)
  });

  const responseText = await response.text();
  
  if (!response.ok) {
    throw new Error(`Yandex API error (${response.status}): ${responseText}`);
  }

  try {
    return JSON.parse(responseText);
  } catch (e) {
    throw new Error(`Failed to parse Yandex API response: ${responseText}`);
  }
}

// OAuth helper to exchange code for token
async function getYandexOAuthToken(code: string) {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    client_id: YANDEX_CLIENT_ID,
    client_secret: YANDEX_CLIENT_SECRET
  });

  const response = await fetch('https://oauth.yandex.ru/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!response.ok) {
    throw new Error(`OAuth error: ${response.statusText}`);
  }

  const data = await response.json();
  YANDEX_OAUTH_TOKEN = data.access_token;
  return data;
}

// Root endpoint - GET
app.get('/', (req, res) => {
  res.json({
    name: 'telegram-mcp-server',
    version: '2.3.0',
    status: 'running',
    description: 'Telegram MCP Server v2.2.0 with Pexels, Yandex Wordstat & WordPress - HTTP API for ChatGPT and Make.com',
    environment: {
      TELEGRAM_BOT_TOKEN: TELEGRAM_BOT_TOKEN ? 'SET' : 'NOT SET',
      TELEGRAM_CHANNEL_ID: CHANNEL_ID,
      WORDPRESS_URL: WORDPRESS_URL ? 'SET' : 'NOT SET',
      WORDPRESS_USERNAME: WORDPRESS_USERNAME ? 'SET' : 'NOT SET',
      PEXELS_API_KEY: PEXELS_API_KEY ? 'SET' : 'NOT SET',
      YANDEX_OAUTH_TOKEN: YANDEX_OAUTH_TOKEN ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: process.env.PORT || 8080
    },
    endpoints: {
      info: '/mcp',
      tools: '/mcp/tools/list',
      call: '/mcp/tools/call',
      health: '/health'
    },
    channel: CHANNEL_ID
  });
});

// MCP tools/list endpoint - GET (for direct access)
app.get('/tools/list', (req, res) => {
  res.json({
    jsonrpc: '2.0',
    id: null,
    result: {
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
                enum: ['HTML', 'Markdown'],
                description: 'Parse mode for the caption',
              },
            },
            required: ['photo'],
          },
        },
        {
          name: 'send_video',
          description: 'Send a video to the Telegram channel',
          inputSchema: {
            type: 'object',
            properties: {
              video: {
                type: 'string',
                description: 'Video URL or file path',
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
            required: ['video'],
          },
        },
        {
          name: 'send_document',
          description: 'Send a document to the Telegram channel',
          inputSchema: {
            type: 'object',
            properties: {
              document: {
                type: 'string',
                description: 'Document URL or file path',
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
            required: ['document'],
          },
        },
        {
          name: 'send_poll',
          description: 'Send a poll to the Telegram channel',
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
                description: 'Poll options',
              },
              is_anonymous: {
                type: 'boolean',
                description: 'Whether the poll is anonymous',
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
              reaction: {
                type: 'string',
                description: 'Reaction emoji',
              },
            },
            required: ['message_id', 'reaction'],
          },
        },
        {
          name: 'edit_message',
          description: 'Edit a message text',
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
                description: 'Message ID to delete',
              },
            },
            required: ['message_id'],
          },
        },
        {
          name: 'pin_message',
          description: 'Pin a message',
          inputSchema: {
            type: 'object',
            properties: {
              message_id: {
                type: 'number',
                description: 'Message ID to pin',
              },
            },
            required: ['message_id'],
          },
        },
        {
          name: 'unpin_message',
          description: 'Unpin a message',
          inputSchema: {
            type: 'object',
            properties: {
              message_id: {
                type: 'number',
                description: 'Message ID to unpin',
              },
            },
            required: ['message_id'],
          },
        },
        {
          name: 'get_channel_info',
          description: 'Get channel information',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_channel_stats',
          description: 'Get channel statistics',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ]
    }
  });
});

// Root endpoint - POST (for Make.com MCP connection)
app.post('/', async (req, res) => {
  console.log('📨 POST request to root endpoint:', JSON.stringify(req.body, null, 2));
  
  // Handle MCP protocol requests
  const { jsonrpc, method, params, id } = req.body;
  
  // Validate MCP request format
  if (!jsonrpc || jsonrpc !== '2.0') {
    console.log('❌ Invalid JSON-RPC version:', jsonrpc);
    res.status(400).json({
      jsonrpc: '2.0',
      id: id || null,
      error: {
        code: -32600,
        message: 'Invalid Request: jsonrpc must be "2.0"'
      }
    });
    return;
  }
  
  if (!method) {
    console.log('❌ Missing method in request');
    res.status(400).json({
      jsonrpc: '2.0',
      id: id || null,
      error: {
        code: -32600,
        message: 'Invalid Request: method is required'
      }
    });
    return;
  }
  
  if (jsonrpc === '2.0' && method) {
    // This is an MCP request
    switch (method) {
      case 'initialize':
        res.json({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {}
            },
            serverInfo: {
              name: 'telegram-mcp-server',
              version: '2.2.0'
            }
          }
        });
        break;
        
      case 'tools/list':
        res.json({
          jsonrpc: '2.0',
          id,
          result: {
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
                      enum: ['HTML', 'Markdown'],
                      description: 'Parse mode for the caption',
                    },
                  },
                  required: ['photo'],
                },
              },
              {
                name: 'send_video',
                description: 'Send a video to the Telegram channel',
                inputSchema: {
                  type: 'object',
                  properties: {
                    video: {
                      type: 'string',
                      description: 'Video URL or file path',
                    },
                    caption: {
                      type: 'string',
                      description: 'Video caption',
                    },
                    duration: {
                      type: 'number',
                      description: 'Video duration in seconds',
                    },
                    width: {
                      type: 'number',
                      description: 'Video width',
                    },
                    height: {
                      type: 'number',
                      description: 'Video height',
                    },
                  },
                  required: ['video'],
                },
              },
              {
                name: 'send_document',
                description: 'Send a document to the Telegram channel',
                inputSchema: {
                  type: 'object',
                  properties: {
                    document: {
                      type: 'string',
                      description: 'Document URL or file path',
                    },
                    caption: {
                      type: 'string',
                      description: 'Document caption',
                    },
                    filename: {
                      type: 'string',
                      description: 'Custom filename for the document',
                    },
                  },
                  required: ['document'],
                },
              },
              {
                name: 'send_poll',
                description: 'Send a poll to the Telegram channel',
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
                      description: 'Poll options (2-10 options)',
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
                    correct_option_id: {
                      type: 'number',
                      description: 'Correct option ID for quiz polls',
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
                      description: 'Emoji to react with',
                    },
                  },
                  required: ['message_id', 'emoji'],
                },
              },
              {
                name: 'edit_message',
                description: 'Edit a message in the Telegram channel',
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
                      enum: ['HTML', 'Markdown'],
                      description: 'Parse mode for the message',
                    },
                  },
                  required: ['message_id', 'text'],
                },
              },
              {
                name: 'delete_message',
                description: 'Delete a message from the Telegram channel',
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
                name: 'pin_message',
                description: 'Pin a message in the Telegram channel',
                inputSchema: {
                  type: 'object',
                  properties: {
                    message_id: {
                      type: 'number',
                      description: 'Message ID to pin',
                    },
                    disable_notification: {
                      type: 'boolean',
                      description: 'Whether to disable notification for pinned message',
                    },
                  },
                  required: ['message_id'],
                },
              },
              {
                name: 'unpin_message',
                description: 'Unpin a message in the Telegram channel',
                inputSchema: {
                  type: 'object',
                  properties: {
                    message_id: {
                      type: 'number',
                      description: 'Message ID to unpin (optional, unpins all if not specified)',
                    },
                  },
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
                name: 'get_channel_stats',
                description: 'Get channel statistics and member count',
                inputSchema: {
                  type: 'object',
                  properties: {},
                },
              },
              {
                name: 'pexels_search_photos',
                description: 'Search for photos on Pexels by query',
                inputSchema: {
                  type: 'object',
                  properties: {
                    query: {
                      type: 'string',
                      description: 'Search query (e.g., "nature", "cats", "city")',
                    },
                    per_page: {
                      type: 'number',
                      description: 'Number of results per page (1-80, default: 15)',
                    },
                    page: {
                      type: 'number',
                      description: 'Page number (default: 1)',
                    },
                    orientation: {
                      type: 'string',
                      enum: ['landscape', 'portrait', 'square'],
                      description: 'Photo orientation filter',
                    },
                    size: {
                      type: 'string',
                      enum: ['large', 'medium', 'small'],
                      description: 'Minimum photo size',
                    },
                    color: {
                      type: 'string',
                      description: 'Desired photo color (e.g., "red", "blue", "#FF0000")',
                    },
                  },
                  required: ['query'],
                },
              },
              {
                name: 'pexels_get_photo',
                description: 'Get a specific photo by ID from Pexels',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'number',
                      description: 'Photo ID from Pexels',
                    },
                  },
                  required: ['id'],
                },
              },
              {
                name: 'pexels_curated_photos',
                description: 'Get curated photos from Pexels',
                inputSchema: {
                  type: 'object',
                  properties: {
                    per_page: {
                      type: 'number',
                      description: 'Number of results per page (1-80, default: 15)',
                    },
                    page: {
                      type: 'number',
                      description: 'Page number (default: 1)',
                    },
                  },
                },
              },
              {
                name: 'pexels_search_videos',
                description: 'Search for videos on Pexels by query',
                inputSchema: {
                  type: 'object',
                  properties: {
                    query: {
                      type: 'string',
                      description: 'Search query (e.g., "nature", "ocean", "city")',
                    },
                    per_page: {
                      type: 'number',
                      description: 'Number of results per page (1-80, default: 15)',
                    },
                    page: {
                      type: 'number',
                      description: 'Page number (default: 1)',
                    },
                    orientation: {
                      type: 'string',
                      enum: ['landscape', 'portrait', 'square'],
                      description: 'Video orientation filter',
                    },
                    size: {
                      type: 'string',
                      enum: ['large', 'medium', 'small'],
                      description: 'Minimum video size',
                    },
                  },
                  required: ['query'],
                },
              },
              {
                name: 'pexels_popular_videos',
                description: 'Get popular videos from Pexels',
                inputSchema: {
                  type: 'object',
                  properties: {
                    per_page: {
                      type: 'number',
                      description: 'Number of results per page (1-80, default: 15)',
                    },
                    page: {
                      type: 'number',
                      description: 'Page number (default: 1)',
                    },
                  },
                },
              },
              {
                name: 'yandex_wordstat_search',
                description: 'Search Yandex Wordstat for keyword statistics',
                inputSchema: {
                  type: 'object',
                  properties: {
                    phrases: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Keywords to search (1-10 phrases)',
                    },
                    geo_ids: {
                      type: 'array',
                      items: { type: 'number' },
                      description: 'Geo IDs (225=Russia, 213=Moscow, 2=SPb)',
                    },
                  },
                  required: ['phrases'],
                },
              },
              {
                name: 'yandex_wordstat_keywords',
                description: 'Get keyword suggestions from Yandex Wordstat',
                inputSchema: {
                  type: 'object',
                  properties: {
                    phrase: {
                      type: 'string',
                      description: 'Base keyword for suggestions',
                    },
                    geo_ids: {
                      type: 'array',
                      items: { type: 'number' },
                      description: 'Geo IDs (default: [225] Russia)',
                    },
                  },
                  required: ['phrase'],
                },
              },
              {
                name: 'yandex_wordstat_related',
                description: 'Get related search queries from Yandex Wordstat',
                inputSchema: {
                  type: 'object',
                  properties: {
                    phrase: {
                      type: 'string',
                      description: 'Base keyword for related queries',
                    },
                    geo_ids: {
                      type: 'array',
                      items: { type: 'number' },
                      description: 'Geo IDs (default: [225] Russia)',
                    },
                  },
                  required: ['phrase'],
                },
              },
              // WordPress Posts
              {
                name: 'wordpress_get_posts',
                description: 'Get WordPress posts with optional filtering',
                inputSchema: {
                  type: 'object',
                  properties: {
                    page: { type: 'number', description: 'Page number (default: 1)' },
                    per_page: { type: 'number', description: 'Posts per page (default: 10, max: 100)' },
                    search: { type: 'string', description: 'Search query' },
                    status: { type: 'string', description: 'Post status (publish, draft, private, pending)' },
                    categories: { type: 'array', items: { type: 'number' }, description: 'Category IDs' },
                    tags: { type: 'array', items: { type: 'number' }, description: 'Tag IDs' },
                    author: { type: 'number', description: 'Author ID' },
                    order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order' },
                    orderby: { type: 'string', enum: ['date', 'id', 'include', 'relevance', 'slug', 'title'], description: 'Sort by field' }
                  }
                }
              },
              {
                name: 'wordpress_get_post',
                description: 'Get a specific WordPress post by ID',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Post ID' }
                  },
                  required: ['id']
                }
              },
              {
                name: 'wordpress_create_post',
                description: 'Create a new WordPress post',
                inputSchema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', description: 'Post title' },
                    content: { type: 'string', description: 'Post content (HTML)' },
                    excerpt: { type: 'string', description: 'Post excerpt' },
                    status: { type: 'string', enum: ['publish', 'draft', 'private', 'pending'], description: 'Post status' },
                    slug: { type: 'string', description: 'Post slug' },
                    categories: { type: 'array', items: { type: 'number' }, description: 'Category IDs' },
                    tags: { type: 'array', items: { type: 'number' }, description: 'Tag IDs' },
                    featured_media: { type: 'number', description: 'Featured media ID' },
                    author: { type: 'number', description: 'Author ID' },
                    sticky: { type: 'boolean', description: 'Make post sticky' },
                    comment_status: { type: 'string', enum: ['open', 'closed'], description: 'Comment status' },
                    ping_status: { type: 'string', enum: ['open', 'closed'], description: 'Ping status' }
                  },
                  required: ['title', 'content']
                }
              },
              {
                name: 'wordpress_update_post',
                description: 'Update an existing WordPress post',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Post ID' },
                    title: { type: 'string', description: 'Post title' },
                    content: { type: 'string', description: 'Post content (HTML)' },
                    excerpt: { type: 'string', description: 'Post excerpt' },
                    status: { type: 'string', enum: ['publish', 'draft', 'private', 'pending'], description: 'Post status' },
                    slug: { type: 'string', description: 'Post slug' },
                    categories: { type: 'array', items: { type: 'number' }, description: 'Category IDs' },
                    tags: { type: 'array', items: { type: 'number' }, description: 'Tag IDs' },
                    featured_media: { type: 'number', description: 'Featured media ID' },
                    author: { type: 'number', description: 'Author ID' },
                    sticky: { type: 'boolean', description: 'Make post sticky' },
                    comment_status: { type: 'string', enum: ['open', 'closed'], description: 'Comment status' },
                    ping_status: { type: 'string', enum: ['open', 'closed'], description: 'Ping status' }
                  },
                  required: ['id']
                }
              },
              {
                name: 'wordpress_delete_post',
                description: 'Delete a WordPress post',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Post ID' },
                    force: { type: 'boolean', description: 'Force delete (bypass trash)' }
                  },
                  required: ['id']
                }
              },
              // WordPress Pages
              {
                name: 'wordpress_get_pages',
                description: 'Get WordPress pages with optional filtering',
                inputSchema: {
                  type: 'object',
                  properties: {
                    page: { type: 'number', description: 'Page number (default: 1)' },
                    per_page: { type: 'number', description: 'Pages per page (default: 10, max: 100)' },
                    search: { type: 'string', description: 'Search query' },
                    status: { type: 'string', description: 'Page status (publish, draft, private, pending)' },
                    parent: { type: 'number', description: 'Parent page ID' },
                    author: { type: 'number', description: 'Author ID' },
                    order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order' },
                    orderby: { type: 'string', enum: ['date', 'id', 'include', 'relevance', 'slug', 'title'], description: 'Sort by field' }
                  }
                }
              },
              {
                name: 'wordpress_get_page',
                description: 'Get a specific WordPress page by ID',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Page ID' }
                  },
                  required: ['id']
                }
              },
              {
                name: 'wordpress_create_page',
                description: 'Create a new WordPress page',
                inputSchema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', description: 'Page title' },
                    content: { type: 'string', description: 'Page content (HTML)' },
                    excerpt: { type: 'string', description: 'Page excerpt' },
                    status: { type: 'string', enum: ['publish', 'draft', 'private', 'pending'], description: 'Page status' },
                    slug: { type: 'string', description: 'Page slug' },
                    parent: { type: 'number', description: 'Parent page ID' },
                    menu_order: { type: 'number', description: 'Menu order' },
                    featured_media: { type: 'number', description: 'Featured media ID' },
                    author: { type: 'number', description: 'Author ID' },
                    template: { type: 'string', description: 'Page template' },
                    comment_status: { type: 'string', enum: ['open', 'closed'], description: 'Comment status' },
                    ping_status: { type: 'string', enum: ['open', 'closed'], description: 'Ping status' }
                  },
                  required: ['title', 'content']
                }
              },
              {
                name: 'wordpress_update_page',
                description: 'Update an existing WordPress page',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Page ID' },
                    title: { type: 'string', description: 'Page title' },
                    content: { type: 'string', description: 'Page content (HTML)' },
                    excerpt: { type: 'string', description: 'Page excerpt' },
                    status: { type: 'string', enum: ['publish', 'draft', 'private', 'pending'], description: 'Page status' },
                    slug: { type: 'string', description: 'Page slug' },
                    parent: { type: 'number', description: 'Parent page ID' },
                    menu_order: { type: 'number', description: 'Menu order' },
                    featured_media: { type: 'number', description: 'Featured media ID' },
                    author: { type: 'number', description: 'Author ID' },
                    template: { type: 'string', description: 'Page template' },
                    comment_status: { type: 'string', enum: ['open', 'closed'], description: 'Comment status' },
                    ping_status: { type: 'string', enum: ['open', 'closed'], description: 'Ping status' }
                  },
                  required: ['id']
                }
              },
              {
                name: 'wordpress_delete_page',
                description: 'Delete a WordPress page',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Page ID' },
                    force: { type: 'boolean', description: 'Force delete (bypass trash)' }
                  },
                  required: ['id']
                }
              },
              // WordPress Media
              {
                name: 'wordpress_get_media',
                description: 'Get WordPress media items with optional filtering',
                inputSchema: {
                  type: 'object',
                  properties: {
                    page: { type: 'number', description: 'Page number (default: 1)' },
                    per_page: { type: 'number', description: 'Media per page (default: 10, max: 100)' },
                    search: { type: 'string', description: 'Search query' },
                    media_type: { type: 'string', enum: ['image', 'video', 'audio', 'application'], description: 'Media type' },
                    mime_type: { type: 'string', description: 'MIME type filter' },
                    parent: { type: 'number', description: 'Parent post/page ID' },
                    author: { type: 'number', description: 'Author ID' },
                    order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order' },
                    orderby: { type: 'string', enum: ['date', 'id', 'include', 'relevance', 'slug', 'title'], description: 'Sort by field' }
                  }
                }
              },
              {
                name: 'wordpress_get_media_item',
                description: 'Get a specific WordPress media item by ID',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Media ID' }
                  },
                  required: ['id']
                }
              },
              {
                name: 'wordpress_upload_media',
                description: 'Upload a media file to WordPress',
                inputSchema: {
                  type: 'object',
                  properties: {
                    file_url: { type: 'string', description: 'URL of the file to upload' },
                    filename: { type: 'string', description: 'Filename for the uploaded file' },
                    title: { type: 'string', description: 'Media title' },
                    alt_text: { type: 'string', description: 'Alt text for images' },
                    caption: { type: 'string', description: 'Media caption' },
                    description: { type: 'string', description: 'Media description' }
                  },
                  required: ['file_url', 'filename']
                }
              },
              {
                name: 'wordpress_upload_media_binary',
                description: 'Upload a media file directly as binary data to WordPress (more efficient for large files)',
                inputSchema: {
                  type: 'object',
                  properties: {
                    file_data: { type: 'string', description: 'Base64 encoded file data' },
                    filename: { type: 'string', description: 'Filename for the uploaded file' },
                    mime_type: { type: 'string', description: 'MIME type of the file (e.g., image/png, image/jpeg)' },
                    title: { type: 'string', description: 'Media title' },
                    alt_text: { type: 'string', description: 'Alt text for images' },
                    caption: { type: 'string', description: 'Media caption' },
                    description: { type: 'string', description: 'Media description' }
                  },
                  required: ['file_data', 'filename', 'mime_type']
                }
              },
              {
                name: 'wordpress_update_media_metadata',
                description: 'Update media metadata (alt_text, caption, description)',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Media ID' },
                    title: { type: 'string', description: 'Media title' },
                    alt_text: { type: 'string', description: 'Alt text for images' },
                    caption: { type: 'string', description: 'Media caption' },
                    description: { type: 'string', description: 'Media description' }
                  },
                  required: ['id']
                }
              },
              {
                name: 'wordpress_upload_media_direct',
                description: 'Upload a media file directly as binary data to WordPress without JSON (for large files)',
                inputSchema: {
                  type: 'object',
                  properties: {
                    file_data: { type: 'string', description: 'Base64 encoded file data' },
                    filename: { type: 'string', description: 'Filename for the uploaded file' },
                    mime_type: { type: 'string', description: 'MIME type of the file (e.g., image/png, image/jpeg)' },
                    title: { type: 'string', description: 'Media title' },
                    alt_text: { type: 'string', description: 'Alt text for images' },
                    caption: { type: 'string', description: 'Media caption' },
                    description: { type: 'string', description: 'Media description' }
                  },
                  required: ['file_data', 'filename', 'mime_type']
                }
              },
              {
                name: 'wordpress_update_media',
                description: 'Update a WordPress media item',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Media ID' },
                    title: { type: 'string', description: 'Media title' },
                    alt_text: { type: 'string', description: 'Alt text for images' },
                    caption: { type: 'string', description: 'Media caption' },
                    description: { type: 'string', description: 'Media description' }
                  },
                  required: ['id']
                }
              },
              {
                name: 'wordpress_delete_media',
                description: 'Delete a WordPress media item',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Media ID' },
                    force: { type: 'boolean', description: 'Force delete (bypass trash)' }
                  },
                  required: ['id']
                }
              },
              // WordPress Categories
              {
                name: 'wordpress_get_categories',
                description: 'Get WordPress categories',
                inputSchema: {
                  type: 'object',
                  properties: {
                    page: { type: 'number', description: 'Page number (default: 1)' },
                    per_page: { type: 'number', description: 'Categories per page (default: 10, max: 100)' },
                    search: { type: 'string', description: 'Search query' },
                    hide_empty: { type: 'boolean', description: 'Hide empty categories' },
                    parent: { type: 'number', description: 'Parent category ID' },
                    post: { type: 'number', description: 'Post ID to get categories for' },
                    order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order' },
                    orderby: { type: 'string', enum: ['id', 'include', 'name', 'slug', 'term_group', 'description', 'count'], description: 'Sort by field' }
                  }
                }
              },
              {
                name: 'wordpress_get_category',
                description: 'Get a specific WordPress category by ID',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Category ID' }
                  },
                  required: ['id']
                }
              },
              {
                name: 'wordpress_create_category',
                description: 'Create a new WordPress category',
                inputSchema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', description: 'Category name' },
                    description: { type: 'string', description: 'Category description' },
                    slug: { type: 'string', description: 'Category slug' },
                    parent: { type: 'number', description: 'Parent category ID' }
                  },
                  required: ['name']
                }
              },
              {
                name: 'wordpress_update_category',
                description: 'Update a WordPress category',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Category ID' },
                    name: { type: 'string', description: 'Category name' },
                    description: { type: 'string', description: 'Category description' },
                    slug: { type: 'string', description: 'Category slug' },
                    parent: { type: 'number', description: 'Parent category ID' }
                  },
                  required: ['id']
                }
              },
              {
                name: 'wordpress_delete_category',
                description: 'Delete a WordPress category',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Category ID' },
                    force: { type: 'boolean', description: 'Force delete' }
                  },
                  required: ['id']
                }
              },
              // WordPress Tags
              {
                name: 'wordpress_get_tags',
                description: 'Get WordPress tags',
                inputSchema: {
                  type: 'object',
                  properties: {
                    page: { type: 'number', description: 'Page number (default: 1)' },
                    per_page: { type: 'number', description: 'Tags per page (default: 10, max: 100)' },
                    search: { type: 'string', description: 'Search query' },
                    hide_empty: { type: 'boolean', description: 'Hide empty tags' },
                    post: { type: 'number', description: 'Post ID to get tags for' },
                    order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order' },
                    orderby: { type: 'string', enum: ['id', 'include', 'name', 'slug', 'term_group', 'description', 'count'], description: 'Sort by field' }
                  }
                }
              },
              {
                name: 'wordpress_get_tag',
                description: 'Get a specific WordPress tag by ID',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Tag ID' }
                  },
                  required: ['id']
                }
              },
              {
                name: 'wordpress_create_tag',
                description: 'Create a new WordPress tag',
                inputSchema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', description: 'Tag name' },
                    description: { type: 'string', description: 'Tag description' },
                    slug: { type: 'string', description: 'Tag slug' }
                  },
                  required: ['name']
                }
              },
              {
                name: 'wordpress_update_tag',
                description: 'Update a WordPress tag',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Tag ID' },
                    name: { type: 'string', description: 'Tag name' },
                    description: { type: 'string', description: 'Tag description' },
                    slug: { type: 'string', description: 'Tag slug' }
                  },
                  required: ['id']
                }
              },
              {
                name: 'wordpress_delete_tag',
                description: 'Delete a WordPress tag',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Tag ID' },
                    force: { type: 'boolean', description: 'Force delete' }
                  },
                  required: ['id']
                }
              },
              // WordPress Users
              {
                name: 'wordpress_get_users',
                description: 'Get WordPress users',
                inputSchema: {
                  type: 'object',
                  properties: {
                    page: { type: 'number', description: 'Page number (default: 1)' },
                    per_page: { type: 'number', description: 'Users per page (default: 10, max: 100)' },
                    search: { type: 'string', description: 'Search query' },
                    roles: { type: 'array', items: { type: 'string' }, description: 'User roles' },
                    who: { type: 'string', enum: ['authors'], description: 'Filter by user type' },
                    order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order' },
                    orderby: { type: 'string', enum: ['id', 'include', 'name', 'registered_date', 'slug', 'email', 'url'], description: 'Sort by field' }
                  }
                }
              },
              {
                name: 'wordpress_get_user',
                description: 'Get a specific WordPress user by ID',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'User ID' }
                  },
                  required: ['id']
                }
              },
              {
                name: 'wordpress_create_user',
                description: 'Create a new WordPress user',
                inputSchema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string', description: 'Username' },
                    email: { type: 'string', description: 'Email address' },
                    password: { type: 'string', description: 'Password' },
                    first_name: { type: 'string', description: 'First name' },
                    last_name: { type: 'string', description: 'Last name' },
                    name: { type: 'string', description: 'Display name' },
                    url: { type: 'string', description: 'Website URL' },
                    description: { type: 'string', description: 'User description' },
                    roles: { type: 'array', items: { type: 'string' }, description: 'User roles' }
                  },
                  required: ['username', 'email', 'password']
                }
              },
              {
                name: 'wordpress_update_user',
                description: 'Update a WordPress user',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'User ID' },
                    username: { type: 'string', description: 'Username' },
                    email: { type: 'string', description: 'Email address' },
                    password: { type: 'string', description: 'Password' },
                    first_name: { type: 'string', description: 'First name' },
                    last_name: { type: 'string', description: 'Last name' },
                    name: { type: 'string', description: 'Display name' },
                    url: { type: 'string', description: 'Website URL' },
                    description: { type: 'string', description: 'User description' },
                    roles: { type: 'array', items: { type: 'string' }, description: 'User roles' }
                  },
                  required: ['id']
                }
              },
              {
                name: 'wordpress_delete_user',
                description: 'Delete a WordPress user',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'User ID' },
                    force: { type: 'boolean', description: 'Force delete' },
                    reassign: { type: 'number', description: 'Reassign posts to this user ID' }
                  },
                  required: ['id']
                }
              },
              // WordPress Comments
              {
                name: 'wordpress_get_comments',
                description: 'Get WordPress comments',
                inputSchema: {
                  type: 'object',
                  properties: {
                    page: { type: 'number', description: 'Page number (default: 1)' },
                    per_page: { type: 'number', description: 'Comments per page (default: 10, max: 100)' },
                    search: { type: 'string', description: 'Search query' },
                    post: { type: 'number', description: 'Post ID' },
                    status: { type: 'string', enum: ['hold', 'approve', 'spam', 'trash'], description: 'Comment status' },
                    parent: { type: 'number', description: 'Parent comment ID' },
                    author: { type: 'number', description: 'Author ID' },
                    order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order' },
                    orderby: { type: 'string', enum: ['date', 'date_gmt', 'id', 'include', 'post', 'parent', 'type'], description: 'Sort by field' }
                  }
                }
              },
              {
                name: 'wordpress_get_comment',
                description: 'Get a specific WordPress comment by ID',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Comment ID' }
                  },
                  required: ['id']
                }
              },
              {
                name: 'wordpress_create_comment',
                description: 'Create a new WordPress comment',
                inputSchema: {
                  type: 'object',
                  properties: {
                    post: { type: 'number', description: 'Post ID' },
                    content: { type: 'string', description: 'Comment content' },
                    author_name: { type: 'string', description: 'Author name' },
                    author_email: { type: 'string', description: 'Author email' },
                    author_url: { type: 'string', description: 'Author website' },
                    parent: { type: 'number', description: 'Parent comment ID' },
                    status: { type: 'string', enum: ['hold', 'approve', 'spam', 'trash'], description: 'Comment status' }
                  },
                  required: ['post', 'content']
                }
              },
              {
                name: 'wordpress_update_comment',
                description: 'Update a WordPress comment',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Comment ID' },
                    content: { type: 'string', description: 'Comment content' },
                    author_name: { type: 'string', description: 'Author name' },
                    author_email: { type: 'string', description: 'Author email' },
                    author_url: { type: 'string', description: 'Author website' },
                    status: { type: 'string', enum: ['hold', 'approve', 'spam', 'trash'], description: 'Comment status' }
                  },
                  required: ['id']
                }
              },
              {
                name: 'wordpress_delete_comment',
                description: 'Delete a WordPress comment',
                inputSchema: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', description: 'Comment ID' },
                    force: { type: 'boolean', description: 'Force delete (bypass trash)' }
                  },
                  required: ['id']
                }
              },
              // WordPress Site Info
              {
                name: 'wordpress_get_site_info',
                description: 'Get WordPress site information',
                inputSchema: {
                  type: 'object',
                  properties: {}
                }
              },
              {
                name: 'wordpress_get_settings',
                description: 'Get WordPress site settings',
                inputSchema: {
                  type: 'object',
                  properties: {}
                }
              },
              {
                name: 'wordpress_search',
                description: 'Search WordPress content',
                inputSchema: {
                  type: 'object',
                  properties: {
                    query: { type: 'string', description: 'Search query' },
                    type: { type: 'string', enum: ['post', 'page', 'attachment', 'any'], description: 'Content type to search' }
                  },
                  required: ['query']
                }
              },
              {
                name: 'wordpress_test_connection',
                description: 'Test WordPress connection',
                inputSchema: {
                  type: 'object',
                  properties: {}
                }
              },
            ]
          }
        });
        break;
        
      case 'tools/call':
        const { name, arguments: args } = params || {};
        
        if (!name) {
          res.json({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32602,
              message: 'Tool name is required'
            }
          });
          return;
        }
        
        let result;
        
        switch (name) {
          case 'send_message': {
            const { text, parse_mode = 'HTML' } = args || {};
            
            if (!text) {
              result = {
                success: false,
                error: 'Text is required for send_message'
              };
            } else if (!bot) {
              result = {
                success: false,
                error: 'Telegram Bot not initialized. Check bot token.'
              };
            } else {
              try {
                // Ensure proper UTF-8 encoding
                const encodedText = Buffer.from(text, 'utf8').toString('utf8');
                const response = await bot.sendMessage(CHANNEL_ID, encodedText, {
                  parse_mode: parse_mode as any,
                });
                
                result = {
                  success: true,
                  message: 'Message sent to Telegram successfully!',
                  message_id: response.message_id,
                  text: response.text,
                  channel: CHANNEL_ID,
                  date: response.date,
                  timestamp: new Date(response.date * 1000).toLocaleString()
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to send message: ${error.message}`,
                  details: error.response?.body || error.message
                };
              }
            }
            break;
          }

          case 'send_photo': {
            const { photo, caption, parse_mode = 'HTML' } = args || {};
            
            if (!photo) {
              result = {
                success: false,
                error: 'Photo URL is required for send_photo'
              };
            } else if (!bot) {
              result = {
                success: false,
                error: 'Telegram Bot not initialized. Check bot token.'
              };
            } else {
              try {
                const response = await bot.sendPhoto(CHANNEL_ID, photo, {
                  caption,
                  parse_mode: parse_mode as any,
                });
                
                result = {
                  success: true,
                  message: 'Photo sent to Telegram successfully!',
                  message_id: response.message_id,
                  photo: response.photo,
                  caption: response.caption,
                  channel: CHANNEL_ID,
                  date: response.date,
                  timestamp: new Date(response.date * 1000).toLocaleString()
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to send photo: ${error.message}`,
                  details: error.response?.body || error.message
                };
              }
            }
            break;
          }

          case 'send_photo_binary': {
            const { file_data, filename, caption, parse_mode = 'HTML' } = args || {};
            
            if (!file_data || !filename) {
              result = {
                success: false,
                error: 'File data and filename are required for send_photo_binary'
              };
            } else if (!bot) {
              result = {
                success: false,
                error: 'Telegram Bot not initialized. Check bot token.'
              };
            } else {
              try {
                // Convert base64 to Buffer
                const fileBuffer = Buffer.from(file_data, 'base64');
                
                // Create a readable stream from buffer
                const { Readable } = await import('stream');
                const stream = new Readable({
                  read() {
                    this.push(fileBuffer);
                    this.push(null);
                  }
                });
                
                const response = await bot.sendPhoto(CHANNEL_ID, stream, {
                  caption,
                  parse_mode: parse_mode as any,
                });
                
                result = {
                  success: true,
                  message: 'Binary photo sent to Telegram successfully!',
                  message_id: response.message_id,
                  photo: response.photo,
                  caption: response.caption,
                  channel: CHANNEL_ID,
                  date: response.date,
                  timestamp: new Date(response.date * 1000).toLocaleString()
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to send binary photo: ${error.message}`,
                  details: error.response?.body || error.message
                };
              }
            }
            break;
          }

          case 'send_video': {
            const { video, caption, duration, width, height, parse_mode = 'HTML' } = args || {};
            
            if (!video) {
              result = {
                success: false,
                error: 'Video URL is required for send_video'
              };
            } else if (!bot) {
              result = {
                success: false,
                error: 'Telegram Bot not initialized. Check bot token.'
              };
            } else {
              try {
                const response = await bot.sendVideo(CHANNEL_ID, video, {
                  caption,
                  duration,
                  width,
                  height,
                  parse_mode: parse_mode as any,
                });
                
                result = {
                  success: true,
                  message: 'Video sent to Telegram successfully!',
                  message_id: response.message_id,
                  video: response.video,
                  caption: response.caption,
                  channel: CHANNEL_ID,
                  date: response.date,
                  timestamp: new Date(response.date * 1000).toLocaleString()
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to send video: ${error.message}`,
                  details: error.response?.body || error.message
                };
              }
            }
            break;
          }

          case 'send_document': {
            const { document, caption, filename, parse_mode = 'HTML' } = args || {};
            
            if (!document) {
              result = {
                success: false,
                error: 'Document URL is required for send_document'
              };
            } else if (!bot) {
              result = {
                success: false,
                error: 'Telegram Bot not initialized. Check bot token.'
              };
            } else {
              try {
                const response = await bot.sendDocument(CHANNEL_ID, document, {
                  caption,
                  parse_mode: parse_mode as any,
                });
                
                result = {
                  success: true,
                  message: 'Document sent to Telegram successfully!',
                  message_id: response.message_id,
                  document: response.document,
                  caption: response.caption,
                  channel: CHANNEL_ID,
                  date: response.date,
                  timestamp: new Date(response.date * 1000).toLocaleString()
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to send document: ${error.message}`,
                  details: error.response?.body || error.message
                };
              }
            }
            break;
          }

          case 'send_poll': {
            const { question, options, is_anonymous = true, type = 'regular', correct_option_id, explanation } = args || {};
            
            if (!question || !options || options.length < 2) {
              result = {
                success: false,
                error: 'Question and at least 2 options are required for send_poll'
              };
            } else if (!bot) {
              result = {
                success: false,
                error: 'Telegram Bot not initialized. Check bot token.'
              };
            } else {
              try {
                const pollOptions: any = {
                  question,
                  options,
                  is_anonymous,
                  type
                };
                
                if (type === 'quiz' && correct_option_id !== undefined) {
                  pollOptions.correct_option_id = correct_option_id;
                  if (explanation) {
                    pollOptions.explanation = explanation;
                  }
                }
                
                const response = await bot.sendPoll(CHANNEL_ID, question, options, pollOptions);
                
                result = {
                  success: true,
                  message: 'Poll sent to Telegram successfully!',
                  message_id: response.message_id,
                  poll: response.poll,
                  channel: CHANNEL_ID,
                  date: response.date,
                  timestamp: new Date(response.date * 1000).toLocaleString()
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to send poll: ${error.message}`,
                  details: error.response?.body || error.message
                };
              }
            }
            break;
          }

          case 'send_reaction': {
            const { message_id, emoji } = args || {};
            
            if (!message_id || !emoji) {
              result = {
                success: false,
                error: 'Message ID and emoji are required for send_reaction'
              };
            } else if (!bot) {
              result = {
                success: false,
                error: 'Telegram Bot not initialized. Check bot token.'
              };
            } else {
              try {
                const response = await bot.setMessageReaction(CHANNEL_ID, message_id, { reaction: [{ type: 'emoji', emoji }] });
                
                result = {
                  success: true,
                  message: 'Reaction sent successfully!',
                  message_id,
                  emoji,
                  channel: CHANNEL_ID
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to send reaction: ${error.message}`,
                  details: error.response?.body || error.message
                };
              }
            }
            break;
          }

          case 'edit_message': {
            const { message_id, text, parse_mode = 'HTML' } = args || {};
            
            if (!message_id || !text) {
              result = {
                success: false,
                error: 'Message ID and text are required for edit_message'
              };
            } else if (!bot) {
              result = {
                success: false,
                error: 'Telegram Bot not initialized. Check bot token.'
              };
            } else {
              try {
                // Ensure proper UTF-8 encoding
                const encodedText = Buffer.from(text, 'utf8').toString('utf8');
                const response = await bot.editMessageText(encodedText, {
                  chat_id: CHANNEL_ID,
                  message_id,
                  parse_mode: parse_mode as any,
                });
                
                result = {
                  success: true,
                  message: 'Message edited successfully!',
                  message_id,
                  text: typeof response === 'object' && response ? response.text : text,
                  channel: CHANNEL_ID
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to edit message: ${error.message}`,
                  details: error.response?.body || error.message
                };
              }
            }
            break;
          }

          case 'delete_message': {
            const { message_id } = args || {};
            
            if (!message_id) {
              result = {
                success: false,
                error: 'Message ID is required for delete_message'
              };
            } else if (!bot) {
              result = {
                success: false,
                error: 'Telegram Bot not initialized. Check bot token.'
              };
            } else {
              try {
                await bot.deleteMessage(CHANNEL_ID, message_id);
                
                result = {
                  success: true,
                  message: 'Message deleted successfully!',
                  message_id,
                  channel: CHANNEL_ID
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to delete message: ${error.message}`,
                  details: error.response?.body || error.message
                };
              }
            }
            break;
          }

          case 'pin_message': {
            const { message_id, disable_notification = false } = args || {};
            
            if (!message_id) {
              result = {
                success: false,
                error: 'Message ID is required for pin_message'
              };
            } else if (!bot) {
              result = {
                success: false,
                error: 'Telegram Bot not initialized. Check bot token.'
              };
            } else {
              try {
                await bot.pinChatMessage(CHANNEL_ID, message_id, { disable_notification });
                
                result = {
                  success: true,
                  message: 'Message pinned successfully!',
                  message_id,
                  channel: CHANNEL_ID
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to pin message: ${error.message}`,
                  details: error.response?.body || error.message
                };
              }
            }
            break;
          }

          case 'unpin_message': {
            const { message_id } = args || {};
            
            if (!bot) {
              result = {
                success: false,
                error: 'Telegram Bot not initialized. Check bot token.'
              };
            } else {
              try {
                if (message_id) {
                  await bot.unpinChatMessage(CHANNEL_ID, message_id);
                  result = {
                    success: true,
                    message: 'Message unpinned successfully!',
                    message_id,
                    channel: CHANNEL_ID
                  };
                } else {
                  await bot.unpinAllChatMessages(CHANNEL_ID);
                  result = {
                    success: true,
                    message: 'All messages unpinned successfully!',
                    channel: CHANNEL_ID
                  };
                }
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to unpin message: ${error.message}`,
                  details: error.response?.body || error.message
                };
              }
            }
            break;
          }
          
          case 'get_channel_info': {
            if (!bot) {
              result = {
                success: false,
                error: 'Telegram Bot not initialized. Check bot token.'
              };
            } else {
              try {
                const chat = await bot.getChat(CHANNEL_ID);
                
                result = {
                  success: true,
                  channel: CHANNEL_ID,
                  title: chat.title,
                  type: chat.type,
                  description: chat.description || 'No description',
                  username: chat.username || 'No username',
                  id: chat.id
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get channel info: ${error.message}`,
                  details: error.response?.body || error.message
                };
              }
            }
            break;
          }

          case 'get_channel_stats': {
            if (!bot) {
              result = {
                success: false,
                error: 'Telegram Bot not initialized. Check bot token.'
              };
            } else {
              try {
                const chat = await bot.getChat(CHANNEL_ID);
                const memberCount = await bot.getChatMemberCount(CHANNEL_ID);
                
                result = {
                  success: true,
                  channel: CHANNEL_ID,
                  title: chat.title,
                  member_count: memberCount,
                  type: chat.type,
                  username: chat.username || 'No username',
                  id: chat.id,
                  timestamp: new Date().toLocaleString()
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get channel stats: ${error.message}`,
                  details: error.response?.body || error.message
                };
              }
            }
            break;
          }

          case 'pexels_search_photos': {
            const { query, per_page = 15, page = 1, orientation, size, color } = args || {};
            
            if (!query) {
              result = {
                success: false,
                error: 'Query is required for pexels_search_photos'
              };
            } else {
              try {
                const params: any = { query, per_page, page };
                if (orientation) params.orientation = orientation;
                if (size) params.size = size;
                if (color) params.color = color;
                
                const data = await pexelsRequest('/search', params);
                
                result = {
                  success: true,
                  total_results: data.total_results,
                  page: data.page,
                  per_page: data.per_page,
                  photos: data.photos.map((photo: any) => ({
                    id: photo.id,
                    width: photo.width,
                    height: photo.height,
                    url: photo.url,
                    photographer: photo.photographer,
                    photographer_url: photo.photographer_url,
                    src: {
                      original: photo.src.original,
                      large: photo.src.large,
                      medium: photo.src.medium,
                      small: photo.src.small,
                      tiny: photo.src.tiny
                    },
                    alt: photo.alt
                  }))
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to search photos: ${error.message}`
                };
              }
            }
            break;
          }

          case 'pexels_get_photo': {
            const { id } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Photo ID is required for pexels_get_photo'
              };
            } else {
              try {
                const photo = await pexelsRequest(`/photos/${id}`);
                
                result = {
                  success: true,
                  photo: {
                    id: photo.id,
                    width: photo.width,
                    height: photo.height,
                    url: photo.url,
                    photographer: photo.photographer,
                    photographer_url: photo.photographer_url,
                    src: {
                      original: photo.src.original,
                      large: photo.src.large,
                      medium: photo.src.medium,
                      small: photo.src.small,
                      tiny: photo.src.tiny
                    },
                    alt: photo.alt
                  }
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get photo: ${error.message}`
                };
              }
            }
            break;
          }

          case 'pexels_curated_photos': {
            const { per_page = 15, page = 1 } = args || {};
            
            try {
              const data = await pexelsRequest('/curated', { per_page, page });
              
              result = {
                success: true,
                page: data.page,
                per_page: data.per_page,
                photos: data.photos.map((photo: any) => ({
                  id: photo.id,
                  width: photo.width,
                  height: photo.height,
                  url: photo.url,
                  photographer: photo.photographer,
                  photographer_url: photo.photographer_url,
                  src: {
                    original: photo.src.original,
                    large: photo.src.large,
                    medium: photo.src.medium,
                    small: photo.src.small,
                    tiny: photo.src.tiny
                  },
                  alt: photo.alt
                }))
              };
            } catch (error: any) {
              result = {
                success: false,
                error: `Failed to get curated photos: ${error.message}`
              };
            }
            break;
          }

          case 'pexels_search_videos': {
            const { query, per_page = 15, page = 1, orientation, size } = args || {};
            
            if (!query) {
              result = {
                success: false,
                error: 'Query is required for pexels_search_videos'
              };
            } else {
              try {
                const params: any = { query, per_page, page };
                if (orientation) params.orientation = orientation;
                if (size) params.size = size;
                
                const data = await pexelsRequest('/videos/search', params);
                
                result = {
                  success: true,
                  total_results: data.total_results,
                  page: data.page,
                  per_page: data.per_page,
                  videos: data.videos.map((video: any) => ({
                    id: video.id,
                    width: video.width,
                    height: video.height,
                    url: video.url,
                    duration: video.duration,
                    user: {
                      name: video.user.name,
                      url: video.user.url
                    },
                    video_files: video.video_files.map((file: any) => ({
                      id: file.id,
                      quality: file.quality,
                      file_type: file.file_type,
                      width: file.width,
                      height: file.height,
                      link: file.link
                    }))
                  }))
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to search videos: ${error.message}`
                };
              }
            }
            break;
          }

          case 'pexels_popular_videos': {
            const { per_page = 15, page = 1 } = args || {};
            
            try {
              const data = await pexelsRequest('/videos/popular', { per_page, page });
              
              result = {
                success: true,
                page: data.page,
                per_page: data.per_page,
                videos: data.videos.map((video: any) => ({
                  id: video.id,
                  width: video.width,
                  height: video.height,
                  url: video.url,
                  duration: video.duration,
                  user: {
                    name: video.user.name,
                    url: video.user.url
                  },
                  video_files: video.video_files.map((file: any) => ({
                    id: file.id,
                    quality: file.quality,
                    file_type: file.file_type,
                    width: file.width,
                    height: file.height,
                    link: file.link
                  }))
                }))
              };
            } catch (error: any) {
              result = {
                success: false,
                error: `Failed to get popular videos: ${error.message}`
              };
            }
            break;
          }

          case 'yandex_wordstat_search': {
            const { phrases, geo_ids = [225] } = args || {};
            
            if (!phrases || !Array.isArray(phrases) || phrases.length === 0) {
              result = {
                success: false,
                error: 'Phrases array is required for yandex_wordstat_search (1-10 phrases)'
              };
            } else {
              try {
                const response = await yandexWordstatRequest('get', {
                  SelectionCriteria: {
                    GeoIds: geo_ids
                  },
                  Phrases: phrases,
                  FieldNames: ['Keyword', 'Shows']
                });
                
                result = {
                  success: true,
                  data: response.result || response,
                  phrases: phrases,
                  geo_ids: geo_ids,
                  full_api_response: response,
                  note: 'Wordstat data for specified phrases and regions'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get Wordstat data: ${error.message}`
                };
              }
            }
            break;
          }

          case 'yandex_wordstat_keywords': {
            const { phrase, geo_ids = [225] } = args || {};
            
            if (!phrase) {
              result = {
                success: false,
                error: 'Phrase is required for yandex_wordstat_keywords'
              };
            } else {
              try {
                const response = await yandexWordstatRequest('get', {
                  SelectionCriteria: {
                    GeoIds: geo_ids
                  },
                  Phrases: [phrase],
                  FieldNames: ['Keyword', 'Shows']
                });
                
                result = {
                  success: true,
                  phrase: phrase,
                  geo_ids: geo_ids,
                  full_response: response,
                  keywords: response.result || response,
                  note: 'Keyword suggestions based on Wordstat data'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get keywords: ${error.message}`,
                  details: error.stack
                };
              }
            }
            break;
          }

          case 'yandex_wordstat_related': {
            const { phrase, geo_ids = [225] } = args || {};
            
            if (!phrase) {
              result = {
                success: false,
                error: 'Phrase is required for yandex_wordstat_related'
              };
            } else {
              try {
                const response = await yandexWordstatRequest('get', {
                  SelectionCriteria: {
                    GeoIds: geo_ids
                  },
                  Phrases: [phrase],
                  FieldNames: ['Keyword', 'Shows']
                });
                
                // Extract related queries from response
                const relatedQueries = response.result?.SearchedWith || [];
                
                result = {
                  success: true,
                  phrase: phrase,
                  geo_ids: geo_ids,
                  full_response: response,
                  related_queries: relatedQueries,
                  count: relatedQueries.length,
                  note: 'Related search queries from Yandex Wordstat'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get related queries: ${error.message}`
                };
              }
            }
            break;
          }

          // WordPress Posts
          case 'wordpress_get_posts': {
            if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const posts = await wordpressAPI.getPosts(args || {});
                result = {
                  success: true,
                  posts: posts,
                  count: posts.length,
                  note: 'WordPress posts retrieved successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get posts: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_get_post': {
            const { id } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Post ID is required for wordpress_get_post'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const post = await wordpressAPI.getPost(id);
                result = {
                  success: true,
                  post: post,
                  note: 'WordPress post retrieved successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get post: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_create_post': {
            const { title, content, ...otherFields } = args || {};
            
            if (!title || !content) {
              result = {
                success: false,
                error: 'Title and content are required for wordpress_create_post'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const post = await wordpressAPI.createPost({
                  title,
                  content,
                  ...otherFields
                });
                result = {
                  success: true,
                  post: post,
                  note: 'WordPress post created successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to create post: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_update_post': {
            const { id, ...updateFields } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Post ID is required for wordpress_update_post'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const post = await wordpressAPI.updatePost(id, updateFields);
                result = {
                  success: true,
                  post: post,
                  note: 'WordPress post updated successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to update post: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_delete_post': {
            const { id, force = false } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Post ID is required for wordpress_delete_post'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const post = await wordpressAPI.deletePost(id, force);
                result = {
                  success: true,
                  post: post,
                  note: 'WordPress post deleted successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to delete post: ${error.message}`
                };
              }
            }
            break;
          }

          // WordPress Pages
          case 'wordpress_get_pages': {
            if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const pages = await wordpressAPI.getPages(args || {});
                result = {
                  success: true,
                  pages: pages,
                  count: pages.length,
                  note: 'WordPress pages retrieved successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get pages: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_get_page': {
            const { id } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Page ID is required for wordpress_get_page'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const page = await wordpressAPI.getPage(id);
                result = {
                  success: true,
                  page: page,
                  note: 'WordPress page retrieved successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get page: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_create_page': {
            const { title, content, ...otherFields } = args || {};
            
            if (!title || !content) {
              result = {
                success: false,
                error: 'Title and content are required for wordpress_create_page'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const page = await wordpressAPI.createPage({
                  title,
                  content,
                  ...otherFields
                });
                result = {
                  success: true,
                  page: page,
                  note: 'WordPress page created successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to create page: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_update_page': {
            const { id, ...updateFields } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Page ID is required for wordpress_update_page'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const page = await wordpressAPI.updatePage(id, updateFields);
                result = {
                  success: true,
                  page: page,
                  note: 'WordPress page updated successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to update page: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_delete_page': {
            const { id, force = false } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Page ID is required for wordpress_delete_page'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const page = await wordpressAPI.deletePage(id, force);
                result = {
                  success: true,
                  page: page,
                  note: 'WordPress page deleted successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to delete page: ${error.message}`
                };
              }
            }
            break;
          }

          // WordPress Media
          case 'wordpress_get_media': {
            if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const media = await wordpressAPI.getMedia(args || {});
                result = {
                  success: true,
                  media: media,
                  count: media.length,
                  note: 'WordPress media retrieved successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get media: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_get_media_item': {
            const { id } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Media ID is required for wordpress_get_media_item'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const media = await wordpressAPI.getMediaItem(id);
                result = {
                  success: true,
                  media: media,
                  note: 'WordPress media item retrieved successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get media item: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_upload_media': {
            const { file_url, filename, ...otherFields } = args || {};
            
            if (!file_url || !filename) {
              result = {
                success: false,
                error: 'File URL and filename are required for wordpress_upload_media'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const media = await wordpressAPI.uploadMedia(file_url, filename, otherFields.title, otherFields.alt_text, otherFields.caption, otherFields.description);
                result = {
                  success: true,
                  media: media,
                  note: 'WordPress media uploaded successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to upload media: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_upload_media_binary': {
            const { file_data, filename, mime_type, ...otherFields } = args || {};
            
            if (!file_data || !filename || !mime_type) {
              result = {
                success: false,
                error: 'File data, filename, and mime_type are required for wordpress_upload_media_binary'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                // Convert base64 to Buffer
                const fileBuffer = Buffer.from(file_data, 'base64');
                const media = await wordpressAPI.uploadMediaBinary(fileBuffer, filename, mime_type, otherFields.title, otherFields.alt_text, otherFields.caption, otherFields.description);
                result = {
                  success: true,
                  media: media,
                  note: 'WordPress media uploaded successfully via binary upload'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to upload media binary: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_update_media_metadata': {
            const { id, ...metadata } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Media ID is required for wordpress_update_media_metadata'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const media = await wordpressAPI.updateMediaMetadata(id, metadata);
                result = {
                  success: true,
                  media: media,
                  note: 'WordPress media metadata updated successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to update media metadata: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_upload_media_direct': {
            const { file_data, filename, mime_type, ...otherFields } = args || {};
            
            if (!file_data || !filename || !mime_type) {
              result = {
                success: false,
                error: 'File data, filename, and mime_type are required for wordpress_upload_media_direct'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                // Convert base64 to Buffer
                const fileBuffer = Buffer.from(file_data, 'base64');
                const media = await wordpressAPI.uploadMediaDirect(fileBuffer, filename, mime_type, otherFields.title, otherFields.alt_text, otherFields.caption, otherFields.description);
                result = {
                  success: true,
                  media: media,
                  note: 'WordPress media uploaded successfully via direct binary upload'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to upload media direct: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_update_media': {
            const { id, ...updateFields } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Media ID is required for wordpress_update_media'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const media = await wordpressAPI.updateMedia(id, updateFields);
                result = {
                  success: true,
                  media: media,
                  note: 'WordPress media updated successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to update media: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_delete_media': {
            const { id, force = false } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Media ID is required for wordpress_delete_media'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const media = await wordpressAPI.deleteMedia(id, force);
                result = {
                  success: true,
                  media: media,
                  note: 'WordPress media deleted successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to delete media: ${error.message}`
                };
              }
            }
            break;
          }

          // WordPress Categories
          case 'wordpress_get_categories': {
            if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const categories = await wordpressAPI.getCategories(args || {});
                result = {
                  success: true,
                  categories: categories,
                  count: categories.length,
                  note: 'WordPress categories retrieved successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get categories: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_get_category': {
            const { id } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Category ID is required for wordpress_get_category'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const category = await wordpressAPI.getCategory(id);
                result = {
                  success: true,
                  category: category,
                  note: 'WordPress category retrieved successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get category: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_create_category': {
            const { name, ...otherFields } = args || {};
            
            if (!name) {
              result = {
                success: false,
                error: 'Name is required for wordpress_create_category'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const category = await wordpressAPI.createCategory({
                  name,
                  ...otherFields
                });
                result = {
                  success: true,
                  category: category,
                  note: 'WordPress category created successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to create category: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_update_category': {
            const { id, ...updateFields } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Category ID is required for wordpress_update_category'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const category = await wordpressAPI.updateCategory(id, updateFields);
                result = {
                  success: true,
                  category: category,
                  note: 'WordPress category updated successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to update category: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_delete_category': {
            const { id, force = false } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Category ID is required for wordpress_delete_category'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const category = await wordpressAPI.deleteCategory(id, force);
                result = {
                  success: true,
                  category: category,
                  note: 'WordPress category deleted successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to delete category: ${error.message}`
                };
              }
            }
            break;
          }

          // WordPress Tags
          case 'wordpress_get_tags': {
            if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const tags = await wordpressAPI.getTags(args || {});
                result = {
                  success: true,
                  tags: tags,
                  count: tags.length,
                  note: 'WordPress tags retrieved successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get tags: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_get_tag': {
            const { id } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Tag ID is required for wordpress_get_tag'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const tag = await wordpressAPI.getTag(id);
                result = {
                  success: true,
                  tag: tag,
                  note: 'WordPress tag retrieved successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get tag: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_create_tag': {
            const { name, ...otherFields } = args || {};
            
            if (!name) {
              result = {
                success: false,
                error: 'Name is required for wordpress_create_tag'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const tag = await wordpressAPI.createTag({
                  name,
                  ...otherFields
                });
                result = {
                  success: true,
                  tag: tag,
                  note: 'WordPress tag created successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to create tag: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_update_tag': {
            const { id, ...updateFields } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Tag ID is required for wordpress_update_tag'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const tag = await wordpressAPI.updateTag(id, updateFields);
                result = {
                  success: true,
                  tag: tag,
                  note: 'WordPress tag updated successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to update tag: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_delete_tag': {
            const { id, force = false } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Tag ID is required for wordpress_delete_tag'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const tag = await wordpressAPI.deleteTag(id, force);
                result = {
                  success: true,
                  tag: tag,
                  note: 'WordPress tag deleted successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to delete tag: ${error.message}`
                };
              }
            }
            break;
          }

          // WordPress Users
          case 'wordpress_get_users': {
            if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const users = await wordpressAPI.getUsers(args || {});
                result = {
                  success: true,
                  users: users,
                  count: users.length,
                  note: 'WordPress users retrieved successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get users: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_get_user': {
            const { id } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'User ID is required for wordpress_get_user'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const user = await wordpressAPI.getUser(id);
                result = {
                  success: true,
                  user: user,
                  note: 'WordPress user retrieved successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get user: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_create_user': {
            const { username, email, password, ...otherFields } = args || {};
            
            if (!username || !email || !password) {
              result = {
                success: false,
                error: 'Username, email, and password are required for wordpress_create_user'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const user = await wordpressAPI.createUser({
                  username,
                  email,
                  password,
                  ...otherFields
                });
                result = {
                  success: true,
                  user: user,
                  note: 'WordPress user created successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to create user: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_update_user': {
            const { id, ...updateFields } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'User ID is required for wordpress_update_user'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const user = await wordpressAPI.updateUser(id, updateFields);
                result = {
                  success: true,
                  user: user,
                  note: 'WordPress user updated successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to update user: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_delete_user': {
            const { id, force = false, reassign } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'User ID is required for wordpress_delete_user'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const user = await wordpressAPI.deleteUser(id, force, reassign);
                result = {
                  success: true,
                  user: user,
                  note: 'WordPress user deleted successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to delete user: ${error.message}`
                };
              }
            }
            break;
          }

          // WordPress Comments
          case 'wordpress_get_comments': {
            if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const comments = await wordpressAPI.getComments(args || {});
                result = {
                  success: true,
                  comments: comments,
                  count: comments.length,
                  note: 'WordPress comments retrieved successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get comments: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_get_comment': {
            const { id } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Comment ID is required for wordpress_get_comment'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const comment = await wordpressAPI.getComment(id);
                result = {
                  success: true,
                  comment: comment,
                  note: 'WordPress comment retrieved successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get comment: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_create_comment': {
            const { post, content, ...otherFields } = args || {};
            
            if (!post || !content) {
              result = {
                success: false,
                error: 'Post ID and content are required for wordpress_create_comment'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const comment = await wordpressAPI.createComment({
                  post,
                  content,
                  ...otherFields
                });
                result = {
                  success: true,
                  comment: comment,
                  note: 'WordPress comment created successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to create comment: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_update_comment': {
            const { id, ...updateFields } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Comment ID is required for wordpress_update_comment'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const comment = await wordpressAPI.updateComment(id, updateFields);
                result = {
                  success: true,
                  comment: comment,
                  note: 'WordPress comment updated successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to update comment: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_delete_comment': {
            const { id, force = false } = args || {};
            
            if (!id) {
              result = {
                success: false,
                error: 'Comment ID is required for wordpress_delete_comment'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const comment = await wordpressAPI.deleteComment(id, force);
                result = {
                  success: true,
                  comment: comment,
                  note: 'WordPress comment deleted successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to delete comment: ${error.message}`
                };
              }
            }
            break;
          }

          // WordPress Site Info
          case 'wordpress_get_site_info': {
            if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const siteInfo = await wordpressAPI.getSiteInfo();
                result = {
                  success: true,
                  site_info: siteInfo,
                  note: 'WordPress site information retrieved successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get site info: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_get_settings': {
            if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const settings = await wordpressAPI.getSettings();
                result = {
                  success: true,
                  settings: settings,
                  note: 'WordPress settings retrieved successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to get settings: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_search': {
            const { query, type } = args || {};
            
            if (!query) {
              result = {
                success: false,
                error: 'Query is required for wordpress_search'
              };
            } else if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const searchResults = await wordpressAPI.search(query, type);
                result = {
                  success: true,
                  search_results: searchResults,
                  count: searchResults.length,
                  query: query,
                  type: type || 'any',
                  note: 'WordPress search completed successfully'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to search: ${error.message}`
                };
              }
            }
            break;
          }

          case 'wordpress_test_connection': {
            if (!wordpressAPI) {
              result = {
                success: false,
                error: 'WordPress API not initialized. Please check WordPress configuration.'
              };
            } else {
              try {
                const isConnected = await wordpressAPI.testConnection();
                result = {
                  success: isConnected,
                  connected: isConnected,
                  wordpress_url: WORDPRESS_URL,
                  note: isConnected ? 'WordPress connection successful' : 'WordPress connection failed'
                };
              } catch (error: any) {
                result = {
                  success: false,
                  error: `Failed to test connection: ${error.message}`
                };
              }
            }
            break;
          }

          
          default:
            result = {
              success: false,
              error: `Unknown tool: ${name}`
            };
        }
        
        res.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result)
              }
            ]
          }
        });
        break;
        
      case 'notifications/initialized':
        // MCP client initialization notification
        res.json({
          jsonrpc: '2.0',
          id,
          result: {}
        });
        break;
        
      default:
        res.json({
          jsonrpc: '2.0',
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`
          }
        });
    }
  } else {
    // Invalid MCP request format
    console.log('❌ Invalid MCP request format:', req.body);
    res.status(400).json({
      jsonrpc: '2.0',
      id: id || null,
      error: {
        code: -32600,
        message: 'Invalid Request: not a valid MCP request'
      }
    });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  let bot_connected = false;
  let bot_username = null;
  
  if (bot) {
    try {
      const botInfo = await bot.getMe();
      bot_connected = true;
      bot_username = botInfo.username;
    } catch (error) {
      console.error('Bot health check failed:', error);
    }
  }
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    channel: CHANNEL_ID,
    bot_token_set: !!TELEGRAM_BOT_TOKEN,
    bot_connected: bot_connected,
    bot_username: bot_username,
    version: '2.3.0',
    mcp_server: true,
    pexels_enabled: !!PEXELS_API_KEY,
    yandex_oauth: !!YANDEX_OAUTH_TOKEN,
    wordpress_enabled: !!wordpressAPI,
    wordpress_url: WORDPRESS_URL || 'Not configured',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Yandex OAuth endpoints
app.get('/yandex/auth', (req, res) => {
  const redirectUri = `${req.protocol}://${req.get('host')}/yandex/callback`;
  const authUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${YANDEX_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=direct:api`;
  res.json({
    message: 'Yandex OAuth Authorization with Direct API scope',
    instructions: 'Open this URL in browser to authorize',
    auth_url: authUrl,
    callback_url: redirectUri,
    scope: 'direct:api',
    note: 'After authorization, you will be redirected to callback URL with code'
  });
});

app.get('/yandex/callback', async (req, res) => {
  const code = req.query.code as string;
  
  if (!code) {
    return res.status(400).json({
      error: 'Authorization code is required',
      message: 'No code provided in callback'
    });
  }

  try {
    const tokenData = await getYandexOAuthToken(code);
    
    res.json({
      success: true,
      message: 'Yandex OAuth token obtained successfully!',
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      note: 'Token has been saved. You can now use Yandex Wordstat tools!'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      note: 'Failed to exchange code for token'
    });
  }
});

app.post('/yandex/set-token', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({
      error: 'Token is required',
      usage: 'POST /yandex/set-token with body: { "token": "your_token" }'
    });
  }

  YANDEX_OAUTH_TOKEN = token;
  
  res.json({
    success: true,
    message: 'Yandex OAuth token set successfully!',
    note: 'You can now use Yandex Wordstat tools'
  });
});

app.get('/yandex/status', (req, res) => {
  const redirectUri = `${req.protocol}://${req.get('host')}/yandex/callback`;
  res.json({
    client_id: YANDEX_CLIENT_ID,
    login: YANDEX_LOGIN,
    token_set: !!YANDEX_OAUTH_TOKEN,
    token_preview: YANDEX_OAUTH_TOKEN ? `${YANDEX_OAUTH_TOKEN.substring(0, 20)}...` : 'Not set',
    auth_url: `https://oauth.yandex.ru/authorize?response_type=code&client_id=${YANDEX_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=direct:api`,
    callback_url: redirectUri,
    scope: 'direct:api'
  });
});

app.get('/yandex/get-token', (req, res) => {
  if (!YANDEX_OAUTH_TOKEN) {
    return res.json({
      error: 'Token not set',
      message: 'Please authorize first'
    });
  }
  
  res.json({
    token: YANDEX_OAUTH_TOKEN,
    note: 'Save this as YANDEX_OAUTH_TOKEN environment variable in Railway'
  });
});

// MCP Server Info endpoint
app.get('/mcp', (req, res) => {
  res.json({
    name: 'telegram-mcp-server',
    version: '2.1.0',
    capabilities: {
      tools: {}
    }
  });
});

// List tools endpoint
app.get('/mcp/tools/list', (req, res) => {
  res.json({
    tools: [
      {
        name: 'send_message',
        description: 'Send a text message to the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            text: { type: 'string', description: 'Message text to send' },
            parse_mode: { type: 'string', enum: ['HTML', 'Markdown'], description: 'Parse mode for the message' }
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
            parse_mode: { type: 'string', enum: ['HTML', 'Markdown'], description: 'Parse mode for the caption' }
          },
          required: ['photo']
        }
      },
      {
        name: 'send_photo_binary',
        description: 'Send a photo to the Telegram channel using binary data',
        inputSchema: {
          type: 'object',
          properties: {
            file_data: { type: 'string', description: 'Base64 encoded image data' },
            filename: { type: 'string', description: 'Filename for the image' },
            caption: { type: 'string', description: 'Photo caption' },
            parse_mode: { type: 'string', enum: ['HTML', 'Markdown'], description: 'Parse mode for the caption' }
          },
          required: ['file_data', 'filename']
        }
      },
      {
        name: 'send_video',
        description: 'Send a video to the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            video: { type: 'string', description: 'Video URL or file path' },
            caption: { type: 'string', description: 'Video caption' },
            duration: { type: 'number', description: 'Video duration in seconds' },
            width: { type: 'number', description: 'Video width' },
            height: { type: 'number', description: 'Video height' }
          },
          required: ['video']
        }
      },
      {
        name: 'send_document',
        description: 'Send a document to the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            document: { type: 'string', description: 'Document URL or file path' },
            caption: { type: 'string', description: 'Document caption' },
            filename: { type: 'string', description: 'Custom filename for the document' }
          },
          required: ['document']
        }
      },
      {
        name: 'send_poll',
        description: 'Send a poll to the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            question: { type: 'string', description: 'Poll question' },
            options: { type: 'array', items: { type: 'string' }, description: 'Poll options (2-10 options)' },
            is_anonymous: { type: 'boolean', description: 'Whether the poll is anonymous' },
            type: { type: 'string', enum: ['quiz', 'regular'], description: 'Poll type' },
            correct_option_id: { type: 'number', description: 'Correct option ID for quiz polls' },
            explanation: { type: 'string', description: 'Explanation for quiz polls' }
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
            emoji: { type: 'string', description: 'Emoji to react with' }
          },
          required: ['message_id', 'emoji']
        }
      },
      {
        name: 'edit_message',
        description: 'Edit a message in the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: { type: 'number', description: 'Message ID to edit' },
            text: { type: 'string', description: 'New message text' },
            parse_mode: { type: 'string', enum: ['HTML', 'Markdown'], description: 'Parse mode for the message' }
          },
          required: ['message_id', 'text']
        }
      },
      {
        name: 'delete_message',
        description: 'Delete a message from the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: { type: 'number', description: 'Message ID to delete' }
          },
          required: ['message_id']
        }
      },
      {
        name: 'pin_message',
        description: 'Pin a message in the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: { type: 'number', description: 'Message ID to pin' },
            disable_notification: { type: 'boolean', description: 'Whether to disable notification for pinned message' }
          },
          required: ['message_id']
        }
      },
      {
        name: 'unpin_message',
        description: 'Unpin a message in the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {
            message_id: { type: 'number', description: 'Message ID to unpin (optional, unpins all if not specified)' }
          }
        }
      },
      {
        name: 'get_channel_info',
        description: 'Get information about the Telegram channel',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_channel_stats',
        description: 'Get channel statistics and member count',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      // WordPress tools
      {
        name: 'wordpress_upload_media',
        description: 'Upload a media file to WordPress',
        inputSchema: {
          type: 'object',
          properties: {
            file_url: { type: 'string', description: 'URL of the file to upload' },
            filename: { type: 'string', description: 'Filename for the uploaded file' },
            title: { type: 'string', description: 'Media title' },
            alt_text: { type: 'string', description: 'Alt text for images' },
            caption: { type: 'string', description: 'Media caption' },
            description: { type: 'string', description: 'Media description' }
          },
          required: ['file_url', 'filename']
        }
      },
      {
        name: 'wordpress_upload_media_binary',
        description: 'Upload a media file directly as binary data to WordPress (more efficient for large files)',
        inputSchema: {
          type: 'object',
          properties: {
            file_data: { type: 'string', description: 'Base64 encoded file data' },
            filename: { type: 'string', description: 'Filename for the uploaded file' },
            mime_type: { type: 'string', description: 'MIME type of the file (e.g., image/png, image/jpeg)' },
            title: { type: 'string', description: 'Media title' },
            alt_text: { type: 'string', description: 'Alt text for images' },
            caption: { type: 'string', description: 'Media caption' },
            description: { type: 'string', description: 'Media description' }
          },
          required: ['file_data', 'filename', 'mime_type']
        }
      },
      {
        name: 'wordpress_upload_media_direct',
        description: 'Upload a media file directly as binary data to WordPress without JSON (for large files)',
        inputSchema: {
          type: 'object',
          properties: {
            file_data: { type: 'string', description: 'Base64 encoded file data' },
            filename: { type: 'string', description: 'Filename for the uploaded file' },
            mime_type: { type: 'string', description: 'MIME type of the file (e.g., image/png, image/jpeg)' },
            title: { type: 'string', description: 'Media title' },
            alt_text: { type: 'string', description: 'Alt text for images' },
            caption: { type: 'string', description: 'Media caption' },
            description: { type: 'string', description: 'Media description' }
          },
          required: ['file_data', 'filename', 'mime_type']
        }
      },
      {
        name: 'wordpress_update_media_metadata',
        description: 'Update media metadata (alt_text, caption, description)',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Media ID' },
            title: { type: 'string', description: 'Media title' },
            alt_text: { type: 'string', description: 'Alt text for images' },
            caption: { type: 'string', description: 'Media caption' },
            description: { type: 'string', description: 'Media description' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_update_media',
        description: 'Update a WordPress media item',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Media ID' },
            title: { type: 'string', description: 'Media title' },
            alt_text: { type: 'string', description: 'Alt text for images' },
            caption: { type: 'string', description: 'Media caption' },
            description: { type: 'string', description: 'Media description' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_get_media',
        description: 'Get a WordPress media item by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Media ID' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_list_media',
        description: 'List WordPress media items',
        inputSchema: {
          type: 'object',
          properties: {
            per_page: { type: 'number', description: 'Number of items per page (default: 10)' },
            page: { type: 'number', description: 'Page number (default: 1)' },
            search: { type: 'string', description: 'Search term' },
            media_type: { type: 'string', description: 'Media type (image, video, audio, application)' },
            mime_type: { type: 'string', description: 'MIME type filter' }
          }
        }
      },
      {
        name: 'wordpress_delete_media',
        description: 'Delete a WordPress media item',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Media ID' },
            force: { type: 'boolean', description: 'Force delete (bypass trash)' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_create_post',
        description: 'Create a new WordPress post',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Post title' },
            content: { type: 'string', description: 'Post content (HTML)' },
            excerpt: { type: 'string', description: 'Post excerpt' },
            status: { type: 'string', enum: ['publish', 'draft', 'private', 'pending'], description: 'Post status' },
            featured_media: { type: 'number', description: 'Featured media ID' },
            categories: { type: 'array', items: { type: 'number' }, description: 'Category IDs' },
            tags: { type: 'array', items: { type: 'number' }, description: 'Tag IDs' },
            meta: { type: 'object', description: 'Custom meta fields' }
          },
          required: ['title', 'content']
        }
      },
      {
        name: 'wordpress_update_post',
        description: 'Update a WordPress post',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Post ID' },
            title: { type: 'string', description: 'Post title' },
            content: { type: 'string', description: 'Post content (HTML)' },
            excerpt: { type: 'string', description: 'Post excerpt' },
            status: { type: 'string', enum: ['publish', 'draft', 'private', 'pending'], description: 'Post status' },
            featured_media: { type: 'number', description: 'Featured media ID' },
            categories: { type: 'array', items: { type: 'number' }, description: 'Category IDs' },
            tags: { type: 'array', items: { type: 'number' }, description: 'Tag IDs' },
            meta: { type: 'object', description: 'Custom meta fields' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_get_post',
        description: 'Get a WordPress post by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Post ID' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_list_posts',
        description: 'List WordPress posts',
        inputSchema: {
          type: 'object',
          properties: {
            per_page: { type: 'number', description: 'Number of items per page (default: 10)' },
            page: { type: 'number', description: 'Page number (default: 1)' },
            search: { type: 'string', description: 'Search term' },
            status: { type: 'string', description: 'Post status' },
            categories: { type: 'array', items: { type: 'number' }, description: 'Category IDs' },
            tags: { type: 'array', items: { type: 'number' }, description: 'Tag IDs' }
          }
        }
      },
      {
        name: 'wordpress_delete_post',
        description: 'Delete a WordPress post',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Post ID' },
            force: { type: 'boolean', description: 'Force delete (bypass trash)' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_create_page',
        description: 'Create a new WordPress page',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Page title' },
            content: { type: 'string', description: 'Page content (HTML)' },
            excerpt: { type: 'string', description: 'Page excerpt' },
            status: { type: 'string', enum: ['publish', 'draft', 'private', 'pending'], description: 'Page status' },
            featured_media: { type: 'number', description: 'Featured media ID' },
            parent: { type: 'number', description: 'Parent page ID' },
            menu_order: { type: 'number', description: 'Menu order' },
            template: { type: 'string', description: 'Page template' },
            meta: { type: 'object', description: 'Custom meta fields' }
          },
          required: ['title', 'content']
        }
      },
      {
        name: 'wordpress_update_page',
        description: 'Update a WordPress page',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Page ID' },
            title: { type: 'string', description: 'Page title' },
            content: { type: 'string', description: 'Page content (HTML)' },
            excerpt: { type: 'string', description: 'Page excerpt' },
            status: { type: 'string', enum: ['publish', 'draft', 'private', 'pending'], description: 'Page status' },
            featured_media: { type: 'number', description: 'Featured media ID' },
            parent: { type: 'number', description: 'Parent page ID' },
            menu_order: { type: 'number', description: 'Menu order' },
            template: { type: 'string', description: 'Page template' },
            meta: { type: 'object', description: 'Custom meta fields' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_get_page',
        description: 'Get a WordPress page by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Page ID' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_list_pages',
        description: 'List WordPress pages',
        inputSchema: {
          type: 'object',
          properties: {
            per_page: { type: 'number', description: 'Number of items per page (default: 10)' },
            page: { type: 'number', description: 'Page number (default: 1)' },
            search: { type: 'string', description: 'Search term' },
            status: { type: 'string', description: 'Page status' },
            parent: { type: 'number', description: 'Parent page ID' }
          }
        }
      },
      {
        name: 'wordpress_delete_page',
        description: 'Delete a WordPress page',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Page ID' },
            force: { type: 'boolean', description: 'Force delete (bypass trash)' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_create_category',
        description: 'Create a new WordPress category',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Category name' },
            description: { type: 'string', description: 'Category description' },
            parent: { type: 'number', description: 'Parent category ID' },
            slug: { type: 'string', description: 'Category slug' }
          },
          required: ['name']
        }
      },
      {
        name: 'wordpress_update_category',
        description: 'Update a WordPress category',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Category ID' },
            name: { type: 'string', description: 'Category name' },
            description: { type: 'string', description: 'Category description' },
            parent: { type: 'number', description: 'Parent category ID' },
            slug: { type: 'string', description: 'Category slug' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_get_category',
        description: 'Get a WordPress category by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Category ID' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_list_categories',
        description: 'List WordPress categories',
        inputSchema: {
          type: 'object',
          properties: {
            per_page: { type: 'number', description: 'Number of items per page (default: 10)' },
            page: { type: 'number', description: 'Page number (default: 1)' },
            search: { type: 'string', description: 'Search term' },
            parent: { type: 'number', description: 'Parent category ID' },
            hide_empty: { type: 'boolean', description: 'Hide empty categories' }
          }
        }
      },
      {
        name: 'wordpress_delete_category',
        description: 'Delete a WordPress category',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Category ID' },
            force: { type: 'boolean', description: 'Force delete' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_create_tag',
        description: 'Create a new WordPress tag',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Tag name' },
            description: { type: 'string', description: 'Tag description' },
            slug: { type: 'string', description: 'Tag slug' }
          },
          required: ['name']
        }
      },
      {
        name: 'wordpress_update_tag',
        description: 'Update a WordPress tag',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Tag ID' },
            name: { type: 'string', description: 'Tag name' },
            description: { type: 'string', description: 'Tag description' },
            slug: { type: 'string', description: 'Tag slug' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_get_tag',
        description: 'Get a WordPress tag by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Tag ID' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_list_tags',
        description: 'List WordPress tags',
        inputSchema: {
          type: 'object',
          properties: {
            per_page: { type: 'number', description: 'Number of items per page (default: 10)' },
            page: { type: 'number', description: 'Page number (default: 1)' },
            search: { type: 'string', description: 'Search term' },
            hide_empty: { type: 'boolean', description: 'Hide empty tags' }
          }
        }
      },
      {
        name: 'wordpress_delete_tag',
        description: 'Delete a WordPress tag',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Tag ID' },
            force: { type: 'boolean', description: 'Force delete' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_get_user',
        description: 'Get a WordPress user by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'User ID' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_list_users',
        description: 'List WordPress users',
        inputSchema: {
          type: 'object',
          properties: {
            per_page: { type: 'number', description: 'Number of items per page (default: 10)' },
            page: { type: 'number', description: 'Page number (default: 1)' },
            search: { type: 'string', description: 'Search term' },
            roles: { type: 'array', items: { type: 'string' }, description: 'User roles' }
          }
        }
      },
      {
        name: 'wordpress_create_comment',
        description: 'Create a new WordPress comment',
        inputSchema: {
          type: 'object',
          properties: {
            post: { type: 'number', description: 'Post ID' },
            author_name: { type: 'string', description: 'Author name' },
            author_email: { type: 'string', description: 'Author email' },
            content: { type: 'string', description: 'Comment content' },
            status: { type: 'string', enum: ['hold', 'approve', 'spam', 'trash'], description: 'Comment status' },
            parent: { type: 'number', description: 'Parent comment ID' }
          },
          required: ['post', 'author_name', 'author_email', 'content']
        }
      },
      {
        name: 'wordpress_update_comment',
        description: 'Update a WordPress comment',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Comment ID' },
            author_name: { type: 'string', description: 'Author name' },
            author_email: { type: 'string', description: 'Author email' },
            content: { type: 'string', description: 'Comment content' },
            status: { type: 'string', enum: ['hold', 'approve', 'spam', 'trash'], description: 'Comment status' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_get_comment',
        description: 'Get a WordPress comment by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Comment ID' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_list_comments',
        description: 'List WordPress comments',
        inputSchema: {
          type: 'object',
          properties: {
            per_page: { type: 'number', description: 'Number of items per page (default: 10)' },
            page: { type: 'number', description: 'Page number (default: 1)' },
            search: { type: 'string', description: 'Search term' },
            status: { type: 'string', description: 'Comment status' },
            post: { type: 'number', description: 'Post ID' },
            parent: { type: 'number', description: 'Parent comment ID' }
          }
        }
      },
      {
        name: 'wordpress_delete_comment',
        description: 'Delete a WordPress comment',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Comment ID' },
            force: { type: 'boolean', description: 'Force delete (bypass trash)' }
          },
          required: ['id']
        }
      },
      {
        name: 'wordpress_get_site_info',
        description: 'Get WordPress site information',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ]
  });
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
        const { text } = args || {};
        
        if (!text) {
          throw new Error('Text is required for send_message');
        }
        
        result = {
          success: true,
          message: 'Message would be sent to Telegram',
          text: text,
          channel: CHANNEL_ID,
          note: 'This is a test response. Telegram integration requires proper bot setup.'
        };
        break;
      }

      case 'get_channel_info': {
        result = {
          success: true,
          channel: CHANNEL_ID,
          title: 'Test Channel',
          type: 'channel',
          description: 'This is a test response. Real channel info requires proper bot setup.',
          note: 'This is a test response. Real channel info requires proper bot setup.'
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

// Start the server
async function main() {
  try {
    const port = process.env.PORT || 8080;
    
    app.listen(port, () => {
      console.log('🚀 Telegram MCP Server v2.3.0 with Pexels, Yandex Wordstat & WordPress running on port', port);
      console.log(`🌐 API URL: http://localhost:${port}`);
      console.log(`📖 MCP Info: http://localhost:${port}/mcp`);
      console.log(`🔧 Tools: http://localhost:${port}/mcp/tools/list`);
      console.log(`💚 Health: http://localhost:${port}/health`);
      console.log('✅ Ready for testing!');
      console.log(`📱 Target channel: ${CHANNEL_ID}`);
      console.log(`🔑 Bot token: ${TELEGRAM_BOT_TOKEN ? 'SET' : 'NOT SET'}`);
      console.log(`🌐 WordPress: ${wordpressAPI ? 'CONNECTED' : 'NOT CONFIGURED'}`);
      if (wordpressAPI) {
        console.log(`   URL: ${WORDPRESS_URL}`);
        console.log(`   User: ${WORDPRESS_USERNAME}`);
      }
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
