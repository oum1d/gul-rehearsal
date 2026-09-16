/* ============================================================================
   ГУЛ — страница комнаты
   ----------------------------------------------------------------------------
   Главная логика проекта: сетка расписания с выбором нескольких подряд идущих
   часов и живым подсчётом суммы.

   ПРАВИЛО ВЫБОРА
   Бронь идёт одним непрерывным блоком. Поэтому добавить можно только час,
   примыкающий к уже выбранному диапазону; нажатие в стороне начинает выбор
   заново. Так пользователь физически не может собрать «21:00 и 23:00» и
   получить счёт за два часа, которые база отдаст разным группам.

   ДВА ВИДА ОДНОЙ СЕТКИ
   На широком экране — неделя целиком (дни по горизонтали, часы по вертикали).
   На телефоне 7×20 клеток превращаются в нечитаемую кашу, поэтому там
   выбирается день, а часы показываются крупными кнопками. Вид переключается
   по matchMedia с сохранением уже сделанного выбора.
   ============================================================================ */

(function () {
  'use strict';

  var $ = UI.$, $$ = UI.$$, el = UI.el;

  var wrap = $('[data-room]');
  if (!wrap) return;

  var scheduleBox = $('[data-schedule]');
  var sideBox = $('[data-booking-side]');

  var room = null;
  var days = [];
  var weekOffset = 0;
  var selection = { day: null, slots: [] };
  var dock = null;

  var wide = window.matchMedia('(min-width: 760px)');

  /* ==========================================================================
     ШАПКА КОМНАТЫ
     ========================================================================== */
  function renderHead() {
    // Заголовок вкладки собирается из перевода: в польской версии это GUL
    document.title = room.letter + ' · ' + I18N.pick(room.name) + ' — ' + I18N.t('brand.name');

    $('[data-room-title]').textContent = room.letter + ' · ' + I18N.pick(room.name);
    $('[data-room-about]').textContent = I18N.pick(room.about);

    var specs = $('[data-specs]');
    specs.innerHTML = '';
    [
      ['room.areaLabel', room.area + ' ' + I18N.t('roomsBlock.area')],
      // В польском и русском дробная часть отделяется запятой, в английском точкой
      ['room.ceilingLabel', String(room.ceiling).replace('.', I18N.lang === 'en' ? '.' : ',') + ' ' + I18N.t('room.meters')],
      ['room.soundLabel', I18N.t('room.soundValue')],
      ['room.capacityLabel', I18N.t('room.capacityValue', { n: room.capacity })]
    ].forEach(function (pair) {
      specs.appendChild(el('div', { class: 'spec' }, [
        el('span', { class: 'spec__label', text: I18N.t(pair[0]) }),
        el('span', { class: 'spec__value', text: pair[1] })
      ]));
    });

    var equip = $('[data-equipment]');
    equip.innerHTML = '';
    I18N.pick(room.equipment).forEach(function (line) {
      equip.appendChild(el('li', {}, [el('span', { text: line })]));
    });

    $('[data-room-price]').textContent = room.price + ' ' + I18N.t('room.perHour');
    renderGallery();
    renderOthers();
  }

  /* Подпись автора под кадром. Лицензии CC BY и CC BY-SA разрешают брать
     фото только с указанием автора и лицензии рядом с изображением. */
  function creditLine(file) {
    var credits = (GUL.data.photoCredits || {})[file];
    if (!credits) return null;
    return el('figcaption', { class: 'gallery__credit' }, [
      document.createTextNode(I18N.t('room.photoBy') + ': ' + credits.author + ' · '),
      el('a', {
        href: credits.source, target: '_blank', rel: 'noopener noreferrer',
        text: credits.license
      })
    ]);
  }

  var galleryIndex = 0;

  function renderGallery() {
    var main = $('[data-gallery-main]');
    var thumbs = $('[data-gallery-thumbs]');
    if (!main || !thumbs) return;

    if (room.photos && room.photos.length) {
      renderPhotoGallery(main, thumbs);
      return;
    }
    renderPlaceholderGallery(main, thumbs);
  }

  function renderPhotoGallery(main, thumbs) {
    var photos = room.photos;
    if (galleryIndex >= photos.length) galleryIndex = 0;

    function show(index, focusThumb) {
      galleryIndex = index;
      var photo = photos[index];

      main.innerHTML = '';
      main.appendChild(el('figure', { class: 'gallery__figure' }, [
        el('div', { class: 'poster poster--photo' }, [
          // Первый кадр виден сразу при открытии страницы — его не откладываем
          Cards.photoImg(photo, {
            size: 'lg', responsive: true, eager: index === 0,
            sizes: '(min-width: 760px) 50vw, 100vw'
          })
        ]),
        creditLine(photo.file)
      ]));

      UI.$$('button', thumbs).forEach(function (b, i) {
        b.setAttribute('aria-pressed', String(i === index));
        b.tabIndex = i === index ? 0 : -1;
        if (focusThumb && i === index) b.focus();
      });
    }

    thumbs.innerHTML = '';
    thumbs.style.gridTemplateColumns = 'repeat(' + photos.length + ', 1fr)';

    photos.forEach(function (photo, i) {
      thumbs.appendChild(el('button', {
        class: 'gallery__thumb', type: 'button',
        'aria-label': I18N.pick(photo.alt),
        'aria-pressed': String(i === galleryIndex),
        onclick: function () { show(i); }
      }, [Cards.photoImg(photo)]));
    });

    // Стрелки влево-вправо переключают кадры, когда фокус на миниатюрах —
    // одна остановка табуляции на всю ленту, а не четыре
    thumbs.onkeydown = function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var step = e.key === 'ArrowRight' ? 1 : -1;
      show((galleryIndex + step + photos.length) % photos.length, true);
    };

    show(galleryIndex);
  }

  /* Заглушка на случай комнаты без фото: переключение миниатюрами работает
     так же, а кадры подставятся, как только появятся файлы в rooms.js */
  function renderPlaceholderGallery(main, thumbs) {
    var frames = [1, 2, 3, 4];

    function show(index) {
      main.innerHTML = '';
      var poster = Cards.poster(room, 'wide');
      var note = poster.querySelector('.poster__note');
      if (note) note.textContent = 'ФОТО ' + String(index).padStart(2, '0') + ' · ЗАМЕНИТЬ';
      main.appendChild(poster);
      $$('button', thumbs).forEach(function (b, i) {
        b.setAttribute('aria-pressed', String(i + 1 === index));
      });
    }

    thumbs.innerHTML = '';
    frames.forEach(function (n) {
      thumbs.appendChild(el('button', {
        class: 'gallery__thumb', type: 'button',
        'aria-label': I18N.pick(room.name) + ' — ' + n,
        'aria-pressed': String(n === 1),
        onclick: function () { show(n); }
      }, [el('span', { class: 'poster poster--square' }, [
        el('span', { class: 'poster__letter', style: 'font-size:1.5rem', 'aria-hidden': 'true', text: String(n) })
      ])]));
    });

    show(1);
  }

  function renderOthers() {
    var box = $('[data-others]');
    if (!box) return;
    box.innerHTML = '';
    GUL.data.rooms
      .filter(function (r) { return r.id !== room.id; })
      .forEach(function (r, i) { box.appendChild(Cards.roomCard(r, i)); });
  }

  /* ==========================================================================
     ВЫБОР СЛОТОВ
     ========================================================================== */
  function sameSelectedDay(day) {
    return selection.day && GUL.sameDay(selection.day, day);
  }

  function pick(day, index) {
    if (!sameSelectedDay(day)) {
      selection.day = day;
      selection.slots = [index];
      return;
    }

    var slots = selection.slots;
    var at = slots.indexOf(index);

    if (at !== -1) {
      // Снять можно только край блока — иначе он развалится на две части
      if (index === slots[0] || index === slots[slots.length - 1]) {
        slots.splice(at, 1);
        if (!slots.length) selection.day = null;
      } else {
        selection.slots = [index];
      }
      return;
    }

    if (index === slots[0] - 1) { slots.unshift(index); return; }
    if (index === slots[slots.length - 1] + 1) { slots.push(index); return; }

    selection.slots = [index];   // нажали в стороне — начинаем заново
  }

  /* ==========================================================================
     ОТРИСОВКА СЕТКИ
     ========================================================================== */
  function slotButton(day, index, opts) {
    var state = GUL.slotState(room.id, day, index);
    var picked = sameSelectedDay(day) && selection.slots.indexOf(index) !== -1;
    var price = GUL.priceOf(room, day, index);

    var stateWord = state === 'busy' ? I18N.t('room.legendBusy')
                  : state === 'past' ? I18N.t('room.legendClosed')
                  : picked ? I18N.t('room.legendPicked')
                  : I18N.t('room.legendFree');

    var classes = ['slot'];
    if (state === 'busy') classes.push('slot--busy');
    if (state === 'past') classes.push('slot--closed');
    if (picked) classes.push('slot--picked');

    var label = I18N.formatDate(day, 'weekdayLong') + ', ' + GUL.slotLabel(index) +
                ' — ' + stateWord + (state === 'free' ? ', ' + price + ' ' + I18N.t('common.zl') : '');

    /* В недельной сетке в клетке стоит цена: у занятого часа она зачёркнута —
       видно и сколько стоит, и что взять нельзя. У прошедшего часа цена уже
       не нужна, там прочерк. */
    var kids = opts && opts.withPrice
      ? [el('b', { text: GUL.slotLabel(index) }), el('span', { text: price + ' ' + I18N.t('common.zl') })]
      : [document.createTextNode(state === 'past' ? '·' : String(price))];

    var btn = el('button', {
      class: classes.join(' '),
      type: 'button',
      'aria-label': label,
      'aria-pressed': String(picked),
      disabled: state === 'free' ? null : 'disabled'
    }, kids);

    if (state === 'free') {
      btn.addEventListener('click', function () {
        pick(day, index);
        var takenNote = $('[data-slots-taken]');
        if (takenNote) takenNote.hidden = true;
        renderSchedule();
        renderSummary();
      });
    }
    return btn;
  }

  function renderWeek() {
    var slice = days.slice(weekOffset * 7, weekOffset * 7 + 7);
    var grid = el('div', {
      class: 'week',
      role: 'group',
      'aria-label': I18N.t('room.schedule')
    });

    grid.appendChild(el('div', { class: 'week__corner' }));

    var today = new Date();
    slice.forEach(function (day) {
      grid.appendChild(el('div', {
        class: 'week__day' + (GUL.sameDay(day, today) ? ' week__day--today' : '')
      }, [
        document.createTextNode(I18N.formatDate(day, 'weekdayShort')),
        el('b', { text: I18N.formatDate(day, 'short') })
      ]));
    });

    GUL.slotRange().forEach(function (index) {
      grid.appendChild(el('div', { class: 'week__hour', text: GUL.slotLabel(index) }));
      slice.forEach(function (day) { grid.appendChild(slotButton(day, index)); });
    });

    return grid;
  }

  function renderDayView() {
    var box = el('div', { class: 'schedule' });

    var picker = el('div', { class: 'daypicker', role: 'group', 'aria-label': I18N.t('room.dayPickerLabel') });
    var active = selection.day || days[0];

    days.forEach(function (day) {
      var anyFree = GUL.slotRange().some(function (i) { return GUL.slotState(room.id, day, i) === 'free'; });
      picker.appendChild(el('button', {
        class: 'daybtn' + (anyFree ? '' : ' daybtn--full'),
        type: 'button',
        'aria-pressed': String(GUL.sameDay(day, active)),
        'aria-label': I18N.formatDate(day, 'weekdayLong') + ', ' + I18N.formatDate(day, 'dayMonth'),
        onclick: function () {
          if (!sameSelectedDay(day)) { selection.day = day; selection.slots = []; }
          renderSchedule();
          renderSummary();
        }
      }, [
        document.createTextNode(I18N.formatDate(day, 'weekdayShort')),
        el('b', { text: String(day.getDate()) })
      ]));
    });

    var slots = el('div', { class: 'dayslots' });
    GUL.slotRange().forEach(function (index) {
      slots.appendChild(slotButton(active, index, { withPrice: true }));
    });

    box.appendChild(picker);
    box.appendChild(slots);
    return box;
  }

  function legend() {
    return el('ul', { class: 'schedule__legend' }, [
      el('li', {}, [el('span', { class: 'legend-swatch', 'aria-hidden': 'true' }), el('span', { text: I18N.t('room.legendFree') })]),
      el('li', {}, [el('span', { class: 'legend-swatch legend-swatch--busy', 'aria-hidden': 'true' }), el('span', { text: I18N.t('room.legendBusy') })]),
      el('li', {}, [el('span', { class: 'legend-swatch legend-swatch--picked', 'aria-hidden': 'true' }), el('span', { text: I18N.t('room.legendPicked') })]),
      el('li', {}, [el('span', { class: 'legend-swatch legend-swatch--closed', 'aria-hidden': 'true' }), el('span', { text: I18N.t('room.legendClosed') })])
    ]);
  }

  function renderSchedule() {
    scheduleBox.innerHTML = '';
    scheduleBox.removeAttribute('aria-busy');

    scheduleBox.appendChild(legend());
    scheduleBox.appendChild(el('p', { class: 'muted', style: 'font-size:0.8125rem', text: I18N.t('room.scheduleHint') }));

    if (wide.matches) {
      scheduleBox.appendChild(renderWeek());

      var pages = Math.ceil(days.length / 7);
      if (pages > 1) {
        var nav = el('div', { class: 'chips', style: 'margin-top:0.75rem' });
        for (var p = 0; p < pages; p++) {
          (function (page) {
            var from = days[page * 7];
            var to = days[Math.min(page * 7 + 6, days.length - 1)];
            nav.appendChild(el('button', {
              class: 'opt', type: 'button',
              'aria-pressed': String(page === weekOffset),
              text: I18N.formatDate(from, 'short') + ' — ' + I18N.formatDate(to, 'short'),
              onclick: function () { weekOffset = page; renderSchedule(); }
            }));
          })(p);
        }
        scheduleBox.appendChild(nav);
      }
    } else {
      scheduleBox.appendChild(renderDayView());
    }
  }

  /* ==========================================================================
     СВОДКА: боковая панель и прилипающий док
     ========================================================================== */
  function currentTotal() {
    if (!selection.slots.length) return 0;
    return GUL.totalOf(room, selection.day, selection.slots);
  }

  function openDrawer() {
    if (!selection.slots.length) return;
    Booking.open({ roomId: room.id, day: selection.day, slots: selection.slots });
  }

  function renderSummary() {
    var count = selection.slots.length;
    var total = currentTotal();

    /* --- боковая панель (десктоп) --- */
    if (sideBox) {
      sideBox.innerHTML = '';
      var card = el('div', { class: 'summary' });

      card.appendChild(el('div', { class: 'summary__row' }, [
        el('span', { class: 'summary__label', text: I18N.t('booking.room') }),
        el('span', { class: 'summary__value', text: room.letter + ' · ' + I18N.pick(room.name) })
      ]));

      if (count) {
        card.appendChild(el('div', { class: 'summary__row' }, [
          el('span', { class: 'summary__label', text: I18N.t('booking.when') }),
          el('span', {
            class: 'summary__value',
            text: I18N.formatDate(selection.day, 'weekdayShort') + ', ' + GUL.rangeLabel(selection.slots)
          })
        ]));
        card.appendChild(el('div', { class: 'summary__row' }, [
          el('span', { class: 'summary__label', text: I18N.t('booking.selected', { n: count }) }),
          el('span', { class: 'summary__total', 'data-side-total': '' })
        ]));
      } else {
        card.appendChild(el('p', { class: 'muted', text: I18N.t('booking.empty') }));
      }

      sideBox.appendChild(card);
      sideBox.appendChild(el('button', {
        class: 'btn btn--primary btn--block',
        type: 'button',
        text: I18N.t('booking.submit'),
        disabled: count ? null : 'disabled',
        onclick: openDrawer
      }));
      sideBox.appendChild(el('p', { class: 'muted', style: 'font-size:0.8125rem', text: I18N.t('booking.note') }));

      var sideTotal = $('[data-side-total]', sideBox);
      if (sideTotal) UI.countTo(sideTotal, total, ' ' + I18N.t('common.zl'));
    }

    /* --- прилипающий док (телефон) --- */
    if (!dock) {
      dock = el('div', { class: 'dock' }, [
        el('div', { class: 'dock__info' }, [
          el('div', { class: 'dock__line', 'data-dock-line': '' }),
          el('div', { class: 'dock__total', 'data-dock-total': '' })
        ]),
        el('button', { class: 'btn btn--primary', type: 'button', 'data-dock-cta': '', onclick: openDrawer })
      ]);
      document.body.appendChild(dock);
      document.body.classList.add('has-dock');
    }

    dock.classList.toggle('is-open', count > 0);
    $('[data-dock-cta]', dock).textContent = I18N.t('booking.submit');
    $('[data-dock-line]', dock).textContent = count
      ? I18N.formatDate(selection.day, 'weekdayShort') + ' ' + GUL.rangeLabel(selection.slots)
      : '';
    UI.countTo($('[data-dock-total]', dock), total, ' ' + I18N.t('common.zl'));

    if (count) {
      UI.announce(I18N.t('booking.selected', { n: count }) + ' · ' + total + ' ' + I18N.t('common.zl'));
    }
  }

  /* ==========================================================================
     СТАРТ
     ========================================================================== */
  function renderAll() {
    renderHead();
    renderSchedule();
    renderSummary();
    UI.revealScan();
  }

  function start() {
    UI.skeletons(scheduleBox, 6, 'row');

    GUL.load().then(function () {
      var id = new URLSearchParams(location.search).get('id');
      room = GUL.room(id);

      // Ссылка с опечаткой не должна показывать пустую страницу
      if (!room) { location.replace('404.html'); return; }

      days = GUL.days();
      renderAll();
    }).catch(function () {
      UI.showError(scheduleBox, function () { GUL.reset(); start(); });
    });
  }

  document.addEventListener('DOMContentLoaded', start);
  document.addEventListener('gul:lang', function () { if (room) renderAll(); });

  /* Сменилось окно занятости или прошёл час. Выбранные часы могли стать
     занятыми или прошедшими — тогда выбор сбрасывается, открытая шторка брони
     закрывается, а скринридер и глаз получают объяснение. Молча оставить
     выбор нельзя: человек отправил бы заявку на час, который уже показан
     занятым в сетке. */
  document.addEventListener('gul:tick', function () {
    if (!room) return;
    days = GUL.days();

    var lost = selection.slots.length && selection.slots.some(function (i) {
      return GUL.slotState(room.id, selection.day, i) !== 'free';
    });
    if (lost) {
      selection = { day: null, slots: [] };
      Booking.close();
      UI.announce(I18N.t('room.slotsTaken'));
      var note = $('[data-slots-taken]');
      if (note) { note.textContent = I18N.t('room.slotsTaken'); note.hidden = false; }
    }

    if (weekOffset * 7 >= days.length) weekOffset = 0;
    renderAll();
  });

  // Смена ориентации или ресайз: перерисовываем сетку, выбор сохраняется
  var onBreakpoint = function () { if (room) { renderSchedule(); renderSummary(); } };
  if (wide.addEventListener) wide.addEventListener('change', onBreakpoint);
  else wide.addListener(onBreakpoint);
})();
