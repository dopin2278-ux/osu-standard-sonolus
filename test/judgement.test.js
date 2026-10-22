'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  judgeHit,
  JudgementEngine
} = require('../src/engine/judgement');

test('recognizes all hit grades', () => {
  assert.equal(judgeHit(0), 'marvelous');
  assert.equal(judgeHit(30), 'perfect');
  assert.equal(judgeHit(-60), 'great');
  assert.equal(judgeHit(100), 'good');
  assert.equal(judgeHit(200), 'miss');
});

test('judges hits on exact window boundaries', () => {
  assert.equal(judgeHit(22), 'marvelous');
  assert.equal(judgeHit(45), 'perfect');
  assert.equal(judgeHit(90), 'great');
  assert.equal(judgeHit(135), 'good');
});

test('registers a hit and awards score', () => {
  const engine = new JudgementEngine();

  const result = engine.registerHit('note-1', 1010, 1000);

  assert.equal(result.accepted, true);
  assert.equal(result.grade, 'marvelous');
  assert.equal(engine.score, 320);
  assert.equal(engine.combo, 1);
});

test('does not judge the same object twice', () => {
  const engine = new JudgementEngine();

  engine.registerHit('note-1', 1000, 1000);

  const result = engine.registerHit('note-1', 1000, 1000);

  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'already-judged');
  assert.equal(engine.judgedCount, 1);
});

test('does not register hits outside the timing window', () => {
  const engine = new JudgementEngine();

  const result = engine.registerHit('note-1', 1200, 1000);

  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'outside-window');
  assert.equal(engine.judgedCount, 0);
});

test('marks missed objects and resets combo', () => {
  const engine = new JudgementEngine();

  engine.registerHit('note-1', 1000, 1000);

  const missed = engine.update(1200, [
    { id: 'note-1', time: 1000 },
    { id: 'note-2', time: 1000 }
  ]);

  assert.deepEqual(missed, ['note-2']);
  assert.equal(engine.combo, 0);
  assert.equal(engine.counts.miss, 1);
  assert.equal(engine.judgedCount, 2);
});

test('calculates accuracy and resets all stats', () => {
  const engine = new JudgementEngine();

  engine.registerHit('note-1', 1000, 1000);
  engine.registerHit('note-2', 1030, 1000);

  assert.equal(engine.accuracy, 96.875);

  engine.reset();

  assert.equal(engine.score, 0);
  assert.equal(engine.combo, 0);
  assert.equal(engine.judgedCount, 0);
  assert.equal(engine.accuracy, 100);
});

test('rejects invalid input', () => {
  const engine = new JudgementEngine();

  assert.throws(() => judgeHit(NaN), TypeError);
  assert.throws(
    () => engine.registerHit('note-1', NaN, 1000),
    TypeError
  );
  assert.throws(() => engine.update(1000, {}), TypeError);
});
