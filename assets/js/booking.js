/* ============================================================================
   ГУЛ — панель брони
   ----------------------------------------------------------------------------
   Одна шторка на весь сайт: её открывают и плитки «ближайшие слоты» на главной,
   и сетка расписания на странице комнаты. Разметка вставляется скриптом, чтобы
   не размножать один и тот же блок по пяти html-файлам и не ловить расхождения.

   ЧЕГО ЗДЕСЬ НАМЕРЕННО НЕТ
   Заявка никуда не отправляется — бэкенда в проекте нет. Функция submit()
   имитирует отправку и уводит на страницу подтверждения. Точка подключения
   реального сервера отмечена ниже комментарием ТОЧКА ИНТЕГРАЦИИ.
   ============================================================================ */

window.Booking = (function () {
  'use strict';

  var el = UI.el, $ = UI.$, $$ = UI.$$;

  var state = { roomId: null, day: null, slots: [], sticks: false };
  var root = null;
  var release = null;
  var validateOnInput = false;   // придирки начинаются только после первой отправки

  /* ==========================================================================
     РАЗМЕТКА
     ========================================================================== */
  /* errorKey может быть null — у необязательных полей ошибок не бывает,
     но контейнер под сообщение всё равно нужен: без него текст ошибки
     пришлось бы вставлять на лету и ломать порядок фокуса. */
  function field(name, labelKey, control, errorKey) {
    var errId = 'bk-' + name + '-err';
    control.setAttribute('id', 'bk-' + name);
    control.setAttribute('aria-describedby', errId);

    var error = el('p', { class: 'field__error', id: errId });
    if (errorKey) error.setAttribute('data-i18n', errorKey);

    return el('div', { class: 'field', 'data-field': name }, [
      el('label', { class: 'field__label', for: 'bk-' + name, 'data-i18n': labelKey }),
      control,
      error
    ]);
  }

  function build() {
    var nameInput = el('input', {
      class: 'field__control', type: 'text', name: 'name',
      autocomplete: 'name', required: 'required', maxlength: '60',
      'data-i18n-attr': 'placeholder:booking.namePlaceholder'
    });

    var phoneInput = el('input', {
      class: 'field__control', type: 'tel', name: 'phone',
      autocomplete: 'tel', required: 'required', inputmode: 'tel', maxlength: '24',
      'data-i18n-attr': 'placeholder:booking.phonePlaceholder'
    });

    var bandInput = el('input', {
      class: 'field__control', type: 'text', name: 'band', maxlength: '60',
      'data-i18n-attr': 'placeholder:booking.bandPlaceholder'
    });

    var commentInput = el('textarea', {
      class: 'field__control', name: 'comment', rows: '3', maxlength: '400',
      'data-i18n-attr': 'placeholder:booking.commentPlaceholder'
    });

    var sticksBox = el('input', { type: 'checkbox', name: 'sticks' });
    var consentBox = el('input', { type: 'checkbox', name: 'consent', required: 'required' });

    var form = el('form', { class: 'drawer__body', id: 'booking-form', novalidate: 'novalidate' }, [
      el('div', { class: 'summary', 'data-summary': '' }),
      field('name', 'booking.name', nameInput, 'booking.errName'),
      field('phone', 'booking.phone', phoneInput, 'booking.errPhone'),
      field('band', 'booking.band', bandInput, null),
      field('comment', 'booking.comment', commentInput, null),
      el('label', { class: 'checkbox' }, [sticksBox, el('span', { 'data-i18n': 'booking.sticks' })]),
      el('div', { class: 'field', 'data-field': 'consent' }, [
        el('label', { class: 'checkbox' }, [consentBox, el('span', { 'data-i18n': 'booking.consent' })]),
        el('p', { class: 'field__error', id: 'bk-consent-err', 'data-i18n': 'booking.errConsent' })
      ]),
      el('p', { class: 'muted', style: 'font-size:0.8125rem', 'data-i18n': 'booking.note' })
    ]);

    var submitBtn = el('button', {
      class: 'btn btn--primary btn--block', type: 'submit', form: 'booking-form',
      'data-i18n': 'booking.submit'
    });

    var panel = el('div', { class: 'drawer__panel', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'booking-title' }, [
      el('div', { class: 'drawer__head' }, [
        el('h2', { id: 'booking-title', 'data-i18n': 'booking.title' }),
        el('button', {
          class: 'icon-btn', type: 'button', 'data-close': '', text: '×',
          'data-i18n-attr': 'aria-label:nav.close'
        })
      ]),
      form,
      el('div', { class: 'drawer__foot' }, [
        el('p', { class: 'field__error', id: 'bk-form-err', style: 'margin-bottom:0.5rem' }),
        submitBtn
      ])
    ]);

    root = el('div', { class: 'drawer', id: 'booking-drawer' }, [
      el('div', { class: 'drawer__backdrop', 'data-close': '' }),
      panel
    ]);

    document.body.appendChild(root);

    $$('[data-close]', root).forEach(function (n) { n.addEventListener('click', close); });
    form.addEventListener('submit', submit);

    [nameInput, phoneInput].forEach(function (input) {
      input.addEventListener('input', function () { if (validateOnInput) validate(); });
    });
    consentBox.addEventListener('change', function () { if (validateOnInput) validate(); });

    sticksBox.addEventListener('change', function () {
      state.sticks = sticksBox.checked;
      renderSummary();
    });

    I18N.apply(root);
    I18N.onChange(function () { I18N.apply(root); renderSummary(); });
  }

  /* ==========================================================================
     СВОДКА
     ========================================================================== */
  function sticksPrice() {
    var svc = (window.GUL_DATA.services || []).filter(function (s) { return s.id === 'sticks'; })[0];
    return svc ? svc.price : 0;
  }

  function total() {
    var room = GUL.room(state.roomId);
    if (!room || !state.slots.length) return 0;
    return GUL.totalOf(room, state.day, state.slots) + (state.sticks ? sticksPrice() : 0);
  }

  function renderSummary() {
    if (!root) return;
    var box = $('[data-summary]', root);
    if (!box) return;

    box.innerHTML = '';

    if (!state.slots.length) {
      box.appendChild(el('p', { class: 'muted', text: I18N.t('booking.empty') }));
      return;
    }

    var room = GUL.room(state.roomId);
    var count = state.slots.length;
    var when = I18N.formatDate(state.day, 'weekdayShort') + ', ' +
               I18N.formatDate(state.day, 'dayMonth') + ' · ' +
               GUL.rangeLabel(state.slots);

    function row(labelKey, value) {
      return el('div', { class: 'summary__row' }, [
        el('span', { class: 'summary__label', text: I18N.t(labelKey) }),
        el('span', { class: 'summary__value', text: value })
      ]);
    }

    box.appendChild(row('booking.room', room.letter + ' · ' + I18N.pick(room.name)));
    box.appendChild(row('booking.when', when));
    box.appendChild(row('booking.duration', count + ' ' + I18N.plural(count, 'hours')));

    var totalRow = el('div', { class: 'summary__row' }, [
      el('span', { class: 'summary__label', text: I18N.t('booking.total') }),
      el('span', { class: 'summary__total', 'data-total': '' })
    ]);
    box.appendChild(totalRow);

    UI.countTo($('[data-total]', totalRow), total(), ' ' + I18N.t('common.zl'));
  }

  /* ==========================================================================
     ВАЛИДАЦИЯ
     ----------------------------------------------------------------------------
     Никаких alert(): ошибка появляется под своим полем, поле помечается
     aria-invalid, фокус уезжает на первое проблемное.
     ========================================================================== */
  function setError(name, on, messageKey) {
    var wrap = $('[data-field="' + name + '"]', root);
    if (!wrap) return;
    wrap.classList.toggle('is-invalid', !!on);

    var control = $('.field__control, input[type="checkbox"]', wrap);
    if (control) control.setAttribute('aria-invalid', String(!!on));

    if (on && messageKey) {
      var err = $('.field__error', wrap);
      if (err) { err.textContent = I18N.t(messageKey); err.setAttribute('data-i18n', messageKey); }
    }
  }

  function phoneLooksReal(value) {
    var digits = value.replace(/\D/g, '');
    return digits.length >= 9 && digits.length <= 15;
  }

  function validate() {
    var form = $('#booking-form', root);
    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    var consent = form.consent.checked;
    var problems = [];

    setError('name', !name, 'booking.errName');
    if (!name) problems.push('name');

    if (!phone) { setError('phone', true, 'booking.errPhone'); problems.push('phone'); }
    else if (!phoneLooksReal(phone)) { setError('phone', true, 'booking.errPhoneFormat'); problems.push('phone'); }
    else setError('phone', false);

    setError('consent', !consent, 'booking.errConsent');
    if (!consent) problems.push('consent');

    var formErr = $('#bk-form-err', root);
    if (!state.slots.length) {
      formErr.textContent = I18N.t('booking.errSlots');
      formErr.style.display = 'flex';
      problems.push('slots');
    } else {
      formErr.textContent = '';
      formErr.style.display = 'none';
    }

    return problems;
  }

  /* ==========================================================================
     ОТПРАВКА
     ========================================================================== */
  function bookingNumber() {
    var d = new Date();
    var stamp = String(d.getFullYear()).slice(2) +
                String(d.getMonth() + 1).padStart(2, '0') +
                String(d.getDate()).padStart(2, '0');
    var tail = Math.random().toString(36).slice(2, 6).toUpperCase();
    return 'GUL-' + stamp + '-' + tail;
  }

  function submit(e) {
    e.preventDefault();
    validateOnInput = true;

    var problems = validate();
    if (problems.length) {
      var first = $('[data-field="' + problems[0] + '"] .field__control, [data-field="' + problems[0] + '"] input', root);
      if (first) first.focus();
      UI.announce(I18N.t('booking.errSlots'));
      return;
    }

    var form = $('#booking-form', root);
    var btn = $('button[type="submit"]', root);
    btn.disabled = true;
    btn.textContent = I18N.t('booking.submitting');

    var room = GUL.room(state.roomId);
    var payload = {
      number: bookingNumber(),
      roomId: room.id,
      roomLetter: room.letter,
      roomName: room.name,
      dayIso: state.day.toISOString(),
      slots: state.slots.slice(),
      range: GUL.rangeLabel(state.slots),
      hours: state.slots.length,
      sticks: state.sticks,
      total: total(),
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      band: form.band.value.trim(),
      comment: form.comment.value.trim()
    };

    /* ТОЧКА ИНТЕГРАЦИИ ------------------------------------------------------
       Здесь должен стоять запрос к серверу:
           fetch('/api/bookings', { method: 'POST', body: JSON.stringify(payload) })
       Сервер обязан заново проверить, что слот свободен и время не в прошлом:
       проверка в браузере защищает от опечатки, но не от подделанного запроса.
       Пока бэкенда нет — имитируем задержку сети и уходим на подтверждение.
       ---------------------------------------------------------------------- */
    setTimeout(function () {
      try {
        sessionStorage.setItem('gul.booking', JSON.stringify(payload));
      } catch (err) {
        /* Хранилище закрыто — так бывает в приватном режиме и при открытии
           сайта напрямую из папки. Запасной канал: window.name переживает
           переход на другую страницу в той же вкладке.

           В запасной канал кладём только обезличенную часть: window.name
           остаётся доступен любому следующему сайту в этой вкладке, и имени
           с телефоном там быть не должно. */
        try {
          window.name = 'gul:' + JSON.stringify({
            number: payload.number, roomLetter: payload.roomLetter, roomName: payload.roomName,
            dayIso: payload.dayIso, range: payload.range, hours: payload.hours,
            sticks: payload.sticks, total: payload.total
          });
        } catch (e2) { /* совсем некуда — покажем мягкую заглушку */ }
      }
      location.href = 'booked.html';
    }, 550);
  }

  /* ==========================================================================
     ОТКРЫТИЕ / ЗАКРЫТИЕ
     ========================================================================== */
  function open(selection) {
    if (!root) build();

    if (selection) {
      state.roomId = selection.roomId;
      state.day = selection.day;
      state.slots = selection.slots.slice().sort(function (a, b) { return a - b; });
    }
    state.sticks = false;
    var sticksBox = $('input[name="sticks"]', root);
    if (sticksBox) sticksBox.checked = false;

    renderSummary();
    root.classList.add('is-open');
    UI.lockScroll(true);
    release = UI.trapFocus(root, close);
  }

  function close() {
    if (!root) return;
    root.classList.remove('is-open');
    UI.lockScroll(false);
    if (release) { release(); release = null; }
  }

  function setSelection(selection) {
    state.roomId = selection.roomId;
    state.day = selection.day;
    state.slots = selection.slots.slice().sort(function (a, b) { return a - b; });
    renderSummary();
  }

  return {
    open: open, close: close, setSelection: setSelection,
    get state() { return state; },
    total: total
  };
})();
