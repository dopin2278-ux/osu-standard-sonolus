'use strict';

const WINDOWS = Object.freeze({
  marvelous: 22,
  perfect: 45,
  great: 90,
  good: 135
});

const SCORES = Object.freeze({
  marvelous: 320,
  perfect: 300,
  great: 200,
  good: 100,
  miss: 0
});

function judgeHit(deltaMs) {
  if (!Number.isFinite(deltaMs)) {
    throw new TypeError('Время попадания должно быть числом');
  }

  const delta = Math.abs(deltaMs);

  if (delta <= WINDOWS.marvelous) return 'marvelous';
  if (delta <= WINDOWS.perfect) return 'perfect';
  if (delta <= WINDOWS.great) return 'great';
  if (delta <= WINDOWS.good) return 'good';

  return 'miss';
}

class JudgementEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.judgedCount = 0;
    this.counts = {
      marvelous: 0,
      perfect: 0,
      great: 0,
      good: 0,
      miss: 0
    };

    this.judgedObjects = new Set();
  }

  registerHit(objectId, hitTime, objectTime) {
    if (objectId === undefined || objectId === null) {
      throw new TypeError('У объекта должен быть ID');
    }

    if (!Number.isFinite(hitTime) || !Number.isFinite(objectTime)) {
      throw new TypeError('Время объекта и нажатия должно быть числом');
    }

    if (this.judgedObjects.has(objectId)) {
      return { accepted: false, reason: 'already-judged' };
    }

    const deltaMs = hitTime - objectTime;
    const grade = judgeHit(deltaMs);

    // Слишком раннее или позднее нажатие не засчитывается.
    // Объект можно будет попробовать нажать снова.
    if (grade === 'miss') {
      return {
        accepted: false,
        reason: 'outside-window',
        deltaMs
      };
    }

    this._record(objectId, grade);

    return {
      accepted: true,
      grade,
      deltaMs,
      score: this.score,
      combo: this.combo
    };
  }

  update(currentTime, objects) {
    if (!Number.isFinite(currentTime)) {
      throw new TypeError('Текущее время должно быть числом');
    }

    if (!Array.isArray(objects)) {
      throw new TypeError('Объекты карты должны быть массивом');
    }

    const missed = [];

    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];

      if (!object || !Number.isFinite(object.time)) {
        throw new TypeError(`Некорректное время объекта ${i}`);
      }

      const id = object.id ?? i;

      if (
        !this.judgedObjects.has(id) &&
        currentTime > object.time + WINDOWS.good
      ) {
        this._record(id, 'miss');
        missed.push(id);
      }
    }

    return missed;
  }

  _record(objectId, grade) {
    this.judgedObjects.add(objectId);
    this.counts[grade]++;
    this.judgedCount++;
    this.score += SCORES[grade];

    if (grade === 'miss') {
      this.combo = 0;
    } else {
      this.combo++;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
    }
  }

  get accuracy() {
    if (this.judgedCount === 0) return 100;

    return (
      (this.score / (this.judgedCount * SCORES.marvelous)) * 100
    );
  }

  getStats() {
    return {
      score: this.score,
      combo: this.combo,
      maxCombo: this.maxCombo,
      judgedCount: this.judgedCount,
      accuracy: Number(this.accuracy.toFixed(2)),
      counts: { ...this.counts }
    };
  }
}

module.exports = {
  WINDOWS,
  SCORES,
  judgeHit,
  JudgementEngine
};
