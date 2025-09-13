# ⚡ БЫСТРАЯ ШПАРГАЛКА ПО РАЗВЕРТЫВАНИЮ

## 🎯 6 ШАГОВ ДО ГОТОВОГО СЕРВЕРА

### 1️⃣ GitHub (2 минуты)
```
🌐 github.com → New repository
📝 Name: telegram-mcp-server
🔓 Public → Create repository
📋 Скопировать URL
```

### 2️⃣ Подключение (1 минута)
```
💻 cmd /c github_connect.bat
📋 Вставить URL репозитория
⏳ Дождаться загрузки
```

### 3️⃣ Railway (3 минуты)
```
🌐 railway.app → Login with GitHub
➕ New Project → Deploy from GitHub repo
🔍 Найти telegram-mcp-server → Выбрать
⏳ Дождаться развертывания
```

### 4️⃣ Переменные (2 минуты)
```
⚙️ Variables → New Variable
🔑 TELEGRAM_BOT_TOKEN = 8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0
🔑 TELEGRAM_CHANNEL_ID = @mymcptest
🔑 NODE_ENV = production
🔄 Redeploy
```

### 5️⃣ Telegram бот (3 минуты)
```
📱 @BotFather → /newbot
📝 Name: My MCP Bot
📝 Username: mymcp_bot
📋 Скопировать токен
📱 @mymcptest → Управление → Администраторы → Добавить бота
```

### 6️⃣ Проверка (1 минута)
```
🌐 ВАШ_URL/health → {"status": "healthy"}
📱 @mymcptest → Проверить сообщение
```

---

## 🚨 БЫСТРОЕ РЕШЕНИЕ ПРОБЛЕМ

### Git не найден
```
🔧 Скачать: git-scm.com/download/win
🔄 Перезапустить PowerShell
✅ Проверить: git --version
```

### 401 Unauthorized
```
🔍 Проверить токен в Railway Variables
❌ Убрать лишние пробелы
🔄 Пересоздать бота через @BotFather
```

### 403 Forbidden
```
👥 Проверить права бота в канале
✅ Бот должен быть администратором
📝 Права на отправку сообщений
```

### Ошибка сборки
```
📁 Проверить файлы в GitHub
📦 Убедиться что package.json корректен
🔄 Попробовать Redeploy в Railway
```

---

## 🎯 ГОТОВЫЕ КОМАНДЫ

### Запуск развертывания
```bash
# Переход в папку
cd C:\Users\user\Desktop\Tg

# Подключение к GitHub
cmd /c github_connect.bat

# Проверка статуса
cmd /c "\"C:\Program Files\Git\bin\git.exe\" status"
```

### Тест сервера
```bash
# Health check
curl https://ВАШ_URL/health

# Отправка сообщения
curl -X POST https://ВАШ_URL/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "send_message", "arguments": {"text": "🚀 Тест!", "parse_mode": "HTML"}}}'
```

---

## 📊 ЧЕК-ЛИСТ ГОТОВНОСТИ

### ✅ Подготовка
```
□ Git установлен и работает
□ Все файлы проекта созданы
□ GitHub аккаунт создан
□ Railway аккаунт создан
```

### ✅ Развертывание
```
□ GitHub репозиторий создан
□ Код загружен на GitHub
□ Railway проект создан
□ Переменные окружения настроены
□ Telegram бот создан
□ Бот добавлен в канал как администратор
```

### ✅ Проверка
```
□ Health check работает
□ Тестовое сообщение отправлено
□ Логи Railway без ошибок
□ Все 15 функций доступны
```

---

## 🎉 РЕЗУЛЬТАТ

После выполнения всех шагов:

### 🚀 У вас будет
- **MCP сервер** с 15 функциями
- **Автоматическое развертывание** на Railway
- **Управление Telegram каналом** через AI
- **Health check** для мониторинга

### 📱 Доступные функции
```
📝 send_message - отправка текста
📸 send_photo - отправка фото
📄 send_document - отправка документов
📚 send_media_group - отправка альбомов
🗳️ send_poll - создание опросов
👍 send_reaction - отправка реакций
📌 pin_message - закрепление сообщений
✏️ edit_message - редактирование
🗑️ delete_message - удаление
📍 send_venue - отправка мест
📞 send_contact - отправка контактов
📊 get_channel_info - информация о канале
👥 get_chat_member_count - количество подписчиков
```

### 🤖 Интеграция с AI
```
Claude Desktop → MCP Server → Telegram Channel
💬 Автоматическая публикация
📊 Управление каналом
🎯 Полная автоматизация
```

---

## ⏱️ ВРЕМЯ РАЗВЕРТЫВАНИЯ

- **Подготовка**: 5 минут
- **GitHub**: 2 минуты
- **Railway**: 3 минуты
- **Настройка**: 2 минуты
- **Telegram**: 3 минуты
- **Проверка**: 1 минута

**🎯 ИТОГО: 16 минут до готового сервера!**

---

**🚀 Готово к развертыванию! Следуйте шагам и получите полнофункциональный MCP сервер!**
