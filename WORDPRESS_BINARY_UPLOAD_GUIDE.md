# WordPress Binary Upload Guide

## Обзор

Новая функция `wordpress_upload_media_binary` позволяет загружать изображения напрямую в WordPress через REST API без использования внешних сервисов. Это более эффективный и надежный способ работы с медиафайлами.

## Преимущества

- ✅ **Прямая загрузка** в медиабиблиотеку WordPress
- ✅ **Без внешних сервисов** (не зависит от ImgBB, Cloudinary и т.д.)
- ✅ **Быстрая обработка** больших файлов
- ✅ **Полный контроль** над метаданными
- ✅ **Автоматическая оптимизация** WordPress
- ✅ **Безопасность** - файлы остаются на вашем сервере

## Новые инструменты

### 1. `wordpress_upload_media_binary`

Загружает файл напрямую как бинарные данные в WordPress.

**Параметры:**
- `file_data` (обязательный) - Base64 encoded file data
- `filename` (обязательный) - Имя файла
- `mime_type` (обязательный) - MIME тип файла (image/png, image/jpeg, etc.)
- `title` (опциональный) - Заголовок медиа
- `alt_text` (опциональный) - Alt текст для изображений
- `caption` (опциональный) - Подпись к изображению
- `description` (опциональный) - Описание медиа

**Пример использования:**
```javascript
{
  "name": "wordpress_upload_media_binary",
  "arguments": {
    "file_data": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    "filename": "test-image.jpg",
    "mime_type": "image/jpeg",
    "title": "Тестовое изображение",
    "alt_text": "Описание изображения",
    "caption": "Подпись к изображению"
  }
}
```

### 2. `wordpress_update_media_metadata`

Обновляет метаданные существующего медиафайла.

**Параметры:**
- `id` (обязательный) - ID медиафайла
- `title` (опциональный) - Заголовок
- `alt_text` (опциональный) - Alt текст
- `caption` (опциональный) - Подпись
- `description` (опциональный) - Описание

**Пример использования:**
```javascript
{
  "name": "wordpress_update_media_metadata",
  "arguments": {
    "id": 52,
    "alt_text": "Обновленный alt текст",
    "caption": "Обновленная подпись"
  }
}
```

## Технические детали

### Эндпоинт WordPress
```
POST /wp-json/wp/v2/media
```

### Заголовки запроса
```
Content-Disposition: attachment; filename="filename.jpg"
Content-Type: image/jpeg
Authorization: Basic <base64(username:app_password)>
```

### Тело запроса
Бинарные данные файла (не JSON, не FormData)

## Примеры использования

### 1. Загрузка изображения с URL

```javascript
// 1. Скачать изображение
const imageResponse = await axios.get('https://example.com/image.jpg', {
  responseType: 'arraybuffer'
});

// 2. Конвертировать в base64
const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');

// 3. Загрузить в WordPress
const uploadResult = await mcpCall('wordpress_upload_media_binary', {
  file_data: base64Image,
  filename: 'downloaded-image.jpg',
  mime_type: 'image/jpeg',
  title: 'Загруженное изображение',
  alt_text: 'Описание изображения'
});
```

### 2. Создание поста с изображением

```javascript
// 1. Загрузить изображение
const mediaResult = await mcpCall('wordpress_upload_media_binary', {
  file_data: base64Image,
  filename: 'post-image.jpg',
  mime_type: 'image/jpeg',
  title: 'Изображение для поста',
  alt_text: 'Главное изображение поста'
});

// 2. Создать пост с изображением
const postResult = await mcpCall('wordpress_create_post', {
  title: 'Пост с изображением',
  content: `<img src="${mediaResult.media.source_url}" alt="Изображение поста" />`,
  featured_media: mediaResult.media.id,
  status: 'publish'
});
```

### 3. Обновление метаданных

```javascript
// Обновить alt текст и подпись
const updateResult = await mcpCall('wordpress_update_media_metadata', {
  id: 52,
  alt_text: 'Новый alt текст',
  caption: 'Новая подпись к изображению'
});
```

## Ограничения

- **Размер файла**: Зависит от настроек WordPress сервера (обычно до 32MB)
- **MIME типы**: Поддерживаются стандартные типы изображений (JPEG, PNG, GIF, WebP)
- **Таймаут**: 60 секунд для больших файлов

## Настройка WordPress

### 1. Application Passwords
Убедитесь, что настроены Application Passwords:
- Админка → Пользователи → Ваш профиль → Application Passwords
- Создайте новый пароль и сохраните его

### 2. Лимиты сервера
Проверьте настройки сервера:
```php
// php.ini
upload_max_filesize = 32M
post_max_size = 32M
```

### 3. Nginx/Apache
```nginx
# Nginx
client_max_body_size 32m;
```

```apache
# Apache
LimitRequestBody 33554432
```

## Сравнение методов

| Метод | Скорость | Надежность | Зависимости | Контроль |
|-------|----------|------------|-------------|----------|
| `wordpress_upload_media` | Медленно | Средне | Внешние URL | Частичный |
| `wordpress_upload_media_binary` | Быстро | Высокая | Нет | Полный |

## Заключение

Новая функция `wordpress_upload_media_binary` предоставляет более эффективный и надежный способ загрузки изображений в WordPress. Она особенно полезна для:

- Автоматизации создания контента
- Массовой загрузки изображений
- Интеграции с внешними API
- Создания постов с изображениями

Рекомендуется использовать этот метод вместо загрузки через внешние URL для лучшей производительности и контроля.
