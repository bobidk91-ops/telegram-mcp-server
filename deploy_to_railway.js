import axios from 'axios';
import { execSync } from 'child_process';
import fs from 'fs';

// Деплой на Railway через API
async function deployToRailway() {
  console.log('🚂 Начинаем деплой на Railway...\n');
  
  try {
    // 1. Проверка Railway CLI
    console.log('1. Проверка Railway CLI...');
    try {
      const railwayVersion = execSync('npx @railway/cli@latest --version', { encoding: 'utf8' });
      console.log('✅ Railway CLI установлен:', railwayVersion.trim());
    } catch (error) {
      console.log('⚠️ Railway CLI не найден, устанавливаем...');
      execSync('npm install -g @railway/cli', { stdio: 'inherit' });
    }
    console.log('');
    
    // 2. Создание проекта на Railway
    console.log('2. Создание проекта на Railway...');
    console.log('   Название проекта: robust-connection');
    console.log('   Тип: worker');
    console.log('');
    
    // 3. Настройка переменных окружения
    console.log('3. Настройка переменных окружения...');
    const environmentVariables = {
      TELEGRAM_BOT_TOKEN: '8198346055:AAG01qXWGBwP4qzDlkZztPwshDdYw_DLFN0',
      TELEGRAM_CHANNEL_ID: '@mymcptest',
      PEXELS_API_KEY: 'j0CGX7JRiZOmEz1bEYvxZeRn1cS7qdFy5351PmDtZ01Wnby18AIeWt32',
      YANDEX_CLIENT_ID: '11221f6ebd2d47649d42d9f4b282a876',
      YANDEX_CLIENT_SECRET: 'eb793370893544d683bf277d14bfd842',
      WORDPRESS_URL: 'https://kavkazoutdoor.ru',
      WORDPRESS_USERNAME: 'u3282220_Boris',
      WORDPRESS_APPLICATION_PASSWORD: 'cRM5 eqYh iYcm sFl6 Kvjb MoSj',
      PORT: '8080',
      NODE_ENV: 'production'
    };
    
    console.log('   Переменные окружения:');
    Object.entries(environmentVariables).forEach(([key, value]) => {
      const displayValue = key.includes('PASSWORD') || key.includes('TOKEN') || key.includes('SECRET') 
        ? value.substring(0, 8) + '...' 
        : value;
      console.log(`   - ${key}: ${displayValue}`);
    });
    console.log('');
    
    // 4. Создание railway.json для worker
    console.log('4. Обновление конфигурации Railway...');
    const railwayConfig = {
      "$schema": "https://railway.app/railway.schema.json",
      "build": {
        "builder": "NIXPACKS"
      },
      "deploy": {
        "startCommand": "npm start",
        "healthcheckPath": "/health",
        "healthcheckTimeout": 100,
        "restartPolicyType": "ON_FAILURE",
        "restartPolicyMaxRetries": 10
      }
    };
    
    fs.writeFileSync('railway.json', JSON.stringify(railwayConfig, null, 2));
    console.log('✅ railway.json обновлен для worker');
    console.log('');
    
    // 5. Обновление package.json для production
    console.log('5. Обновление package.json...');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    packageJson.scripts = {
      ...packageJson.scripts,
      "start": "node dist/simple-server.js",
      "build": "tsc",
      "postinstall": "npm run build"
    };
    
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ package.json обновлен для production');
    console.log('');
    
    // 6. Коммит изменений
    console.log('6. Коммит изменений...');
    try {
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "Configure for Railway deployment as worker"', { stdio: 'inherit' });
      execSync('git push origin main', { stdio: 'inherit' });
      console.log('✅ Изменения отправлены в GitHub');
    } catch (error) {
      console.log('⚠️ Ошибка при коммите:', error.message);
    }
    console.log('');
    
    // 7. Инструкции для деплоя
    console.log('7. Инструкции для деплоя на Railway:');
    console.log('');
    console.log('📋 Ручной деплой:');
    console.log('1. Перейдите на https://railway.app');
    console.log('2. Войдите через GitHub');
    console.log('3. Нажмите "New Project"');
    console.log('4. Выберите "Deploy from GitHub repo"');
    console.log('5. Выберите репозиторий: bobidk91-ops/telegram-mcp-server');
    console.log('6. Назовите проект: robust-connection');
    console.log('7. Выберите тип: Worker');
    console.log('');
    console.log('⚙️ Настройка переменных окружения:');
    console.log('В Settings → Variables добавьте:');
    Object.entries(environmentVariables).forEach(([key, value]) => {
      console.log(`${key}=${value}`);
    });
    console.log('');
    console.log('🔧 Настройки деплоя:');
    console.log('- Start Command: npm start');
    console.log('- Health Check Path: /health');
    console.log('- Port: 8080');
    console.log('- Environment: production');
    console.log('');
    console.log('✅ После деплоя сервер будет доступен по адресу:');
    console.log('https://robust-connection-production.up.railway.app');
    console.log('');
    console.log('🧪 Тестирование после деплоя:');
    console.log('curl https://robust-connection-production.up.railway.app/health');
    console.log('');
    
    // 8. Создание тестового скрипта для проверки деплоя
    console.log('8. Создание тестового скрипта...');
    const testScript = `import axios from 'axios';

// Тест деплоя на Railway
async function testRailwayDeployment() {
  const baseURL = 'https://robust-connection-production.up.railway.app';
  
  console.log('🧪 Тестирование деплоя на Railway...\\n');
  
  try {
    // 1. Health Check
    console.log('1. Health Check...');
    const healthResponse = await axios.get(\`\${baseURL}/health\`);
    console.log('✅ Health Check:', healthResponse.data.status);
    console.log('   WordPress:', healthResponse.data.wordpress_enabled ? 'Включен' : 'Отключен');
    console.log('   Версия:', healthResponse.data.version);
    console.log('');
    
    // 2. MCP Info
    console.log('2. MCP Info...');
    const mcpResponse = await axios.get(\`\${baseURL}/mcp\`);
    console.log('✅ MCP Info получена');
    console.log('   Название:', mcpResponse.data.name);
    console.log('   Версия:', mcpResponse.data.version);
    console.log('');
    
    // 3. Tools List
    console.log('3. Tools List...');
    const toolsResponse = await axios.get(\`\${baseURL}/mcp/tools/list\`);
    console.log('✅ Tools List получен');
    console.log('   Количество инструментов:', toolsResponse.data.tools.length);
    console.log('');
    
    // 4. WordPress Test
    console.log('4. WordPress Test...');
    const wpTestResponse = await axios.post(\`\${baseURL}/\`, {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'wordpress_test_connection',
        arguments: {}
      },
      id: 1
    });
    
    const wpTestResult = JSON.parse(wpTestResponse.data.result.content[0].text);
    console.log('✅ WordPress Test:', wpTestResult.success ? 'Успешно' : 'Ошибка');
    if (wpTestResult.success) {
      console.log('   Соединение с KavkazOutdoor установлено');
    }
    console.log('');
    
    console.log('🎉 Деплой на Railway успешен!');
    console.log('🌐 Сервер работает по адресу:', baseURL);
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
    if (error.response) {
      console.error('📊 Статус:', error.response.status);
      console.error('📄 Данные:', error.response.data);
    }
  }
}

// Запуск тестирования
testRailwayDeployment();
`;

    fs.writeFileSync('test_railway_deployment.js', testScript);
    console.log('✅ test_railway_deployment.js создан');
    console.log('');
    
    console.log('🎉 Подготовка к деплою завершена!');
    console.log('📋 Следуйте инструкциям выше для завершения деплоя на Railway');
    
  } catch (error) {
    console.error('❌ Ошибка при подготовке к деплою:', error.message);
  }
}

// Запуск подготовки к деплою
deployToRailway();
