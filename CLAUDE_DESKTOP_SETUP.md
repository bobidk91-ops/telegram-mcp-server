# 🔧 Настройка Claude Desktop для Telegram MCP

## ❌ Проблема
ChatGPT/Claude Desktop **НЕ МОЖЕТ** подключаться к HTTP URL! MCP протокол работает только через **stdio** (локальный процесс).

## ✅ Решение: Локальное подключение

### 1. Скачайте и настройте проект локально

#### **Скачайте код:**
```bash
git clone https://github.com/bobidk91-ops/telegram-mcp-server.git
cd telegram-mcp-server
```

#### **Установите зависимости:**
```bash
npm install
```

#### **Соберите проект:**
```bash
npm run build
```

#### **Создайте .env файл:**
```bash
# Создайте файл .env в корне проекта
echo "TELEGRAM_BOT_TOKEN=8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0" > .env
echo "TELEGRAM_CHANNEL_ID=@mymcptest" >> .env
echo "NODE_ENV=development" >> .env
```

### 2. Настройте Claude Desktop

#### **Найдите файл конфигурации Claude Desktop:**
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

#### **Добавьте конфигурацию MCP сервера:**
```json
{
  "mcpServers": {
    "telegram-mcp": {
      "command": "node",
      "args": ["dist/stdio-mcp-server.js"],
      "cwd": "C:\\Users\\user\\Desktop\\Tg",
      "env": {
        "TELEGRAM_BOT_TOKEN": "8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0",
        "TELEGRAM_CHANNEL_ID": "@mymcptest",
        "NODE_ENV": "development"
      }
    }
  }
}
```

### 3. Альтернативный способ - через интерфейс Claude Desktop

#### **В Claude Desktop:**
1. **Откройте настройки** (Settings)
2. **Перейдите в раздел** "MCP Servers"
3. **Добавьте новый сервер:**
   - **Name**: `telegram-mcp`
   - **Command**: `node`
   - **Args**: `["dist/stdio-mcp-server.js"]`
   - **Working Directory**: `C:\Users\user\Desktop\Tg`
   - **Environment Variables**:
     - `TELEGRAM_BOT_TOKEN` = `8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0`
     - `TELEGRAM_CHANNEL_ID` = `@mymcptest`
     - `NODE_ENV` = `development`

### 4. Тестирование

#### **Проверьте локальный сервер:**
```bash
# В папке проекта
npm run dev:stdio

# Должно показать:
# 🚀 Telegram MCP Server started (stdio mode)
# 📱 Channel: @mymcptest
# ✅ Ready for Claude Desktop connection!
```

#### **Тест через Claude Desktop:**
1. **Перезапустите Claude Desktop**
2. **Откройте новый чат**
3. **Попробуйте команды:**
   - "Отправь сообщение 'Привет!' в Telegram канал"
   - "Создай опрос 'Как дела?' с вариантами: Отлично, Хорошо, Плохо"
   - "Покажи информацию о канале"

## 🔍 Диагностика проблем

### Если сервер не запускается:
1. **Проверьте .env файл** - все переменные должны быть установлены
2. **Проверьте токен бота** - должен быть действительным
3. **Проверьте права бота** - должен быть администратором канала
4. **Проверьте путь** - `cwd` должен указывать на папку проекта

### Если Claude Desktop не видит сервер:
1. **Проверьте конфигурацию** - JSON должен быть валидным
2. **Перезапустите Claude Desktop** после изменения конфигурации
3. **Проверьте логи** Claude Desktop на наличие ошибок

### Если команды не работают:
1. **Проверьте подключение к интернету**
2. **Проверьте токен бота** в .env файле
3. **Проверьте ID канала** - должен начинаться с @

## 📱 Доступные команды

После настройки в Claude Desktop будут доступны:

1. **send_message** - Отправка текстовых сообщений
2. **send_photo** - Отправка фотографий с подписями
3. **send_poll** - Создание опросов и викторин
4. **send_reaction** - Отправка эмодзи реакций
5. **edit_message** - Редактирование сообщений
6. **delete_message** - Удаление сообщений
7. **get_channel_info** - Информация о канале

## 🚀 Быстрый старт

### 1. Скачайте проект:
```bash
git clone https://github.com/bobidk91-ops/telegram-mcp-server.git
cd telegram-mcp-server
```

### 2. Установите и соберите:
```bash
npm install
npm run build
```

### 3. Создайте .env:
```bash
echo "TELEGRAM_BOT_TOKEN=8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0" > .env
echo "TELEGRAM_CHANNEL_ID=@mymcptest" >> .env
echo "NODE_ENV=development" >> .env
```

### 4. Настройте Claude Desktop:
- Используйте конфигурацию выше
- Укажите правильный путь к проекту

### 5. Перезапустите Claude Desktop и тестируйте!

---

## 🎯 Важно!

**MCP клиенты НЕ МОГУТ подключаться к HTTP URL!**

**Правильный способ:**
- ✅ **Локальный stdio сервер** через файл конфигурации
- ❌ **HTTP URL** (не работает с MCP протоколом)

**Railway URL работает только для HTTP API, но не для MCP клиентов!**
