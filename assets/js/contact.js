/* ============================================================================
   ГУЛ — форма вопроса на странице «О базе»
   ----------------------------------------------------------------------------
   Та же логика ошибок, что и в панели брони: сообщение появляется под своим
   полем, поле помечается aria-invalid, фокус уезжает на первое проблемное.
   Отправлять некуда — бэкенда нет, поэтому форма показывает подтверждение
   и очищается. Точка подключения отмечена ниже.
   ============================================================================ */

(function () {
  'use strict';

  var $ = UI.$, el = UI.el;

  var form = $('#ask-form');
  if (!form) return;

  var strict = false;   // придираться начинаем после первой отправки

  function setError(fieldName, on, messageKey) {
    var wrap = $('[data-field="' + fieldName + '"]', form);
    if (!wrap) return;
    wrap.classList.toggle('is-invalid', !!on);

    var control = wrap.querySelector('.field__control, input[type="checkbox"]');
    if (control) control.setAttribute('aria-invalid', String(!!on));

    if (on && messageKey) {
      var err = wrap.querySelector('.field__error');
      if (err) { err.setAttribute('data-i18n', messageKey); err.textContent = I18N.t(messageKey); }
    }
  }

  function phoneLooksReal(value) {
    var digits = value.replace(/\D/g, '');
    return digits.length >= 9 && digits.length <= 15;
  }

  function validate() {
    var problems = [];

    var name = form.name.value.trim();
    setError('ask-name', !name, 'booking.errName');
    if (!name) problems.push('ask-name');

    var phone = form.phone.value.trim();
    if (!phone) { setError('ask-contact', true, 'booking.errPhone'); problems.push('ask-contact'); }
    else if (!phoneLooksReal(phone)) { setError('ask-contact', true, 'booking.errPhoneFormat'); problems.push('ask-contact'); }
    else setError('ask-contact', false);

    var message = form.message.value.trim();
    setError('ask-message', !message, 'about.formErrMessage');
    if (!message) problems.push('ask-message');

    setError('ask-consent', !form.consent.checked, 'booking.errConsent');
    if (!form.consent.checked) problems.push('ask-consent');

    return problems;
  }

  ['name', 'phone', 'message'].forEach(function (field) {
    form[field].addEventListener('input', function () { if (strict) validate(); });
  });
  form.consent.addEventListener('change', function () { if (strict) validate(); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    strict = true;

    var problems = validate();
    if (problems.length) {
      var first = form.querySelector('[data-field="' + problems[0] + '"] .field__control, [data-field="' + problems[0] + '"] input');
      if (first) first.focus();
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = I18N.t('booking.submitting');

    /* ТОЧКА ИНТЕГРАЦИИ ------------------------------------------------------
       Здесь ставится отправка на сервер или в почтовый сервис. Что бы это ни
       было — данные обязаны проверяться ещё раз на стороне сервера: проверка
       в браузере ловит опечатку, но не защищает от подделанного запроса.
       ---------------------------------------------------------------------- */
    setTimeout(function () {
      form.reset();
      strict = false;
      ['ask-name', 'ask-contact', 'ask-message', 'ask-consent'].forEach(function (f) { setError(f, false); });

      btn.disabled = false;
      btn.textContent = I18N.t('about.formSubmit');

      var done = el('p', { class: 'mono acid', role: 'status', text: I18N.t('about.formSent') });
      form.appendChild(done);
      UI.announce(I18N.t('about.formSent'));
      setTimeout(function () { done.remove(); }, 6000);
    }, 500);
  });
})();
