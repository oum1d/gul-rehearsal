/* ============================================================================
   ГУЛ — страница «Заявка принята»
   ----------------------------------------------------------------------------
   Данные брони приходят из sessionStorage, а не из адреса страницы: имя и
   телефон не должны попадать в URL — он остаётся в истории браузера, в
   логах прокси и в заголовке Referer при переходе на любой внешний сайт.

   Если страницу открыли напрямую (или память недоступна в приватном режиме),
   показывается мягкая заглушка, а не пустой экран.
   ============================================================================ */

(function () {
  'use strict';

  var $ = UI.$, el = UI.el;

  var box = $('[data-booked]');
  if (!box) return;

  function read() {
    var raw = null;

    try { raw = sessionStorage.getItem('gul.booking'); } catch (e) { /* хранилище закрыто */ }

    // Запасной канал на случай запрещённого хранилища — см. booking.js.
    // Читаем и сразу стираем: window.name виден следующему сайту в этой вкладке.
    if (!raw && typeof window.name === 'string' && window.name.indexOf('gul:') === 0) {
      raw = window.name.slice(4);
      window.name = '';
    }

    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function row(label, value) {
    return el('div', { class: 'recap__row' }, [
      el('span', { class: 'summary__label', text: label }),
      // textContent, а не innerHTML: в имени и комментарии лежит пользовательский
      // ввод, и он не должен превращаться в разметку
      el('span', { class: 'summary__value', text: value })
    ]);
  }

  function render() {
    var data = read();

    box.innerHTML = '';

    if (!data) {
      box.appendChild(el('p', { class: 'muted', text: I18N.t('booked.lost') }));
      box.appendChild(el('a', { class: 'btn btn--primary', href: 'rooms.html', text: I18N.t('notfound.rooms') }));
      return;
    }

    var day = new Date(data.dayIso);
    var roomName = data.roomLetter + ' · ' + I18N.pick(data.roomName);
    var when = I18N.formatDate(day, 'weekdayLong') + ', ' +
               I18N.formatDate(day, 'dayMonth') + ' · ' + data.range;

    box.appendChild(el('p', { class: 'summary__label', text: I18N.t('booked.numberLabel') }));
    box.appendChild(el('p', { class: 'booking-number', text: data.number }));

    var recap = el('div', { class: 'recap' }, [
      row(I18N.t('booking.room'), roomName),
      row(I18N.t('booking.when'), when),
      row(I18N.t('booking.selected', { n: data.hours }), data.total + ' ' + I18N.t('common.zl'))
    ]);

    // Имя и телефон приходят не всегда: в запасном канале передачи их нет
    if (data.name) recap.appendChild(row(I18N.t('booking.name'), data.name));
    if (data.phone) recap.appendChild(row(I18N.t('booking.phone'), data.phone));
    if (data.band) recap.appendChild(row(I18N.t('booking.band'), data.band));
    if (data.sticks) recap.appendChild(row(I18N.t('booking.sticks'), '✓'));

    box.appendChild(recap);
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Словарь комнаты лежит прямо в сохранённой брони, поэтому rooms.js
    // для этой страницы не обязателен — но язык всё равно надо применить
    render();
  });

  document.addEventListener('gul:lang', render);
})();
