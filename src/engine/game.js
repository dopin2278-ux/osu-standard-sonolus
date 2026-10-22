'use strict';

const { JudgementEngine, WINDOWS } = require('./judgement');

const DEFAULT_APPROACH_TIME = 1500;

class GameEngine {
  constructor(chart, options = {}) {
    if (!chart || !Array.isArray(chart.objects)) {
      throw new TypeError('Ожидается карта с массивом objects');
    }

    const approachTime = options.approachTime ?? DEFAULT_APPROACH_TIME;

    if (!Number.isFinite(approachTime) || approachTime < 0) {
      throw new RangeError('approachTime должен быть неотрицательным');
    }

    const ids = new Set();

    for (const object of chart.objects) {
      if (
        !object ||
        (typeof object.id !== 'string' &&
          typeof object.id !== 'number') ||
        !Number.isFinite(object.time) ||
        ids.has(object.id)
      ) {
        throw new TypeError('Некорректные или повторяющиеся ID объектов');
      }

      ids.add(object.id);
    }

    this.chart = chart;
    this.approachTime = approachTime;
    this.judgement = new JudgementEngine();
    this.objectById = new Map(
      chart.objects.map((object) => [object.id, object])
    );

    this.currentTime = 0;
    this.started = false;
    this.finished = false;
  }

  start() {
    this.judgement.reset();
    this.currentTime = 0;
    this.started = true;
    this.finished = false;

    return this.getFrame();
  }

  update(currentTime) {
    if (!this.started) {
      throw new Error('Сначала запусти уровень методом start()');
    }

    if (!Number.isFinite(currentTime) || currentTime < 0) {
      throw new RangeError('Время игры должно быть неотрицательным');
    }

    if (currentTime < this.currentTime) {
      throw new Error('Время игры не может идти назад');
    }

    if (this.finished) {
      return this.getFrame();
    }

    this.currentTime = currentTime;

    const missed = this.judgement.update(
      currentTime,
      this.chart.objects
    );

    const allJudged =
      this.judgement.judgedCount === this.chart.objects.length;

    if (
      allJudged &&
      currentTime > this.chart.duration + WINDOWS.good
    ) {
      this.finished = true;
    }

    return { ...this.getFrame(), missed };
  }

  press(objectId) {
    if (!this.started) {
      throw new Error('Сначала запусти уровень методом start()');
    }

    if (this.finished) {
      return { accepted: false, reason: 'game-finished' };
    }

    const object = this.objectById.get(objectId);

    if (!object) {
      return { accepted: false, reason: 'unknown-object' };
    }

    return this.judgement.registerHit(
      objectId,
      this.currentTime,
      object.time
    );
  }

  getFrame() {
    const visibleObjects = this.chart.objects.filter((object) => {
      const judged = this.judgement.judgedObjects.has(object.id);

      return (
        !judged &&
        object.time >= this.currentTime - WINDOWS.good &&
        object.time <= this.currentTime + this.approachTime
      );
    });

    return {
      currentTime: this.currentTime,
      started: this.started,
      finished: this.finished,
      visibleObjects,
      stats: this.judgement.getStats()
    };
  }

  getStats() {
    return this.judgement.getStats();
  }
}

module.exports = { GameEngine, DEFAULT_APPROACH_TIME };
