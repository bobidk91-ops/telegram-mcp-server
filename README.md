# Telegram MCP Server

MCP (Model Context Protocol) Server for Telegram Bot API with comprehensive blogging features.

## Features

- 📝 **Send Messages** - Text messages with HTML/Markdown support
- 📸 **Send Photos** - Images with captions
- 📊 **Create Polls** - Interactive polls and quizzes
- 😀 **Send Reactions** - Emoji reactions to messages
- ✏️ **Edit Messages** - Modify existing messages
- 🗑️ **Delete Messages** - Remove messages from channel
- ℹ️ **Channel Info** - Get channel information

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `env.example` to `.env` and set your values:
```bash
cp env.example .env
```

### 3. Build and Run
```bash
npm run build
npm start
```

## Environment Variables

- `TELEGRAM_BOT_TOKEN` - Your Telegram bot token from @BotFather
- `TELEGRAM_CHANNEL_ID` - Target channel ID (e.g., @mychannel)
- `NODE_ENV` - Environment (production/development)

## Available Tools

### send_message
Send a text message to the channel.
```json
{
  "text": "Hello World!",
  "parse_mode": "HTML"
}
```

### send_photo
Send a photo with optional caption.
```json
{
  "photo": "https://example.com/image.jpg",
  "caption": "Check this out!",
  "parse_mode": "HTML"
}
```

### send_poll
Create an interactive poll.
```json
{
  "question": "What's your favorite color?",
  "options": ["Red", "Blue", "Green", "Yellow"],
  "is_anonymous": true,
  "type": "regular"
}
```

### send_reaction
Add emoji reaction to a message.
```json
{
  "message_id": 123,
  "emoji": "👍"
}
```

### edit_message
Edit an existing message.
```json
{
  "message_id": 123,
  "text": "Updated message text",
  "parse_mode": "HTML"
}
```

### delete_message
Delete a message from the channel.
```json
{
  "message_id": 123
}
```

### get_channel_info
Get information about the channel.
```json
{}
```

## Development

```bash
# Development mode with auto-reload
npm run dev

# Watch mode for TypeScript compilation
npm run watch
```

## Deployment

This project is configured for Railway.com deployment:

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

## License

MIT
