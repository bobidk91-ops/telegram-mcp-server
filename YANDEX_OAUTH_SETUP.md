# Yandex OAuth Setup - Пошаговая инструкция

## ✅ Что уже сделано:

1. ✅ Добавлены OAuth эндпоинты в MCP сервер
2. ✅ Код загружен на GitHub
3. ✅ Railway автоматически деплоит новую версию

## 📝 Что нужно сделать:

### Шаг 1: Обновить Redirect URI в Yandex

1. Откройте https://oauth.yandex.ru
2. Войдите в свой аккаунт
3. Найдите ваше приложение (Client ID: `11221f6ebd2d47649d42d9f4b282a876`)
4. **Измените Redirect URI на:**
   ```
   https://worker-production-f73d.up.railway.app/yandex/callback
   ```
5. Сохраните изменения

### Шаг 2: Получить OAuth токен

После деплоя на Railway (подождите 2-3 минуты):

**Вариант A: Автоматическая авторизация**

1. Откройте в браузере:
   ```
   https://worker-production-f73d.up.railway.app/yandex/auth
   ```

2. Скопируйте `auth_url` из ответа

3. Откройте этот URL в браузере

4. Авторизуйтесь и разрешите доступ

5. Вас автоматически перенаправит на callback URL

6. Вы увидите сообщение: "Yandex OAuth token obtained successfully!"

7. Готово! Токен сохранен ✅

**Вариант B: Ручная установка токена**

Если у вас уже есть токен:

```bash
curl -X POST https://worker-production-f73d.up.railway.app/yandex/set-token \
  -H "Content-Type: application/json" \
  -d '{"token": "ваш_токен_здесь"}'
```

### Шаг 3: Проверить статус

Откройте:
```
https://worker-production-f73d.up.railway.app/yandex/status
```

Должно показать:
```json
{
  "client_id": "11221f6ebd2d47649d42d9f4b282a876",
  "token_set": true,
  "auth_url": "...",
  "callback_url": "..."
}
```

### Шаг 4: Проверить health

Откройте:
```
https://worker-production-f73d.up.railway.app/health
```

Должно быть:
```json
{
  ...
  "yandex_oauth": true
}
```

## 🎯 После успешной авторизации:

Я добавлю 5 Yandex Wordstat функций:
1. `yandex_wordstat_search` - Поиск статистики
2. `yandex_wordstat_forecast` - Прогноз показов
3. `yandex_wordstat_keywords` - Подбор ключевых слов
4. `yandex_wordstat_region_stats` - Региональная статистика
5. `yandex_wordstat_related` - Похожие запросы

## 📚 Доступные эндпоинты:

- `GET /yandex/auth` - Получить URL для авторизации
- `GET /yandex/callback` - Callback для OAuth (автоматический)
- `POST /yandex/set-token` - Установить токен вручную
- `GET /yandex/status` - Проверить статус OAuth

## ⚠️ Важно:

- **Redirect URI должен точно совпадать** с тем, что в настройках Yandex
- Токен действует **1 год**
- После истечения нужно будет повторить авторизацию

## 🚀 Готовы начать?

1. Подождите 2-3 минуты пока Railway задеплоит
2. Обновите Redirect URI в Yandex
3. Откройте `/yandex/auth` и следуйте инструкциям
4. После успешной авторизации я добавлю Wordstat функции!

Напишите, когда будете готовы! 💪
