'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { loadOsuFile } = require('../src/beatmap/loader');
const { buildChart } = require('../src/engine/chart');
const { createSonolusChartPayload } = require('../src/engine/sonolus-chart');

test('exports parsed osu chart into a stable transport payload', async () => {
  const beatmap = await loadOsuFile('assets/maps/demo.osu');
  const payload = createSonolusChartPayload(buildChart(beatmap));

  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.sourceFormat, 'osu');
  assert.deepEqual(payload.coordinateSpace, { width: 512, height: 384 });
  assert.equal(payload.metadata.title, 'Demo Song');
  assert.equal(payload.objects.length, 4);
  assert.equal(payload.objects[0].kind, 'circle');
  assert.equal(payload.objects[0].time, 1000);
});

test('rejects malformed chart payload input', () => {
  assert.throws(() => createSonolusChartPayload(null), TypeError);
  assert.throws(
    () => createSonolusChartPayload({ objects: [] }),
    /objects and timingPoints/
  );
});

test('rejects objects outside osu playfield', () => {
  assert.throws(() => createSonolusChartPayload({
    metadata: {},
    difficulty: {},
    timingPoints: [],
    objects: [{ id: 'bad', time: 10, x: 600, y: 20, kind: 'circle' }]
  }), RangeError);
});

test('uses the last object time when chart duration is missing', () => {
  const payload = createSonolusChartPayload({
    metadata: {},
    difficulty: {},
    timingPoints: [],
    objects: [
      { id: 'a', time: 100, x: 0, y: 0, kind: 'circle' },
      { id: 'b', time: 250, x: 512, y: 384, kind: 'slider' }
    ]
  });

  assert.equal(payload.duration, 250);
});
