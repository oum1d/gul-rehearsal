/* ============================================================================
   ГУЛ — каталог комнат
   ----------------------------------------------------------------------------
   Фильтры работают вместе, каждое активное условие видно отдельным чипсом с
   крестиком, сброс возвращает всё в исходное. Пустая выдача — не белый экран,
   а объяснение с кнопкой сброса.
   ============================================================================ */

(function () {
  'use strict';

  var $ = UI.$, $$ = UI.$$, el = UI.el;

  var resultsBox = $('[data-results]');
  if (!resultsBox) return;

  var chipsBox = $('[data-chips]');
  var countBox = $('[data-count]');
  var sortSelect = $('[data-sort]');
  var priceRange = $('[data-price-range]');
  var priceOut = $('[data-price-out]');

  var state = { area: [], gear: [], time: [], maxPrice: null, freeToday: false, sort: 'popular' };
  var priceMax = null;

  /* ==========================================================================
     ЧТЕНИЕ АДРЕСА
     Ссылка «занять ночной слот» с главной приводит сюда с готовым фильтром.
     ========================================================================== */
  function readUrl() {
    var params = new URLSearchParams(location.search);
    var time = params.get('time');
    if (time && ['day', 'evening', 'night'].indexOf(time) !== -1) state.time = [time];
    var gear = params.get('gear');
    if (gear && ['drums', 'bass', 'mics', 'mixer', 'keys'].indexOf(gear) !== -1) state.gear = [gear];
  }

  /* ==========================================================================
     ПЕРЕКЛЮЧЕНИЕ
     ========================================================================== */
  function toggle(group, value) {
    var list = state[group];
    var at = list.indexOf(value);
    if (at === -1) list.push(value); else list.splice(at, 1);
  }

  function syncControls() {
    $$('[data-filter]').forEach(function (btn) {
      var group = btn.getAttribute('data-filter');
      var value = btn.getAttribute('data-value');
      btn.setAttribute('aria-pressed', String(state[group].indexOf(value) !== -1));
    });

    var freeBtn = $('[data-only-free]');
    if (freeBtn) freeBtn.setAttribute('aria-pressed', String(state.freeToday));

    if (sortSelect) sortSelect.value = state.sort;

    if (priceRange) {
      priceRange.value = state.maxPrice == null ? priceMax : state.maxPrice;
      if (priceOut) priceOut.textContent = I18N.t('catalog.priceTo', { n: priceRange.value });
    }
  }

  /* ==========================================================================
     ЧИПСЫ АКТИВНЫХ ФИЛЬТРОВ
     ========================================================================== */
  var LABELS = {
    area: { s: 'catalog.areaS', m: 'catalog.areaM', l: 'catalog.areaL' },
    gear: { drums: 'catalog.gearDrums', bass: 'catalog.gearBass', mics: 'catalog.gearMics', mixer: 'catalog.gearMixer', keys: 'catalog.gearKeys' },
    time: { day: 'catalog.timeDay', evening: 'catalog.timeEvening', night: 'catalog.timeNight' }
  };

  function chip(text, onRemove) {
    return el('span', { class: 'chip' }, [
      el('span', { text: text }),
      el('button', {
        class: 'chip__x', type: 'button', text: '×',
        'aria-label': I18N.t('catalog.resetOne') + ': ' + text,
        onclick: onRemove
      })
    ]);
  }

  function renderChips() {
    if (!chipsBox) return;
    chipsBox.innerHTML = '';
    var any = false;

    ['area', 'gear', 'time'].forEach(function (group) {
      state[group].forEach(function (value) {
        any = true;
        chipsBox.appendChild(chip(I18N.t(LABELS[group][value]), function () {
          toggle(group, value);
          update();
        }));
      });
    });

    if (state.maxPrice != null && state.maxPrice < priceMax) {
      any = true;
      chipsBox.appendChild(chip(I18N.t('catalog.priceTo', { n: state.maxPrice }), function () {
        state.maxPrice = null;
        update();
      }));
    }

    if (state.freeToday) {
      any = true;
      chipsBox.appendChild(chip(I18N.t('catalog.onlyFree'), function () {
        state.freeToday = false;
        update();
      }));
    }

    if (any) {
      chipsBox.appendChild(el('button', {
        class: 'btn btn--quiet', type: 'button',
        text: I18N.t('catalog.reset'), onclick: resetAll
      }));
    }
  }

  function resetAll() {
    state.area = []; state.gear = []; state.time = [];
    state.maxPrice = null; state.freeToday = false;
    update();
  }

  /* ==========================================================================
     ВЫДАЧА
     ========================================================================== */
  function renderResults() {
    var list = GUL.sortRooms(GUL.filterRooms(state), state.sort);

    resultsBox.removeAttribute('aria-busy');
    resultsBox.innerHTML = '';

    if (countBox) countBox.textContent = I18N.t('catalog.count', { n: list.length });

    if (!list.length) {
      resultsBox.classList.remove('grid-rooms');
      resultsBox.appendChild(el('div', { class: 'empty' }, [
        el('h2', { text: I18N.t('catalog.emptyTitle') }),
        el('p', { class: 'muted', text: I18N.t('catalog.emptyText') }),
        el('button', { class: 'btn btn--primary', type: 'button', text: I18N.t('catalog.emptyCta'), onclick: resetAll })
      ]));
    } else {
      resultsBox.classList.add('grid-rooms');
      list.forEach(function (room, i) { resultsBox.appendChild(Cards.roomCard(room, i)); });
    }

    UI.revealScan();
    UI.announce(I18N.t('catalog.count', { n: list.length }));
  }

  function update() {
    syncControls();
    renderChips();
    renderResults();
  }

  /* ==========================================================================
     СОБЫТИЯ
     ========================================================================== */
  function bind() {
    $$('[data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        toggle(btn.getAttribute('data-filter'), btn.getAttribute('data-value'));
        update();
      });
    });

    var freeBtn = $('[data-only-free]');
    if (freeBtn) freeBtn.addEventListener('click', function () {
      state.freeToday = !state.freeToday;
      update();
    });

    if (sortSelect) sortSelect.addEventListener('change', function () {
      state.sort = sortSelect.value;
      update();
    });

    if (priceRange) {
      // input — мгновенный отклик ползунка, change — пересчёт выдачи
      priceRange.addEventListener('input', function () {
        if (priceOut) priceOut.textContent = I18N.t('catalog.priceTo', { n: priceRange.value });
      });
      priceRange.addEventListener('change', function () {
        var value = Number(priceRange.value);
        state.maxPrice = value >= priceMax ? null : value;
        update();
      });
    }

    var toggleBtn = $('[data-filters-toggle]');
    var panel = $('[data-filters]');
    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', function () {
        var open = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', String(!open));
        panel.hidden = open;
      });
    }
  }

  /* ==========================================================================
     СТАРТ
     ========================================================================== */
  function start() {
    UI.skeletons(resultsBox, 4, 'card');

    GUL.load().then(function () {
      var prices = GUL.data.rooms.map(function (r) { return r.price; });
      priceMax = Math.max.apply(null, prices);

      if (priceRange) {
        priceRange.min = Math.min.apply(null, prices);
        priceRange.max = priceMax;
        priceRange.step = 5;
        priceRange.value = priceMax;
      }

      readUrl();
      bind();
      update();
    }).catch(function () {
      UI.showError(resultsBox, function () { GUL.reset(); start(); });
    });
  }

  document.addEventListener('DOMContentLoaded', start);
  document.addEventListener('gul:lang', function () { if (GUL.data) update(); });
  // Фильтр «только свободные сегодня» и бейджи зависят от занятости —
  // при смене окна выдача пересобирается с теми же фильтрами
  document.addEventListener('gul:tick', function () { if (GUL.data) update(); });
})();
