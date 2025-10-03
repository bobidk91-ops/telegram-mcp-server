# Настройка KavkazOutdoor для MCP сервера

## Информация о сайте

- **URL**: https://kavkazoutdoor.ru/
- **Тема**: Горные походы и туризм
- **Пользователь**: boris
- **Application Password**: `pO2o 6wTP iwg5 jkKL 2cxF gwZ0`

## Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# WordPress Configuration - KavkazOutdoor
WORDPRESS_URL=https://kavkazoutdoor.ru
WORDPRESS_USERNAME=boris
WORDPRESS_PASSWORD=
WORDPRESS_APPLICATION_PASSWORD=pO2o 6wTP iwg5 jkKL 2cxF gwZ0
```

## Запуск сервера

```bash
# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Запуск сервера
npm start
```

## Тестирование подключения

```bash
# Тест подключения к KavkazOutdoor
node test_kavkazoutdoor.js

# Создание тестового поста
node create_kavkazoutdoor_post.js

# Загрузка медиафайла
node upload_kavkazoutdoor_media.js
```

## Доступные операции

### Управление постами
- Создание новых постов о горных походах
- Редактирование существующих статей
- Управление статусом публикации
- Добавление категорий и тегов

### Управление медиа
- Загрузка фотографий горных пейзажей
- Добавление изображений снаряжения
- Создание галерей для постов

### Управление контентом
- Создание категорий (Снаряжение, Маршруты, Советы)
- Добавление тегов для лучшей навигации
- Модерация комментариев

## Примеры использования

### Создание поста о снаряжении

```json
{
  "name": "wordpress_create_post",
  "arguments": {
    "title": "Лучшая палатка для горных походов",
    "content": "<h2>Выбор палатки</h2><p>Подробное описание...</p>",
    "excerpt": "Руководство по выбору палатки для горных походов",
    "status": "publish",
    "categories": [1],
    "tags": [1, 2]
  }
}
```

### Загрузка изображения

```json
{
  "name": "wordpress_upload_media",
  "arguments": {
    "file_url": "https://example.com/tent.jpg",
    "filename": "mountain-tent.jpg",
    "title": "Горная палатка",
    "alt_text": "Палатка в горах",
    "caption": "Пример установки палатки"
  }
}
```

## Безопасность

- Application Password обеспечивает безопасный доступ
- Все операции логируются
- Посты создаются как черновики по умолчанию
- Возможность отката изменений

## Мониторинг

- Проверка статуса: `GET /health`
- Тест соединения: `wordpress_test_connection`
- Получение информации о сайте: `wordpress_get_site_info`

## Поддержка

При возникновении проблем:
1. Проверьте переменные окружения
2. Убедитесь в правильности Application Password
3. Проверьте права пользователя boris
4. Используйте тестовые скрипты для диагностики
