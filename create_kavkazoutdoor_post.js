import axios from 'axios';

// Создание поста на KavkazOutdoor
async function createKavkazOutdoorPost() {
  const baseURL = 'http://localhost:8080';
  
  console.log('🏔️ Создание поста на KavkazOutdoor...\n');
  
  try {
    // 1. Получение категорий для выбора
    console.log('1. Получение доступных категорий...');
    const categoriesResponse = await axios.post(`${baseURL}/`, {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'wordpress_get_categories',
        arguments: {
          per_page: 20
        }
      },
      id: 1
    });
    
    const categoriesResult = JSON.parse(categoriesResponse.data.result.content[0].text);
    if (categoriesResult.success) {
      console.log('📂 Доступные категории:');
      categoriesResult.categories.forEach((category, index) => {
        console.log(`   ${index + 1}. ${category.name} (ID: ${category.id})`);
      });
    }
    console.log('');
    
    // 2. Создание нового поста
    console.log('2. Создание нового поста...');
    const newPost = {
      title: 'Тестовый пост от MCP сервера',
      content: `
        <h2>Добро пожаловать в мир горных походов!</h2>
        
        <p>Этот пост был создан автоматически через MCP сервер для тестирования интеграции с WordPress.</p>
        
        <h3>Что можно делать через MCP:</h3>
        <ul>
          <li>Создавать и редактировать посты</li>
          <li>Управлять категориями и тегами</li>
          <li>Загружать медиафайлы</li>
          <li>Управлять пользователями</li>
          <li>Модерировать комментарии</li>
        </ul>
        
        <p>Сайт <strong>KavkazOutdoor</strong> теперь полностью интегрирован с MCP протоколом!</p>
        
        <blockquote>
          <p>"Горы зовут тех, чья душа им по росту"</p>
        </blockquote>
      `,
      excerpt: 'Тестовый пост для демонстрации возможностей MCP интеграции с WordPress',
      status: 'draft', // Создаем как черновик для безопасности
      categories: [1], // Без рубрики
      comment_status: 'open',
      ping_status: 'open'
    };
    
    const createPostResponse = await axios.post(`${baseURL}/`, {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'wordpress_create_post',
        arguments: newPost
      },
      id: 2
    });
    
    const createResult = JSON.parse(createPostResponse.data.result.content[0].text);
    console.log('📝 Создание поста:', createResult.success ? 'Успешно' : 'Ошибка');
    if (createResult.success) {
      console.log('   ID поста:', createResult.post.id);
      console.log('   Заголовок:', createResult.post.title);
      console.log('   Статус:', createResult.post.status);
      console.log('   Дата создания:', createResult.post.date);
      console.log('   Ссылка для редактирования:', `https://kavkazoutdoor.ru/wp-admin/post.php?post=${createResult.post.id}&action=edit`);
    } else {
      console.log('❌ Ошибка:', createResult.error);
    }
    console.log('');
    
    // 3. Получение созданного поста для проверки
    if (createResult.success) {
      console.log('3. Проверка созданного поста...');
      const getPostResponse = await axios.post(`${baseURL}/`, {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'wordpress_get_post',
          arguments: {
            id: createResult.post.id
          }
        },
        id: 3
      });
      
      const getPostResult = JSON.parse(getPostResponse.data.result.content[0].text);
      console.log('📖 Получение поста:', getPostResult.success ? 'Успешно' : 'Ошибка');
      if (getPostResult.success) {
        console.log('   Заголовок:', getPostResult.post.title);
        if (getPostResult.post.content && typeof getPostResult.post.content === 'string') {
          console.log('   Содержимое:', getPostResult.post.content.substring(0, 200) + '...');
        }
        if (getPostResult.post.excerpt && typeof getPostResult.post.excerpt === 'string') {
          console.log('   Отрывок:', getPostResult.post.excerpt);
        }
        console.log('   Автор:', getPostResult.post.author);
        console.log('   Категории:', getPostResult.post.categories);
      }
    }
    console.log('');
    
    console.log('🎉 Пост успешно создан на KavkazOutdoor!');
    console.log('🌐 Проверьте админку WordPress для просмотра и публикации');
    
  } catch (error) {
    console.error('❌ Ошибка при создании поста:', error.message);
    if (error.response) {
      console.error('📊 Статус:', error.response.status);
      console.error('📄 Данные:', error.response.data);
    }
  }
}

// Запуск создания поста
createKavkazOutdoorPost();
