// Отладка base64 данных
const pngHeader = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

console.log('Base64 строка:', pngHeader);
console.log('Длина base64:', pngHeader.length);

// Декодируем base64 в Buffer
const buffer = Buffer.from(pngHeader, 'base64');
console.log('Buffer длина:', buffer.length);
console.log('Buffer первые 20 байт:', buffer.slice(0, 20));
console.log('Buffer как hex:', buffer.toString('hex'));

// Проверяем PNG заголовок
const pngSignature = buffer.slice(0, 8);
console.log('PNG сигнатура:', pngSignature);
console.log('PNG сигнатура как hex:', pngSignature.toString('hex'));

// Правильная PNG сигнатура: 89 50 4E 47 0D 0A 1A 0A
const correctPngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
console.log('Правильная PNG сигнатура:', correctPngSignature.toString('hex'));

// Сравниваем
console.log('Сигнатуры совпадают:', pngSignature.equals(correctPngSignature));

// Создаем правильный 1x1 PNG
const create1x1Png = () => {
  // PNG заголовок
  const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(1, 0);  // width
  ihdrData.writeUInt32BE(1, 4);  // height
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  
  // CRC для IHDR
  const crc = require('crypto').createHash('crc32').update(ihdrData).digest();
  
  // Собираем IHDR chunk
  const ihdrChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 13]), // length
    Buffer.from('IHDR'),
    ihdrData,
    crc
  ]);
  
  // IDAT chunk (минимальный)
  const idatData = Buffer.from([0x78, 0x9c, 0x62, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01]);
  const idatCrc = require('crypto').createHash('crc32').update(Buffer.concat([Buffer.from('IDAT'), idatData])).digest();
  const idatChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 9]), // length
    Buffer.from('IDAT'),
    idatData,
    idatCrc
  ]);
  
  // IEND chunk
  const iendCrc = require('crypto').createHash('crc32').update(Buffer.from('IEND')).digest();
  const iendChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 0]), // length
    Buffer.from('IEND'),
    iendCrc
  ]);
  
  // Собираем весь PNG
  const png = Buffer.concat([pngHeader, ihdrChunk, idatChunk, iendChunk]);
  
  return png;
};

const correctPng = create1x1Png();
console.log('\nПравильный PNG:');
console.log('Длина:', correctPng.length);
console.log('Первые 20 байт:', correctPng.slice(0, 20));
console.log('Base64:', correctPng.toString('base64'));
