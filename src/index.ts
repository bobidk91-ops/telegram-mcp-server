import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import TelegramBot from 'node-telegram-bot-api';
import { WordPressAPI, WordPressConfig } from './wordpress-api.js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@mymcptest';

// WordPress Configuration
const WORDPRESS_URL = process.env.WORDPRESS_URL || '';
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME || '';
const WORDPRESS_PASSWORD = process.env.WORDPRESS_PASSWORD || '';
const WORDPRESS_APPLICATION_PASSWORD = process.env.WORDPRESS_APPLICATION_PASSWORD || '';

if (!TELEGRAM_BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set in environment variables.');
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

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

// Create MCP server
const server = new Server(
  {
    name: 'telegram-mcp-server',
    version: '2.2.0',
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
        name: 'wordpress_test_connection',
        description: 'Test WordPress connection',
        inputSchema: {
          type: 'object',
          properties: {}
        }
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

      // WordPress Posts
      case 'wordpress_get_posts': {
        if (!wordpressAPI) {
          return {
            content: [
              {
                type: 'text',
                text: '❌ WordPress API not initialized. Please check WordPress configuration.',
              },
            ],
            isError: true,
          };
        }
        
        try {
          const posts = await wordpressAPI.getPosts(args as any);
          return {
            content: [
              {
                type: 'text',
                text: `✅ WordPress posts retrieved successfully!\n\n📊 Found ${posts.length} posts\n\n${posts.map((post: any) => `📝 ${post.title} (ID: ${post.id})`).join('\n')}`,
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Failed to get WordPress posts: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }

      case 'wordpress_create_post': {
        const { title, content, ...otherFields } = args as {
          title: string;
          content: string;
          [key: string]: any;
        };
        
        if (!title || !content) {
          return {
            content: [
              {
                type: 'text',
                text: '❌ Title and content are required for wordpress_create_post',
              },
            ],
            isError: true,
          };
        }
        
        if (!wordpressAPI) {
          return {
            content: [
              {
                type: 'text',
                text: '❌ WordPress API not initialized. Please check WordPress configuration.',
              },
            ],
            isError: true,
          };
        }
        
        try {
          const post = await wordpressAPI.createPost({
            title,
            content,
            ...otherFields
          });
          
          return {
            content: [
              {
                type: 'text',
                text: `✅ WordPress post created successfully!\n\n📝 Title: ${post.title}\n🆔 ID: ${post.id}\n📊 Status: ${post.status}`,
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Failed to create WordPress post: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }

      case 'wordpress_upload_media': {
        const { file_url, filename, ...otherFields } = args as {
          file_url: string;
          filename: string;
          [key: string]: any;
        };
        
        if (!file_url || !filename) {
          return {
            content: [
              {
                type: 'text',
                text: '❌ File URL and filename are required for wordpress_upload_media',
              },
            ],
            isError: true,
          };
        }
        
        if (!wordpressAPI) {
          return {
            content: [
              {
                type: 'text',
                text: '❌ WordPress API not initialized. Please check WordPress configuration.',
              },
            ],
            isError: true,
          };
        }
        
        try {
          const media = await wordpressAPI.uploadMedia(file_url, filename, otherFields.title, otherFields.alt_text, otherFields.caption, otherFields.description);
          
          return {
            content: [
              {
                type: 'text',
                text: `✅ WordPress media uploaded successfully!\n\n📁 Title: ${media.title}\n🆔 ID: ${media.id}\n🔗 URL: ${media.source_url}\n📊 Type: ${media.media_type}`,
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Failed to upload WordPress media: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }

      case 'wordpress_get_categories': {
        if (!wordpressAPI) {
          return {
            content: [
              {
                type: 'text',
                text: '❌ WordPress API not initialized. Please check WordPress configuration.',
              },
            ],
            isError: true,
          };
        }
        
        try {
          const categories = await wordpressAPI.getCategories(args as any);
          return {
            content: [
              {
                type: 'text',
                text: `✅ WordPress categories retrieved successfully!\n\n📊 Found ${categories.length} categories\n\n${categories.map((cat: any) => `📂 ${cat.name} (ID: ${cat.id}, Count: ${cat.count})`).join('\n')}`,
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Failed to get WordPress categories: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }

      case 'wordpress_test_connection': {
        if (!wordpressAPI) {
          return {
            content: [
              {
                type: 'text',
                text: '❌ WordPress API not initialized. Please check WordPress configuration.',
              },
            ],
            isError: true,
          };
        }
        
        try {
          const isConnected = await wordpressAPI.testConnection();
          return {
            content: [
              {
                type: 'text',
                text: `✅ WordPress connection test ${isConnected ? 'successful' : 'failed'}!\n\n🌐 URL: ${WORDPRESS_URL}\n👤 User: ${WORDPRESS_USERNAME}\n🔗 Status: ${isConnected ? 'Connected' : 'Failed'}`,
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Failed to test WordPress connection: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
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
    
    console.log('🚀 Telegram MCP Server v2.2.0 running on stdio');
    console.log('✅ Ready for ChatGPT and Make.com integration!');
    console.log('📋 Available tools: send_message, send_photo, send_poll, send_reaction, edit_message, delete_message, get_channel_info, send_document, send_video');
    console.log('🌐 WordPress tools: wordpress_get_posts, wordpress_create_post, wordpress_upload_media, wordpress_get_categories, wordpress_test_connection');
    console.log(`🌐 WordPress: ${wordpressAPI ? 'CONNECTED' : 'NOT CONFIGURED'}`);
    if (wordpressAPI) {
      console.log(`   URL: ${WORDPRESS_URL}`);
      console.log(`   User: ${WORDPRESS_USERNAME}`);
    }
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
