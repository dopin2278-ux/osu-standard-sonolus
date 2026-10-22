'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const { GameEngine } = require('../src/engine/game');
const { buildChart } = require('../src/engine/chart');
const { loadOsuFile } = require('../src/beatmap/loader');

const mapPath = path.join(__dirname, '../assets/maps/demo.osu');

let chart;

test('loads the demo chart', async () => {
  const beatmap = await loadOsuFile(mapPath);
  chart = buildChart(beatmap);

  assert.equal(chart.objects.length, 4);
  assert.equal(chart.timingPoints.length, 1);
});

test('starts a level at time zero', () => {
  const game = new GameEngine(chart);
  const frame = game.start();

  assert.equal(frame.currentTime, 0);
  assert.equal(frame.started, true);
  assert.equal(frame.finished, false);
  assert.equal(frame.visibleObjects.length, 2);
});

test('registers a hit and awards points', () => {
  const game = new GameEngine(chart);
  game.start();
  game.update(1000);

  const result = game.press('object-0');

  assert.equal(result.accepted, true);
  assert.equal(result.grade, 'marvelous');
  assert.equal(game.getStats().score, 320);
  assert.equal(game.getStats().combo, 1);
});

test('does not judge the same object twice', () => {
  const game = new GameEngine(chart);
  game.start();
  game.update(1000);

  game.press('object-0');
  const result = game.press('object-0');

  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'already-judged');
});

test('rejects an unknown object ID', () => {
  const game = new GameEngine(chart);
  game.start();

  assert.deepEqual(game.press('missing-object'), {
    accepted: false,
    reason: 'unknown-object',
  });
});

test('automatically misses objects after the judgement window', () => {
  const game = new GameEngine(chart);
  game.start();

  const frame = game.update(1200);

  assert.deepEqual(frame.missed, ['object-0']);
  assert.equal(game.getStats().counts.miss, 1);
});

test('rejects time moving backwards', () => {
  const game = new GameEngine(chart);
  game.start();
  game.update(1000);

  assert.throws(() => game.update(900), /назад/);
});

test('finishes after all objects are missed', () => {
  const game = new GameEngine(chart);
  game.start();

  const frame = game.update(3200);

  assert.equal(frame.finished, true);
  assert.equal(game.getStats().counts.miss, 4);
});

test('resets progress when restarted', () => {
  const game = new GameEngine(chart);
  game.start();
  game.update(1000);
  game.press('object-0');

  const frame = game.start();

  assert.equal(frame.currentTime, 0);
  assert.equal(frame.finished, false);
  assert.equal(frame.stats.score, 0);
  assert.equal(frame.stats.combo, 0);
});

test('rejects invalid game configuration', () => {
  assert.throws(() => new GameEngine(null), TypeError);
  assert.throws(
    () => new GameEngine(chart, { approachTime: -1 }),
    RangeError,
  );
});
