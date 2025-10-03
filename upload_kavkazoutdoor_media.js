import axios from 'axios';

// Загрузка медиафайла на KavkazOutdoor
async function uploadKavkazOutdoorMedia() {
  const baseURL = 'http://localhost:8080';
  
  console.log('🏔️ Загрузка медиафайла на KavkazOutdoor...\n');
  
  try {
    // 1. Загрузка изображения гор
    console.log('1. Загрузка изображения гор...');
    const mediaData = {
      file_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      filename: 'mountain-landscape.jpg',
      title: 'Горный пейзаж для KavkazOutdoor',
      alt_text: 'Красивый горный пейзаж с заснеженными вершинами',
      caption: 'Вдохновляющий вид на горы для любителей походов',
      description: 'Высококачественное изображение горного пейзажа, идеально подходящее для статей о горных походах и туризме.'
    };
    
    const uploadResponse = await axios.post(`${baseURL}/`, {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'wordpress_upload_media',
        arguments: mediaData
      },
      id: 1
    });
    
    const uploadResult = JSON.parse(uploadResponse.data.result.content[0].text);
    console.log('📁 Загрузка медиа:', uploadResult.success ? 'Успешно' : 'Ошибка');
    if (uploadResult.success) {
      console.log('   ID медиа:', uploadResult.media.id);
      console.log('   Название:', uploadResult.media.title);
      console.log('   URL:', uploadResult.media.source_url);
      console.log('   Тип:', uploadResult.media.media_type);
      console.log('   MIME тип:', uploadResult.media.mime_type);
      if (uploadResult.media.media_details) {
        console.log('   Размеры:', `${uploadResult.media.media_details.width}x${uploadResult.media.media_details.height}`);
      }
    } else {
      console.log('❌ Ошибка:', uploadResult.error);
    }
    console.log('');
    
    // 2. Получение информации о загруженном медиа
    if (uploadResult.success) {
      console.log('2. Получение информации о медиафайле...');
      const getMediaResponse = await axios.post(`${baseURL}/`, {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'wordpress_get_media_item',
          arguments: {
            id: uploadResult.media.id
          }
        },
        id: 2
      });
      
      const getMediaResult = JSON.parse(getMediaResponse.data.result.content[0].text);
      console.log('📖 Информация о медиа:', getMediaResult.success ? 'Получена' : 'Ошибка');
      if (getMediaResult.success) {
        console.log('   Название:', getMediaResult.media.title);
        console.log('   Alt текст:', getMediaResult.media.alt_text);
        console.log('   Подпись:', getMediaResult.media.caption);
        console.log('   Описание:', getMediaResult.media.description);
        console.log('   Ссылка:', getMediaResult.media.link);
      }
    }
    console.log('');
    
    // 3. Получение списка всех медиафайлов
    console.log('3. Получение списка медиафайлов...');
    const getMediaListResponse = await axios.post(`${baseURL}/`, {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'wordpress_get_media',
        arguments: {
          per_page: 10,
          orderby: 'date',
          order: 'desc'
        }
      },
      id: 3
    });
    
    const getMediaListResult = JSON.parse(getMediaListResponse.data.result.content[0].text);
    console.log('📁 Список медиа:', getMediaListResult.success ? 'Получен' : 'Ошибка');
    if (getMediaListResult.success) {
      console.log(`   Найдено: ${getMediaListResult.count} медиафайлов`);
      getMediaListResult.media.forEach((media, index) => {
        console.log(`   ${index + 1}. ${media.title} (ID: ${media.id})`);
        console.log(`      Тип: ${media.media_type}, MIME: ${media.mime_type}`);
        console.log(`      URL: ${media.source_url}`);
      });
    }
    console.log('');
    
    console.log('🎉 Медиафайл успешно загружен на KavkazOutdoor!');
    console.log('🖼️ Изображение готово к использованию в постах');
    
  } catch (error) {
    console.error('❌ Ошибка при загрузке медиа:', error.message);
    if (error.response) {
      console.error('📊 Статус:', error.response.status);
      console.error('📄 Данные:', error.response.data);
    }
  }
}

// Запуск загрузки медиа
uploadKavkazOutdoorMedia();
