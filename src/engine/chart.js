'use strict';

function buildChart(beatmap) {
  if (!beatmap || typeof beatmap !== 'object') {
    throw new TypeError('Ожидаются данные карты osu!');
  }

  if (!Array.isArray(beatmap.hitObjects)) {
    throw new TypeError('В карте отсутствует массив hitObjects');
  }

  if (!Array.isArray(beatmap.timingPoints)) {
    throw new TypeError('В карте отсутствует массив timingPoints');
  }

  const objects = beatmap.hitObjects.map((object, index) => {
    if (
      !object ||
      !Number.isFinite(object.time) ||
      !Number.isFinite(object.x) ||
      !Number.isFinite(object.y)
    ) {
      throw new TypeError(`Некорректный игровой объект №${index}`);
    }

    return {
      id: `object-${index}`,
      time: object.time,
      x: object.x,
      y: object.y,
      kind: object.kind,
      type: object.type,
      hitSound: object.hitSound,
      raw: object.raw
    };
  });

  objects.sort((a, b) => a.time - b.time);

  return {
    metadata: { ...(beatmap.metadata || {}) },
    difficulty: { ...(beatmap.difficulty || {}) },
    timingPoints: beatmap.timingPoints.map((point) => ({ ...point })),
    objects,
    duration: objects.length > 0
      ? objects[objects.length - 1].time
      : 0
  };
}

module.exports = { buildChart };
