# ChatGPT → WordPress Integration Guide

## Обзор

Теперь вы можете загружать изображения, сгенерированные ChatGPT, напрямую в WordPress через MCP сервер без использования внешних сервисов хостинга изображений.

## Как это работает

### 1. Генерация изображения в ChatGPT
ChatGPT генерирует изображение и возвращает его в формате base64:
```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==
```

### 2. Загрузка через MCP сервер
Используйте инструмент `wordpress_upload_media_binary` для прямой загрузки:

```javascript
{
  "name": "wordpress_upload_media_binary",
  "arguments": {
    "file_data": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    "filename": "chatgpt-generated-image.png",
    "mime_type": "image/png",
    "title": "Изображение от ChatGPT",
    "alt_text": "AI-генерированное изображение",
    "caption": "🎨 Создано искусственным интеллектом"
  }
}
```

### 3. Создание поста
После загрузки изображения создайте пост:

```javascript
{
  "name": "wordpress_create_post",
  "arguments": {
    "title": "Пост с AI-изображением",
    "content": "<img src=\"URL_ИЗОБРАЖЕНИЯ\" alt=\"Описание\" />",
    "status": "publish"
  }
}
```

## Преимущества

- ✅ **Прямая загрузка** - без промежуточных сервисов
- ✅ **Быстрота** - мгновенная загрузка в WordPress
- ✅ **Контроль** - полный контроль над метаданными
- ✅ **Безопасность** - файлы остаются на вашем сервере
- ✅ **Автоматизация** - можно автоматизировать весь процесс

## Примеры использования

### Простая загрузка изображения
```javascript
// 1. Получить base64 от ChatGPT
const chatGPTImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

// 2. Извлечь чистый base64 (без префикса)
const cleanBase64 = chatGPTImage.split(',')[1];

// 3. Загрузить в WordPress
const result = await mcpCall('wordpress_upload_media_binary', {
  file_data: cleanBase64,
  filename: 'ai-generated-image.png',
  mime_type: 'image/png',
  title: 'AI Generated Image',
  alt_text: 'Изображение, созданное ИИ'
});
```

### Создание поста с изображением
```javascript
// 1. Загрузить изображение
const mediaResult = await mcpCall('wordpress_upload_media_binary', {
  file_data: cleanBase64,
  filename: 'post-image.png',
  mime_type: 'image/png',
  title: 'Главное изображение поста',
  alt_text: 'Описание изображения'
});

// 2. Создать пост
const postResult = await mcpCall('wordpress_create_post', {
  title: 'Пост с AI-изображением',
  content: `<img src="${mediaResult.media.source_url}" alt="AI изображение" />
            <p>Этот пост содержит изображение, сгенерированное ChatGPT.</p>`,
  status: 'publish'
});
```

### Обновление метаданных
```javascript
// Обновить alt текст и подпись
const updateResult = await mcpCall('wordpress_update_media_metadata', {
  id: mediaResult.media.id,
  alt_text: 'Обновленное описание',
  caption: 'Новая подпись к изображению'
});
```

## Поддерживаемые форматы

- **PNG** - `image/png`
- **JPEG** - `image/jpeg`
- **GIF** - `image/gif`
- **WebP** - `image/webp`

## Ограничения

- **Размер файла**: до 32MB (зависит от настроек WordPress)
- **Формат**: только изображения
- **Таймаут**: 60 секунд для больших файлов

## Автоматизация

Вы можете создать полный workflow:

1. **ChatGPT** генерирует изображение
2. **MCP сервер** загружает его в WordPress
3. **WordPress** создает пост с изображением
4. **Telegram** отправляет уведомление

## Пример полного workflow

```javascript
async function createPostWithAIImage() {
  // 1. Получить изображение от ChatGPT (пример)
  const aiImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
  const cleanBase64 = aiImage.split(',')[1];
  
  // 2. Загрузить в WordPress
  const mediaResult = await mcpCall('wordpress_upload_media_binary', {
    file_data: cleanBase64,
    filename: 'ai-image.png',
    mime_type: 'image/png',
    title: 'AI Generated Image',
    alt_text: 'Изображение создано ИИ'
  });
  
  // 3. Создать пост
  const postResult = await mcpCall('wordpress_create_post', {
    title: 'Пост с AI-изображением',
    content: `<img src="${mediaResult.media.source_url}" alt="AI изображение" />
              <p>Этот пост содержит изображение, сгенерированное ChatGPT.</p>`,
    status: 'publish'
  });
  
  // 4. Отправить в Telegram
  await mcpCall('send_photo', {
    photo: mediaResult.media.source_url,
    caption: `🎨 Новый пост с AI-изображением: ${postResult.post.link}`
  });
  
  return { media: mediaResult.media, post: postResult.post };
}
```

## Заключение

Теперь у вас есть полный контроль над процессом создания контента с AI-изображениями:

- Генерируйте изображения в ChatGPT
- Загружайте их напрямую в WordPress
- Создавайте посты автоматически
- Получайте уведомления в Telegram

Это значительно упрощает процесс создания контента и дает вам полный контроль над каждым этапом.
