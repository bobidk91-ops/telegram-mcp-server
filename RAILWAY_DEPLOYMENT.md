# 🚂 Деплой MCP сервера на Railway

## Подготовка к деплою

### 1. Создание аккаунта Railway

1. Перейдите на [railway.app](https://railway.app)
2. Войдите через GitHub
3. Подтвердите email

### 2. Подготовка репозитория

```bash
# Инициализация Git (если еще не сделано)
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "Initial commit: MCP server with WordPress integration"

# Создание репозитория на GitHub
# Перейдите на github.com и создайте новый репозиторий

# Подключение к GitHub
git remote add origin https://github.com/YOUR_USERNAME/telegram-mcp-server.git

# Отправка кода
git push -u origin main
```

### 3. Деплой на Railway

1. **Создание проекта**
   - Нажмите "New Project"
   - Выберите "Deploy from GitHub repo"
   - Выберите ваш репозиторий

2. **Настройка переменных окружения**
   - Перейдите в Settings → Variables
   - Добавьте следующие переменные:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0
TELEGRAM_CHANNEL_ID=@mymcptest

# Pexels API Configuration
PEXELS_API_KEY=j0CGX7JRiZOmEz1bEYvxZeRn1cS7qdFy5351PmDtZ01Wnby18AIeWt32

# Yandex OAuth Configuration
YANDEX_CLIENT_ID=11221f6ebd2d47649d42d9f4b282a876
YANDEX_CLIENT_SECRET=eb793370893544d683bf277d14bfd842

# WordPress Configuration - KavkazOutdoor
WORDPRESS_URL=https://kavkazoutdoor.ru
WORDPRESS_USERNAME=u3282220_Boris
WORDPRESS_APPLICATION_PASSWORD=cRM5 eqYh iYcm sFl6 Kvjb MoSj

# Server Configuration
PORT=8080
NODE_ENV=production
```

3. **Настройка домена**
   - Перейдите в Settings → Domains
   - Добавьте кастомный домен или используйте Railway домен

### 4. Проверка деплоя

После деплоя проверьте:

1. **Health Check**: `https://your-app.railway.app/health`
2. **MCP Info**: `https://your-app.railway.app/mcp`
3. **Tools List**: `https://your-app.railway.app/mcp/tools/list`

### 5. Тестирование функций

```bash
# Тест соединения с WordPress
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

# Тест получения постов
curl -X POST https://your-app.railway.app/ \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "wordpress_get_posts",
      "arguments": {"per_page": 5}
    },
    "id": 2
  }'
```

## Структура проекта для Railway

```
telegram-mcp-server/
├── src/
│   ├── index.ts              # stdio сервер
│   ├── simple-server.ts      # HTTP сервер
│   ├── wordpress-api.ts      # WordPress API модуль
│   └── telegram-bot.ts       # Telegram Bot модуль
├── dist/                     # Скомпилированные файлы
├── package.json              # Зависимости и скрипты
├── tsconfig.json             # TypeScript конфигурация
├── railway.json              # Railway конфигурация
├── Procfile                  # Процесс для Railway
├── .env.example              # Пример переменных окружения
└── README.md                 # Документация
```

## Автоматический деплой

Railway автоматически:
- Собирает проект при каждом push в main
- Устанавливает зависимости
- Запускает сервер
- Проверяет health endpoint

## Мониторинг

1. **Логи**: View → Logs
2. **Метрики**: View → Metrics
3. **Переменные**: Settings → Variables

## Обновление

Для обновления просто сделайте push в main:

```bash
git add .
git commit -m "Update: new features"
git push origin main
```

## Безопасность

- Все секреты хранятся в Railway Variables
- Не коммитьте .env файлы
- Используйте HTTPS для всех API вызовов
- Регулярно обновляйте зависимости

## Стоимость

- **Hobby Plan**: $5/месяц
- **Pro Plan**: $20/месяц
- **Team Plan**: $99/месяц

## Поддержка

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [GitHub Issues](https://github.com/railwayapp/cli/issues)

## Готово! 🎉

После деплоя ваш MCP сервер будет доступен по адресу:
`https://your-app.railway.app`

Все функции WordPress, Telegram и Pexels будут работать в облаке!
