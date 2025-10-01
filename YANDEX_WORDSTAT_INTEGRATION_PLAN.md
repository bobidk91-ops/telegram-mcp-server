# Yandex Wordstat API Integration Plan

## Текущая ситуация

**У вас есть:**
- Client ID: `11221f6ebd2d47649d42d9f4b282a876`
- Client Secret: `eb793370893544d683bf277d14bfd842`
- Redirect URI: `https://www.make.com/oauth/cb/app`

**Нужно получить:**
- OAuth Access Token для работы с API

## Проблема

Yandex Wordstat API требует OAuth авторизации, но вы не можете получить токен напрямую через интерфейс.

## Решение

### Вариант 1: Ручная авторизация (РЕКОМЕНДУЕТСЯ)

1. Откройте в браузере:
```
https://oauth.yandex.ru/authorize?response_type=code&client_id=11221f6ebd2d47649d42d9f4b282a876&redirect_uri=https://www.make.com/oauth/cb/app
```

2. Авторизуйтесь в Yandex
3. Разрешите доступ
4. Вас перенаправит на: `https://www.make.com/oauth/cb/app?code=XXXXXX`
5. Скопируйте `code=XXXXXX`
6. Отправьте мне этот код

### Вариант 2: Автоматическая авторизация через MCP

Я могу добавить специальный эндпоинт `/yandex/authorize` который:
- Покажет вам OAuth URL
- Примет callback с кодом
- Автоматически обменяет код на токен

Но для этого нужен публичный URL (Railway).

## Какие функции Wordstat будут добавлены

После получения токена я добавлю:

### 1. yandex_wordstat_search
Поиск статистики по ключевым словам
```json
{
  "name": "yandex_wordstat_search",
  "arguments": {
    "keywords": ["купить телефон", "смартфон"],
    "geo_ids": [225] // Россия
  }
}
```

### 2. yandex_wordstat_forecast
Прогноз показов
```json
{
  "name": "yandex_wordstat_forecast",
  "arguments": {
    "phrases": ["мебель москва"],
    "geo_ids": [213] // Москва
  }
}
```

### 3. yandex_wordstat_keywords
Подбор ключевых слов
```json
{
  "name": "yandex_wordstat_keywords",
  "arguments": {
    "query": "ремонт квартир"
  }
}
```

### 4. yandex_wordstat_region_stats
Региональная статистика
```json
{
  "name": "yandex_wordstat_region_stats",
  "arguments": {
    "keyword": "доставка еды",
    "regions": [1, 213, 2] // СПб, Москва, Екатеринбург
  }
}
```

### 5. yandex_wordstat_related
Похожие запросы
```json
{
  "name": "yandex_wordstat_related",
  "arguments": {
    "keyword": "отдых на море"
  }
}
```

## Следующие шаги

1. **Выберите вариант авторизации** (1 или 2)
2. Если вариант 1 - откройте URL и дайте мне код
3. Если вариант 2 - я добавлю OAuth endpoints
4. После получения токена - добавлю все 5 функций Wordstat
5. Протестируем
6. Задеплоим на Railway

## Ограничения API

- **Лимит запросов**: зависит от типа аккаунта
- **OAuth токен**: действует 1 год
- **Refresh token**: для автоматического обновления

Что выбираете? 🚀
