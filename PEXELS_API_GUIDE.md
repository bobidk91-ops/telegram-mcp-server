# Pexels API Integration Guide

## Overview

This MCP server now includes **5 Pexels API tools** for searching and retrieving high-quality photos and videos.

## Available Pexels Tools

### 1. `pexels_search_photos`
Search for photos on Pexels by query.

**Parameters:**
- `query` (required): Search query (e.g., "nature", "cats", "city")
- `per_page` (optional): Number of results per page (1-80, default: 15)
- `page` (optional): Page number (default: 1)
- `orientation` (optional): Photo orientation - "landscape", "portrait", or "square"
- `size` (optional): Minimum photo size - "large", "medium", or "small"
- `color` (optional): Desired photo color (e.g., "red", "blue", "#FF0000")

**Example Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "pexels_search_photos",
    "arguments": {
      "query": "nature",
      "per_page": 10,
      "orientation": "landscape"
    }
  },
  "id": 1
}
```

**Response:**
```json
{
  "success": true,
  "total_results": 8000,
  "page": 1,
  "per_page": 10,
  "photos": [
    {
      "id": 2325447,
      "width": 5184,
      "height": 3456,
      "url": "https://www.pexels.com/photo/...",
      "photographer": "Francesco Ungaro",
      "photographer_url": "https://www.pexels.com/@francesco-ungaro",
      "src": {
        "original": "https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg",
        "large": "...",
        "medium": "...",
        "small": "...",
        "tiny": "..."
      },
      "alt": "Photo description"
    }
  ]
}
```

---

### 2. `pexels_get_photo`
Get a specific photo by ID from Pexels.

**Parameters:**
- `id` (required): Photo ID from Pexels

**Example Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "pexels_get_photo",
    "arguments": {
      "id": 2325447
    }
  },
  "id": 1
}
```

---

### 3. `pexels_curated_photos`
Get curated (editor's choice) photos from Pexels.

**Parameters:**
- `per_page` (optional): Number of results per page (1-80, default: 15)
- `page` (optional): Page number (default: 1)

**Example Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "pexels_curated_photos",
    "arguments": {
      "per_page": 20
    }
  },
  "id": 1
}
```

---

### 4. `pexels_search_videos`
Search for videos on Pexels by query.

**Parameters:**
- `query` (required): Search query (e.g., "nature", "ocean", "city")
- `per_page` (optional): Number of results per page (1-80, default: 15)
- `page` (optional): Page number (default: 1)
- `orientation` (optional): Video orientation - "landscape", "portrait", or "square"
- `size` (optional): Minimum video size - "large", "medium", or "small"

**Example Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "pexels_search_videos",
    "arguments": {
      "query": "ocean",
      "per_page": 5
    }
  },
  "id": 1
}
```

**Response:**
```json
{
  "success": true,
  "total_results": 8000,
  "page": 1,
  "per_page": 5,
  "videos": [
    {
      "id": 1918465,
      "width": 3840,
      "height": 2160,
      "url": "https://www.pexels.com/video/...",
      "duration": 15,
      "user": {
        "name": "Ruvim Miksanskiy",
        "url": "https://www.pexels.com/@digitech"
      },
      "video_files": [
        {
          "id": 9228888,
          "quality": "uhd",
          "file_type": "video/mp4",
          "width": 3840,
          "height": 2160,
          "link": "https://videos.pexels.com/video-files/1918465/1918465-uhd_3840_2160_24fps.mp4"
        }
      ]
    }
  ]
}
```

---

### 5. `pexels_popular_videos`
Get popular/trending videos from Pexels.

**Parameters:**
- `per_page` (optional): Number of results per page (1-80, default: 15)
- `page` (optional): Page number (default: 1)

**Example Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "pexels_popular_videos",
    "arguments": {
      "per_page": 10
    }
  },
  "id": 1
}
```

---

## Setup

### 1. Get Pexels API Key

1. Go to https://www.pexels.com/api/
2. Sign up for free account
3. Get your API key

### 2. Configure Environment Variables

Add to your `.env` file:
```
PEXELS_API_KEY=your_api_key_here
```

### 3. Railway Deployment

In Railway dashboard, add environment variable:
- **Key**: `PEXELS_API_KEY`
- **Value**: Your Pexels API key

---

## Use Cases

### 1. Content Creation
Search and download high-quality images for blog posts, social media, or presentations.

### 2. Automated Publishing
Automatically find and post relevant images to your Telegram channel based on topics.

### 3. Visual Search
Find images matching specific criteria (color, orientation, size) for design projects.

### 4. Video Content
Search and retrieve professional stock videos for video editing projects.

### 5. AI Integration
Use with ChatGPT or Claude to automatically find and suggest relevant visuals for content.

---

## Example: Search and Post to Telegram

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "pexels_search_photos",
    "arguments": {
      "query": "technology",
      "per_page": 1,
      "orientation": "landscape"
    }
  },
  "id": 1
}
```

Then use the returned photo URL with `send_photo`:

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "send_photo",
    "arguments": {
      "photo": "https://images.pexels.com/photos/.../photo.jpeg",
      "caption": "Photo by [Photographer Name] from Pexels"
    }
  },
  "id": 2
}
```

---

## API Limits

- **Free tier**: 200 requests per hour
- **Rate limit**: Handled automatically by server

---

## Attribution

When using Pexels content:
- Give credit to the photographer
- Link back to Pexels (optional but appreciated)
- Example: "Photo by [Photographer Name] from Pexels"

---

## Error Handling

All tools return standardized error responses:

```json
{
  "success": false,
  "error": "Error description"
}
```

Common errors:
- `Unauthorized`: Invalid API key
- `Rate limit exceeded`: Too many requests
- `Not found`: Invalid photo/video ID

---

## Testing

Test Pexels integration locally:

```bash
node test_pexels.js
```

---

## Support

For issues or questions:
- Pexels API Docs: https://www.pexels.com/api/documentation/
- MCP Server Issues: Create an issue in the repository
