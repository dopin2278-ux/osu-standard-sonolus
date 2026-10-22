'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { loadOsuFile } = require('../src/beatmap/loader');

test('loads a valid osu file', async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'osu-test-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));

  const file = path.join(dir, 'sample.osu');
  await fs.writeFile(file, [
    'osu file format v14',
    '[Metadata]',
    'Title:Sample Song',
    'Artist:Sample Artist',
    '[HitObjects]',
    '256,192,1000,1,0,0:0:0:0:',
    ''
  ].join('\n'));

  const map = await loadOsuFile(file);

  assert.equal(map.metadata.Title, 'Sample Song');
  assert.equal(map.metadata.Artist, 'Sample Artist');
  assert.equal(map.hitObjects.length, 1);
});

test('rejects wrong file extension', async () => {
  await assert.rejects(
    loadOsuFile('song.txt'),
    /только файлы .osu/
  );
});

test('rejects missing file', async () => {
  await assert.rejects(
    loadOsuFile('/definitely-missing-osu-map.osu'),
    { code: 'ENOENT' }
  );
});

test('rejects file without osu header', async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'osu-test-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));

  const file = path.join(dir, 'invalid.osu');
  await fs.writeFile(file, '[Metadata]\nTitle:Invalid\n');

  await assert.rejects(
    loadOsuFile(file),
    /не похож на карту osu!/
  );
});
