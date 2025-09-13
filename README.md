# Telegram MCP Server v2.0.0

🚀 **MCP (Model Context Protocol) сервер для Telegram Bot API** с функциями ведения блога, совместимый с ChatGPT и Make.com.

## ✨ Возможности

### 📝 Блоггинг функции
- **Отправка сообщений** - текстовые посты с поддержкой HTML/Markdown
- **Отправка фотографий** - изображения с подписями
- **Отправка видео** - видеофайлы с описанием
- **Отправка документов** - файлы любого типа
- **Создание опросов** - интерактивные опросы и викторины
- **Реакции на сообщения** - эмодзи реакции
- **Редактирование сообщений** - изменение уже отправленных постов
- **Удаление сообщений** - удаление ненужных постов
- **Информация о канале** - получение статистики канала

### 🔧 Технические особенности
- **MCP протокол** - совместимость с ChatGPT и другими AI клиентами
- **TypeScript** - типобезопасность и современный код
- **Railway.com** - простое развертывание в облаке
- **Environment variables** - безопасное хранение токенов
- **Error handling** - подробная обработка ошибок

## 🚀 Быстрый старт

### 1. Клонирование репозитория
```bash
git clone https://github.com/your-username/telegram-mcp-server.git
cd telegram-mcp-server
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка переменных окружения
Скопируйте `env.example` в `.env` и заполните:
```bash
cp env.example .env
```

Отредактируйте `.env`:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHANNEL_ID=@your_channel_here
PORT=8080
NODE_ENV=production
```

### 4. Сборка проекта
```bash
npm run build
```

### 5. Запуск сервера
```bash
npm start
```

## 🌐 Развертывание на Railway.com

### Автоматическое развертывание

1. **Подключите GitHub репозиторий** к Railway.com
2. **Добавьте переменные окружения** в настройках Railway:
   - `TELEGRAM_BOT_TOKEN` - токен вашего бота
   - `TELEGRAM_CHANNEL_ID` - ID канала (например: @mychannel)
3. **Railway автоматически развернет** сервер
4. **Получите публичный URL** из панели Railway

### Ручное развертывание

```bash
# Установка Railway CLI
npm install -g @railway/cli

# Вход в аккаунт
railway login

# Инициализация проекта
railway init

# Развертывание
railway up
```

## 🔌 Подключение к ChatGPT

### Через Claude Desktop

1. Откройте настройки Claude Desktop
2. Добавьте MCP сервер:
   ```json
   {
     "mcpServers": {
       "telegram": {
         "command": "node",
         "args": ["path/to/your/telegram-mcp-server/dist/index.js"],
         "env": {
           "TELEGRAM_BOT_TOKEN": "your_bot_token",
           "TELEGRAM_CHANNEL_ID": "@your_channel"
         }
       }
     }
   }
   ```

### Через HTTP (для Make.com)

Railway предоставляет публичный URL, который можно использовать в Make.com:
- **URL**: `https://your-app.up.railway.app`
- **Метод**: POST
- **Content-Type**: `application/json`

## 📋 Доступные инструменты

| Инструмент | Описание | Параметры |
|------------|----------|-----------|
| `send_message` | Отправка текстового сообщения | `text`, `parse_mode` |
| `send_photo` | Отправка фотографии | `photo_url`, `caption`, `parse_mode` |
| `send_video` | Отправка видео | `video_url`, `caption`, `parse_mode` |
| `send_document` | Отправка документа | `document_url`, `caption`, `parse_mode` |
| `send_poll` | Создание опроса | `question`, `options`, `is_anonymous`, `type` |
| `send_reaction` | Отправка реакции | `message_id`, `emoji` |
| `edit_message` | Редактирование сообщения | `message_id`, `text`, `parse_mode` |
| `delete_message` | Удаление сообщения | `message_id` |
| `get_channel_info` | Информация о канале | - |

## 🛠️ Разработка

### Локальная разработка
```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка проекта
npm run build
```

### Структура проекта
```
telegram-mcp-server/
├── src/
│   └── index.ts          # Основной MCP сервер
├── dist/                 # Собранный код
├── package.json          # Зависимости и скрипты
├── tsconfig.json         # Конфигурация TypeScript
├── Procfile             # Конфигурация Railway
├── .nvmrc               # Версия Node.js
└── README.md            # Документация
```

## 🔐 Безопасность

- **Токены** хранятся в переменных окружения
- **Валидация** всех входных параметров
- **Обработка ошибок** на всех уровнях
- **Логирование** для отладки

## 📞 Поддержка

Если у вас возникли проблемы:

1. **Проверьте логи** в Railway панели
2. **Убедитесь** что токен бота корректный
3. **Проверьте** что бот добавлен в канал как администратор
4. **Создайте issue** в GitHub репозитории

## 📄 Лицензия

MIT License - используйте свободно для любых целей.

---

**Создано с ❤️ для сообщества Telegram блогеров**
