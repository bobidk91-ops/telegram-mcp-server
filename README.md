# Telegram MCP Server with Pexels API

Полнофункциональный MCP (Model Context Protocol) сервер для интеграции с Telegram каналами и Pexels API.

## 🚀 Возможности

- **12 Telegram функций**: отправка сообщений, фото, видео, документов, опросов, реакций, редактирование, удаление, закрепление сообщений
- **5 Pexels API функций**: поиск фото и видео, кураторские подборки, популярные видео
- **MCP протокол**: полная поддержка JSON-RPC 2.0
- **HTTP API**: поддержка как MCP, так и REST API
- **Railway деплой**: готов к развертыванию в облаке
- **UTF-8 поддержка**: корректная обработка русского текста

## 📋 Доступные инструменты

### Telegram (12 инструментов)
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

### Pexels API (5 инструментов)
13. `pexels_search_photos` - Поиск фотографий по запросу
14. `pexels_get_photo` - Получение фото по ID
15. `pexels_curated_photos` - Кураторские фотографии
16. `pexels_search_videos` - Поиск видео по запросу
17. `pexels_popular_videos` - Популярные видео

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
3. Настройте переменные окружения:
   - `TELEGRAM_BOT_TOKEN` - токен Telegram бота
   - `TELEGRAM_CHANNEL_ID` - ID канала (например, @channel)
   - `PEXELS_API_KEY` - API ключ Pexels (получить на https://www.pexels.com/api/)

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
- **Версия**: v2.1.0
- **Статус**: ✅ Работает
- **MCP совместимость**: ✅ Полная
- **Telegram интеграция**: ✅ Активна
- **Pexels API**: ✅ Активна
- **Всего инструментов**: 17 (12 Telegram + 5 Pexels)

## 📖 Документация

- [Pexels API Guide](./PEXELS_API_GUIDE.md) - Полная документация по Pexels интеграции
- [Telegram Setup](./TELEGRAM_SETUP_GUIDE.md) - Настройка Telegram бота
- [Troubleshooting](./TROUBLESHOOTING.md) - Решение проблем

## 🎯 Готов к использованию!

Сервер полностью настроен и готов к работе с ChatGPT, Claude Desktop и другими MCP клиентами.

### Новые возможности v2.1.0:
- ✨ Интеграция с Pexels API
- 🖼️ Поиск высококачественных фотографий
- 🎥 Поиск профессиональных видео
- 📸 Кураторские подборки
- 🔥 Популярные видео