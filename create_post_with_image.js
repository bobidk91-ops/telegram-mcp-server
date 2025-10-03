import axios from 'axios';

// Создание поста с изображением на KavkazOutdoor
async function createPostWithImage() {
  const baseURL = 'http://localhost:8080';
  
  console.log('🏔️ Создание поста с изображением на KavkazOutdoor...\n');
  
  try {
    // 1. Создание поста о горном снаряжении
    console.log('1. Создание поста о горном снаряжении...');
    const newPost = {
      title: 'Лучшая палатка для горных походов - обзор 2025',
      content: `
        <h2>Выбор палатки для горных походов</h2>
        
        <p>Правильный выбор палатки - это основа комфортного и безопасного горного похода. В этой статье мы рассмотрим ключевые критерии выбора и представим лучшие модели 2025 года.</p>
        
        <h3>Ключевые критерии выбора:</h3>
        <ul>
          <li><strong>Вес</strong> - для горных походов критически важен</li>
          <li><strong>Устойчивость к ветру</strong> - горы известны сильными ветрами</li>
          <li><strong>Водонепроницаемость</strong> - защита от дождя и снега</li>
          <li><strong>Простота установки</strong> - важно в сложных условиях</li>
        </ul>
        
        <h3>Топ-3 палатки для горных походов:</h3>
        
        <h4>1. MSR Hubba Hubba NX</h4>
        <p>Легкая двухместная палатка с отличным соотношением веса и комфорта. Идеальна для большинства горных маршрутов.</p>
        
        <h4>2. Big Agnes Copper Spur HV UL2</h4>
        <p>Ультралегкая модель с просторным внутренним пространством. Отлично подходит для длительных походов.</p>
        
        <h4>3. Nemo Hornet 2P</h4>
        <p>Минималистичная палатка для опытных туристов, ценящих минимальный вес.</p>
        
        <blockquote>
          <p>"Инвестиции в качественную палатку окупаются комфортом и безопасностью в горах"</p>
        </blockquote>
        
        <h3>Советы по уходу:</h3>
        <ul>
          <li>Всегда сушите палатку после похода</li>
          <li>Храните в сухом прохладном месте</li>
          <li>Периодически обрабатывайте водоотталкивающим составом</li>
        </ul>
        
        <p>Выбор палатки - это инвестиция в ваше комфортное и безопасное путешествие по горам. Удачных походов!</p>
      `,
      excerpt: 'Подробный обзор лучших палаток для горных походов 2025 года. Критерии выбора, топ-3 модели и советы по уходу.',
      status: 'publish', // Публикуем сразу
      categories: [1], // Без рубрики
      featured_media: 35, // Используем загруженное изображение
      comment_status: 'open',
      ping_status: 'open',
      tags: [] // Пока без тегов
    };
    
    const createPostResponse = await axios.post(`${baseURL}/`, {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'wordpress_create_post',
        arguments: newPost
      },
      id: 1
    });
    
    const createResult = JSON.parse(createPostResponse.data.result.content[0].text);
    console.log('📝 Создание поста:', createResult.success ? 'Успешно' : 'Ошибка');
    if (createResult.success) {
      console.log('   ID поста:', createResult.post.id);
      console.log('   Заголовок:', createResult.post.title);
      console.log('   Статус:', createResult.post.status);
      console.log('   Дата создания:', createResult.post.date);
      console.log('   Изображение:', createResult.post.featured_media ? 'Добавлено' : 'Не добавлено');
      console.log('   Ссылка для просмотра:', `https://kavkazoutdoor.ru/?p=${createResult.post.id}`);
      console.log('   Ссылка для редактирования:', `https://kavkazoutdoor.ru/wp-admin/post.php?post=${createResult.post.id}&action=edit`);
    } else {
      console.log('❌ Ошибка:', createResult.error);
    }
    console.log('');
    
    // 2. Создание категории "Снаряжение"
    console.log('2. Создание категории "Снаряжение"...');
    const newCategory = {
      name: 'Снаряжение',
      description: 'Обзоры и рекомендации по выбору горного снаряжения',
      slug: 'equipment'
    };
    
    const createCategoryResponse = await axios.post(`${baseURL}/`, {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'wordpress_create_category',
        arguments: newCategory
      },
      id: 2
    });
    
    const categoryResult = JSON.parse(createCategoryResponse.data.result.content[0].text);
    console.log('📂 Создание категории:', categoryResult.success ? 'Успешно' : 'Ошибка');
    if (categoryResult.success) {
      console.log('   ID категории:', categoryResult.category.id);
      console.log('   Название:', categoryResult.category.name);
      console.log('   Описание:', categoryResult.category.description);
    } else {
      console.log('❌ Ошибка:', categoryResult.error);
    }
    console.log('');
    
    // 3. Обновление поста с новой категорией
    if (createResult.success && categoryResult.success) {
      console.log('3. Обновление поста с новой категорией...');
      const updatePostResponse = await axios.post(`${baseURL}/`, {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'wordpress_update_post',
          arguments: {
            id: createResult.post.id,
            categories: [categoryResult.category.id]
          }
        },
        id: 3
      });
      
      const updateResult = JSON.parse(updatePostResponse.data.result.content[0].text);
      console.log('📝 Обновление поста:', updateResult.success ? 'Успешно' : 'Ошибка');
      if (updateResult.success) {
        console.log('   Категории обновлены');
      }
    }
    console.log('');
    
    console.log('🎉 Пост с изображением успешно создан на KavkazOutdoor!');
    console.log('🌐 Проверьте сайт для просмотра результата');
    console.log('📱 Пост готов к публикации в социальных сетях');
    
  } catch (error) {
    console.error('❌ Ошибка при создании поста:', error.message);
    if (error.response) {
      console.error('📊 Статус:', error.response.status);
      console.error('📄 Данные:', error.response.data);
    }
  }
}

// Запуск создания поста
createPostWithImage();
