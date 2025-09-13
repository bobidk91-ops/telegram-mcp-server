# 🚀 Развертывание на Railway.com

## 📋 Пошаговая инструкция

### 1. Подготовка переменных окружения

Перед развертыванием подготовьте следующие переменные:

```env
TELEGRAM_BOT_TOKEN=8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0
TELEGRAM_CHANNEL_ID=@mymcptest
PORT=8080
NODE_ENV=production
```

### 2. Развертывание на Railway.com

#### Вариант A: Через веб-интерфейс Railway

1. **Откройте [Railway.com](https://railway.com)**
2. **Войдите в аккаунт** (или создайте новый)
3. **Нажмите "New Project"**
4. **Выберите "Deploy from GitHub repo"**
5. **Подключите репозиторий** `bobidk91-ops/telegram-mcp-server`
6. **Дождитесь автоматического развертывания**

#### Вариант B: Через Railway CLI

```bash
# Установка Railway CLI
npm install -g @railway/cli

# Вход в аккаунт
railway login

# Инициализация проекта
railway init

# Установка переменных окружения
railway variables set TELEGRAM_BOT_TOKEN=8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0
railway variables set TELEGRAM_CHANNEL_ID=@mymcptest
railway variables set PORT=8080
railway variables set NODE_ENV=production

# Развертывание
railway up
```

### 3. Настройка переменных окружения

В панели Railway:

1. **Перейдите в Settings** вашего проекта
2. **Откройте вкладку "Variables"**
3. **Добавьте переменные:**
   - `TELEGRAM_BOT_TOKEN` = `8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0`
   - `TELEGRAM_CHANNEL_ID` = `@mymcptest`
   - `PORT` = `8080`
   - `NODE_ENV` = `production`

### 4. Получение публичного URL

После развертывания:

1. **Перейдите в раздел "Deployments"**
2. **Скопируйте URL** (например: `https://telegram-mcp-server-production.up.railway.app`)
3. **Этот URL** будет использоваться для подключения

## 🔧 Проверка развертывания

### Тест через браузер

Откройте в браузере: `https://your-app.up.railway.app`

Должен отобразиться MCP сервер (может показать ошибку, это нормально для stdio сервера).

### Тест через curl

```bash
curl -X POST https://your-app.up.railway.app \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}'
```

## 📱 Настройка Telegram бота

### 1. Создание бота

1. **Напишите @BotFather** в Telegram
2. **Отправьте команду** `/newbot`
3. **Следуйте инструкциям** для создания бота
4. **Скопируйте токен** (формат: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Настройка канала

1. **Создайте канал** в Telegram
2. **Добавьте бота** как администратора канала
3. **Скопируйте username** канала (формат: `@mychannel`)

### 3. Права администратора

Убедитесь, что бот имеет права:
- ✅ **Отправка сообщений**
- ✅ **Редактирование сообщений**
- ✅ **Удаление сообщений**
- ✅ **Добавление участников** (для опросов)

## 🔌 Подключение к ChatGPT

### Через Claude Desktop

1. **Откройте настройки** Claude Desktop
2. **Добавьте MCP сервер** в конфигурацию:

```json
{
  "mcpServers": {
    "telegram": {
      "command": "node",
      "args": ["https://your-app.up.railway.app/dist/index.js"],
      "env": {
        "TELEGRAM_BOT_TOKEN": "8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0",
        "TELEGRAM_CHANNEL_ID": "@mymcptest"
      }
    }
  }
}
```

### Через Make.com

1. **Создайте новое подключение** в Make.com
2. **Выберите "MCP Server"**
3. **URL**: `https://your-app.up.railway.app`
4. **API Key**: оставьте пустым

## 🐛 Устранение неполадок

### Ошибка "Bot token not found"

- Проверьте переменную `TELEGRAM_BOT_TOKEN` в Railway
- Убедитесь, что токен корректный

### Ошибка "Channel not found"

- Проверьте переменную `TELEGRAM_CHANNEL_ID`
- Убедитесь, что бот добавлен в канал как администратор

### Ошибка "Permission denied"

- Проверьте права бота в канале
- Убедитесь, что бот может отправлять сообщения

### Сервер не запускается

- Проверьте логи в Railway панели
- Убедитесь, что все переменные окружения установлены
- Проверьте, что код собран без ошибок

## 📊 Мониторинг

### Логи Railway

1. **Перейдите в раздел "Deployments"**
2. **Откройте последний деплой**
3. **Просмотрите логи** для отладки

### Статистика использования

Railway предоставляет метрики:
- **CPU usage**
- **Memory usage**
- **Network traffic**
- **Response time**

## 🔄 Обновление

Для обновления сервера:

1. **Внесите изменения** в код
2. **Загрузите в GitHub** (`git push`)
3. **Railway автоматически** пересоберет и развернет новую версию

---

**✅ Готово! Ваш MCP сервер развернут и готов к использованию!**
