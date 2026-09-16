/* ============================================================================
   ГУЛ — страница «Авторы фотографий»
   ----------------------------------------------------------------------------
   Список собирается из rooms.js: кадры комнат, баннер студии и их авторы
   в photoCredits. Добавили фото в данные — оно само появится здесь.
   ============================================================================ */

(function () {
  'use strict';

  var $ = UI.$, el = UI.el;

  var box = $('[data-credits]');
  if (!box || !window.GUL_DATA) return;

  var data = window.GUL_DATA;

  function item(file, label, alt) {
    var c = (data.photoCredits || {})[file];
    if (!c) return null;

    return el('li', { class: 'credit' }, [
      el('img', {
        class: 'credit__thumb',
        src: 'assets/img/rooms/' + file + '-sm.jpg',
        alt: alt, width: '600', height: '450', loading: 'lazy', decoding: 'async'
      }),
      el('div', { class: 'credit__body' }, [
        el('p', { class: 'credit__label', text: label }),
        el('p', { class: 'credit__alt', text: alt }),
        el('dl', { class: 'credit__meta' }, [
          el('dt', { text: I18N.t('credits.author') }),
          el('dd', { text: c.author }),
          el('dt', { text: I18N.t('credits.license') }),
          el('dd', {}, [
            c.licenseUrl
              ? el('a', { href: c.licenseUrl, target: '_blank', rel: 'noopener noreferrer', text: c.license })
              : document.createTextNode(c.license)
          ])
        ]),
        el('a', {
          class: 'credit__source', href: c.source, target: '_blank', rel: 'noopener noreferrer',
          text: I18N.t('credits.open')
        })
      ])
    ]);
  }

  function render() {
    box.innerHTML = '';

    data.rooms.forEach(function (room) {
      (room.photos || []).forEach(function (photo) {
        var node = item(
          photo.file,
          I18N.t('credits.room', { letter: room.letter, name: I18N.pick(room.name) }),
          I18N.pick(photo.alt)
        );
        if (node) box.appendChild(node);
      });
    });

    var studio = item('studio', I18N.t('credits.studio'), I18N.t('studio.photoAlt'));
    if (studio) box.appendChild(studio);
  }

  document.addEventListener('DOMContentLoaded', render);
  document.addEventListener('gul:lang', render);
})();
