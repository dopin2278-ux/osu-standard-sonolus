'use strict';

const path = require('node:path');
const { loadOsuFile } = require('../beatmap/loader');

async function main() {
  const input = process.argv[2];

  if (!input) {
    console.error('Использование: npm run parse -- путь/к/карте.osu');
    process.exitCode = 1;
    return;
  }

  try {
    const map = await loadOsuFile(path.resolve(input));

    const count = (kind) =>
      map.hitObjects.filter((object) => object.kind === kind).length;

    console.log('\n=== Информация о карте osu! ===');
    console.log(`Файл: ${map.filePath}`);
    console.log(`Название: ${map.metadata.Title || 'Не указано'}`);
    console.log(`Исполнитель: ${map.metadata.Artist || 'Не указан'}`);
    console.log(`Сложность: ${map.metadata.Version || 'Не указана'}`);
    console.log(`Mapper: ${map.metadata.Creator || 'Не указан'}`);
    console.log(`Формат: v${map.formatVersion ?? 'неизвестен'}`);
    console.log(`Круги: ${count('circle')}`);
    console.log(`Слайдеры: ${count('slider')}`);
    console.log(`Спиннеры: ${count('spinner')}`);
    console.log(`Точки тайминга: ${map.timingPoints.length}`);
    console.log(`Всего объектов: ${map.hitObjects.length}`);
  } catch (error) {
    console.error(`Ошибка загрузки: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
