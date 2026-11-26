'use strict';

function getBaseBeatLength(beatmap, time) {
  const point = [...beatmap.timingPoints]
    .filter((item) => item.uninherited !== false && item.time <= time && item.beatLength > 0)
    .sort((a, b) => b.time - a.time)[0];
  return point?.beatLength || 500;
}

function getSliderVelocityMultiplier(beatmap, time) {
  const basePoint = [...beatmap.timingPoints]
    .filter((item) => item.uninherited !== false && item.time <= time && item.beatLength > 0)
    .sort((a, b) => b.time - a.time)[0];

  const baseTime = basePoint?.time ?? Number.NEGATIVE_INFINITY;
  const point = [...beatmap.timingPoints]
    .filter((item) =>
      item.uninherited === false &&
      item.time >= baseTime &&
      item.time <= time &&
      item.beatLength < 0
    )
    .sort((a, b) => b.time - a.time)[0];

  return point ? Math.max(0.01, -100 / point.beatLength) : 1;
}

function getSliderDuration(beatmap, object) {
  if (!object.slider) return 0;

  const beatLength = getBaseBeatLength(beatmap, object.time);
  const sliderMultiplier = Number(beatmap.difficulty?.SliderMultiplier || 1.4);
  const velocityMultiplier = getSliderVelocityMultiplier(beatmap, object.time);

  if (!Number.isFinite(sliderMultiplier) || sliderMultiplier <= 0) {
    throw new TypeError('Некорректный SliderMultiplier');
  }

  return object.slider.length /
    (100 * sliderMultiplier * velocityMultiplier) *
    beatLength *
    object.slider.slides;
}

function bezierPoint(points, t) {
  const work = points.map((point) => ({ x: point.x, y: point.y }));

  for (let level = work.length - 1; level > 0; level--) {
    for (let index = 0; index < level; index++) {
      work[index].x += (work[index + 1].x - work[index].x) * t;
      work[index].y += (work[index + 1].y - work[index].y) * t;
    }
  }

  return work[0];
}

function buildSliderPath(object) {
  const slider = object.slider;
  const points = [{ x: object.x, y: object.y }, ...slider.controlPoints];

  if (slider.curveType === 'L' || points.length < 2) return points;

  if (slider.curveType === 'B') {
    const samples = Math.max(64, points.length * 64);
    return Array.from({ length: samples + 1 }, (_, index) =>
      bezierPoint(points, index / samples)
    );
  }

  return points;
}

function getSliderEndpoint(object) {
  if (!object || !object.slider || !Array.isArray(object.slider.controlPoints)) {
    throw new TypeError('Некорректные данные Slider для расчёта endpoint');
  }

  const path = buildSliderPath(object);
  const targetLength = Number(object.slider.length);

  if (!Number.isFinite(targetLength) || targetLength <= 0 || path.length === 0) {
    throw new TypeError('Некорректная длина Slider');
  }

  let travelled = 0;

  for (let index = 1; index < path.length; index++) {
    const previous = path[index - 1];
    const current = path[index];
    const segment = Math.hypot(current.x - previous.x, current.y - previous.y);

    if (travelled + segment >= targetLength) {
      const ratio = segment === 0 ? 0 : (targetLength - travelled) / segment;
      return {
        x: previous.x + (current.x - previous.x) * ratio,
        y: previous.y + (current.y - previous.y) * ratio,
      };
    }

    travelled += segment;
  }

  const endpoint = path[path.length - 1];

  if (!endpoint || !Number.isFinite(endpoint.x) || !Number.isFinite(endpoint.y)) {
    throw new TypeError('Не удалось вычислить endpoint Slider');
  }

  return { x: endpoint.x, y: endpoint.y };
}

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

    const slider = object.slider ? {
      curveType: object.slider.curveType,
      controlPoints: object.slider.controlPoints.map((point) => ({ ...point })),
      slides: object.slider.slides,
      length: object.slider.length,
      duration: getSliderDuration(beatmap, object),
      ...getSliderEndpoint(object),
    } : null;

    return {
      id: `object-${index}`,
      time: object.time,
      x: object.x,
      y: object.y,
      kind: object.kind,
      type: object.type,
      hitSound: object.hitSound,
      raw: object.raw,
      slider,
    };
  });

  objects.sort((a, b) => a.time - b.time);

  return {
    metadata: { ...(beatmap.metadata || {}) },
    difficulty: { ...(beatmap.difficulty || {}) },
    timingPoints: beatmap.timingPoints.map((point) => ({ ...point })),
    objects,
    duration: objects.length > 0
      ? Math.max(...objects.map((object) =>
          object.slider ? object.time + object.slider.duration : object.time
        ))
      : 0,
  };
}

module.exports = {
  buildChart,
  getSliderDuration,
  getSliderVelocityMultiplier,
  getSliderEndpoint,
};