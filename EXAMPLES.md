# Примеры использования Telegram MCP Server

Этот документ содержит практические примеры использования всех функций MCP сервера для управления Telegram каналом.

## 📝 Базовые функции публикации

### Отправка текстового сообщения

```json
{
  "name": "send_message",
  "arguments": {
    "text": "🚀 Добро пожаловать в наш канал!\n\nЗдесь вы найдете:\n• Полезные статьи\n• Новости технологий\n• Обучающие материалы",
    "parse_mode": "HTML"
  }
}
```

### Отправка сообщения с Markdown

```json
{
  "name": "send_message",
  "arguments": {
    "text": "*Важное объявление*\n\n`Код` для примера:\n```javascript\nconsole.log('Hello World!');\n```",
    "parse_mode": "Markdown"
  }
}
```

### Отправка фотографии с подписью

```json
{
  "name": "send_photo",
  "arguments": {
    "photo_url": "https://example.com/image.jpg",
    "caption": "📸 <b>Красивое фото</b>\n\n<i>Описание изображения</i>",
    "parse_mode": "HTML"
  }
}
```

### Отправка документа

```json
{
  "name": "send_document",
  "arguments": {
    "document_url": "https://example.com/document.pdf",
    "caption": "📄 <b>Важный документ</b>\n\nСкачайте и изучите материал",
    "parse_mode": "HTML"
  }
}
```

## 🗳️ Интерактивные функции

### Создание обычного опроса

```json
{
  "name": "send_poll",
  "arguments": {
    "question": "Какой ваш любимый язык программирования?",
    "options": [
      "JavaScript",
      "Python", 
      "TypeScript",
      "Go",
      "Rust",
      "Java"
    ],
    "is_anonymous": true,
    "type": "regular"
  }
}
```

### Создание викторины

```json
{
  "name": "send_poll",
  "arguments": {
    "question": "Столица России?",
    "options": [
      "Москва",
      "Санкт-Петербург",
      "Новосибирск",
      "Екатеринбург"
    ],
    "is_anonymous": false,
    "type": "quiz",
    "correct_option_id": 0,
    "explanation": "Москва является столицей России с 1918 года"
  }
}
```

### Отправка реакции на сообщение

```json
{
  "name": "send_reaction",
  "arguments": {
    "message_id": 123,
    "emoji": "👍"
  }
}
```

## 📌 Управление сообщениями

### Закрепление сообщения

```json
{
  "name": "pin_message",
  "arguments": {
    "message_id": 123,
    "disable_notification": false
  }
}
```

### Открепление сообщения

```json
{
  "name": "unpin_message",
  "arguments": {
    "message_id": 123
  }
}
```

### Редактирование сообщения

```json
{
  "name": "edit_message",
  "arguments": {
    "message_id": 123,
    "text": "Обновленный текст сообщения",
    "parse_mode": "HTML"
  }
}
```

### Удаление сообщения

```json
{
  "name": "delete_message",
  "arguments": {
    "message_id": 123
  }
}
```

## 📱 Расширенные функции

### Отправка медиа-группы (альбом)

```json
{
  "name": "send_media_group",
  "arguments": {
    "media": [
      {
        "type": "photo",
        "media": "https://example.com/photo1.jpg",
        "caption": "Первое фото"
      },
      {
        "type": "photo", 
        "media": "https://example.com/photo2.jpg",
        "caption": "Второе фото"
      },
      {
        "type": "video",
        "media": "https://example.com/video.mp4",
        "caption": "Видео"
      }
    ]
  }
}
```

### Отправка информации о месте

```json
{
  "name": "send_venue",
  "arguments": {
    "latitude": 55.7558,
    "longitude": 37.6176,
    "title": "Красная площадь",
    "address": "Москва, Россия",
    "foursquare_id": "4f8b8b8b8b8b8b8b8b8b8b8b"
  }
}
```

### Отправка контакта

```json
{
  "name": "send_contact",
  "arguments": {
    "phone_number": "+1234567890",
    "first_name": "Иван",
    "last_name": "Петров",
    "vcard": "BEGIN:VCARD\nVERSION:3.0\nFN:Иван Петров\nORG:Компания\nEND:VCARD"
  }
}
```

## 📊 Аналитические функции

### Получение информации о канале

```json
{
  "name": "get_channel_info",
  "arguments": {}
}
```

**Ответ:**
```
Channel Info:
Title: Мой канал
Type: channel
ID: -1001234567890
```

### Получение количества подписчиков

```json
{
  "name": "get_chat_member_count",
  "arguments": {}
}
```

**Ответ:**
```
Channel has 1234 members
```

## 🎯 Практические сценарии

### Сценарий 1: Ежедневный пост

```json
[
  {
    "name": "send_message",
    "arguments": {
      "text": "🌅 <b>Доброе утро!</b>\n\nСегодня мы изучаем:\n• Новые технологии\n• Лучшие практики\n• Полезные советы",
      "parse_mode": "HTML"
    }
  },
  {
    "name": "send_photo",
    "arguments": {
      "photo_url": "https://example.com/morning.jpg",
      "caption": "Красивое утро для новых знаний! ☀️"
    }
  }
]
```

### Сценарий 2: Образовательный контент

```json
[
  {
    "name": "send_message",
    "arguments": {
      "text": "📚 <b>Урок #1: Основы JavaScript</b>\n\nСегодня изучаем:\n• Переменные\n• Функции\n• Объекты",
      "parse_mode": "HTML"
    }
  },
  {
    "name": "send_document",
    "arguments": {
      "document_url": "https://example.com/lesson1.pdf",
      "caption": "📄 Материалы урока"
    }
  },
  {
    "name": "send_poll",
    "arguments": {
      "question": "Понятен ли материал урока?",
      "options": ["Да, все понятно", "Частично", "Нужно больше примеров"],
      "is_anonymous": true
    }
  }
]
```

### Сценарий 3: Интерактивный опрос

```json
[
  {
    "name": "send_message",
    "arguments": {
      "text": "🗳️ <b>Голосование за тему следующего поста</b>\n\nВыберите, о чем хотите узнать больше:",
      "parse_mode": "HTML"
    }
  },
  {
    "name": "send_poll",
    "arguments": {
      "question": "Какая тема вас больше интересует?",
      "options": [
        "Веб-разработка",
        "Мобильная разработка", 
        "Искусственный интеллект",
        "Кибербезопасность",
        "DevOps"
      ],
      "is_anonymous": false
    }
  }
]
```

### Сценарий 4: Анонс мероприятия

```json
[
  {
    "name": "send_message",
    "arguments": {
      "text": "🎉 <b>АНОНС!</b>\n\nЗавтра в 19:00 состоится вебинар:\n\n<b>\"Современные подходы к разработке\"</b>\n\nСпикер: Иван Петров\nДлительность: 1 час",
      "parse_mode": "HTML"
    }
  },
  {
    "name": "pin_message",
    "arguments": {
      "message_id": 123,
      "disable_notification": false
    }
  },
  {
    "name": "send_venue",
    "arguments": {
      "latitude": 55.7558,
      "longitude": 37.6176,
      "title": "Конференц-зал",
      "address": "Москва, ул. Примерная, 1"
    }
  }
]
```

### Сценарий 5: Обновление важной информации

```json
[
  {
    "name": "edit_message",
    "arguments": {
      "message_id": 123,
      "text": "📢 <b>ОБНОВЛЕНИЕ!</b>\n\nВремя вебинара изменено на 20:00\n\nВсе остальное остается без изменений",
      "parse_mode": "HTML"
    }
  },
  {
    "name": "send_reaction",
    "arguments": {
      "message_id": 123,
      "emoji": "📢"
    }
  }
]
```

## 🔧 Интеграция с AI

### Использование с Claude

```javascript
// Пример интеграции с Claude Desktop
const mcpClient = new MCPClient({
  server: {
    command: "node",
    args: ["dist/index.js"]
  }
});

// Отправка сообщения через AI
await mcpClient.callTool("send_message", {
  text: "AI сгенерировал этот пост автоматически! 🤖",
  parse_mode: "HTML"
});
```

### Автоматизация контента

```javascript
// Автоматическая публикация новостей
async function publishNews(newsData) {
  await mcpClient.callTool("send_message", {
    text: `📰 <b>${newsData.title}</b>\n\n${newsData.content}`,
    parse_mode: "HTML"
  });
  
  if (newsData.image) {
    await mcpClient.callTool("send_photo", {
      photo_url: newsData.image,
      caption: "Иллюстрация к новости"
    });
  }
}
```

## 🎨 Форматирование текста

### HTML разметка

```html
<b>Жирный текст</b>
<i>Курсив</i>
<u>Подчеркнутый</u>
<s>Зачеркнутый</s>
<code>Моноширинный шрифт</code>
<pre>Блок кода</pre>
<a href="https://example.com">Ссылка</a>
```

### Markdown разметка

```markdown
**Жирный текст**
*Курсив*
__Подчеркнутый__
~~Зачеркнутый~~
`Моноширинный шрифт`
```код```
[Ссылка](https://example.com)
```

## ⚠️ Ограничения

### Размеры файлов
- Фото: до 10 МБ
- Видео: до 50 МБ
- Документы: до 50 МБ

### Лимиты API
- 30 сообщений в секунду
- 20 сообщений в минуту для одного чата

### Ограничения опросов
- 2-10 вариантов ответов
- До 300 символов в вопросе
- До 100 символов в каждом варианте

---

**Удачного использования! 🚀**
