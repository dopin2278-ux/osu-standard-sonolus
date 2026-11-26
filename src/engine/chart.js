'use strict';

function getSliderDuration(beatmap, object) {
  const slider = object.slider;
  if (!slider) return 0;

  const timingPoint = [...beatmap.timingPoints]
    .filter((point) => point.uninherited !== false && point.time <= object.time && point.beatLength > 0)
    .sort((a, b) => b.time - a.time)[0];

  const beatLength = timingPoint?.beatLength || 500;
  const sliderMultiplier = Number(beatmap.difficulty?.SliderMultiplier || 1.4);

  if (!Number.isFinite(sliderMultiplier) || sliderMultiplier <= 0) {
    throw new TypeError('Некорректный SliderMultiplier');
  }

  const durationPerSlide = slider.length / (100 * sliderMultiplier) * beatLength;

  return durationPerSlide * slider.slides;
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
      endX: object.slider.controlPoints.at(-1)?.x ?? object.x,
      endY: object.slider.controlPoints.at(-1)?.y ?? object.y,
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
      : 0
  };
}

module.exports = { buildChart, getSliderDuration };
