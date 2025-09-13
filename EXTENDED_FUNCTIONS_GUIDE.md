# 🚀 Расширенные функции Telegram MCP Server

## 📋 Обзор

Telegram MCP Server теперь поддерживает **12 мощных функций** для полноценного ведения блога в Telegram:

## 🛠️ Доступные функции

### 1. 📝 **send_message** - Отправка текстовых сообщений
```json
{
  "name": "send_message",
  "arguments": {
    "text": "Ваш текст сообщения",
    "parse_mode": "HTML" // или "Markdown"
  }
}
```

### 2. 🖼️ **send_photo** - Отправка фотографий
```json
{
  "name": "send_photo",
  "arguments": {
    "photo": "https://example.com/image.jpg",
    "caption": "Подпись к фото",
    "parse_mode": "HTML"
  }
}
```

### 3. 🎥 **send_video** - Отправка видео
```json
{
  "name": "send_video",
  "arguments": {
    "video": "https://example.com/video.mp4",
    "caption": "Описание видео",
    "duration": 120,
    "width": 1920,
    "height": 1080
  }
}
```

### 4. 📄 **send_document** - Отправка документов
```json
{
  "name": "send_document",
  "arguments": {
    "document": "https://example.com/file.pdf",
    "caption": "Описание документа"
  }
}
```

### 5. 📊 **send_poll** - Создание опросов
```json
{
  "name": "send_poll",
  "arguments": {
    "question": "Ваш вопрос?",
    "options": ["Вариант 1", "Вариант 2", "Вариант 3"],
    "is_anonymous": true,
    "type": "regular" // или "quiz"
  }
}
```

### 6. 👍 **send_reaction** - Добавление реакций
```json
{
  "name": "send_reaction",
  "arguments": {
    "message_id": 123,
    "emoji": "👍"
  }
}
```

### 7. ✏️ **edit_message** - Редактирование сообщений
```json
{
  "name": "edit_message",
  "arguments": {
    "message_id": 123,
    "text": "Новый текст сообщения",
    "parse_mode": "HTML"
  }
}
```

### 8. 🗑️ **delete_message** - Удаление сообщений
```json
{
  "name": "delete_message",
  "arguments": {
    "message_id": 123
  }
}
```

### 9. 📌 **pin_message** - Закрепление сообщений
```json
{
  "name": "pin_message",
  "arguments": {
    "message_id": 123,
    "disable_notification": false
  }
}
```

### 10. 📌 **unpin_message** - Открепление сообщений
```json
{
  "name": "unpin_message",
  "arguments": {
    "message_id": 123 // опционально, если не указан - открепляет все
  }
}
```

### 11. ℹ️ **get_channel_info** - Информация о канале
```json
{
  "name": "get_channel_info",
  "arguments": {}
}
```

### 12. 📊 **get_channel_stats** - Статистика канала
```json
{
  "name": "get_channel_stats",
  "arguments": {}
}
```

## 🔌 Использование с Make.com

### URL сервера:
```
https://telegram-mcp-server-production.up.railway.app
```

### Пример запроса:
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "send_poll",
    "arguments": {
      "question": "Какой ваш любимый язык программирования?",
      "options": ["JavaScript", "Python", "TypeScript", "Go", "Rust"],
      "is_anonymous": true,
      "type": "regular"
    }
  },
  "id": 1
}
```

## 🎯 Примеры использования

### Создание поста с фото и опросом:
1. Отправьте фото с подписью
2. Создайте опрос
3. Закрепите важное сообщение

### Управление контентом:
1. Редактируйте сообщения при необходимости
2. Добавляйте реакции к популярным постам
3. Удаляйте устаревший контент

### Аналитика:
1. Получайте статистику канала
2. Отслеживайте количество подписчиков
3. Анализируйте информацию о канале

## ✅ Статус функций

- ✅ **send_message** - Работает
- ✅ **send_photo** - Работает  
- ✅ **send_video** - Работает
- ✅ **send_document** - Работает
- ✅ **send_poll** - Работает
- ✅ **send_reaction** - Работает (исправлено)
- ✅ **edit_message** - Работает
- ✅ **delete_message** - Работает
- ✅ **pin_message** - Работает
- ✅ **unpin_message** - Работает
- ✅ **get_channel_info** - Работает
- ✅ **get_channel_stats** - Работает

## 🚀 Готово к использованию!

MCP сервер полностью готов для интеграции с Make.com и другими платформами автоматизации. Все функции протестированы и работают корректно!
