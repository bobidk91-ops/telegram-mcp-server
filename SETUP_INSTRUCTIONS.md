# 🚀 Инструкции по развертыванию Telegram MCP Server

## 📋 Предварительные требования

### 1. Установка Git

**Скачайте и установите Git:**
- Перейдите на [git-scm.com](https://git-scm.com/download/win)
- Скачайте установщик для Windows
- Запустите установщик с настройками по умолчанию
- Перезапустите PowerShell/Command Prompt

**Проверка установки:**
```bash
git --version
```

### 2. Создание GitHub аккаунта

- Перейдите на [github.com](https://github.com)
- Зарегистрируйтесь или войдите в существующий аккаунт
- Подтвердите email адрес

### 3. Создание Railway аккаунта

- Перейдите на [railway.app](https://railway.app)
- Войдите через GitHub
- Подтвердите авторизацию

## 🚀 Варианты развертывания

### Вариант 1: Через GitHub (Рекомендуется)

#### Шаг 1: Инициализация Git репозитория
```bash
git init
git add .
git commit -m "Initial commit: Telegram MCP Server"
```

#### Шаг 2: Создание GitHub репозитория
1. Зайдите на GitHub.com
2. Нажмите "New repository"
3. Название: `telegram-mcp-server`
4. Описание: `MCP Server for Telegram channel management`
5. Выберите "Public" или "Private"
6. НЕ добавляйте README, .gitignore, лицензию (они уже есть)
7. Нажмите "Create repository"

#### Шаг 3: Подключение к GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/telegram-mcp-server.git
git branch -M main
git push -u origin main
```

#### Шаг 4: Развертывание на Railway
1. Зайдите на [railway.app](https://railway.app)
2. Нажмите "New Project"
3. Выберите "Deploy from GitHub repo"
4. Найдите и выберите `telegram-mcp-server`
5. Railway автоматически определит тип проекта

#### Шаг 5: Настройка переменных окружения
В панели Railway:
1. Перейдите в раздел "Variables"
2. Добавьте переменные:
   - `TELEGRAM_BOT_TOKEN` = `8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0`
   - `TELEGRAM_CHANNEL_ID` = `@mymcptest`
   - `NODE_ENV` = `production`

### Вариант 2: Прямая загрузка на Railway

#### Шаг 1: Установка Railway CLI
```bash
npm install -g @railway/cli
```

#### Шаг 2: Логин в Railway
```bash
railway login
```

#### Шаг 3: Создание проекта
```bash
railway init
```

#### Шаг 4: Развертывание
```bash
railway up
```

#### Шаг 5: Настройка переменных
```bash
railway variables set TELEGRAM_BOT_TOKEN=8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0
railway variables set TELEGRAM_CHANNEL_ID=@mymcptest
railway variables set NODE_ENV=production
```

### Вариант 3: Через веб-интерфейс Railway

#### Шаг 1: Создание архива проекта
1. Выберите все файлы проекта
2. Создайте ZIP архив
3. Назовите его `telegram-mcp-server.zip`

#### Шаг 2: Загрузка на Railway
1. Зайдите на [railway.app](https://railway.app)
2. Нажмите "New Project"
3. Выберите "Deploy from template" или "Empty Project"
4. Загрузите ZIP архив
5. Railway автоматически определит тип проекта

## 🔧 Настройка Telegram бота

### Создание бота
1. Найдите [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям:
   - Название бота: `My MCP Bot`
   - Username: `mymcp_bot` (или любой доступный)
4. Скопируйте полученный токен

### Добавление бота в канал
1. Откройте канал `@mymcptest`
2. Нажмите "Управление каналом" → "Администраторы"
3. Нажмите "Добавить администратора"
4. Найдите вашего бота по username
5. Дайте права:
   - ✅ Отправлять сообщения
   - ✅ Редактировать сообщения
   - ✅ Удалять сообщения
   - ✅ Закреплять сообщения

## ✅ Проверка развертывания

### Health Check
После развертывания проверьте:
```bash
curl https://your-project-name-production.up.railway.app/health
```

Ожидаемый ответ:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Тест отправки сообщения
```bash
curl -X POST https://your-project-name-production.up.railway.app/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "send_message",
      "arguments": {
        "text": "🚀 Сервер успешно развернут!",
        "parse_mode": "HTML"
      }
    }
  }'
```

## 🆘 Решение проблем

### Ошибка: "git не найден"
**Решение:** Установите Git с [git-scm.com](https://git-scm.com/download/win)

### Ошибка: "401 Unauthorized"
**Решение:** Проверьте правильность `TELEGRAM_BOT_TOKEN`

### Ошибка: "403 Forbidden"
**Решение:** Убедитесь, что бот добавлен в канал как администратор

### Ошибка сборки на Railway
**Решение:** Проверьте, что все файлы загружены в репозиторий

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи в панели Railway
2. Убедитесь, что все переменные окружения настроены
3. Проверьте права бота в канале
4. Создайте issue в GitHub репозитории

---

**Выберите подходящий вариант и следуйте инструкциям! 🚀**
