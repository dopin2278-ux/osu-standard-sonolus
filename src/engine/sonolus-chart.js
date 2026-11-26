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

    let slider = null;

    if (object.kind === 'slider') {
      const source = object.slider;

      if (
        !source ||
        typeof source.curveType !== 'string' ||
        !Array.isArray(source.controlPoints) ||
        !Number.isInteger(source.slides) ||
        source.slides < 1 ||
        !Number.isFinite(source.length) ||
        source.length <= 0 ||
        !Number.isFinite(source.duration) ||
        source.duration < 0 ||
        !Number.isFinite(source.endX) ||
        !Number.isFinite(source.endY)
      ) {
        throw new TypeError(`Некорректные данные Slider объекта ${object.id}`);
      }

      slider = {
        curveType: source.curveType,
        controlPoints: source.controlPoints.map((point) => ({
          x: point.x,
          y: point.y,
        })),
        slides: source.slides,
        length: source.length,
        duration: source.duration,
        endX: source.endX,
        endY: source.endY,
      };
    }

    return {
      id: object.id,
      time: object.time,
      x: object.x,
      y: object.y,
      kind: object.kind,
      type: Number.isInteger(object.type) ? object.type : null,
      hitSound: Number.isInteger(object.hitSound) ? object.hitSound : 0,
      slider,
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
      uninherited: Boolean(point.uninherited),
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
      version: String(metadata.Version || ''),
    },
    difficulty: {
      circleSize: toFiniteNumber(difficulty.CircleSize),
      overallDifficulty: toFiniteNumber(difficulty.OverallDifficulty),
      approachRate: toFiniteNumber(difficulty.ApproachRate),
      hpDrainRate: toFiniteNumber(difficulty.HPDrainRate),
      sliderMultiplier: toFiniteNumber(difficulty.SliderMultiplier, 1.4),
    },
    timingPoints,
    objects,
    duration: Number.isFinite(chart.duration)
      ? Math.max(0, chart.duration)
      : objects.reduce((maximum, object) => Math.max(maximum, object.time), 0),
  };
}

module.exports = { createSonolusChartPayload, OSU_PLAYFIELD };
