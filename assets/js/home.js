/* ============================================================================
   ГУЛ — главная
   ----------------------------------------------------------------------------
   Три динамических блока: плашка занятости, ближайшие свободные слоты и
   карточки комнат. Всё остальное на странице — статический текст со словарём.
   ============================================================================ */

(function () {
  'use strict';

  var $ = UI.$, el = UI.el;

  var statusBox  = $('[data-status]');
  var nearestBox = $('[data-nearest]');
  var roomsBox   = $('[data-rooms]');

  /* --- плашка «сейчас свободно N из 4» ----------------------------------- */
  function renderStatus() {
    if (!statusBox) return;

    var free = GUL.freeRoomsNow();
    var total = GUL.data.rooms.length;
    var text, modifier;

    if (free === null) { text = I18N.t('hero.statusClosed'); modifier = 'status--closed'; }
    else if (free === 0) { text = I18N.t('hero.statusNone'); modifier = 'status--none'; }
    else { text = I18N.t('hero.statusFree', { n: free, total: total }); modifier = ''; }

    statusBox.className = 'status ' + modifier;
    statusBox.innerHTML = '';
    statusBox.appendChild(el('span', { class: 'status__dot', 'aria-hidden': 'true' }));
    statusBox.appendChild(el('span', { class: 'status__label', text: I18N.t('hero.statusLabel') }));
    statusBox.appendChild(el('span', { class: 'status__value', text: text }));
  }

  /* --- ближайшие свободные слоты ----------------------------------------- */
  function renderNearest() {
    if (!nearestBox) return;

    var items = GUL.nearestSlots(6);
    nearestBox.removeAttribute('aria-busy');
    nearestBox.innerHTML = '';

    if (!items.length) {
      nearestBox.appendChild(el('div', { class: 'empty' }, [
        el('p', { class: 'muted', text: I18N.t('nearest.empty') }),
        el('a', { class: 'btn btn--ghost btn--sm', href: 'rooms.html', text: I18N.t('roomsBlock.all') })
      ]));
      return;
    }

    items.forEach(function (item, i) { nearestBox.appendChild(Cards.slotTile(item, i)); });
  }

  /* --- карточки комнат ---------------------------------------------------- */
  function renderRooms() {
    if (!roomsBox) return;
    roomsBox.removeAttribute('aria-busy');
    roomsBox.innerHTML = '';
    GUL.data.rooms.forEach(function (room, i) { roomsBox.appendChild(Cards.roomCard(room, i)); });
  }

  /* --- цифры в блоке тарифов --------------------------------------------- */
  function renderPriceBrief() {
    var prices = GUL.data.rooms.map(function (r) { return r.price; });
    var min = Math.min.apply(null, prices);
    var nightMin = Math.round(min * GUL.data.schedule.tariffs.night.coef);
    var pass = GUL.data.passes.filter(function (p) { return p.popular; })[0] || GUL.data.passes[0];

    // «от», потому что 30 zł — это самая маленькая комната, а не общая ставка:
    // без этого слова цифра противоречит «40 zł в час» из первого экрана
    var from = I18N.t('roomsBlock.from') + ' ';
    var map = {
      'price-hour': from + min + ' ' + I18N.t('common.zl'),
      'price-night': from + nightMin + ' ' + I18N.t('common.zl'),
      'price-pass': pass.price + ' ' + I18N.t('common.zl')
    };

    Object.keys(map).forEach(function (key) {
      UI.$$('[data-' + key + ']').forEach(function (node) { node.textContent = map[key]; });
    });
  }

  function renderAll() {
    renderStatus();
    renderNearest();
    renderRooms();
    renderPriceBrief();
    UI.revealScan();
  }

  /* --- загрузка ----------------------------------------------------------- */
  function start() {
    if (nearestBox) UI.skeletons(nearestBox, 4, 'tile');
    if (roomsBox) UI.skeletons(roomsBox, 4, 'card');

    GUL.load()
      .then(renderAll)
      .catch(function () {
        if (nearestBox) UI.showError(nearestBox, retry);
        if (roomsBox) {
          roomsBox.innerHTML = '';
          // без снятия aria-busy скринридер будет считать блок вечно грузящимся
          roomsBox.removeAttribute('aria-busy');
        }
        if (statusBox) statusBox.innerHTML = '';
      });
  }

  function retry() { GUL.reset(); start(); }

  document.addEventListener('DOMContentLoaded', start);
  document.addEventListener('gul:lang', function () { if (GUL.data) renderAll(); });
  // Новый час или новое окно занятости — плашка «сейчас свободно», плитки и
  // бейджи карточек пересчитываются без перезагрузки страницы
  document.addEventListener('gul:tick', function () { if (GUL.data) renderAll(); });

  /* Кнопка «ближайший свободный слот» просто уводит к блоку: это дешевле
     и понятнее, чем открывать шторку с угаданным за пользователя временем. */
  document.addEventListener('DOMContentLoaded', function () {
    var jump = $('[data-jump-nearest]');
    if (!jump) return;
    jump.addEventListener('click', function (e) {
      e.preventDefault();
      var target = $('#nearest');
      if (!target) return;
      target.scrollIntoView({ behavior: UI.reducedMotion ? 'auto' : 'smooth', block: 'start' });
      // Фокус уезжает следом, иначе клавиатурный пользователь останется наверху
      var first = target.querySelector('.slot-tile, a, button');
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 400);
    });
  });
})();
