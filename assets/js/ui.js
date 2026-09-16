/* ============================================================================
   ГУЛ — общий интерфейсный слой
   ----------------------------------------------------------------------------
   Всё, что повторяется на каждой странице: язык, меню, аккордеон, появление
   блоков при скролле, отзывы, подстановка контактов, ловушка фокуса.

   Скрипты подключаются обычными <script>, без type="module": модули так же,
   как и fetch, блокируются на протоколе file://, а проект обязан открываться
   двойным кликом.
   ============================================================================ */

window.UI = (function () {
  'use strict';

  /* ==========================================================================
     МЕЛОЧИ
     ========================================================================== */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function el(tag, props, children) {
    var node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (key) {
        if (key === 'class') node.className = props[key];
        else if (key === 'text') node.textContent = props[key];
        else if (key === 'html') node.innerHTML = props[key];
        else if (key.slice(0, 2) === 'on') node.addEventListener(key.slice(2).toLowerCase(), props[key]);
        else if (props[key] !== null && props[key] !== undefined) node.setAttribute(key, props[key]);
      });
    }
    (children || []).forEach(function (child) {
      if (child == null) return;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return node;
  }

  function money(value) { return value + ' ' + I18N.t('common.zl'); }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     ОБЪЯВЛЕНИЯ ДЛЯ СКРИНРИДЕРА
     Изменения фильтров и суммы видны глазами, но не слышны — вежливая
     живая область закрывает эту дыру.
     ========================================================================== */
  var liveRegion = null;
  function announce(message) {
    if (!liveRegion) {
      liveRegion = el('div', { class: 'sr-only', role: 'status', 'aria-live': 'polite' });
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = '';
    setTimeout(function () { liveRegion.textContent = message; }, 60);
  }

  /* ==========================================================================
     БЛОКИРОВКА ПРОКРУТКИ И ЛОВУШКА ФОКУСА
     ========================================================================== */
  function lockScroll(on) { document.body.classList.toggle('is-locked', !!on); }

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  /* Пока открыта шторка, Tab не должен уводить в страницу за ней */
  function trapFocus(container, onEscape) {
    var previous = document.activeElement;

    function handler(e) {
      if (e.key === 'Escape') { e.preventDefault(); if (onEscape) onEscape(); return; }
      if (e.key !== 'Tab') return;

      var items = $$(FOCUSABLE, container).filter(function (n) { return n.offsetParent !== null; });
      if (!items.length) return;

      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    document.addEventListener('keydown', handler);

    var target = $$(FOCUSABLE, container)[0];
    if (target) target.focus();

    return function release() {
      document.removeEventListener('keydown', handler);
      if (previous && previous.focus) previous.focus();
    };
  }

  /* ==========================================================================
     ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ
     Класс .reveal вешает скрипт, а не разметка: если JS не отработает,
     контент останется видимым, а не пропадёт навсегда.
     ========================================================================== */
  function initReveal() {
    var targets = $$('[data-reveal]');
    if (!targets.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    targets.forEach(function (node) { node.classList.add('reveal'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // Небольшая лесенка, чтобы карточки не вспыхивали разом
        var delay = Number(entry.target.getAttribute('data-reveal-delay') || 0);
        setTimeout(function () { entry.target.classList.add('is-in'); }, delay);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

    targets.forEach(function (node) { io.observe(node); });
  }

  /* Плавный счётчик суммы. Считает всегда честно: конечное значение ставится
     точным, анимируется только путь к нему. */
  function countTo(node, to, suffix) {
    var from = Number(node.getAttribute('data-value') || 0);
    node.setAttribute('data-value', to);

    if (prefersReducedMotion || from === to) {
      node.textContent = to + (suffix || '');
      return;
    }

    var start = performance.now();
    var duration = 320;

    function step(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var value = Math.round(from + (to - from) * eased);
      node.textContent = value + (suffix || '');
      if (p < 1) requestAnimationFrame(step);
      else node.textContent = to + (suffix || '');
    }
    requestAnimationFrame(step);

    /* Страховка: в фоновой вкладке requestAnimationFrame не вызывается вовсе,
       и сумма осталась бы пустой. Цена — не то место, где можно надеяться
       на анимацию, поэтому конечное значение ставится по таймеру в любом случае. */
    setTimeout(function () { node.textContent = to + (suffix || ''); }, duration + 80);
  }

  /* ==========================================================================
     ШАПКА: МЕНЮ И ЯЗЫК
     ========================================================================== */
  function initHeader() {
    // Текущий пункт меню. Ссылки-якори (index.html#studio) пропускаем:
    // это переход к блоку, а не отдельная страница, и подсвечивать его как
    // «вы здесь» — врать пользователю и скринридеру.
    var here = location.pathname.split('/').pop() || 'index.html';
    $$('.site-nav a, .mobile-nav__list a').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href.indexOf('#') !== -1) return;
      if (href === here) link.setAttribute('aria-current', 'page');
    });

    // переключатель языка
    function syncLang() {
      $$('.lang__btn').forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === I18N.lang));
      });
    }
    $$('.lang__btn').forEach(function (btn) {
      btn.addEventListener('click', function () { I18N.set(btn.getAttribute('data-lang')); });
    });
    I18N.onChange(syncLang);
    syncLang();

    // мобильное меню
    var nav = $('#mobile-nav');
    var burger = $('#burger');
    if (!nav || !burger) return;

    var release = null;

    function open() {
      nav.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      lockScroll(true);
      release = trapFocus(nav, close);
    }
    function close() {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      lockScroll(false);
      if (release) { release(); release = null; }
      // Фокус возвращается на кнопку меню всегда, а не только когда её нажали
      // мышью: иначе после Esc клавиатурный пользователь оказывается в начале
      // страницы и заново идёт табом до того места, где был.
      burger.focus();
    }

    burger.addEventListener('click', open);
    $$('[data-close-menu]', nav).forEach(function (n) { n.addEventListener('click', close); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', close); });
  }

  /* ==========================================================================
     АККОРДЕОН
     ========================================================================== */
  function buildAccordion(container, items) {
    container.innerHTML = '';
    items.forEach(function (item, index) {
      var panelId = container.id + '-panel-' + index;
      var btnId = container.id + '-btn-' + index;

      var panel = el('div', { class: 'accordion__panel', id: panelId, role: 'region', 'aria-labelledby': btnId, hidden: '' },
        [el('p', { text: item.a })]);

      var btn = el('button', {
        class: 'accordion__btn', type: 'button', id: btnId,
        'aria-expanded': 'false', 'aria-controls': panelId
      }, [
        el('span', { text: item.q }),
        el('span', { class: 'accordion__sign', 'aria-hidden': 'true', text: '+' })
      ]);

      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        panel.hidden = open;
      });

      container.appendChild(el('div', { class: 'accordion__item' }, [btn, panel]));
    });
  }

  function initAccordions() {
    $$('[data-faq]').forEach(function (container) {
      function render() { buildAccordion(container, I18N.t('faq.items') || []); }
      render();
      I18N.onChange(render);
    });
  }

  /* ==========================================================================
     ОТЗЫВЫ
     ========================================================================== */
  function initReviews() {
    var track = $('[data-reviews]');
    if (!track) return;

    function render() {
      track.innerHTML = '';
      (I18N.t('reviews.items') || []).forEach(function (item) {
        track.appendChild(el('figure', { class: 'review' }, [
          el('blockquote', { class: 'review__text', text: item.text }),
          el('figcaption', { class: 'review__author' }, [
            el('b', { text: item.author }),
            document.createTextNode(' · ' + item.band)
          ])
        ]));
      });
    }
    render();
    I18N.onChange(render);

    // Стрелки нужны только там, где лента реально прокручивается
    $$('[data-reviews-nav]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = btn.getAttribute('data-reviews-nav') === 'next' ? 1 : -1;
        var card = track.firstElementChild;
        var step = card ? card.getBoundingClientRect().width + 20 : 320;
        track.scrollBy({ left: dir * step, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    });
  }

  /* ==========================================================================
     СПИСКИ ИЗ СЛОВАРЯ (правила базы)
     ========================================================================== */
  function initLists() {
    $$('[data-list]').forEach(function (container) {
      function render() {
        container.innerHTML = '';
        (I18N.t(container.getAttribute('data-list')) || []).forEach(function (text) {
          container.appendChild(el('li', {}, [el('span', { text: text })]));
        });
      }
      render();
      I18N.onChange(render);
    });
  }

  /* ==========================================================================
     КОНТАКТЫ ИЗ ДАННЫХ
     Телефон и адрес живут в rooms.js, чтобы правиться в одном месте.
     ========================================================================== */
  function initContacts() {
    if (!window.GUL_DATA) return;
    var c = window.GUL_DATA.contacts;

    function render() {
      $$('[data-contact]').forEach(function (node) {
        var kind = node.getAttribute('data-contact');
        if (kind === 'phone') {
          node.textContent = c.phone;
          if (node.tagName === 'A') node.href = 'tel:' + c.phoneHref;
        } else if (kind === 'email') {
          node.textContent = c.email;
          if (node.tagName === 'A') node.href = 'mailto:' + c.email;
        } else if (kind === 'instagram') {
          node.textContent = '@' + c.instagram;
          if (node.tagName === 'A') node.href = c.instagramUrl;
        } else if (kind === 'address') {
          node.textContent = I18N.pick(c.address);
        } else if (kind === 'hours') {
          node.textContent = c.hoursShort;
        }
      });
    }
    render();
    I18N.onChange(render);
  }

  /* ==========================================================================
     ПОДПИСИ АВТОРОВ ФОТО
     <figcaption data-credit="studio"> — автор и лицензия подставляются из
     photoCredits в rooms.js. Для CC BY подпись рядом с фото обязательна.
     ========================================================================== */
  function initCredits() {
    if (!window.GUL_DATA || !window.GUL_DATA.photoCredits) return;
    var all = window.GUL_DATA.photoCredits;

    function render() {
      $$('[data-credit]').forEach(function (node) {
        var c = all[node.getAttribute('data-credit')];
        if (!c) return;
        node.innerHTML = '';
        node.appendChild(document.createTextNode(I18N.t('room.photoBy') + ': ' + c.author + ' · '));
        node.appendChild(el('a', { href: c.source, target: '_blank', rel: 'noopener noreferrer', text: c.license }));
      });
    }
    render();
    I18N.onChange(render);
  }

  /* ==========================================================================
     СОСТОЯНИЯ ЗАГРУЗКИ И ОШИБКИ
     ========================================================================== */
  function skeletons(container, count, kind) {
    container.innerHTML = '';
    for (var i = 0; i < count; i++) {
      container.appendChild(el('div', { class: 'skeleton skeleton--' + (kind || 'card'), 'aria-hidden': 'true' }));
    }
    container.setAttribute('aria-busy', 'true');
  }

  function showError(container, retryFn) {
    container.removeAttribute('aria-busy');
    container.innerHTML = '';
    container.appendChild(el('div', { class: 'alert', role: 'alert' }, [
      el('p', { class: 'alert__title', text: I18N.t('common.errorTitle') }),
      el('p', { class: 'alert__text', text: I18N.t('common.errorText') }),
      retryFn ? el('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: retryFn, text: I18N.t('common.retry') }) : null
    ]));
  }

  /* ==========================================================================
     ГОД В ПОДВАЛЕ
     ========================================================================== */
  function initYear() {
    $$('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });
  }

  /* ==========================================================================
     СТАРТ
     ========================================================================== */
  function init() {
    I18N.apply();
    initHeader();
    initAccordions();
    initReviews();
    initLists();
    initContacts();
    initCredits();
    initYear();
    initReveal();

    // Страницы перерисовывают свои динамические части сами
    I18N.onChange(function (lang) {
      document.dispatchEvent(new CustomEvent('gul:lang', { detail: { lang: lang } }));
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    $: $, $$: $$, el: el, money: money, announce: announce,
    lockScroll: lockScroll, trapFocus: trapFocus,
    countTo: countTo, skeletons: skeletons, showError: showError,
    /* вызывается после отрисовки динамических блоков: карточки приходят
       позже DOMContentLoaded и сами себя наблюдателю не покажут */
    revealScan: initReveal,
    reducedMotion: prefersReducedMotion
  };
})();
