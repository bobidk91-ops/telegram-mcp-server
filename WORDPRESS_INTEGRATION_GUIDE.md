# WordPress Integration Guide

## Обзор

MCP сервер теперь поддерживает полную интеграцию с WordPress через REST API. Это позволяет управлять постами, страницами, медиафайлами, пользователями, категориями, тегами и комментариями.

## Настройка

### 1. Переменные окружения

Добавьте следующие переменные в ваш `.env` файл:

```env
# WordPress Configuration
WORDPRESS_URL=https://your-wordpress-site.com
WORDPRESS_USERNAME=your_username
WORDPRESS_PASSWORD=your_password
WORDPRESS_APPLICATION_PASSWORD=your_application_password_here
```

### 2. Аутентификация

WordPress API поддерживает два типа аутентификации:

#### Стандартная аутентификация
- Используйте `WORDPRESS_USERNAME` и `WORDPRESS_PASSWORD`

#### Application Password (рекомендуется)
- Создайте Application Password в WordPress админке
- Используйте `WORDPRESS_USERNAME` и `WORDPRESS_APPLICATION_PASSWORD`

### 3. Создание Application Password

1. Войдите в WordPress админку
2. Перейдите в **Пользователи** → **Профиль**
3. Прокрутите до раздела **Application Passwords**
4. Введите название (например, "MCP Server")
5. Нажмите **Add New Application Password**
6. Скопируйте сгенерированный пароль

## Доступные инструменты

### Посты (Posts)

#### `wordpress_get_posts`
Получить список постов с фильтрацией
```json
{
  "page": 1,
  "per_page": 10,
  "search": "ключевое слово",
  "status": "publish",
  "categories": [1, 2],
  "tags": [3, 4],
  "author": 1,
  "order": "desc",
  "orderby": "date"
}
```

#### `wordpress_get_post`
Получить конкретный пост по ID
```json
{
  "id": 123
}
```

#### `wordpress_create_post`
Создать новый пост
```json
{
  "title": "Заголовок поста",
  "content": "<p>Содержимое поста в HTML</p>",
  "excerpt": "Краткое описание",
  "status": "publish",
  "categories": [1, 2],
  "tags": [3, 4],
  "featured_media": 123,
  "sticky": false,
  "comment_status": "open",
  "ping_status": "open"
}
```

#### `wordpress_update_post`
Обновить существующий пост
```json
{
  "id": 123,
  "title": "Новый заголовок",
  "content": "<p>Обновленное содержимое</p>",
  "status": "draft"
}
```

#### `wordpress_delete_post`
Удалить пост
```json
{
  "id": 123,
  "force": false
}
```

### Страницы (Pages)

#### `wordpress_get_pages`
Получить список страниц
```json
{
  "page": 1,
  "per_page": 10,
  "search": "поиск",
  "status": "publish",
  "parent": 0,
  "order": "asc",
  "orderby": "title"
}
```

#### `wordpress_get_page`
Получить конкретную страницу
```json
{
  "id": 456
}
```

#### `wordpress_create_page`
Создать новую страницу
```json
{
  "title": "Заголовок страницы",
  "content": "<p>Содержимое страницы</p>",
  "status": "publish",
  "parent": 0,
  "menu_order": 0,
  "template": "page-template.php"
}
```

#### `wordpress_update_page`
Обновить страницу
```json
{
  "id": 456,
  "title": "Новый заголовок",
  "content": "<p>Обновленное содержимое</p>"
}
```

#### `wordpress_delete_page`
Удалить страницу
```json
{
  "id": 456,
  "force": false
}
```

### Медиафайлы (Media)

#### `wordpress_get_media`
Получить список медиафайлов
```json
{
  "page": 1,
  "per_page": 20,
  "media_type": "image",
  "mime_type": "image/jpeg",
  "parent": 123,
  "order": "desc",
  "orderby": "date"
}
```

#### `wordpress_get_media_item`
Получить конкретный медиафайл
```json
{
  "id": 789
}
```

#### `wordpress_upload_media`
Загрузить медиафайл
```json
{
  "file_url": "https://example.com/image.jpg",
  "filename": "image.jpg",
  "title": "Название изображения",
  "alt_text": "Альтернативный текст",
  "caption": "Подпись к изображению",
  "description": "Описание изображения"
}
```

#### `wordpress_update_media`
Обновить медиафайл
```json
{
  "id": 789,
  "title": "Новое название",
  "alt_text": "Новый альтернативный текст",
  "caption": "Новая подпись"
}
```

#### `wordpress_delete_media`
Удалить медиафайл
```json
{
  "id": 789,
  "force": false
}
```

### Категории (Categories)

#### `wordpress_get_categories`
Получить список категорий
```json
{
  "page": 1,
  "per_page": 20,
  "search": "поиск",
  "hide_empty": false,
  "parent": 0,
  "order": "asc",
  "orderby": "name"
}
```

#### `wordpress_get_category`
Получить конкретную категорию
```json
{
  "id": 1
}
```

#### `wordpress_create_category`
Создать новую категорию
```json
{
  "name": "Новая категория",
  "description": "Описание категории",
  "slug": "new-category",
  "parent": 0
}
```

#### `wordpress_update_category`
Обновить категорию
```json
{
  "id": 1,
  "name": "Обновленная категория",
  "description": "Новое описание"
}
```

#### `wordpress_delete_category`
Удалить категорию
```json
{
  "id": 1,
  "force": false
}
```

### Теги (Tags)

#### `wordpress_get_tags`
Получить список тегов
```json
{
  "page": 1,
  "per_page": 20,
  "search": "поиск",
  "hide_empty": false,
  "order": "asc",
  "orderby": "name"
}
```

#### `wordpress_get_tag`
Получить конкретный тег
```json
{
  "id": 2
}
```

#### `wordpress_create_tag`
Создать новый тег
```json
{
  "name": "Новый тег",
  "description": "Описание тега",
  "slug": "new-tag"
}
```

#### `wordpress_update_tag`
Обновить тег
```json
{
  "id": 2,
  "name": "Обновленный тег",
  "description": "Новое описание"
}
```

#### `wordpress_delete_tag`
Удалить тег
```json
{
  "id": 2,
  "force": false
}
```

### Пользователи (Users)

#### `wordpress_get_users`
Получить список пользователей
```json
{
  "page": 1,
  "per_page": 20,
  "search": "поиск",
  "roles": ["author", "editor"],
  "order": "asc",
  "orderby": "name"
}
```

#### `wordpress_get_user`
Получить конкретного пользователя
```json
{
  "id": 1
}
```

#### `wordpress_create_user`
Создать нового пользователя
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "first_name": "Имя",
  "last_name": "Фамилия",
  "roles": ["author"]
}
```

#### `wordpress_update_user`
Обновить пользователя
```json
{
  "id": 1,
  "first_name": "Новое имя",
  "last_name": "Новая фамилия",
  "description": "Описание пользователя"
}
```

#### `wordpress_delete_user`
Удалить пользователя
```json
{
  "id": 1,
  "force": false,
  "reassign": 2
}
```

### Комментарии (Comments)

#### `wordpress_get_comments`
Получить список комментариев
```json
{
  "page": 1,
  "per_page": 20,
  "post": 123,
  "status": "approve",
  "order": "desc",
  "orderby": "date"
}
```

#### `wordpress_get_comment`
Получить конкретный комментарий
```json
{
  "id": 456
}
```

#### `wordpress_create_comment`
Создать новый комментарий
```json
{
  "post": 123,
  "content": "Текст комментария",
  "author_name": "Имя автора",
  "author_email": "author@example.com",
  "author_url": "https://example.com",
  "status": "approve"
}
```

#### `wordpress_update_comment`
Обновить комментарий
```json
{
  "id": 456,
  "content": "Обновленный текст комментария",
  "status": "approve"
}
```

#### `wordpress_delete_comment`
Удалить комментарий
```json
{
  "id": 456,
  "force": false
}
```

### Информация о сайте

#### `wordpress_get_site_info`
Получить информацию о сайте
```json
{}
```

#### `wordpress_get_settings`
Получить настройки сайта
```json
{}
```

#### `wordpress_search`
Поиск по контенту
```json
{
  "query": "поисковый запрос",
  "type": "post"
}
```

#### `wordpress_test_connection`
Проверить соединение с WordPress
```json
{}
```

## Примеры использования

### Создание поста с изображением

1. Загрузите изображение:
```json
{
  "name": "wordpress_upload_media",
  "arguments": {
    "file_url": "https://example.com/image.jpg",
    "filename": "featured-image.jpg",
    "title": "Изображение для поста",
    "alt_text": "Описание изображения"
  }
}
```

2. Создайте пост с загруженным изображением:
```json
{
  "name": "wordpress_create_post",
  "arguments": {
    "title": "Мой новый пост",
    "content": "<p>Содержимое поста с <img src='...' alt='...'></p>",
    "status": "publish",
    "featured_media": 789,
    "categories": [1],
    "tags": [2, 3]
  }
}
```

### Получение постов с фильтрацией

```json
{
  "name": "wordpress_get_posts",
  "arguments": {
    "per_page": 5,
    "status": "publish",
    "order": "desc",
    "orderby": "date",
    "categories": [1, 2]
  }
}
```

### Создание категории и тега

1. Создайте категорию:
```json
{
  "name": "wordpress_create_category",
  "arguments": {
    "name": "Технологии",
    "description": "Посты о технологиях",
    "slug": "technology"
  }
}
```

2. Создайте тег:
```json
{
  "name": "wordpress_create_tag",
  "arguments": {
    "name": "JavaScript",
    "description": "Посты о JavaScript",
    "slug": "javascript"
  }
}
```

## Обработка ошибок

Все инструменты возвращают структурированные ответы:

### Успешный ответ
```json
{
  "success": true,
  "data": { ... },
  "note": "Операция выполнена успешно"
}
```

### Ошибка
```json
{
  "success": false,
  "error": "Описание ошибки",
  "details": "Дополнительная информация"
}
```

## Безопасность

1. **Используйте Application Passwords** вместо обычных паролей
2. **Ограничьте права пользователя** - создайте отдельного пользователя с минимальными правами
3. **Используйте HTTPS** для всех запросов
4. **Регулярно обновляйте пароли** Application Passwords

## Ограничения

1. **Размер файлов**: Ограничения WordPress на загрузку медиафайлов
2. **Rate Limiting**: Некоторые хостинги ограничивают количество API запросов
3. **Права доступа**: Некоторые операции требуют определенных прав пользователя
4. **Версия WordPress**: Требуется WordPress 4.7+ для полной поддержки REST API

## Поддержка

При возникновении проблем:

1. Проверьте переменные окружения
2. Убедитесь в правильности URL WordPress
3. Проверьте права пользователя
4. Используйте `wordpress_test_connection` для диагностики
5. Проверьте логи сервера

## Changelog

### v2.2.0
- Добавлена полная поддержка WordPress REST API
- 40+ новых инструментов для управления WordPress
- Поддержка постов, страниц, медиа, пользователей, категорий, тегов, комментариев
- Аутентификация через Application Passwords
- Загрузка медиафайлов по URL
- Поиск по контенту
- Полная интеграция с MCP протоколом
