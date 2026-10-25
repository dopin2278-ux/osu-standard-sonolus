'use strict';

const OSU_PLAYFIELD = Object.freeze({ width: 512, height: 384 });

function toFiniteNumber(value, fallback = null) {
  if (value === undefined || value === null || value === '') return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function createSonolusChartPayload(chart) {
  if (!chart || typeof chart !== 'object') {
    throw new TypeError('Ожидается объект chart');
  }
  if (!Array.isArray(chart.objects) || !Array.isArray(chart.timingPoints)) {
    throw new TypeError('chart должен содержать массивы objects и timingPoints');
  }

  const metadata = chart.metadata || {};
  const difficulty = chart.difficulty || {};

  const objects = chart.objects.map((object, index) => {
    if (
      !object ||
      typeof object.id !== 'string' ||
      !Number.isFinite(object.time) ||
      !Number.isFinite(object.x) ||
      !Number.isFinite(object.y) ||
      typeof object.kind !== 'string'
    ) {
      throw new TypeError(`Некорректный объект карты №${index}`);
    }

    if (
      object.x < 0 || object.x > OSU_PLAYFIELD.width ||
      object.y < 0 || object.y > OSU_PLAYFIELD.height
    ) {
      throw new RangeError(`Координаты объекта ${object.id} выходят за границы osu! playfield`);
    }

    return {
      id: object.id,
      time: object.time,
      x: object.x,
      y: object.y,
      kind: object.kind,
      type: Number.isInteger(object.type) ? object.type : null,
      hitSound: Number.isInteger(object.hitSound) ? object.hitSound : 0
    };
  });

  const timingPoints = chart.timingPoints.map((point, index) => {
    if (!point || !Number.isFinite(point.time) || !Number.isFinite(point.beatLength)) {
      throw new TypeError(`Некорректная timing point №${index}`);
    }

    return {
      time: point.time,
      beatLength: point.beatLength,
      meter: toFiniteNumber(point.meter, 4),
      uninherited: Boolean(point.uninherited)
    };
  });

  return {
    schemaVersion: 1,
    sourceFormat: 'osu',
    coordinateSpace: { ...OSU_PLAYFIELD },
    metadata: {
      title: String(metadata.Title || ''),
      artist: String(metadata.Artist || ''),
      creator: String(metadata.Creator || ''),
      version: String(metadata.Version || '')
    },
    difficulty: {
      circleSize: toFiniteNumber(difficulty.CircleSize),
      overallDifficulty: toFiniteNumber(difficulty.OverallDifficulty),
      approachRate: toFiniteNumber(difficulty.ApproachRate),
      hpDrainRate: toFiniteNumber(difficulty.HPDrainRate)
    },
    timingPoints,
    objects,
    duration: Number.isFinite(chart.duration)
      ? Math.max(0, chart.duration)
      : objects.reduce((maximum, object) => Math.max(maximum, object.time), 0)
  };
}

module.exports = { createSonolusChartPayload, OSU_PLAYFIELD };
