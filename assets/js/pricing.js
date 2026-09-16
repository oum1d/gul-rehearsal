/* ============================================================================
   ГУЛ — тарифы и абонементы
   ----------------------------------------------------------------------------
   Все цифры считаются из rooms.js, ни одна не вбита в вёрстку руками: цену
   комнаты правят в одном месте, а таблица, карточки и калькулятор
   пересчитываются сами.
   ============================================================================ */

(function () {
  'use strict';

  var $ = UI.$, $$ = UI.$$, el = UI.el;

  var tableBody = $('[data-tariff-rows]');
  if (!tableBody) return;

  var passesBox = $('[data-passes]');
  var servicesBox = $('[data-services]');
  var calcRange = $('[data-calc-range]');

  /* Диапазон цен по всем комнатам для заданного коэффициента */
  function range(coef) {
    var prices = GUL.data.rooms.map(function (r) { return Math.round(r.price * coef); });
    var min = Math.min.apply(null, prices);
    var max = Math.max.apply(null, prices);
    return min + ' — ' + max + ' ' + I18N.t('common.zl');
  }

  function fmtCoef(coef) {
    return '×' + String(coef.toFixed(2)).replace(/0$/, '').replace(/\.$/, '');
  }

  /* ==========================================================================
     ТАБЛИЦА ТАРИФОВ
     ========================================================================== */
  function renderTable() {
    var t = GUL.data.schedule.tariffs;
    var weekendCoef = GUL.data.schedule.weekendDayCoef;

    var rows = [
      ['pricing.rowDay', 'pricing.rowDayTime', t.day.coef, true],
      ['pricing.rowEvening', 'pricing.rowEveningTime', t.evening.coef, false],
      ['pricing.rowNight', 'pricing.rowNightTime', t.night.coef, false],
      ['pricing.rowWeekend', 'pricing.rowWeekendTime', weekendCoef, false]
    ];

    tableBody.innerHTML = '';
    rows.forEach(function (row) {
      tableBody.appendChild(el('tr', {}, [
        el('td', {}, [el('strong', { text: I18N.t(row[0]) })]),
        el('td', { class: 'num', text: I18N.t(row[1]) }),
        el('td', { class: 'num', text: fmtCoef(row[2]) + (row[3] ? ' · ' + I18N.t('pricing.base') : '') }),
        el('td', { class: 'num', text: range(row[2]) })
      ]));
    });
  }

  /* ==========================================================================
     АБОНЕМЕНТЫ
     ========================================================================== */
  function renderPasses() {
    if (!passesBox) return;
    passesBox.innerHTML = '';

    GUL.data.passes.forEach(function (pass, i) {
      var save = GUL.passSaving(pass);
      var rate = Math.round(pass.price / pass.hours);

      passesBox.appendChild(el('article', {
        class: 'pass' + (pass.popular ? ' pass--popular' : ''),
        'data-reveal': '', 'data-reveal-delay': String(i * 80)
      }, [
        pass.popular ? el('span', { class: 'pass__flag', text: I18N.t('pricing.passPopular') }) : null,
        el('h3', { text: I18N.t('pricing.passHours', { n: pass.hours }) }),
        el('p', { class: 'pass__price' }, [
          document.createTextNode(String(pass.price)),
          el('small', { text: ' ' + I18N.t('common.zl') })
        ]),
        el('p', { class: 'pass__save', text: I18N.t('pricing.passSave', { n: save }) }),
        el('ul', {}, [
          el('li', { text: I18N.t('pricing.passRate', { n: rate }) }),
          el('li', { text: I18N.t('pricing.passesSub') })
        ]),
        el('a', { class: 'btn ' + (pass.popular ? 'btn--primary' : 'btn--ghost'), href: 'about.html#contacts', text: I18N.t('pricing.passCta') })
      ]));
    });
  }

  /* ==========================================================================
     КАЛЬКУЛЯТОР
     ----------------------------------------------------------------------------
     Показывает разницу честно: если абонемент на заданном объёме невыгоден,
     так и написано. Продавать абонемент тому, кому он не нужен, — быстрый
     способ потерять постоянную группу.
     ========================================================================== */
  function renderCalc() {
    if (!calcRange) return;

    var hours = Number(calcRange.value);
    var result = GUL.bestPass(hours);

    $('[data-calc-hours]').textContent = hours;
    $('[data-calc-hours-label]').textContent = I18N.plural(hours, 'hours');
    UI.countTo($('[data-calc-hourly]'), result.hourly, ' ' + I18N.t('common.zl'));
    UI.countTo($('[data-calc-pass]'), result.cost, ' ' + I18N.t('common.zl'));

    var bestBox = $('[data-calc-best]');
    var saveBox = $('[data-calc-save]');

    if (result.save > 0) {
      bestBox.textContent = I18N.t('pricing.passHours', { n: result.pass.hours });
      saveBox.textContent = '−' + result.save + ' ' + I18N.t('common.zl');
      saveBox.classList.add('calc__save');
    } else {
      bestBox.textContent = '—';
      saveBox.textContent = I18N.t('pricing.calcNoPass');
      saveBox.classList.remove('calc__save');
    }
  }

  /* ==========================================================================
     УСЛУГИ
     ========================================================================== */
  var SERVICE_KEYS = {
    demo: ['pricing.svcDemo', 'pricing.svcDemoNote', 'pricing.perHour'],
    mix: ['pricing.svcMix', 'pricing.svcMixNote', 'pricing.perTrack'],
    sticks: ['pricing.svcSticks', 'pricing.svcSticksNote', 'pricing.perItem'],
    cable: ['pricing.svcCable', 'pricing.svcCableNote', 'pricing.perItem']
  };

  function renderServices() {
    if (!servicesBox) return;
    servicesBox.innerHTML = '';

    GUL.data.services.forEach(function (svc) {
      var keys = SERVICE_KEYS[svc.id];
      if (!keys) return;
      servicesBox.appendChild(el('div', { class: 'service' }, [
        el('span', { class: 'service__name', text: I18N.t(keys[0]) }),
        el('span', { class: 'service__price', text: svc.price + ' ' + I18N.t(keys[2]) }),
        el('span', { class: 'service__note', text: I18N.t(keys[1]) })
      ]));
    });
  }

  /* ==========================================================================
     СТАРТ
     ========================================================================== */
  function renderAll() {
    renderTable();
    renderPasses();
    renderCalc();
    renderServices();
    UI.revealScan();
  }

  function start() {
    tableBody.innerHTML = '';
    tableBody.appendChild(el('tr', {}, [
      el('td', { colspan: '4' }, [el('span', { class: 'loading-note', text: I18N.t('common.loadingShort') })])
    ]));

    GUL.load().then(function () {
      if (calcRange) {
        calcRange.addEventListener('input', renderCalc);
      }
      renderAll();
    }).catch(function () {
      tableBody.innerHTML = '';
      var host = $('[data-pricing-error]');
      if (host) UI.showError(host, function () { GUL.reset(); start(); });
    });
  }

  document.addEventListener('DOMContentLoaded', start);
  document.addEventListener('gul:lang', function () { if (GUL.data) renderAll(); });
})();
