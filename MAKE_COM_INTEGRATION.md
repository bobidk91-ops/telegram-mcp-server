# 🔗 Интеграция с Make.com (Integromat)

## ✅ Готовый HTTP API для Make.com!

Создан простой и понятный HTTP API сервер специально для интеграции с Make.com.

## 🌐 API Endpoints

### **Базовый URL:**
```
https://worker-production-193e.up.railway.app
```

### **Документация API:**
```
GET https://worker-production-193e.up.railway.app/
```

## 📱 Доступные методы

### 1. **Отправить сообщение**
```http
POST https://worker-production-193e.up.railway.app/send-message
Content-Type: application/json

{
  "text": "Привет из Make.com!",
  "parse_mode": "HTML"
}
```

**Ответ:**
```json
{
  "success": true,
  "message_id": 123,
  "text": "Привет из Make.com!",
  "date": 1694567890,
  "channel": "@mymcptest"
}
```

### 2. **Отправить фотографию**
```http
POST https://worker-production-193e.up.railway.app/send-photo
Content-Type: application/json

{
  "photo": "https://example.com/image.jpg",
  "caption": "Фото из Make.com!",
  "parse_mode": "HTML"
}
```

### 3. **Создать опрос**
```http
POST https://worker-production-193e.up.railway.app/send-poll
Content-Type: application/json

{
  "question": "Как дела?",
  "options": ["Отлично!", "Хорошо", "Нормально", "Плохо"],
  "is_anonymous": true,
  "type": "regular"
}
```

### 4. **Отправить реакцию**
```http
POST https://worker-production-193e.up.railway.app/send-reaction
Content-Type: application/json

{
  "message_id": 123,
  "emoji": "👍"
}
```

### 5. **Редактировать сообщение**
```http
POST https://worker-production-193e.up.railway.app/edit-message
Content-Type: application/json

{
  "message_id": 123,
  "text": "Обновленный текст",
  "parse_mode": "HTML"
}
```

### 6. **Удалить сообщение**
```http
POST https://worker-production-193e.up.railway.app/delete-message
Content-Type: application/json

{
  "message_id": 123
}
```

### 7. **Получить информацию о канале**
```http
GET https://worker-production-193e.up.railway.app/channel-info
```

## 🔧 Настройка в Make.com

### 1. **HTTP модуль**
- **Метод**: `POST` или `GET`
- **URL**: `https://worker-production-193e.up.railway.app/send-message`
- **Headers**: `Content-Type: application/json`
- **Body**: JSON с параметрами

### 2. **Пример настройки для отправки сообщения**

#### **HTTP Request модуль:**
- **URL**: `https://worker-production-193e.up.railway.app/send-message`
- **Method**: `POST`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "text": "{{1.text}}",
    "parse_mode": "HTML"
  }
  ```

### 3. **Пример для отправки опроса**

#### **HTTP Request модуль:**
- **URL**: `https://worker-production-193e.up.railway.app/send-poll`
- **Method**: `POST`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "question": "{{1.question}}",
    "options": {{1.options}},
    "is_anonymous": true
  }
  ```

## 🧪 Тестирование API

### **Проверка статуса:**
```bash
curl https://worker-production-193e.up.railway.app/health
```

### **Тест отправки сообщения:**
```bash
curl -X POST https://worker-production-193e.up.railway.app/send-message \
  -H "Content-Type: application/json" \
  -d '{"text": "Тест из Make.com!", "parse_mode": "HTML"}'
```

### **Тест создания опроса:**
```bash
curl -X POST https://worker-production-193e.up.railway.app/send-poll \
  -H "Content-Type: application/json" \
  -d '{"question": "Тестовый опрос", "options": ["Да", "Нет"]}'
```

## 📋 Примеры сценариев Make.com

### 1. **Автоматическая отправка уведомлений**
```
Google Sheets (новый ряд) → HTTP Request (отправить сообщение)
```

### 2. **Ежедневный опрос**
```
Schedule (каждый день в 9:00) → HTTP Request (создать опрос)
```

### 3. **Отправка фото при изменении файла**
```
Google Drive (новый файл) → HTTP Request (отправить фото)
```

### 4. **Реакция на новые комментарии**
```
Instagram (новый комментарий) → HTTP Request (отправить реакцию)
```

## 🔍 Обработка ошибок

### **Стандартный формат ошибок:**
```json
{
  "success": false,
  "error": "Описание ошибки"
}
```

### **Коды ошибок:**
- **400** - Неверные параметры запроса
- **500** - Внутренняя ошибка сервера
- **404** - Endpoint не найден

## ⚙️ Переменные окружения

Сервер использует следующие переменные:
- `TELEGRAM_BOT_TOKEN` - Токен бота
- `TELEGRAM_CHANNEL_ID` - ID канала (@mymcptest)
- `NODE_ENV` - Режим работы (production)

## 🚀 Преимущества для Make.com

### ✅ **Простота:**
- Понятные REST endpoints
- Стандартные HTTP методы
- JSON формат данных

### ✅ **Надежность:**
- Обработка ошибок
- Валидация параметров
- CORS поддержка

### ✅ **Гибкость:**
- Поддержка всех типов контента
- Настраиваемые параметры
- Детальные ответы

### ✅ **Масштабируемость:**
- Работает на Railway
- Автоматическое масштабирование
- Высокая доступность

---

## 🎯 Готово к использованию!

**API сервер готов для интеграции с Make.com!**

**Базовый URL**: `https://worker-production-193e.up.railway.app`

**Документация**: `https://worker-production-193e.up.railway.app/`

**Railway автоматически развернет новый API сервер!** 🚀
