# 📁 Структура проекта Telegram MCP Server

```
telegram-mcp-server/
├── 📁 src/                          # Исходный код
│   └── 📄 index.ts                  # Основной файл MCP сервера
├── 📄 package.json                  # Зависимости и скрипты
├── 📄 tsconfig.json                 # Конфигурация TypeScript
├── 📄 railway.json                  # Конфигурация для Railway
├── 📄 Procfile                      # Команда запуска для Railway
├── 📄 .gitignore                    # Игнорируемые файлы Git
├── 📄 env.example                   # Пример переменных окружения
├── 📄 README.md                     # Основная документация
├── 📄 QUICK_START.md                # Быстрый старт
├── 📄 EXAMPLES.md                   # Примеры использования
├── 📄 RAILWAY_DEPLOYMENT.md         # Инструкции по развертыванию
└── 📄 PROJECT_STRUCTURE.md          # Этот файл
```

## 📋 Описание файлов

### 🚀 Основные файлы

- **`src/index.ts`** - Главный файл MCP сервера с реализацией всех функций
- **`package.json`** - Метаданные проекта, зависимости и скрипты
- **`tsconfig.json`** - Конфигурация TypeScript компилятора

### 🚂 Конфигурация для Railway

- **`railway.json`** - Настройки развертывания на Railway
- **`Procfile`** - Команда запуска для облачной платформы
- **`.gitignore`** - Файлы, исключаемые из Git репозитория

### 📚 Документация

- **`README.md`** - Полная документация проекта
- **`QUICK_START.md`** - Быстрый старт для новых пользователей
- **`EXAMPLES.md`** - Практические примеры использования
- **`RAILWAY_DEPLOYMENT.md`** - Подробные инструкции по развертыванию
- **`PROJECT_STRUCTURE.md`** - Описание структуры проекта

### ⚙️ Конфигурация

- **`env.example`** - Шаблон переменных окружения

## 🔧 Зависимости

### Основные зависимости

```json
{
  "@modelcontextprotocol/sdk": "^0.4.0",  // MCP SDK
  "node-telegram-bot-api": "^0.66.0",     // Telegram Bot API
  "dotenv": "^16.3.1",                     // Переменные окружения
  "express": "^4.18.2"                     // HTTP сервер для health check
}
```

### Зависимости разработки

```json
{
  "@types/node": "^20.10.0",              // Типы Node.js
  "@types/node-telegram-bot-api": "^0.64.5", // Типы Telegram API
  "@types/express": "^4.17.21",           // Типы Express
  "typescript": "^5.3.0",                 // TypeScript компилятор
  "ts-node": "^10.9.0"                    // TypeScript для Node.js
}
```

## 🛠 Скрипты

```json
{
  "build": "tsc",                    // Сборка TypeScript
  "start": "node dist/index.js",     // Запуск продакшн версии
  "dev": "ts-node src/index.ts",     // Запуск в режиме разработки
  "watch": "tsc -w"                   // Автоматическая пересборка
}
```

## 📦 Структура сборки

После выполнения `npm run build` создается папка `dist/`:

```
dist/
└── 📄 index.js                      # Скомпилированный JavaScript
```

## 🔐 Переменные окружения

### Обязательные

- `TELEGRAM_BOT_TOKEN` - Токен Telegram бота
- `TELEGRAM_CHANNEL_ID` - ID или username канала

### Опциональные

- `PORT` - Порт для HTTP сервера (по умолчанию 3000)
- `NODE_ENV` - Окружение (development/production)

## 🚀 Процесс развертывания

### Локальная разработка

1. `npm install` - Установка зависимостей
2. `cp env.example .env` - Настройка переменных
3. `npm run dev` - Запуск в режиме разработки

### Продакшн сборка

1. `npm run build` - Компиляция TypeScript
2. `npm start` - Запуск продакшн версии

### Развертывание на Railway

1. Push в GitHub репозиторий
2. Railway автоматически:
   - Установит зависимости
   - Соберет проект
   - Запустит сервер

## 📊 Мониторинг

### Health Check

- **Эндпоинт**: `GET /health`
- **Ответ**: `{"status": "healthy", "timestamp": "..."}`

### Логи

- **Локально**: Вывод в консоль
- **Railway**: Панель управления → Deployments → View Logs

## 🔄 Обновления

### Автоматические

- Railway автоматически развертывает изменения при push в основную ветку

### Ручные

- В панели Railway: Deployments → Redeploy

## 🎯 Расширение функциональности

### Добавление новых инструментов

1. Добавьте описание в `ListToolsRequestSchema`
2. Реализуйте обработчик в `CallToolRequestSchema`
3. Обновите документацию

### Пример добавления нового инструмента

```typescript
// В ListToolsRequestSchema
{
  name: 'new_tool',
  description: 'Описание нового инструмента',
  inputSchema: {
    type: 'object',
    properties: {
      param: { type: 'string', description: 'Параметр' }
    },
    required: ['param']
  }
}

// В CallToolRequestSchema
case 'new_tool':
  // Реализация логики
  return { content: [{ type: 'text', text: 'Результат' }] };
```

---

**Проект готов к использованию! 🎉**

