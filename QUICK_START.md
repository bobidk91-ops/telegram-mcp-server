# 🚀 Быстрый старт Telegram MCP Server

Этот документ поможет вам быстро запустить MCP сервер для управления Telegram каналом.

## ⚡ Быстрая установка

### 1. Клонирование и установка

```bash
git clone <your-repository-url>
cd telegram-mcp-server
npm install
```

### 2. Настройка переменных окружения

```bash
cp env.example .env
```

Отредактируйте `.env` файл:
```env
TELEGRAM_BOT_TOKEN=8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0
TELEGRAM_CHANNEL_ID=@mymcptest
PORT=3000
NODE_ENV=production
```

### 3. Сборка и запуск

```bash
npm run build
npm start
```

## 🔧 Настройка Telegram бота

### Создание бота

1. Найдите [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. Скопируйте полученный токен в `.env`

### Добавление бота в канал

1. Откройте ваш канал `@mymcptest`
2. Нажмите "Управление каналом" → "Администраторы"
3. Нажмите "Добавить администратора"
4. Найдите вашего бота по username
5. Дайте права на публикацию сообщений

## 🚂 Развертывание на Railway

### Автоматическое развертывание

1. Зайдите на [railway.app](https://railway.app)
2. Нажмите "New Project" → "Deploy from GitHub repo"
3. Выберите ваш репозиторий
4. Добавьте переменные окружения в Railway:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHANNEL_ID`
   - `NODE_ENV=production`

### Проверка развертывания

После развертывания проверьте:
```bash
curl https://your-project-name-production.up.railway.app/health
```

## 🧪 Тестирование функций

### Тест отправки сообщения

```bash
# Используйте MCP клиент или напрямую через API
curl -X POST https://your-project-name-production.up.railway.app/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "send_message",
      "arguments": {
        "text": "Тестовое сообщение! 🚀",
        "parse_mode": "HTML"
      }
    }
  }'
```

### Тест создания опроса

```bash
curl -X POST https://your-project-name-production.up.railway.app/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "send_poll",
      "arguments": {
        "question": "Тестовый опрос?",
        "options": ["Да", "Нет"],
        "is_anonymous": true
      }
    }
  }'
```

## 📱 Интеграция с Claude Desktop

### Настройка MCP в Claude Desktop

1. Откройте Claude Desktop
2. Перейдите в настройки
3. Добавьте MCP сервер:

```json
{
  "mcpServers": {
    "telegram-bot": {
      "command": "node",
      "args": ["/path/to/your/telegram-mcp-server/dist/index.js"],
      "env": {
        "TELEGRAM_BOT_TOKEN": "8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0",
        "TELEGRAM_CHANNEL_ID": "@mymcptest"
      }
    }
  }
}
```

### Использование в Claude

Теперь вы можете использовать команды типа:
- "Отправь сообщение в Telegram канал"
- "Создай опрос в канале"
- "Закрепи это сообщение"

## 🔍 Отладка

### Проверка логов

```bash
# Локально
npm run dev

# На Railway
railway logs
```

### Частые проблемы

#### Ошибка 401 Unauthorized
- Проверьте правильность `TELEGRAM_BOT_TOKEN`
- Убедитесь, что токен не истек

#### Ошибка 403 Forbidden
- Убедитесь, что бот добавлен в канал как администратор
- Проверьте права бота на публикацию

#### Ошибка подключения
- Проверьте интернет соединение
- Убедитесь, что канал существует

## 📊 Мониторинг

### Health Check

```bash
curl https://your-project-name-production.up.railway.app/health
```

### Метрики Railway

В панели Railway вы можете отслеживать:
- Использование CPU и памяти
- Количество запросов
- Время отклика

## 🎯 Следующие шаги

1. **Изучите примеры** - см. [EXAMPLES.md](EXAMPLES.md)
2. **Настройте автоматизацию** - создайте скрипты для регулярной публикации
3. **Интегрируйте с AI** - используйте Claude для автоматического создания контента
4. **Мониторьте производительность** - отслеживайте метрики в Railway

## 🆘 Получение помощи

- **Документация**: [README.md](README.md)
- **Примеры**: [EXAMPLES.md](EXAMPLES.md)
- **Развертывание**: [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)
- **Issues**: Создайте issue в GitHub репозитории

---

**Готово! Ваш Telegram MCP Server запущен и готов к работе! 🎉**
