/* ============================================================================
   ГУЛ — карточка комнаты
   ----------------------------------------------------------------------------
   Общий кирпич для главной и каталога: если менять вид карточки, менять
   придётся в одном месте, а не в двух похожих.
   ============================================================================ */

window.Cards = (function () {
  'use strict';

  var el = UI.el;

  var IMG_DIR = 'assets/img/rooms/';

  function photoSrc(file, size) {
    return IMG_DIR + file + '-' + size + '.jpg';
  }

  /* Кадр комнаты. Каждый файл лежит в двух размерах: sm (600px) и lg (1200px).
     В карточках — только sm, без srcset: на телефоне с плотным экраном
     браузер выбрал бы lg и тянул по 150 КБ на карточку, а скорость
     на плохой связи здесь важнее лишней резкости. */
  function photoImg(photo, opts) {
    var o = opts || {};
    var attrs = {
      src: photoSrc(photo.file, o.size || 'sm'),
      alt: I18N.pick(photo.alt),
      width: o.size === 'lg' ? '1200' : '600',
      height: o.size === 'lg' ? '900' : '450',
      decoding: 'async',
      loading: o.eager ? 'eager' : 'lazy'
    };
    if (o.responsive) {
      attrs.srcset = photoSrc(photo.file, 'sm') + ' 600w, ' + photoSrc(photo.file, 'lg') + ' 1200w';
      attrs.sizes = o.sizes || '100vw';
    }
    return el('img', attrs);
  }

  /* Обложка комнаты — первый кадр галереи. Если кадров нет,
     остаётся типографическая заглушка в стиле афиши. */
  function poster(room, variant) {
    var cover = room.photos && room.photos[0];
    var cls = 'poster' + (variant ? ' poster--' + variant : '');

    if (cover) {
      return el('div', { class: cls + ' poster--photo' }, [photoImg(cover)]);
    }

    return el('div', { class: cls, role: 'img', 'aria-label': I18N.pick(room.name) }, [
      el('span', { class: 'poster__letter', 'aria-hidden': 'true', text: room.letter }),
      el('span', { class: 'poster__note', text: 'ФОТО · ЗАМЕНИТЬ' })
    ]);
  }

  /* Бейдж занятости. Текст всегда сопровождает цвет: «занято» читается
     и без способности различать красный. */
  function badge(room) {
    var info = GUL.todayBadge(room.id);
    if (info.kind === 'free') {
      return el('span', { class: 'badge badge--free', text: I18N.t('catalog.freeToday') });
    }
    if (info.kind === 'busyUntil') {
      return el('span', { class: 'badge badge--busy', text: I18N.t('catalog.busyUntil', { time: info.time }) });
    }
    return el('span', { class: 'badge badge--busy', text: I18N.t('catalog.busyAllDay') });
  }

  var TAG_KEYS = {
    drums: 'catalog.gearDrums',
    bass: 'catalog.gearBass',
    mics: 'catalog.gearMics',
    mixer: 'catalog.gearMixer',
    keys: 'catalog.gearKeys',
    monitors: 'gear.monitors'
  };

  function roomCard(room, index) {
    var tags = room.tags.slice(0, 4).map(function (tag) {
      return el('span', { class: 'tag', text: I18N.t(TAG_KEYS[tag] || tag) });
    });

    return el('article', {
      class: 'room-card',
      'data-reveal': '',
      'data-reveal-delay': String((index || 0) * 70)
    }, [
      poster(room),
      el('div', { class: 'room-card__body' }, [
        el('div', { class: 'room-card__top' }, [
          el('h3', { class: 'room-card__title', text: I18N.pick(room.name) }),
          el('span', { class: 'room-card__letter', text: room.letter })
        ]),
        badge(room),
        el('div', { class: 'room-card__meta' }, [
          el('span', { class: 'tag', text: room.area + ' ' + I18N.t('roomsBlock.area') }),
          el('span', { class: 'tag', text: I18N.t('roomsBlock.capacity', { n: room.capacity }) })
        ]),
        el('div', { class: 'room-card__meta' }, tags),
        el('div', { class: 'room-card__foot' }, [
          el('p', { class: 'room-card__price price' }, [
            document.createTextNode(room.price + ' '),
            el('small', { text: I18N.t('roomsBlock.perHour') })
          ]),
          el('a', {
            class: 'btn btn--ghost btn--sm',
            href: 'room.html?id=' + encodeURIComponent(room.id),
            text: I18N.t('roomsBlock.choose')
          })
        ])
      ])
    ]);
  }

  /* Плитка ближайшего свободного слота: главный «быстрый путь» сайта.
     Одно нажатие — и панель брони открыта с уже выбранным временем. */
  function slotTile(item, index) {
    var room = GUL.room(item.roomId);
    var today = GUL.sameDay(item.day, new Date());
    var dayWord = today ? I18N.t('nearest.today') : I18N.formatDate(item.day, 'weekdayShort');

    return el('button', {
      class: 'slot-tile',
      type: 'button',
      'data-reveal': '',
      'data-reveal-delay': String((index || 0) * 60),
      onclick: function () {
        Booking.open({ roomId: item.roomId, day: item.day, slots: item.slots });
      }
    }, [
      el('span', { class: 'slot-tile__room', text: room.letter + ' · ' + I18N.pick(room.name) }),
      el('span', { class: 'slot-tile__time', text: dayWord + ' ' + GUL.rangeLabel(item.slots) }),
      // На плитке ничего ещё не выбрано, поэтому здесь просто длительность,
      // а не «выбрано N часов» — это слово появится уже в панели брони
      el('span', {
        class: 'slot-tile__price',
        text: item.total + ' ' + I18N.t('common.zl') + ' · ' +
              item.slots.length + ' ' + I18N.plural(item.slots.length, 'hours')
      })
    ]);
  }

  return {
    poster: poster, badge: badge, roomCard: roomCard, slotTile: slotTile,
    photoImg: photoImg, photoSrc: photoSrc
  };
})();
