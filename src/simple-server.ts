import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import TelegramBot from 'node-telegram-bot-api';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

// Default values if environment variables are not set
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0';
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@mymcptest';

console.log('🔧 Environment variables:');
console.log('TELEGRAM_BOT_TOKEN:', TELEGRAM_BOT_TOKEN ? 'SET' : 'NOT SET');
console.log('TELEGRAM_CHANNEL_ID:', CHANNEL_ID);

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

// Root endpoint - GET
app.get('/', (req, res) => {
  res.json({
    name: 'telegram-mcp-server',
    version: '2.0.0',
    status: 'running',
    description: 'Telegram MCP Server v2.0.0 - HTTP API for ChatGPT and Make.com',
    environment: {
      TELEGRAM_BOT_TOKEN: TELEGRAM_BOT_TOKEN ? 'SET' : 'NOT SET',
      TELEGRAM_CHANNEL_ID: CHANNEL_ID,
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

// Root endpoint - POST (for Make.com MCP connection)
app.post('/', async (req, res) => {
  console.log('📨 POST request to root endpoint:', req.body);
  
  // Handle MCP protocol requests
  const { jsonrpc, method, params, id } = req.body;
  
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
              version: '2.0.0'
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
              }
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
    // Regular POST request
    res.json({
      message: 'POST request received',
      body: req.body,
      timestamp: new Date().toISOString()
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
    version: '2.0.0',
    mcp_server: true,
    environment: process.env.NODE_ENV || 'development'
  });
});

// MCP Server Info endpoint
app.get('/mcp', (req, res) => {
  res.json({
    name: 'telegram-mcp-server',
    version: '2.0.0',
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
      console.log('🚀 Telegram MCP Simple Server v2.0.0 running on port', port);
      console.log(`🌐 API URL: http://localhost:${port}`);
      console.log(`📖 MCP Info: http://localhost:${port}/mcp`);
      console.log(`🔧 Tools: http://localhost:${port}/mcp/tools/list`);
      console.log(`💚 Health: http://localhost:${port}/health`);
      console.log('✅ Ready for testing!');
      console.log(`📱 Target channel: ${CHANNEL_ID}`);
      console.log(`🔑 Bot token: ${TELEGRAM_BOT_TOKEN ? 'SET' : 'NOT SET'}`);
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
