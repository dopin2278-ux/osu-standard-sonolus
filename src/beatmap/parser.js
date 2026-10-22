'use strict';

function parseOsu(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Beatmap content must be a string');
  }

  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
  const result = {
    formatVersion: null,
    sections: {},
    general: {},
    metadata: {},
    difficulty: {},
    timingPoints: [],
    hitObjects: []
  };

  let section = '';

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith('//')) continue;

    const version = line.match(/^osu file format v(\d+)$/i);
    if (version) {
      result.formatVersion = Number(version[1]);
      continue;
    }

    const header = line.match(/^\[([^\]]+)\]$/);
    if (header) {
      section = header[1];
      result.sections[section] ??= [];
      continue;
    }

    if (!section) continue;

    result.sections[section].push(line);

    if (['General', 'Metadata', 'Difficulty'].includes(section)) {
      const separator = line.indexOf(':');
      if (separator < 0) continue;

      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim();

      const target = {
        General: result.general,
        Metadata: result.metadata,
        Difficulty: result.difficulty
      }[section];

      target[key] = value;
    }

    if (section === 'TimingPoints') {
      const fields = line.split(',');
      if (fields.length < 2) continue;

      const time = Number(fields[0]);
      const beatLength = Number(fields[1]);

      if (!Number.isFinite(time) || !Number.isFinite(beatLength)) {
        continue;
      }

      result.timingPoints.push({
        time,
        beatLength,
        meter: Number(fields[2] || 4),
        sampleSet: Number(fields[3] || 0),
        sampleIndex: Number(fields[4] || 0),
        volume: Number(fields[5] || 100),
        uninherited: Number(fields[6] || 0) === 1,
        effects: Number(fields[7] || 0)
      });
    }

    if (section === 'HitObjects') {
      const fields = line.split(',');
      if (fields.length < 5) continue;

      const [x, y, time, type, hitSound] = fields;
      const object = {
        x: Number(x),
        y: Number(y),
        time: Number(time),
        type: Number(type),
        hitSound: Number(hitSound),
        raw: line
      };

      if (
        !Number.isFinite(object.x) ||
        !Number.isFinite(object.y) ||
        !Number.isFinite(object.time) ||
        !Number.isInteger(object.type) ||
        !Number.isFinite(object.hitSound)
      ) {
        continue;
      }

      object.kind =
        object.type & 8 ? 'spinner' :
        object.type & 2 ? 'slider' :
        object.type & 1 ? 'circle' :
        object.type & 128 ? 'hold' :
        'unknown';

      result.hitObjects.push(object);
    }
  }

  result.hitObjects.sort((a, b) => a.time - b.time);
  result.timingPoints.sort((a, b) => a.time - b.time);

  return result;
}

module.exports = { parseOsu };
