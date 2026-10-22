'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { parseOsu } = require('./parser');

const MAX_FILE_SIZE = 16 * 1024 * 1024;

async function loadOsuFile(filePath) {
  if (typeof filePath !== 'string' || !filePath.trim()) {
    throw new TypeError('Укажи путь к файлу .osu');
  }

  if (path.extname(filePath).toLowerCase() !== '.osu') {
    throw new Error('Поддерживаются только файлы .osu');
  }

  const info = await fs.stat(filePath);

  if (!info.isFile()) {
    throw new Error('Указанный путь не является файлом');
  }

  if (info.size > MAX_FILE_SIZE) {
    throw new Error('Файл слишком большой: максимум 16 МБ');
  }

  const content = await fs.readFile(filePath, 'utf8');

  if (!/^osu file format v\d+/im.test(content)) {
    throw new Error('Файл не похож на карту osu!');
  }

  const beatmap = parseOsu(content);

  return {
    ...beatmap,
    filePath: path.resolve(filePath)
  };
}

module.exports = { loadOsuFile };
