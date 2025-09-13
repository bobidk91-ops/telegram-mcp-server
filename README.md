# Telegram MCP Server

Полнофункциональный MCP (Model Context Protocol) сервер для интеграции с Telegram каналами.

## 🚀 Возможности

- **12 Telegram функций**: отправка сообщений, фото, видео, документов, опросов, реакций, редактирование, удаление, закрепление сообщений
- **MCP протокол**: полная поддержка JSON-RPC 2.0
- **HTTP API**: поддержка как MCP, так и REST API
- **Railway деплой**: готов к развертыванию в облаке
- **UTF-8 поддержка**: корректная обработка русского текста

## 📋 Доступные инструменты

1. `send_message` - Отправка текстовых сообщений
2. `send_photo` - Отправка фотографий
3. `send_video` - Отправка видео
4. `send_document` - Отправка документов
5. `send_poll` - Создание опросов
6. `send_reaction` - Отправка реакций
7. `edit_message` - Редактирование сообщений
8. `delete_message` - Удаление сообщений
9. `pin_message` - Закрепление сообщений
10. `unpin_message` - Открепление сообщений
11. `get_channel_info` - Получение информации о канале
12. `get_channel_stats` - Получение статистики канала

## 🛠 Установка

```bash
npm install
npm run build
```

## 🚀 Запуск

```bash
# Локальный запуск
npm start

# Разработка
npm run dev
```

## 🌐 Деплой на Railway

1. Подключите GitHub репозиторий к Railway
2. Railway автоматически определит Node.js проект
3. Настройте переменные окружения (опционально):
   - `TELEGRAM_BOT_TOKEN` - токен бота
   - `TELEGRAM_CHANNEL_ID` - ID канала

## 📡 API Endpoints

- `GET /` - Информация о сервере
- `GET /health` - Проверка здоровья
- `GET /tools/list` - Список инструментов (MCP)
- `POST /` - MCP JSON-RPC 2.0 эндпоинт

## 🔧 Использование

### MCP клиенты (ChatGPT, Claude Desktop)
```
URL: https://telegram-mcp-server-production.up.railway.app
```

### REST API
```bash
# Получить список инструментов
curl https://telegram-mcp-server-production.up.railway.app/tools/list

# Отправить сообщение
curl -X POST https://telegram-mcp-server-production.up.railway.app \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "send_message",
      "arguments": {
        "text": "Привет из MCP сервера!",
        "parse_mode": "HTML"
      }
    },
    "id": 1
  }'
```

## 📁 Структура проекта

```
├── src/
│   ├── simple-server.ts    # Основной MCP сервер
│   └── index.ts           # Альтернативная реализация
├── dist/                  # Скомпилированный код
├── package.json           # Зависимости и скрипты
├── Procfile              # Конфигурация Railway
├── tsconfig.json         # TypeScript конфигурация
└── README.md            # Документация
```

## ✅ Статус

- **Railway URL**: `https://telegram-mcp-server-production.up.railway.app`
- **Статус**: ✅ Работает
- **MCP совместимость**: ✅ Полная
- **Telegram интеграция**: ✅ Активна

## 🎯 Готов к использованию!

Сервер полностью настроен и готов к работе с ChatGPT, Claude Desktop и другими MCP клиентами.