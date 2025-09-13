# 🚀 Временное решение: Локальный сервер

## ❌ Проблема с Railway
Railway кэширует старую версию сервера и не пересобирает проект. Make.com получает ошибку 404.

## ✅ Решение: Локальный сервер

### 1. **Запустите локальный сервер**

#### **В папке проекта:**
```bash
cd C:\Users\user\Desktop\Tg
npm run dev:make
```

#### **Сервер запустится на:**
```
http://localhost:8080
```

### 2. **Используйте локальный URL в Make.com**

#### **Основные endpoints:**
- **Документация**: `http://localhost:8080/`
- **Статус**: `http://localhost:8080/health`
- **Отправить сообщение**: `http://localhost:8080/send-message`

### 3. **Настройка в Make.com**

#### **Для отправки сообщения:**
- **URL**: `http://localhost:8080/send-message`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "text": "Привет из Make.com!",
    "parse_mode": "HTML"
  }
  ```

#### **Для создания опроса:**
- **URL**: `http://localhost:8080/send-poll`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "question": "Как дела?",
    "options": ["Отлично!", "Хорошо", "Плохо"]
  }
  ```

### 4. **Тестирование локального сервера**

#### **Проверка API:**
```bash
curl http://localhost:8080/health
```

#### **Тест отправки сообщения:**
```bash
curl -X POST http://localhost:8080/send-message \
  -H "Content-Type: application/json" \
  -d '{"text": "Тест из Make.com!"}'
```

## 🔧 Альтернативное решение: ngrok

### 1. **Установите ngrok:**
```bash
# Скачайте с https://ngrok.com/
# Или через winget:
winget install ngrok
```

### 2. **Запустите ngrok:**
```bash
# В одном терминале:
npm run dev:make

# В другом терминале:
ngrok http 8080
```

### 3. **Используйте ngrok URL в Make.com:**
```
https://your-random-id.ngrok.io/send-message
```

## 📋 Все доступные endpoints

### **1. Отправить сообщение**
```
POST http://localhost:8080/send-message
```

### **2. Отправить фотографию**
```
POST http://localhost:8080/send-photo
```

### **3. Создать опрос**
```
POST http://localhost:8080/send-poll
```

### **4. Отправить реакцию**
```
POST http://localhost:8080/send-reaction
```

### **5. Редактировать сообщение**
```
POST http://localhost:8080/edit-message
```

### **6. Удалить сообщение**
```
POST http://localhost:8080/delete-message
```

### **7. Информация о канале**
```
GET http://localhost:8080/channel-info
```

## 🚀 Быстрый старт

### 1. **Запустите сервер:**
```bash
cd C:\Users\user\Desktop\Tg
npm run dev:make
```

### 2. **Откройте браузер:**
```
http://localhost:8080
```

### 3. **Настройте Make.com:**
- Используйте `http://localhost:8080/send-message`
- Метод: `POST`
- Headers: `Content-Type: application/json`

### 4. **Тестируйте!**

## ⚠️ Важно

### **Локальный сервер работает только пока:**
- ✅ Компьютер включен
- ✅ Сервер запущен
- ✅ Интернет подключен

### **Для постоянной работы:**
- 🔧 Нужно исправить Railway
- 🔧 Или использовать VPS
- 🔧 Или другой хостинг

---

## 🎯 Итог

**Локальный сервер работает отлично!**

**Используйте `http://localhost:8080` в Make.com**

**Все endpoints работают корректно!** 🚀
