# Telegram MCP Server with Pexels & WordPress

Полнофункциональный MCP (Model Context Protocol) сервер для интеграции с Telegram каналами, Pexels API и WordPress.

<a href="https://glama.ai/mcp/servers/@bobidk91-ops/telegram-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@bobidk91-ops/telegram-mcp-server/badge" alt="Telegram Server MCP server" />
</a>

## 🚀 Возможности

- **12 Telegram функций**: отправка сообщений, фото, видео, документов, опросов, реакций, редактирование, удаление, закрепление сообщений
- **5 Pexels API функций**: поиск фото и видео, кураторские подборки, популярные видео
- **40+ WordPress функций**: полное управление постами, страницами, медиа, пользователями, категориями, тегами, комментариями
- **MCP протокол**: полная поддержка JSON-RPC 2.0
- **HTTP API**: поддержка как MCP, так и REST API
- **Railway деплой**: готов к развертыванию в облаке
- **UTF-8 поддержка**: корректная обработка русского текста

## 📋 Доступные инструменты

### Telegram (12 инструментов)
1. `send_message` - Отправка текстовых сообщений
2. `send_photo` - Отправка фотографий
3. `send_video` - Отправка видео
4. `send_document` - Отправка документов
5. `send_poll` - Создание опросов
6. `send_reaction` - Отправка реакций
7. `edit_message` - Редактирование сообщений
8. `delete_message` - Удаление сообщений
9. `pin_message` - Закрепление сообщений
10. `unpin_message` - Открепление сообщений
11. `get_channel_info` - Получение информации о канале
12. `get_channel_stats` - Получение статистики канала

### Pexels API (5 инструментов)
13. `pexels_search_photos` - Поиск фотографий по запросу
14. `pexels_get_photo` - Получение фото по ID
15. `pexels_curated_photos` - Кураторские фотографии
16. `pexels_search_videos` - Поиск видео по запросу
17. `pexels_popular_videos` - Популярные видео

### WordPress (40+ инструментов)

#### Посты (Posts)
18. `wordpress_get_posts` - Получение списка постов
19. `wordpress_get_post` - Получение поста по ID
20. `wordpress_create_post` - Создание нового поста
21. `wordpress_update_post` - Обновление поста
22. `wordpress_delete_post` - Удаление поста

#### Страницы (Pages)
23. `wordpress_get_pages` - Получение списка страниц
24. `wordpress_get_page` - Получение страницы по ID
25. `wordpress_create_page` - Создание новой страницы
26. `wordpress_update_page` - Обновление страницы
27. `wordpress_delete_page` - Удаление страницы

#### Медиафайлы (Media)
28. `wordpress_get_media` - Получение списка медиафайлов
29. `wordpress_get_media_item` - Получение медиафайла по ID
30. `wordpress_upload_media` - Загрузка медиафайла
31. `wordpress_update_media` - Обновление медиафайла
32. `wordpress_delete_media` - Удаление медиафайла

#### Категории (Categories)
33. `wordpress_get_categories` - Получение списка категорий
34. `wordpress_get_category` - Получение категории по ID
35. `wordpress_create_category` - Создание новой категории
36. `wordpress_update_category` - Обновление категории
37. `wordpress_delete_category` - Удаление категории

#### Теги (Tags)
38. `wordpress_get_tags` - Получение списка тегов
39. `wordpress_get_tag` - Получение тега по ID
40. `wordpress_create_tag` - Создание нового тега
41. `wordpress_update_tag` - Обновление тега
42. `wordpress_delete_tag` - Удаление тега

#### Пользователи (Users)
43. `wordpress_get_users` - Получение списка пользователей
44. `wordpress_get_user` - Получение пользователя по ID
45. `wordpress_create_user` - Создание нового пользователя
46. `wordpress_update_user` - Обновление пользователя
47. `wordpress_delete_user` - Удаление пользователя

#### Комментарии (Comments)
48. `wordpress_get_comments` - Получение списка комментариев
49. `wordpress_get_comment` - Получение комментария по ID
50. `wordpress_create_comment` - Создание нового комментария
51. `wordpress_update_comment` - Обновление комментария
52. `wordpress_delete_comment` - Удаление комментария

#### Информация о сайте
53. `wordpress_get_site_info` - Получение информации о сайте
54. `wordpress_get_settings` - Получение настроек сайта
55. `wordpress_search` - Поиск по контенту
56. `wordpress_test_connection` - Проверка соединения

## 🛠 Установка

```bash
npm install
npm run build
```

## 🚀 Запуск

```bash
# Локальный запуск
npm start

# Разработка
npm run dev
```

## 🌐 Деплой на Railway

1. Подключите GitHub репозиторий к Railway
2. Railway автоматически определит Node.js проект
3. Настройте переменные окружения:
   - `TELEGRAM_BOT_TOKEN` - токен Telegram бота
   - `TELEGRAM_CHANNEL_ID` - ID канала (например, @channel)
   - `PEXELS_API_KEY` - API ключ Pexels (получить на https://www.pexels.com/api/)
   - `WORDPRESS_URL` - URL вашего WordPress сайта
   - `WORDPRESS_USERNAME` - имя пользователя WordPress
   - `WORDPRESS_APPLICATION_PASSWORD` - пароль приложения WordPress

## 📡 API Endpoints

- `GET /` - Информация о сервере
- `GET /health` - Проверка здоровья
- `GET /tools/list` - Список инструментов (MCP)
- `POST /` - MCP JSON-RPC 2.0 эндпоинт

## 🔧 Использование

### MCP клиенты (ChatGPT, Claude Desktop)
```
URL: https://telegram-mcp-server-production.up.railway.app
```

### REST API
```bash
# Получить список инструментов
curl https://telegram-mcp-server-production.up.railway.app/tools/list

# Отправить сообщение
curl -X POST https://telegram-mcp-server-production.up.railway.app \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "send_message",
      "arguments": {
        "text": "Привет из MCP сервера!",
        "parse_mode": "HTML"
      }
    },
    "id": 1
  }'
```

## 📁 Структура проекта

```
├── src/
│   ├── simple-server.ts    # Основной MCP сервер
│   └── index.ts           # Альтернативная реализация
├── dist/                  # Скомпилированный код
├── package.json           # Зависимости и скрипты
├── Procfile              # Конфигурация Railway
├── tsconfig.json         # TypeScript конфигурация
└── README.md            # Документация
```

## ✅ Статус

- **Railway URL**: `https://telegram-mcp-server-production.up.railway.app`
- **Версия**: v2.2.0
- **Статус**: ✅ Работает
- **MCP совместимость**: ✅ Полная
- **Telegram интеграция**: ✅ Активна
- **Pexels API**: ✅ Активна
- **WordPress интеграция**: ✅ Активна
- **Всего инструментов**: 56+ (12 Telegram + 5 Pexels + 40+ WordPress)

## 📖 Документация

- [WordPress Integration Guide](./WORDPRESS_INTEGRATION_GUIDE.md) - Полная документация по WordPress интеграции
- [Pexels API Guide](./PEXELS_API_GUIDE.md) - Полная документация по Pexels интеграции
- [Telegram Setup](./TELEGRAM_SETUP_GUIDE.md) - Настройка Telegram бота
- [Troubleshooting](./TROUBLESHOOTING.md) - Решение проблем

## 🎯 Готов к использованию!

Сервер полностью настроен и готов к работе с ChatGPT, Claude Desktop и другими MCP клиентами.

### Новые возможности v2.2.0:
- 🌐 Полная интеграция с WordPress REST API
- 📝 Управление постами, страницами, медиафайлами
- 👥 Управление пользователями, категориями, тегами
- 💬 Управление комментариями
- 🔍 Поиск по контенту WordPress
- 📤 Загрузка медиафайлов по URL
- 🔐 Аутентификация через Application Passwords

### Возможности v2.1.0:
- ✨ Интеграция с Pexels API
- 🖼️ Поиск высококачественных фотографий
- 🎥 Поиск профессиональных видео
- 📸 Кураторские подборки
- 🔥 Популярные видео