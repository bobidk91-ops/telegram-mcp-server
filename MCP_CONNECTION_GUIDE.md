# 🔌 Руководство по подключению MCP клиентов

## ❌ Проблема
MCP клиент не может подключиться к URL `https://worker-production-193e.up.railway.app` потому что:
- MCP протокол работает через **stdio** (стандартный ввод/вывод), а не HTTP
- Обычные MCP серверы не поддерживают удаленное подключение через URL

## ✅ Решение

### Вариант 1: Локальное подключение (Рекомендуется)

#### Для Claude Desktop:
1. **Скачайте код** с GitHub:
   ```bash
   git clone https://github.com/bobidk91-ops/telegram-mcp-server.git
   cd telegram-mcp-server
   npm install
   npm run build
   ```

2. **Создайте файл `.env`**:
   ```
   TELEGRAM_BOT_TOKEN=8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0
   TELEGRAM_CHANNEL_ID=@mymcptest
   NODE_ENV=development
   ```

3. **Настройте Claude Desktop**:
   ```json
   {
     "mcpServers": {
       "telegram-mcp": {
         "command": "node",
         "args": ["dist/server.js"],
         "cwd": "/path/to/telegram-mcp-server",
         "env": {
           "TELEGRAM_BOT_TOKEN": "8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0",
           "TELEGRAM_CHANNEL_ID": "@mymcptest"
         }
       }
     }
   }
   ```

### Вариант 2: HTTP API (Альтернатива)

#### Используйте HTTP endpoints напрямую:
- **Главная**: `https://worker-production-193e.up.railway.app/`
- **Статус**: `https://worker-production-193e.up.railway.app/health`
- **Инструменты**: `https://worker-production-193e.up.railway.app/tools`

#### Отправка сообщения через HTTP:
```bash
curl -X POST https://worker-production-193e.up.railway.app/api/send_message \
  -H "Content-Type: application/json" \
  -d '{"text": "Привет из HTTP API!"}'
```

### Вариант 3: WebSocket MCP (Экспериментальный)

#### Для продвинутых пользователей:
- **WebSocket URL**: `wss://worker-production-193e.up.railway.app`
- **HTTP MCP**: `https://worker-production-193e.up.railway.app/mcp`

## 🔧 Настройка MCP клиентов

### Claude Desktop:
1. **Откройте настройки** Claude Desktop
2. **Перейдите в раздел** "MCP Servers"
3. **Добавьте сервер** с локальным путем:
   ```json
   {
     "mcpServers": {
       "telegram-mcp": {
         "command": "node",
         "args": ["dist/server.js"],
         "cwd": "C:\\path\\to\\telegram-mcp-server",
         "env": {
           "TELEGRAM_BOT_TOKEN": "8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0",
           "TELEGRAM_CHANNEL_ID": "@mymcptest"
         }
       }
     }
   }
   ```

### Cursor:
1. **Откройте настройки** Cursor
2. **Перейдите в раздел** "MCP Servers"
3. **Добавьте локальный сервер**:
   - **Command**: `node`
   - **Args**: `["dist/server.js"]`
   - **Working Directory**: Путь к проекту
   - **Environment Variables**: Добавьте токены

## 📱 Тестирование подключения

### 1. Проверка HTTP API:
```bash
# Проверка статуса
curl https://worker-production-193e.up.railway.app/health

# Отправка сообщения
curl -X POST https://worker-production-193e.up.railway.app/api/send_message \
  -H "Content-Type: application/json" \
  -d '{"text": "Тестовое сообщение"}'
```

### 2. Проверка MCP сервера:
```bash
# Запуск локально
cd telegram-mcp-server
npm run dev

# Тест через stdio
echo '{"method": "tools/list", "params": {}}' | node dist/server.js
```

## 🚀 Быстрый старт

### 1. Скачайте проект:
```bash
git clone https://github.com/bobidk91-ops/telegram-mcp-server.git
cd telegram-mcp-server
```

### 2. Установите зависимости:
```bash
npm install
```

### 3. Настройте переменные:
```bash
# Создайте .env файл
echo "TELEGRAM_BOT_TOKEN=8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0" > .env
echo "TELEGRAM_CHANNEL_ID=@mymcptest" >> .env
echo "NODE_ENV=development" >> .env
```

### 4. Соберите проект:
```bash
npm run build
```

### 5. Настройте MCP клиент:
- Используйте локальный путь к `dist/server.js`
- Добавьте переменные окружения

## 🔍 Диагностика

### Если MCP не подключается:
1. **Проверьте путь** к `dist/server.js`
2. **Убедитесь, что проект собран** (`npm run build`)
3. **Проверьте переменные окружения**
4. **Убедитесь, что бот добавлен** в канал как администратор

### Если HTTP API не работает:
1. **Проверьте статус** в Railway
2. **Убедитесь, что сервер запущен**
3. **Проверьте логи** на наличие ошибок

## 💡 Рекомендации

### Для разработки:
- Используйте **локальное подключение** через stdio
- Это стандартный способ работы с MCP серверами

### Для продакшена:
- Используйте **HTTP API** для интеграций
- MCP протокол предназначен для локального использования

---

## 🎯 Итог

**MCP клиенты не могут подключаться к URL напрямую!**

**Правильный способ:**
1. **Скачайте код** локально
2. **Настройте MCP клиент** на локальный файл
3. **Используйте HTTP API** для удаленного доступа

**URL `https://worker-production-193e.up.railway.app/` работает для HTTP API, но не для MCP протокола!**
