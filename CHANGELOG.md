# Changelog

## 2026-11-27 — Slider runtime and timing foundation

### Что уже достигнуто

- Создан рабочий парсер карт osu! Standard формата `.osu`.
- Добавлена загрузка и базовая валидация файлов карт.
- Реализована игровая модель Chart с сортировкой игровых объектов по времени.
- Реализована базовая игровая логика и система judgement для hit objects.
- Добавлен реальный игровой процесс для Circle в Sonolus:
  - обработка касаний;
  - проверка позиции;
  - временные окна Perfect / Great / Good;
  - автоматический Miss;
  - предотвращение повторного использования одного касания.
- Создан централизованный InputManager для управления touch input.
- Добавлен разбор Slider из osu! карт:
  - тип кривой;
  - контрольные точки;
  - количество повторов;
  - длина Slider.
- Добавлен расчёт длительности Slider.
- Добавлена поддержка inherited timing points и Slider Velocity.
- Добавлен расчёт конечной точки Slider по фактической длине пути для Linear и Bezier-кривых.
- Slider runtime-данные сохраняются в промежуточном Sonolus chart payload.
- Slider runtime-данные передаются в Sonolus level entities:
  - duration;
  - slides;
  - length;
  - endpoint;
  - curve type.
- Добавлены regression-тесты для parser, chart, Slider timing, endpoint, transport payload и Sonolus level data.
- Настроена сборка Sonolus Play Engine.
- Проект развивается через отдельные feature/fix ветки и Pull Request с обязательной проверкой CI перед слиянием.

### Текущий статус

Circle gameplay уже реализован в Sonolus.

Slider сейчас находится на этапе подготовки полноценного runtime: данные карты, timing, длительность, endpoint и основные runtime-параметры уже проходят через core → chart → Sonolus transport → level data. Следующий этап — полноценная обработка движения по Slider, удержания, повторов, ticks и tail judgement непосредственно во время игры.

> Цель проекта: полноценный osu! Standard engine для Sonolus с поддержкой реальных карт osu!.
