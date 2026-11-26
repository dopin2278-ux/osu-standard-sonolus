'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { loadOsuFile } = require('../src/beatmap/loader');
const {
  buildChart,
  getSliderDuration,
  getSliderVelocityMultiplier,
  getSliderEndpoint,
} = require('../src/engine/chart');

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
      { x: 30, y: 40, time: 1000, kind: 'circle' },
    ],
  });
  assert.deepEqual(chart.objects.map((object) => object.time), [1000, 2000]);
  assert.equal(chart.objects[0].id, 'object-1');
});

test('preserves slider gameplay data', () => {
  const chart = buildChart({
    metadata: {},
    difficulty: {},
    timingPoints: [],
    hitObjects: [{
      x: 100,
      y: 150,
      time: 1000,
      kind: 'slider',
      type: 2,
      hitSound: 0,
      slider: {
        curveType: 'B',
        controlPoints: [{ x: 200, y: 200 }, { x: 300, y: 150 }],
        slides: 2,
        length: 250,
      },
    }],
  });

  const slider = chart.objects[0].slider;
  assert.equal(slider.curveType, 'B');
  assert.deepEqual(slider.controlPoints, [
    { x: 200, y: 200 },
    { x: 300, y: 150 },
  ]);
  assert.equal(slider.slides, 2);
  assert.equal(slider.length, 250);
  assert.equal(slider.duration, 1785.7142857142858);
  assert.ok(Number.isFinite(slider.endX));
  assert.ok(Number.isFinite(slider.endY));
});

test('uses inherited timing point for slider velocity', () => {
  const beatmap = {
    difficulty: { SliderMultiplier: '1.4' },
    timingPoints: [
      { time: 0, beatLength: 500, uninherited: true },
      { time: 500, beatLength: -250, uninherited: false },
    ],
  };
  const object = { time: 1000, slider: { length: 280, slides: 1 } };

  assert.equal(getSliderVelocityMultiplier(beatmap, object.time), 0.4);
  assert.equal(getSliderDuration(beatmap, object), 2500);
});

test('uses the active base timing point with inherited SV', () => {
  const beatmap = {
    difficulty: { SliderMultiplier: '1.4' },
    timingPoints: [
      { time: 0, beatLength: 500, uninherited: true },
      { time: 100, beatLength: -250, uninherited: false },
      { time: 800, beatLength: 400, uninherited: true },
      { time: 900, beatLength: -200, uninherited: false },
    ],
  };
  const object = { time: 1000, slider: { length: 280, slides: 1 } };

  assert.equal(getSliderDuration(beatmap, object), 2000);
});

test('calculates a linear slider endpoint from path length', () => {
  const endpoint = getSliderEndpoint({
    x: 0,
    y: 0,
    slider: {
      curveType: 'L',
      controlPoints: [{ x: 300, y: 0 }],
      length: 150,
    },
  });

  assert.equal(endpoint.x, 150);
  assert.equal(endpoint.y, 0);
});

test('calculates slider duration and endpoint', () => {
  const chart = buildChart({
    metadata: {},
    difficulty: { SliderMultiplier: '1.4' },
    timingPoints: [{ time: 0, beatLength: 500, uninherited: true }],
    hitObjects: [{
      x: 100,
      y: 150,
      time: 1000,
      kind: 'slider',
      type: 2,
      hitSound: 0,
      slider: {
        curveType: 'B',
        controlPoints: [{ x: 200, y: 200 }, { x: 300, y: 150 }],
        slides: 2,
        length: 280,
      },
    }],
  });

  assert.equal(chart.objects[0].slider.duration, 2000);
  assert.ok(Number.isFinite(chart.objects[0].slider.endX));
  assert.ok(Number.isFinite(chart.objects[0].slider.endY));
  assert.equal(chart.duration, 3000);
});

test('rejects invalid chart input', () => {
  assert.throws(() => buildChart(null), TypeError);
  assert.throws(() => buildChart({ hitObjects: [] }), /timingPoints/);
  assert.throws(
    () => buildChart({
      hitObjects: [{ x: 10, y: 20, time: NaN }],
      timingPoints: [],
    }),
    /Некорректный игровой объект/
  );
});

test('supports an empty chart', () => {
  const chart = buildChart({
    metadata: {},
    difficulty: {},
    timingPoints: [],
    hitObjects: [],
  });
  assert.equal(chart.objects.length, 0);
  assert.equal(chart.duration, 0);
});
