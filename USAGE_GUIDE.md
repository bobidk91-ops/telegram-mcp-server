# 🚀 Telegram MCP Server - Руководство по использованию

## ✅ Проблема решена!

Теперь ваш MCP сервер работает как **гибридное приложение**:
- ✅ **HTTP API** - для прямого доступа через браузер
- ✅ **MCP протокол** - для подключения MCP клиентов

## 🌐 HTTP API Endpoints

### Основные URL:
- **Главная страница**: `https://worker-production-193e.up.railway.app/`
- **Статус сервера**: `https://worker-production-193e.up.railway.app/health`
- **Список инструментов**: `https://worker-production-193e.up.railway.app/tools`

### API для отправки сообщений:

#### 1. Отправить текстовое сообщение
```bash
curl -X POST https://worker-production-193e.up.railway.app/api/send_message \
  -H "Content-Type: application/json" \
  -d '{"text": "Привет из MCP сервера!", "parse_mode": "HTML"}'
```

#### 2. Отправить фотографию
```bash
curl -X POST https://worker-production-193e.up.railway.app/api/send_photo \
  -H "Content-Type: application/json" \
  -d '{"photo": "https://example.com/image.jpg", "caption": "Крутая картинка!"}'
```

#### 3. Создать опрос
```bash
curl -X POST https://worker-production-193e.up.railway.app/api/send_poll \
  -H "Content-Type: application/json" \
  -d '{"question": "Какой ваш любимый цвет?", "options": ["Красный", "Синий", "Зеленый"]}'
```

#### 4. Отправить реакцию
```bash
curl -X POST https://worker-production-193e.up.railway.app/api/send_reaction \
  -H "Content-Type: application/json" \
  -d '{"message_id": 123, "emoji": "👍"}'
```

#### 5. Редактировать сообщение
```bash
curl -X POST https://worker-production-193e.up.railway.app/api/edit_message \
  -H "Content-Type: application/json" \
  -d '{"message_id": 123, "text": "Обновленный текст"}'
```

#### 6. Удалить сообщение
```bash
curl -X POST https://worker-production-193e.up.railway.app/api/delete_message \
  -H "Content-Type: application/json" \
  -d '{"message_id": 123}'
```

#### 7. Получить информацию о канале
```bash
curl https://worker-production-193e.up.railway.app/api/channel_info
```

## 🔧 Подключение MCP клиентов

### Для Claude Desktop:
1. Откройте файл конфигурации MCP
2. Добавьте ваш сервер:
```json
{
  "mcpServers": {
    "telegram-mcp": {
      "command": "node",
      "args": ["dist/server.js"],
      "env": {
        "TELEGRAM_BOT_TOKEN": "8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0",
        "TELEGRAM_CHANNEL_ID": "@mymcptest"
      }
    }
  }
}
```

### Для Cursor:
1. Откройте настройки Cursor
2. Перейдите в раздел "MCP Servers"
3. Добавьте URL: `https://worker-production-193e.up.railway.app`

## 📱 Тестирование

### 1. Проверка через браузер:
- Откройте: `https://worker-production-193e.up.railway.app/`
- Должны увидеть информацию о сервере

### 2. Проверка статуса:
- Откройте: `https://worker-production-193e.up.railway.app/health`
- Должны увидеть: `{"status": "healthy", "timestamp": "..."}`

### 3. Проверка инструментов:
- Откройте: `https://worker-production-193e.up.railway.app/tools`
- Должны увидеть список всех 7 инструментов

## 🎯 Примеры использования

### Отправка сообщения через браузер:
1. Откройте `https://worker-production-193e.up.railway.app/`
2. Используйте встроенные формы для тестирования

### Отправка через Postman:
1. Создайте POST запрос
2. URL: `https://worker-production-193e.up.railway.app/api/send_message`
3. Body (JSON): `{"text": "Тестовое сообщение"}`

### Отправка через curl:
```bash
curl -X POST https://worker-production-193e.up.railway.app/api/send_message \
  -H "Content-Type: application/json" \
  -d '{"text": "Привет из Railway!"}'
```

## 🔍 Диагностика

### Если URL не работает:
1. **Проверьте статус деплоя** в Railway
2. **Убедитесь, что сервер запущен** (зеленый статус)
3. **Проверьте логи** на наличие ошибок

### Если API не отвечает:
1. **Проверьте переменные окружения**:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHANNEL_ID`
   - `NODE_ENV`
2. **Проверьте права бота** в Telegram канале
3. **Убедитесь, что бот добавлен** как администратор

## 🚀 Преимущества нового подхода

### ✅ HTTP API:
- Прямой доступ через браузер
- Легкое тестирование
- Интеграция с другими сервисами
- Простые curl команды

### ✅ MCP протокол:
- Подключение к AI клиентам
- Стандартизированный интерфейс
- Автоматическое обнаружение инструментов

### ✅ Гибридная архитектура:
- Один сервер, два интерфейса
- Максимальная совместимость
- Простота использования

---

## 🎉 Готово!

**Ваш MCP сервер теперь полностью функционален!**

- ✅ **HTTP API работает** через браузер
- ✅ **MCP протокол готов** для AI клиентов
- ✅ **Все 7 функций** доступны
- ✅ **URL работает**: `https://worker-production-193e.up.railway.app/`

**Попробуйте открыть URL в браузере прямо сейчас!** 🚀
