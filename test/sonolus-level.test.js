'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { loadOsuFile } = require('../src/beatmap/loader');
const { buildChart } = require('../src/engine/chart');
const { createSonolusChartPayload } = require('../src/engine/sonolus-chart');
const { createSonolusLevelData } = require('../src/engine/sonolus-level');

test('converts osu chart payload into native Sonolus level entities', async () => {
  const beatmap = await loadOsuFile('assets/maps/demo.osu');
  const payload = createSonolusChartPayload(buildChart(beatmap));
  const level = createSonolusLevelData(payload);

  assert.equal(level.bgmOffset, 0);
  assert.equal(level.entities.length, payload.objects.length + 2);

  const firstNote = level.entities[2];

  assert.equal(firstNote.name, 'object-0');
  assert.equal(firstNote.archetype, 'HitObject');
  assert.deepEqual(firstNote.data, [
    { name: 'time', value: 1 },
    { name: 'x', value: 256 },
    { name: 'y', value: 192 },
    { name: 'type', value: 1 },
    { name: 'hitSound', value: 0 }
  ]);
});

test('preserves object ordering and converts milliseconds to seconds', () => {
  const level = createSonolusLevelData({
    objects: [
      {
        id: 'object-a',
        time: 2500,
        x: 0,
        y: 384,
        kind: 'circle',
        type: 1,
        hitSound: 2
      },
      {
        id: 'object-b',
        time: 4000,
        x: 512,
        y: 0,
        kind: 'slider',
        type: 2,
        hitSound: 4
      }
    ],
    timingPoints: []
  });

  assert.equal(level.entities[2].data[0].value, 2.5);
  assert.equal(level.entities[3].data[0].value, 4);
  assert.equal(level.entities[2].data[1].value, 0);
  assert.equal(level.entities[3].data[2].value, 0);
});

test('rejects malformed Sonolus level input', () => {
  assert.throws(() => createSonolusLevelData(null), TypeError);
  assert.throws(
    () => createSonolusLevelData({ objects: [], timingPoints: null }),
    /objects.*timingPoints/
  );
});
