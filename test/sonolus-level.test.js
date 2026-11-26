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
    { name: 'hitSound', value: 0 },
  ]);
});

test('exports slider runtime fields to the HitObject entity', () => {
  const level = createSonolusLevelData({
    objects: [{
      id: 'slider-1',
      time: 2500,
      x: 100,
      y: 150,
      kind: 'slider',
      type: 2,
      hitSound: 4,
      slider: {
        curveType: 'B',
        controlPoints: [{ x: 200, y: 200 }],
        slides: 2,
        length: 250,
        duration: 1800,
        endX: 275,
        endY: 175,
      },
    }],
    timingPoints: [],
  });

  assert.deepEqual(level.entities[2].data, [
    { name: 'time', value: 2.5 },
    { name: 'x', value: 100 },
    { name: 'y', value: 150 },
    { name: 'type', value: 2 },
    { name: 'hitSound', value: 4 },
    { name: 'sliderDuration', value: 1.8 },
    { name: 'sliderSlides', value: 2 },
    { name: 'sliderLength', value: 250 },
    { name: 'sliderEndX', value: 275 },
    { name: 'sliderEndY', value: 175 },
    { name: 'sliderCurveType', value: 66 },
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
        hitSound: 2,
      },
      {
        id: 'object-b',
        time: 4000,
        x: 512,
        y: 0,
        kind: 'circle',
        type: 1,
        hitSound: 4,
      },
    ],
    timingPoints: [],
  });

  assert.equal(level.entities[2].data[0].value, 2.5);
  assert.equal(level.entities[3].data[0].value, 4);
  assert.equal(level.entities[2].data[1].value, 0);
  assert.equal(level.entities[3].data[2].value, 0);
});

test('supports all osu object kinds and playfield boundaries', () => {
  const level = createSonolusLevelData({
    objects: [
      { id: 'circle', time: 100, x: 0, y: 0, kind: 'circle' },
      {
        id: 'slider',
        time: 200,
        x: 512,
        y: 384,
        kind: 'slider',
        type: 2,
        slider: {
          curveType: 'L',
          controlPoints: [{ x: 512, y: 384 }],
          slides: 1,
          length: 1,
          duration: 1,
          endX: 512,
          endY: 384,
        },
      },
      { id: 'spinner', time: 300, x: 256, y: 192, kind: 'spinner' },
      { id: 'hold', time: 400, x: 128, y: 256, kind: 'hold' },
    ],
    timingPoints: [],
  });

  assert.equal(level.entities.length, 6);
  assert.equal(level.entities[2].archetype, 'HitObject');
  assert.equal(level.entities[3].archetype, 'HitObject');
  assert.equal(level.entities[4].archetype, 'HitObject');
  assert.equal(level.entities[5].archetype, 'HitObject');
});

test('rejects objects outside the osu playfield', () => {
  assert.throws(
    () => createSonolusLevelData({
      objects: [{ id: 'bad-x', time: 100, x: 513, y: 192, kind: 'circle' }],
      timingPoints: [],
    }),
    /выходят за границы/
  );

  assert.throws(
    () => createSonolusLevelData({
      objects: [{ id: 'bad-y', time: 100, x: 256, y: 385, kind: 'circle' }],
      timingPoints: [],
    }),
    /выходят за границы/
  );
});

test('rejects malformed Sonolus level input', () => {
  assert.throws(() => createSonolusLevelData(null), TypeError);
  assert.throws(
    () => createSonolusLevelData({ objects: [], timingPoints: null }),
    /objects.*timingPoints/
  );
});

test('rejects slider entities without runtime data', () => {
  assert.throws(
    () => createSonolusLevelData({
      objects: [{
        id: 'slider-1',
        time: 100,
        x: 100,
        y: 100,
        kind: 'slider',
      }],
      timingPoints: [],
    }),
    /Slider/
  );
});
