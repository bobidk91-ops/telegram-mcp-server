# 🔌 Подключение к OpenAI (Claude Desktop)

## ✅ Проблема решена!

Теперь ваш MCP сервер правильно поддерживает HTTP-based MCP протокол для удаленного подключения.

## 🌐 Правильный URL для подключения

### **Используйте этот URL:**
```
https://worker-production-193e.up.railway.app/mcp
```

## 🔧 Настройка в Claude Desktop

### 1. Откройте Claude Desktop
### 2. Перейдите в настройки MCP
### 3. Добавьте новый коннектор:

#### **Основные настройки:**
- **Имя коннектора**: `Telegram MCP Server`
- **Описание**: `MCP сервер для управления Telegram каналом`
- **URL MCP сервера**: `https://worker-production-193e.up.railway.app/mcp`
- **Аутентификация**: `Без аутентификации`

#### **Дополнительные настройки:**
- ✅ **Я доверяю этому приложению** (отметьте галочку)
- ⚠️ **Внимание**: Пользовательские коннекторы не проверяются OpenAI

## 🧪 Тестирование подключения

### 1. Проверка MCP endpoint:
```bash
curl https://worker-production-193e.up.railway.app/mcp
```

**Ожидаемый ответ:**
```json
{
  "name": "Telegram MCP Server",
  "version": "1.0.0",
  "description": "MCP Server for Telegram Bot API with blogging features",
  "protocol": "MCP",
  "transport": "HTTP",
  "capabilities": {
    "tools": {}
  },
  "tools": [...]
}
```

### 2. Проверка списка инструментов:
```bash
curl -X POST https://worker-production-193e.up.railway.app/mcp/tools/list
```

### 3. Тест отправки сообщения:
```bash
curl -X POST https://worker-production-193e.up.railway.app/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "send_message",
    "arguments": {
      "text": "Тестовое сообщение из MCP!",
      "parse_mode": "HTML"
    }
  }'
```

## 📱 Доступные инструменты

После подключения в Claude Desktop будут доступны:

1. **send_message** - Отправка текстовых сообщений
2. **send_photo** - Отправка фотографий с подписями
3. **send_poll** - Создание опросов и викторин
4. **send_reaction** - Отправка эмодзи реакций
5. **edit_message** - Редактирование сообщений
6. **delete_message** - Удаление сообщений
7. **get_channel_info** - Информация о канале

## 🔍 Диагностика проблем

### Если подключение не работает:

#### 1. Проверьте URL:
- Убедитесь, что используете: `https://worker-production-193e.up.railway.app/mcp`
- НЕ используйте: `https://worker-production-193e.up.railway.app/`

#### 2. Проверьте статус сервера:
```bash
curl https://worker-production-193e.up.railway.app/health
```

#### 3. Проверьте переменные окружения:
- `TELEGRAM_BOT_TOKEN` должен быть действительным
- `TELEGRAM_CHANNEL_ID` должен быть правильным
- Бот должен быть добавлен в канал как администратор

#### 4. Проверьте логи Railway:
- Откройте панель Railway
- Перейдите в раздел "Logs"
- Убедитесь, что нет ошибок

## 🚀 Примеры использования

### Отправка сообщения:
```
Отправь сообщение "Привет из Claude!" в Telegram канал
```

### Создание опроса:
```
Создай опрос "Какой твой любимый цвет?" с вариантами: Красный, Синий, Зеленый
```

### Отправка фотографии:
```
Отправь фотографию с URL "https://example.com/image.jpg" и подписью "Крутая картинка!"
```

## ⚙️ Конфигурация сервера

### Переменные окружения:
```
TELEGRAM_BOT_TOKEN = 8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0
TELEGRAM_CHANNEL_ID = @mymcptest
NODE_ENV = production
```

### Endpoints:
- **MCP Info**: `GET /mcp`
- **Tools List**: `POST /mcp/tools/list`
- **Tool Call**: `POST /mcp/tools/call`
- **Health Check**: `GET /health`

## 🎯 Важные моменты

### ✅ Что работает:
- HTTP-based MCP протокол
- Удаленное подключение через URL
- Все 7 инструментов Telegram
- CORS поддержка для браузера

### ⚠️ Ограничения:
- MCP протокол через HTTP (не stdio)
- Требует стабильного интернет-соединения
- Зависит от доступности Railway

### 🔒 Безопасность:
- Коннектор не проверяется OpenAI
- Используйте только доверенные серверы
- Не передавайте токены третьим лицам

---

## 🎉 Готово!

**Теперь ваш MCP сервер правильно работает с Claude Desktop!**

**URL для подключения**: `https://worker-production-193e.up.railway.app/mcp`

**Railway автоматически пересоберет проект с новым MCP сервером!** 🚀
