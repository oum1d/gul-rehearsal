/* ============================================================================
   ГУЛ — слой данных
   ----------------------------------------------------------------------------
   Здесь живёт вся арифметика времени и цен. Страницы к window.GUL_DATA
   напрямую не обращаются — только через этот модуль. Когда появится настоящий
   бэкенд, менять придётся один файл.

   ОПЕРАЦИОННЫЙ ДЕНЬ
   База работает с 10:00 до 06:00 следующих суток, поэтому слоты пронумерованы
   сквозным индексом 10..29, где 24 — это полночь. Ночь не «перепрыгивает» в
   другую дату, и смежность часов считается обычным +1.
   ============================================================================ */

window.GUL = (function () {
  'use strict';

  /* Переключатель источника данных.
     false — данные из assets/data/rooms.js (работает при открытии двойным
             кликом, протокол file://)
     true  — данные из assets/data/rooms.json через fetch (нужен http-сервер:
             хостинг, Live Server и т. п.) */
  var USE_FETCH = false;
  var JSON_URL = 'assets/data/rooms.json';

  var cache = null;

  /* ==========================================================================
     ЗАГРУЗКА
     ========================================================================== */

  /* Имитация сетевого запроса: задержка есть всегда, поэтому состояния
     загрузки — настоящие, а не декоративные. ?fail=1 в адресе принудительно
     роняет запрос: так проверяется экран ошибки. */
  function load() {
    if (cache) return Promise.resolve(cache);

    var forceFail = new URLSearchParams(location.search).get('fail') === '1';
    var delay = 320 + Math.random() * 280;

    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (forceFail) { reject(new Error('forced-failure')); return; }

        if (USE_FETCH) {
          fetch(JSON_URL)
            .then(function (r) {
              if (!r.ok) throw new Error('HTTP ' + r.status);
              return r.json();
            })
            .then(function (data) { cache = data; startClockOnce(); resolve(data); })
            .catch(reject);
          return;
        }

        if (!window.GUL_DATA) { reject(new Error('no-data')); return; }
        cache = window.GUL_DATA;
        startClockOnce();
        resolve(cache);
      }, delay);
    });
  }

  function reset() { cache = null; }

  var clockStarted = false;
  function startClockOnce() {
    if (clockStarted) return;
    clockStarted = true;
    startClock();
  }

  /* ==========================================================================
     ВРЕМЯ
     ========================================================================== */

  function startOfDay(date) {
    var d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function addDays(date, n) {
    var d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  /* Реальный момент времени для слота операционного дня */
  function slotDate(dayDate, index) {
    var d = startOfDay(dayDate);
    if (index >= 24) { d = addDays(d, 1); }
    d.setHours(index % 24, 0, 0, 0);
    return d;
  }

  /* «23:00», «00:00» — индекс приводится к обычным часам */
  function slotLabel(index) {
    return String(index % 24).padStart(2, '0') + ':00';
  }

  /* Диапазон подряд идущих слотов: «21:00 — 23:00» */
  function rangeLabel(indexes) {
    if (!indexes.length) return '';
    var sorted = indexes.slice().sort(function (a, b) { return a - b; });
    return slotLabel(sorted[0]) + ' — ' + slotLabel(sorted[sorted.length - 1] + 1);
  }

  /* Какой операционный день идёт прямо сейчас.
     В 02:00 идёт вчерашний день, в 08:00 база закрыта. */
  function nowContext() {
    var now = new Date();
    var h = now.getHours();

    if (h >= 10) return { day: startOfDay(now), index: h, open: true };
    if (h < 6)   return { day: addDays(startOfDay(now), -1), index: h + 24, open: true };
    return { day: startOfDay(now), index: null, open: false };  // 06:00–10:00
  }

  /* Ближайший час, который ещё можно забронировать.
     Текущий час уже идёт — забронировать его нельзя, поэтому «сейчас свободно»
     считается по следующему часу, а не по текущему. Если база закрыта или
     сутки закончились, ближайший слот — сегодняшнее открытие в 10:00. */
  function nextContext() {
    var now = new Date();
    var h = now.getHours();
    var first = cache.schedule.firstSlot;
    var last = cache.schedule.lastSlot;

    if (h >= 10) return { day: startOfDay(now), index: h + 1, open: true };

    if (h < 6) {
      var index = h + 24 + 1;
      if (index <= last) return { day: addDays(startOfDay(now), -1), index: index, open: true };
      return { day: startOfDay(now), index: first, open: false };   // ночь кончилась
    }

    return { day: startOfDay(now), index: first, open: false };     // 06:00–10:00
  }

  function isWeekend(dayDate) {
    var d = dayDate.getDay();
    return d === 0 || d === 6;
  }

  /* ==========================================================================
     ТАРИФЫ И ЦЕНЫ
     ========================================================================== */

  function tariffOf(index) {
    var t = cache.schedule.tariffs;
    if (index >= t.night.from) return 'night';
    if (index >= t.evening.from) return 'evening';
    return 'day';
  }

  function coefOf(index, dayDate) {
    var t = cache.schedule.tariffs;
    var kind = tariffOf(index);
    if (kind === 'night') return t.night.coef;
    if (kind === 'evening') return t.evening.coef;
    // В выходные дневные часы идут по вечернему коэффициенту
    return isWeekend(dayDate) ? cache.schedule.weekendDayCoef : t.day.coef;
  }

  function priceOf(room, dayDate, index) {
    return Math.round(room.price * coefOf(index, dayDate));
  }

  function totalOf(room, dayDate, indexes) {
    return indexes.reduce(function (sum, i) { return sum + priceOf(room, dayDate, i); }, 0);
  }

  /* ==========================================================================
     ЗАНЯТОСТЬ
     ========================================================================== */

  /* --------------------------------------------------------------------------
     Демо-занятость, которая меняется каждые два часа.

     Номер окна считается от местного времени: окна начинаются в 00:00,
     02:00, 04:00 и т. д. Из номера окна, комнаты и даты собирается «зерно»,
     и уже из него генератор раскладывает брони на день. Одно зерно — одна
     и та же раскладка, поэтому все страницы и все посетители в пределах
     окна видят одинаковое расписание, а со сменой окна оно перетасовывается.
     -------------------------------------------------------------------------- */

  /* ?occ=N фиксирует окно — для скриншотов и проверки. */
  var fixedWindow = (function () {
    var v = new URLSearchParams(location.search).get('occ');
    return v !== null && /^\d+$/.test(v) ? Number(v) : null;
  })();

  function occupancyWindow(date) {
    if (fixedWindow !== null) return fixedWindow;
    var d = date || new Date();
    // Номер местных суток: Date.UTC от местных года-месяца-дня не зависит от
    // часового пояса и перехода на летнее время
    var dayNumber = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
    return Math.floor((dayNumber * 24 + d.getHours()) / cache.demoOccupancy.windowHours);
  }

  /* FNV-1a: строка → 32-битное число. Нужен только разброс, не криптостойкость. */
  function hashString(s) {
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  /* mulberry32: маленький генератор псевдослучайных чисел с зерном. */
  function seededRandom(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function dayKey(dayDate) {
    return dayDate.getFullYear() + '-' + (dayDate.getMonth() + 1) + '-' + dayDate.getDate();
  }

  var busyMemo = {};
  var memoWindow = null;

  /* Раскладка броней одной комнаты на один операционный день.
     Идём по часам с открытия: на свободном часе с вероятностью p начинается
     бронь длиной 1–3 часа. p зависит от востребованности комнаты, времени
     суток и выходных — вечер получается плотным, утро и позднюю ночь
     свободнее, как у настоящей репбазы. */
  function busyDay(roomId, dayDate) {
    var win = occupancyWindow();
    if (win !== memoWindow) { busyMemo = {}; memoWindow = win; }

    var key = roomId + '|' + dayKey(dayDate);
    if (busyMemo[key]) return busyMemo[key];

    var cfg = cache.demoOccupancy;
    var rnd = seededRandom(hashString(win + '|' + key));
    var load = cfg.load[roomId] || 0.25;
    var weekend = isWeekend(dayDate) ? cfg.weekend : 1;
    var busy = {};

    var i = cache.schedule.firstSlot;
    while (i <= cache.schedule.lastSlot) {
      var kind = tariffOf(i);
      var p = load * cfg.timeWeight[kind];
      if (kind !== 'night') p *= weekend;
      if (i >= cfg.lateNight.from) p *= cfg.lateNight.coef;

      if (rnd() < Math.min(p, 0.9)) {
        // длина брони по таблице вероятностей blockHours
        var roll = rnd(), acc = 0, length = 1;
        for (var k = 0; k < cfg.blockHours.length; k++) {
          acc += cfg.blockHours[k].chance;
          if (roll < acc) { length = cfg.blockHours[k].hours; break; }
        }
        for (var h = 0; h < length && i <= cache.schedule.lastSlot; h++, i++) busy[i] = true;
      } else {
        i++;
      }
    }

    busyMemo[key] = busy;
    return busy;
  }

  function isBusy(roomId, dayDate, index) {
    if (!cache.demoOccupancy) return false;
    return !!busyDay(roomId, dayDate)[index];
  }

  /* --------------------------------------------------------------------------
     Тик: страница сама узнаёт, что наступил новый час или новое окно
     занятости, и перерисовывается. Без этого вкладка, открытая в 23:50,
     в 00:10 показывала бы прошедшие часы свободными и старую раскладку.
     Страницы слушают событие gul:tick так же, как смену языка.
     -------------------------------------------------------------------------- */
  var lastTick = { hour: null, win: null };

  function emitTickIfChanged() {
    if (!cache) return;
    var now = new Date();
    var hour = now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate() + '-' + now.getHours();
    var win = occupancyWindow(now);
    if (hour === lastTick.hour && win === lastTick.win) return;

    var windowChanged = lastTick.win !== null && win !== lastTick.win;
    var first = lastTick.hour === null;
    lastTick = { hour: hour, win: win };
    if (first) return;                         // первый вызов — просто запоминаем

    document.dispatchEvent(new CustomEvent('gul:tick', { detail: { windowChanged: windowChanged } }));
  }

  function scheduleTick() {
    var now = new Date();
    var next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
    // +1,5 с запаса: таймер в браузере может сработать на пару миллисекунд раньше
    setTimeout(function () { emitTickIfChanged(); scheduleTick(); }, next - now + 1500);
  }

  // Фоновые вкладки браузер «усыпляет», и таймер опаздывает — поэтому при
  // возвращении во вкладку проверяем время ещё раз
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) emitTickIfChanged();
  });

  function startClock() {
    emitTickIfChanged();
    scheduleTick();
  }

  /* Состояние слота: 'free' | 'busy' | 'past'
     'past' показывается как «закрыто» — час уже прошёл, забронировать нельзя. */
  function slotState(roomId, dayDate, index) {
    if (slotDate(dayDate, index) <= new Date()) return 'past';
    if (isBusy(roomId, dayDate, index)) return 'busy';
    return 'free';
  }

  function slotRange() {
    var out = [];
    for (var i = cache.schedule.firstSlot; i <= cache.schedule.lastSlot; i++) out.push(i);
    return out;
  }

  /* Список операционных дней вперёд, начиная с текущего */
  function days(count) {
    var ctx = nowContext();
    var first = ctx.open ? ctx.day : startOfDay(new Date());
    var n = count || cache.schedule.daysAhead;
    var out = [];
    for (var i = 0; i < n; i++) out.push(addDays(first, i));
    return out;
  }

  /* ==========================================================================
     ВЫБОРКИ ДЛЯ ЭКРАНОВ
     ========================================================================== */

  function room(id) {
    return cache.rooms.filter(function (r) { return r.id === id; })[0] || null;
  }

  /* Можно ли занять эту комнату на ближайший час */
  function isFreeNow(roomId) {
    var ctx = nextContext();
    if (!ctx.open) return false;
    return slotState(roomId, ctx.day, ctx.index) === 'free';
  }

  function freeRoomsNow() {
    var ctx = nextContext();
    if (!ctx.open) return null;                 // база закрыта
    return cache.rooms.filter(function (r) { return isFreeNow(r.id); }).length;
  }

  /* Бейдж занятости для карточки каталога */
  function todayBadge(roomId) {
    var ctx = nextContext();
    var day = ctx.day;

    if (ctx.open && slotState(roomId, day, ctx.index) === 'free') {
      return { kind: 'free' };
    }

    var all = slotRange();
    for (var i = 0; i < all.length; i++) {
      if (all[i] < ctx.index) continue;
      if (slotState(roomId, day, all[i]) === 'free') {
        return { kind: 'busyUntil', time: slotLabel(all[i]) };
      }
    }
    return { kind: 'busyAll' };
  }

  /* Ближайшие свободные блоки: по одному на комнату, максимум `limit` штук.
     Блок — до двух смежных свободных часов: одна репетиция редко бывает
     короче и почти никогда не бывает длиннее для спонтанной брони. */
  function nearestSlots(limit) {
    var max = limit || 6;
    var result = [];
    var dayList = days(3);

    for (var d = 0; d < dayList.length && result.length < max; d++) {
      var day = dayList[d];
      for (var r = 0; r < cache.rooms.length && result.length < max; r++) {
        var rm = cache.rooms[r];
        if (result.some(function (x) { return x.roomId === rm.id; })) continue;

        var all = slotRange();
        for (var i = 0; i < all.length; i++) {
          if (slotState(rm.id, day, all[i]) !== 'free') continue;

          var block = [all[i]];
          if (i + 1 < all.length && slotState(rm.id, day, all[i + 1]) === 'free') {
            block.push(all[i + 1]);
          }
          result.push({
            roomId: rm.id,
            day: day,
            slots: block,
            total: totalOf(rm, day, block)
          });
          break;
        }
      }
    }
    return result;
  }

  /* ==========================================================================
     ФИЛЬТРЫ КАТАЛОГА
     ========================================================================== */

  /* Все условия складываются по И: комната должна пройти каждое.
     Внутри группы «оборудование» — тоже И: попросили барабаны и пульт,
     значит нужны оба. */
  function filterRooms(state) {
    return cache.rooms.filter(function (r) {
      if (state.area.length) {
        var okArea = state.area.some(function (band) {
          if (band === 's') return r.area < 20;
          if (band === 'm') return r.area >= 20 && r.area <= 35;
          return r.area > 35;
        });
        if (!okArea) return false;
      }

      if (state.gear.length) {
        var hasAll = state.gear.every(function (g) { return r.tags.indexOf(g) !== -1; });
        if (!hasAll) return false;
      }

      if (state.maxPrice != null && r.price > state.maxPrice) return false;

      if (state.time.length) {
        // «есть свободный час в это время суток сегодня»
        var ctx = nextContext();
        var day = ctx.day;
        var okTime = state.time.some(function (kind) {
          return slotRange().some(function (i) {
            return tariffOf(i) === kind && slotState(r.id, day, i) === 'free';
          });
        });
        if (!okTime) return false;
      }

      if (state.freeToday) {
        var badge = todayBadge(r.id);
        if (badge.kind === 'busyAll') return false;
      }

      return true;
    });
  }

  function sortRooms(list, mode) {
    var out = list.slice();
    if (mode === 'price') out.sort(function (a, b) { return a.price - b.price; });
    else if (mode === 'area') out.sort(function (a, b) { return b.area - a.area; });
    else out.sort(function (a, b) { return b.popularity - a.popularity; });
    return out;
  }

  /* ==========================================================================
     АБОНЕМЕНТЫ
     ========================================================================== */

  function passSaving(pass) {
    return pass.hours * cache.passBaseRate - pass.price;
  }

  /* Подбор выгодного абонемента под заданное число часов в месяц */
  function bestPass(hours) {
    var hourly = hours * cache.passBaseRate;
    var options = cache.passes.filter(function (p) { return p.hours >= hours; });
    if (!options.length) {
      // Часов больше самого крупного абонемента: берём его и добиваем почасово
      var biggest = cache.passes[cache.passes.length - 1];
      var extra = (hours - biggest.hours) * cache.passBaseRate;
      return { pass: biggest, cost: biggest.price + extra, hourly: hourly, save: hourly - (biggest.price + extra) };
    }
    var best = options[0];
    return { pass: best, cost: best.price, hourly: hourly, save: hourly - best.price };
  }

  /* ==========================================================================
     ПУБЛИЧНЫЙ ИНТЕРФЕЙС
     ========================================================================== */
  return {
    load: load, reset: reset,
    get data() { return cache; },

    startOfDay: startOfDay, addDays: addDays, sameDay: sameDay,
    slotDate: slotDate, slotLabel: slotLabel, rangeLabel: rangeLabel,
    nowContext: nowContext, nextContext: nextContext, isWeekend: isWeekend,

    tariffOf: tariffOf, coefOf: coefOf, priceOf: priceOf, totalOf: totalOf,
    isBusy: isBusy, slotState: slotState, slotRange: slotRange, days: days,
    occupancyWindow: occupancyWindow,

    room: room, isFreeNow: isFreeNow, freeRoomsNow: freeRoomsNow,
    todayBadge: todayBadge, nearestSlots: nearestSlots,
    filterRooms: filterRooms, sortRooms: sortRooms,
    passSaving: passSaving, bestPass: bestPass
  };
})();
