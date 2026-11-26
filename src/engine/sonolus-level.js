'use strict';

const { OSU_PLAYFIELD } = require('./sonolus-chart');

const SONOLUS_ARCHETYPES = Object.freeze({
  circle: 'HitObject',
  slider: 'HitObject',
  spinner: 'HitObject',
  hold: 'HitObject',
  unknown: 'HitObject',
});

function value(name, number) {
  return { name, value: number };
}

function createSonolusLevelData(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new TypeError('Ожидается Sonolus chart payload');
  }

  if (!Array.isArray(payload.objects) || !Array.isArray(payload.timingPoints)) {
    throw new TypeError('Payload должен содержать массивы objects и timingPoints');
  }

  const entities = [
    { archetype: 'Initialization', data: [] },
    { archetype: 'Stage', data: [] },
  ];

  for (let index = 0; index < payload.objects.length; index++) {
    const object = payload.objects[index];

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
      object.x < 0 ||
      object.x > OSU_PLAYFIELD.width ||
      object.y < 0 ||
      object.y > OSU_PLAYFIELD.height
    ) {
      throw new RangeError(`Координаты объекта ${object.id} выходят за границы osu! playfield`);
    }

    const data = [
      value('time', object.time / 1000),
      value('x', object.x),
      value('y', object.y),
      value('type', Number.isInteger(object.type) ? object.type : 0),
      value('hitSound', Number.isInteger(object.hitSound) ? object.hitSound : 0),
    ];

    if (object.kind === 'slider') {
      const slider = object.slider;

      if (
        !slider ||
        !Number.isFinite(slider.duration) ||
        slider.duration < 0 ||
        !Number.isInteger(slider.slides) ||
        slider.slides < 1 ||
        !Number.isFinite(slider.length) ||
        slider.length <= 0 ||
        !Number.isFinite(slider.endX) ||
        !Number.isFinite(slider.endY) ||
        typeof slider.curveType !== 'string'
      ) {
        throw new TypeError(`Slider объект ${object.id} не содержит корректные runtime данные`);
      }

      data.push(
        value('sliderDuration', slider.duration / 1000),
        value('sliderSlides', slider.slides),
        value('sliderLength', slider.length),
        value('sliderEndX', slider.endX),
        value('sliderEndY', slider.endY),
        value('sliderCurveType', slider.curveType.charCodeAt(0)),
      );
    }

    entities.push({
      name: object.id,
      archetype: SONOLUS_ARCHETYPES[object.kind] || 'HitObject',
      data,
    });
  }

  return {
    bgmOffset: 0,
    entities,
  };
}

module.exports = {
  SONOLUS_ARCHETYPES,
  createSonolusLevelData,
};
