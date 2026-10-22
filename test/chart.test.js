'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { loadOsuFile } = require('../src/beatmap/loader');
const { buildChart } = require('../src/engine/chart');

test('converts demo osu map into a game chart', async () => {
  const beatmap = await loadOsuFile('assets/maps/demo.osu');
  const chart = buildChart(beatmap);

  assert.equal(chart.objects.length, 4);
  assert.equal(chart.objects[0].id, 'object-0');
  assert.equal(chart.objects[0].time, 1000);
  assert.equal(chart.objects[0].kind, 'circle');
  assert.equal(chart.duration, 3000);
});

test('preserves object positions and metadata', async () => {
  const beatmap = await loadOsuFile('assets/maps/demo.osu');
  const chart = buildChart(beatmap);

  assert.equal(chart.objects[0].x, 256);
  assert.equal(chart.objects[0].y, 192);
  assert.equal(chart.metadata.Title, 'Demo Song');
});

test('sorts objects by hit time', () => {
  const chart = buildChart({
    metadata: {},
    difficulty: {},
    timingPoints: [],
    hitObjects: [
      { x: 10, y: 20, time: 2000, kind: 'circle' },
      { x: 30, y: 40, time: 1000, kind: 'circle' }
    ]
  });

  assert.deepEqual(
    chart.objects.map((object) => object.time),
    [1000, 2000]
  );

  assert.equal(chart.objects[0].id, 'object-1');
});

test('rejects invalid chart input', () => {
  assert.throws(() => buildChart(null), TypeError);

  assert.throws(
    () => buildChart({ hitObjects: [] }),
    /timingPoints/
  );

  assert.throws(
    () => buildChart({
      hitObjects: [{ x: 10, y: 20, time: NaN }],
      timingPoints: []
    }),
    /Некорректный игровой объект/
  );
});

test('supports an empty chart', () => {
  const chart = buildChart({
    metadata: {},
    difficulty: {},
    timingPoints: [],
    hitObjects: []
  });

  assert.equal(chart.objects.length, 0);
  assert.equal(chart.duration, 0);
});
