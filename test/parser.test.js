'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseOsu } = require('../src/beatmap/parser');

test('parses metadata and hit objects', () => {
  const input = [
    'osu file format v14',
    '[Metadata]',
    'Title:Test Song',
    'Artist:Test Artist',
    '[TimingPoints]',
    '0,500,4,1,0,100,1,0',
    '[HitObjects]',
    '256,192,1000,1,0,0:0:0:0:',
    '128,192,500,1,0,0:0:0:0:',
    ''
  ].join('\n');

  const map = parseOsu(input);

  assert.equal(map.formatVersion, 14);
  assert.equal(map.metadata.Title, 'Test Song');
  assert.equal(map.metadata.Artist, 'Test Artist');
  assert.equal(map.timingPoints.length, 1);
  assert.equal(map.hitObjects.length, 2);
  assert.equal(map.hitObjects[0].time, 500);
  assert.equal(map.hitObjects[0].kind, 'circle');
});

test('recognizes sliders and spinners', () => {
  const input = [
    '[HitObjects]',
    '100,100,1000,2,0,B|200:200,1,100',
    '256,192,2000,8,0,3000',
    ''
  ].join('\n');

  const map = parseOsu(input);

  assert.equal(map.hitObjects[0].kind, 'slider');
  assert.equal(map.hitObjects[1].kind, 'spinner');
});

test('rejects non-string input', () => {
  assert.throws(() => parseOsu(null), TypeError);
});

test('handles Windows line endings and a byte-order mark', () => {
  const map = parseOsu('\uFEFFosu file format v14\r\n[Metadata]\r\nTitle:Example\r\n');

  assert.equal(map.formatVersion, 14);
  assert.equal(map.metadata.Title, 'Example');
});

