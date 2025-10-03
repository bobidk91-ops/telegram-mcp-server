# Настройка аутентификации для KavkazOutdoor

## Текущий статус

✅ **Сайт доступен**: https://kavkazoutdoor.ru  
✅ **REST API работает**: `/index.php?rest_route=/wp/v2/`  
❌ **Аутентификация не работает**: Application Password не принимается  
❌ **Создание постов недоступно**: Ошибка 401 (Unauthorized)  

## Проблема

Application Password `pO2o 6wTP iwg5 jkKL 2cxF gwZ0` не работает для аутентификации через REST API.

## Возможные причины

1. **Application Password создан неправильно**
2. **У пользователя `boris` нет прав на создание постов**
3. **REST API отключен для записи**
4. **Плагины безопасности блокируют API**

## Решения

### 1. Проверка Application Password

Войдите в админку WordPress (https://kavkazoutdoor.ru/wp-admin/) и:

1. Перейдите в **Пользователи → Профиль**
2. Прокрутите до раздела **Application Passwords**
3. Удалите старый Application Password
4. Создайте новый с именем "MCP Server"
5. Скопируйте новый пароль

### 2. Проверка прав пользователя

Убедитесь, что пользователь `boris` имеет роль **Администратор** или **Редактор**:

1. **Пользователи → Все пользователи**
2. Найдите пользователя `boris`
3. Проверьте роль
4. При необходимости измените на **Администратор**

### 3. Проверка настроек REST API

Добавьте в `wp-config.php`:

```php
// Разрешить REST API для всех пользователей
add_filter('rest_authentication_errors', function($result) {
    if (!empty($result)) {
        return $result;
    }
    if (!is_user_logged_in()) {
        return new WP_Error('rest_not_logged_in', 'You are not currently logged in.', array('status' => 401));
    }
    return $result;
});
```

### 4. Отключение плагинов безопасности

Временно отключите плагины, которые могут блокировать REST API:

- Wordfence
- iThemes Security
- Sucuri Security
- All In One WP Security

### 5. Альтернативные методы

#### Метод 1: OAuth 2.0
```bash
# Установите плагин OAuth 2.0
# Настройте клиент для MCP сервера
```

#### Метод 2: JWT Authentication
```bash
# Установите плагин JWT Authentication
# Используйте токен вместо пароля
```

#### Метод 3: Custom API Key
```bash
# Создайте кастомный API ключ
# Добавьте в заголовки запросов
```

## Тестирование

После настройки запустите тесты:

```bash
# Тест аутентификации
node test_auth_kavkazoutdoor.js

# Тест создания поста
node create_kavkazoutdoor_post.js

# Полный тест
node test_kavkazoutdoor.js
```

## Обновление конфигурации

После получения рабочего пароля обновите переменные окружения:

```env
WORDPRESS_URL=https://kavkazoutdoor.ru
WORDPRESS_USERNAME=boris
WORDPRESS_APPLICATION_PASSWORD=НОВЫЙ_ПАРОЛЬ
```

## Мониторинг

Проверьте логи WordPress для диагностики:

1. **Инструменты → Site Health**
2. **Проверьте статус REST API**
3. **Посмотрите ошибки в логах**

## Контакты

Если проблема не решается:

1. Обратитесь к администратору сайта
2. Проверьте документацию WordPress
3. Используйте альтернативные методы аутентификации

## Статус интеграции

- ✅ MCP сервер настроен
- ✅ WordPress API подключен
- ✅ Тестовые скрипты готовы
- ❌ Аутентификация требует настройки
- ⏳ Ожидание корректного Application Password
