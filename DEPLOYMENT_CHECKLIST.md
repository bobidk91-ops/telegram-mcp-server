# ✅ Чек-лист деплоя на Railway

## Подготовка к деплою

### 1. GitHub репозиторий
- [ ] Создать репозиторий на GitHub
- [ ] Подключить локальный репозиторий к GitHub
- [ ] Отправить код на GitHub

### 2. Railway аккаунт
- [ ] Зарегистрироваться на railway.app
- [ ] Подключить GitHub аккаунт
- [ ] Создать новый проект

### 3. Переменные окружения
- [ ] TELEGRAM_BOT_TOKEN
- [ ] TELEGRAM_CHANNEL_ID
- [ ] PEXELS_API_KEY
- [ ] YANDEX_CLIENT_ID
- [ ] YANDEX_CLIENT_SECRET
- [ ] WORDPRESS_URL
- [ ] WORDPRESS_USERNAME
- [ ] WORDPRESS_APPLICATION_PASSWORD
- [ ] PORT
- [ ] NODE_ENV

### 4. Деплой
- [ ] Выбрать репозиторий для деплоя
- [ ] Настроить переменные окружения
- [ ] Запустить деплой
- [ ] Дождаться завершения сборки

### 5. Тестирование
- [ ] Проверить health endpoint
- [ ] Протестировать WordPress соединение
- [ ] Проверить Telegram Bot
- [ ] Протестировать Pexels API

## Команды для деплоя

```bash
# 1. Подключение к GitHub
git remote add origin https://github.com/YOUR_USERNAME/telegram-mcp-server.git

# 2. Отправка кода
git push -u origin main

# 3. Создание проекта на Railway
# Перейти на railway.app → New Project → Deploy from GitHub repo

# 4. Настройка переменных окружения
# Settings → Variables → Add Variable

# 5. Проверка деплоя
curl https://your-app.railway.app/health
```

## Проверочные тесты

### Health Check
```bash
curl https://your-app.railway.app/health
```

### WordPress Test
```bash
curl -X POST https://your-app.railway.app/ \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "wordpress_test_connection",
      "arguments": {}
    },
    "id": 1
  }'
```

### Telegram Test
```bash
curl -X POST https://your-app.railway.app/ \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "send_telegram_message",
      "arguments": {
        "text": "Тест деплоя на Railway!"
      }
    },
    "id": 1
  }'
```

## Возможные проблемы

### 1. Ошибка сборки
- Проверить package.json
- Убедиться в правильности TypeScript конфигурации
- Проверить зависимости

### 2. Ошибка переменных окружения
- Проверить все переменные в Railway
- Убедиться в правильности значений
- Проверить формат Application Password

### 3. Ошибка подключения к WordPress
- Проверить WORDPRESS_URL
- Убедиться в правильности Application Password
- Проверить доступность REST API

### 4. Ошибка Telegram Bot
- Проверить TELEGRAM_BOT_TOKEN
- Убедиться в правильности TELEGRAM_CHANNEL_ID
- Проверить права бота

## Мониторинг

### Логи
- View → Logs в Railway dashboard
- Проверить ошибки и предупреждения

### Метрики
- View → Metrics
- Мониторинг CPU, памяти, сети

### Health Check
- Регулярно проверять /health endpoint
- Настроить мониторинг uptime

## Обновление

```bash
# Внесение изменений
git add .
git commit -m "Update: new features"
git push origin main

# Railway автоматически пересоберет и перезапустит приложение
```

## Готово! 🎉

После успешного деплоя:
- MCP сервер будет доступен в облаке
- Все функции WordPress, Telegram и Pexels будут работать
- Автоматические обновления при каждом push
- Мониторинг и логирование включены
