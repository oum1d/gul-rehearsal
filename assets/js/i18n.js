/* ============================================================================
   ГУЛ — словари и движок переключения языков (RU / PL / EN)
   ----------------------------------------------------------------------------
   Весь текст сайта живёт здесь. В разметке стоят только ключи:
       <h1 data-i18n="hero.h1"></h1>
       <input data-i18n-attr="placeholder:form.namePlaceholder">
   Язык определяется в таком порядке:
       1) ?lang= в адресе   2) сохранённый выбор   3) язык браузера   4) ru

   ЧТО ЗНАТЬ ПРО POLSKI: тексты написаны в той же «флаерной» интонации, что и
   русские, а не переведены дословно. Перед показом реальному клиенту их всё
   равно стоит дать на вычитку носителю — см. README, раздел «Ограничения».
   ============================================================================ */

window.GUL_I18N = {

  /* ======================================================================== */
  ru: {
    _meta: { name: 'RU', htmlLang: 'ru', dir: 'ltr' },
    _plural: {
      rooms: ['комната', 'комнаты', 'комнат'],
      hours: ['час', 'часа', 'часов'],
      free:  ['свободна', 'свободны', 'свободно']
    },

    nav: {
      rooms: 'Комнаты', pricing: 'Тарифы', studio: 'Студия', contacts: 'Контакты',
      book: 'Забронировать', menu: 'Меню', close: 'Закрыть', lang: 'Язык',
      main: 'Основная навигация'
    },

    /* Название базы в кириллице и латинице: «ГУЛ» для русской версии,
       «GUL» для польской и английской — иначе знак не читается вслух */
    brand: { name: 'ГУЛ', mark: 'Г', tagline: 'Репбаза и студия · Вроцлав' },

    footer: { nav: 'Разделы', contacts: 'Контакты', hours: 'Часы работы', rights: 'Все права защищены' },

    /* Заголовок вкладки и описание для поиска — тоже часть перевода:
       иначе польская версия сайта отдаёт в выдачу русский заголовок */
    pages: {
      homeTitle: 'ГУЛ — репетиционная база и студия записи во Вроцлаве',
      homeDesc: 'Четыре репетиционные комнаты в подвале старого завода во Вроцлаве. Барабаны Tama, комбики, пульт. От 30 zł в час, ночью на 25% дешевле. Бронь онлайн без переписки.',
      roomsTitle: 'Комнаты — ГУЛ, репбаза во Вроцлаве',
      roomsDesc: 'Четыре репетиционные комнаты от 12 до 42 м². Фильтр по оборудованию, площади, цене и времени суток.',
      roomDesc: 'Оборудование, цена и расписание комнаты на неделю вперёд. Выберите свободные часы подряд и забронируйте за минуту.',
      pricingTitle: 'Тарифы и абонементы — ГУЛ',
      pricingDesc: 'Почасовая аренда комнат: день, вечер, ночь и выходные. Абонементы на 8, 16 и 32 часа. Калькулятор выгоды.',
      aboutTitle: 'О базе и контакты — ГУЛ, Вроцлав',
      aboutDesc: 'Как появилась репбаза ГУЛ, правила базы, адрес и телефон. Вход со двора, чёрная дверь без вывески.',
      bookedTitle: 'Заявка принята — ГУЛ',
      notfoundTitle: 'Страница не найдена — ГУЛ',
      creditsTitle: 'Авторы фотографий — ГУЛ'
    },

    hero: {
      h1: 'Подвал, где громко можно',
      sub: '4 комнаты, барабаны Tama, честные 40 zł в час днём. Вход со двора, чёрная дверь без вывески.',
      ctaRooms: 'Смотреть комнаты',
      ctaNearest: 'Ближайший свободный слот',
      statusLabel: 'Сейчас',
      statusFree: 'свободно {n} из {total}',
      statusNone: 'все комнаты заняты',
      statusClosed: 'база закрыта до 10:00'
    },

    nearest: {
      title: 'Ближайшие свободные слоты',
      sub: 'Тапните по слоту — панель брони откроется с уже выбранным временем.',
      empty: 'На сегодня свободных слотов не осталось. Посмотрите завтрашний день в расписании комнаты.',
      today: 'сегодня', tomorrow: 'завтра'
    },

    roomsBlock: {
      title: 'Выбери, где шуметь',
      sub: 'Четыре комнаты под разный состав и разный бюджет.',
      all: 'Все комнаты и фильтры',
      from: 'от', perHour: 'zł/час',
      area: 'м²', capacity: 'до {n} чел.',
      choose: 'Выбрать время'
    },

    gear: {
      title: 'Что уже стоит в комнатах',
      sub: 'Своё привозить не обязательно. Всё настроено и работает — это проверяется перед каждой сменой.',
      drums: 'Барабаны Tama', drumsNote: 'Пластики меняем раз в два месяца',
      combos: 'Комбики Marshall и Ampeg', combosNote: 'Гитара и бас в трёх комнатах',
      mixer: 'Пульт Behringer, 16 каналов', mixerNote: 'Комната C, полное подключение',
      monitors: 'Вокальные мониторы', monitorsNote: 'До четырёх точек в большой комнате',
      mics: 'Микрофоны Shure', micsNote: 'Со стойками и кабелями',
      keys: 'Клавиши Yamaha', keysNote: 'Плюс интерфейс и наушники'
    },

    pricingBlock: {
      title: 'Цены без звёздочек',
      hour: 'Час', hourNote: 'Днём, с 10:00 до 17:00',
      night: 'Ночь', nightNote: 'С 23:00 до 06:00, минус 25%',
      pass: 'Абонемент', passNote: '16 часов в месяц, экономия 160 zł',
      more: 'Все тарифы'
    },

    night: {
      title: 'В 23:00 цена падает. Соседей у нас нет.',
      text: 'Подвал стоит в отдельном цехе старого завода. Ближайшее жильё — за оградой, в трёхстах метрах. Ночная смена идёт в полную громкость и стоит на четверть дешевле дневной.',
      cta: 'Занять ночной слот'
    },

    studio: {
      title: 'Студия записи',
      text: 'Записать демо, свести трек, снять живую репетицию на два микрофона. Работаем с тем, что вы играете, а не с тем, что «сейчас модно».',
      cta: 'Записать демо',
      price: '120 zł/час со звукорежиссёром',
      photoAlt: 'Аппаратная студии: большой пульт, мониторы и окно в зал записи'
    },

    reviews: {
      title: 'Что говорят группы',
      items: [
        { text: 'Приехали из Познани на один вечер, забронировали за 10 минут с телефона в поезде. Барабаны настроены, всё работает.', author: 'Марк', band: 'группа «Слюда»' },
        { text: 'Репетируем тут второй год по абонементу. Комната C — единственная в городе, где помещается наш состав из шести человек.', author: 'Аня', band: '«Пятый Этаж»' },
        { text: 'Записали демо за одну ночь. Звукач не пытался сделать из нас кого-то другого.', author: 'Дима', band: 'соло-проект' }
      ],
      prev: 'Предыдущий отзыв', next: 'Следующий отзыв'
    },

    faq: {
      title: 'Вопросы',
      items: [
        { q: 'Можно прийти со своим комбиком?', a: 'Да, и это бесплатно. Место в комнате есть, розеток хватает. Если аппарата много — предупредите при брони, оставим пять минут на занос.' },
        { q: 'Есть ли парковка?', a: 'Во дворе три места, они не бронируются — кто раньше приехал. После 18:00 свободно вдоль заводской ограды, это бесплатно и в минуте ходьбы.' },
        { q: 'Что с шумом ночью?', a: 'Ничего. Подвал в отдельно стоящем цехе, жилых домов рядом нет. Ночью играем в полную громкость без ограничений по децибелам.' },
        { q: 'Опоздали или нужно отменить — что делать?', a: 'Позвонить. Отмена больше чем за 3 часа — без последствий, слот просто освобождается. Опоздание слот не продлевает: следующая группа уже стоит в коридоре.' },
        { q: 'Как платить?', a: 'На месте, наличными или картой. Онлайн-оплаты нет и не планируем — так проще и вам, и нам.' }
      ]
    },

    map: {
      title: 'Как добраться',
      note: 'Вход со двора. Чёрная дверь без вывески, слева от ворот. Если стоите перед фасадом с окнами — обойдите здание.',
      placeholder: 'Здесь будет карта',
      photoPlaceholder: 'Фото входа',
      hoursTitle: 'Часы работы',
      hoursValue: 'Ежедневно, 10:00 — 06:00'
    },

    catalog: {
      title: 'Комнаты',
      count: '{n} {rooms}',
      filters: 'Фильтры',
      area: 'Площадь', areaS: 'до 20 м²', areaM: '20–35 м²', areaL: '35+ м²',
      gear: 'Оборудование', gearDrums: 'Барабаны', gearBass: 'Бас-комбик', gearMics: 'Микрофоны', gearMixer: 'Пульт', gearKeys: 'Клавиши',
      price: 'Цена за час', priceTo: 'до {n} zł',
      time: 'Время', timeDay: 'День', timeEvening: 'Вечер', timeNight: 'Ночь',
      onlyFree: 'Только свободные сегодня',
      sort: 'Сортировка', sortPrice: 'По цене', sortArea: 'По площади', sortPopular: 'По популярности',
      reset: 'Сбросить всё', resetOne: 'Убрать фильтр',
      activeFilters: 'Активные фильтры',
      emptyTitle: 'Под такие фильтры комнат нет',
      emptyText: 'Попробуйте убрать одно из условий — например, требование барабанов или ограничение по цене.',
      emptyCta: 'Сбросить фильтры',
      freeToday: 'Свободно сегодня',
      busyUntil: 'Занято до {time}',
      busyAllDay: 'Сегодня занято полностью'
    },

    room: {
      back: 'Все комнаты',
      specs: 'Характеристики',
      areaLabel: 'Площадь', ceilingLabel: 'Потолок', soundLabel: 'Шумоизоляция', capacityLabel: 'Вместимость',
      soundValue: 'Полная обшивка', capacityValue: 'до {n} чел.', meters: 'м',
      photoBy: 'Фото',
      slotsTaken: 'Пока вы выбирали, эти часы заняли. Выберите другое время — расписание обновилось.',
      equipment: 'Что стоит в комнате',
      schedule: 'Расписание на неделю',
      scheduleHint: 'Выбирайте часы подряд — бронь идёт одним блоком. Чтобы начать заново, тапните любой свободный час в стороне.',
      legendFree: 'Свободно', legendBusy: 'Занято', legendPicked: 'Выбрано', legendClosed: 'Закрыто',
      dayPickerLabel: 'День',
      rules: 'Правила комнаты',
      others: 'Другие комнаты',
      priceFrom: 'Цена', perHour: 'zł/час',
      tariffDay: 'День', tariffEvening: 'Вечер +30%', tariffNight: 'Ночь −25%'
    },

    booking: {
      title: 'Бронь',
      empty: 'Выберите часы в расписании — сумма посчитается сама.',
      selected: 'Выбрано {n} {hours}',
      duration: 'Длительность',
      total: 'Итого',
      when: 'Когда',
      room: 'Комната',
      name: 'Как вас зовут', namePlaceholder: 'Имя',
      phone: 'Телефон', phonePlaceholder: '+48 600 000 000',
      band: 'Название группы', bandPlaceholder: 'Необязательно',
      comment: 'Комментарий', commentPlaceholder: 'Что привезёте с собой, во сколько подъедете',
      sticks: 'Нужны барабанные палочки (+5 zł)',
      consent: 'Согласен на обработку данных для подтверждения брони',
      submit: 'Забронировать',
      submitting: 'Отправляем…',
      note: 'Мы перезвоним в течение часа. Ночью — утром.',
      errName: 'Напишите имя — иначе не поймём, кого встречать',
      errPhone: 'Введите телефон, иначе не сможем подтвердить',
      errPhoneFormat: 'Похоже, в номере опечатка. Проверьте цифры',
      errConsent: 'Без согласия мы не можем сохранить заявку',
      errSlots: 'Сначала выберите время в расписании',
      errSend: 'Заявка не ушла. Проверьте связь и попробуйте ещё раз'
    },

    pricing: {
      title: 'Тарифы и абонементы',
      sub: 'Одна ставка за час комнаты. Скрытых доплат за второго гитариста или за свет нет.',
      tableTitle: 'Почасовая аренда',
      colTariff: 'Тариф', colTime: 'Время', colCoef: 'Коэффициент', colRange: 'Цена за час',
      rowDay: 'Дневной', rowDayTime: '10:00 — 17:00',
      rowEvening: 'Вечерний', rowEveningTime: '17:00 — 23:00',
      rowNight: 'Ночной', rowNightTime: '23:00 — 06:00',
      rowWeekend: 'Выходные', rowWeekendTime: 'Сб и Вс, дневные часы',
      base: 'базовая',
      tableNote: 'Диапазон цен зависит от комнаты: «Каморка» — 30 zł, «Большая» — 85 zł за час.',
      passesTitle: 'Абонементы',
      passesSub: 'Часы действуют месяц и тратятся в любой комнате в любое время.',
      passHours: '{n} {hours} в месяц',
      passPopular: 'Берут чаще всего',
      passSave: 'Экономия {n} zł',
      passRate: '{n} zł за час',
      passCta: 'Купить абонемент',
      calcTitle: 'Считалка выгоды',
      calcSub: 'Сдвиньте ползунок — покажем, с какого момента абонемент дешевле почасовой оплаты.',
      calcLabel: 'Часов в месяц',
      calcHourly: 'Почасово',
      calcPass: 'С абонементом',
      calcBest: 'Подходящий абонемент',
      calcSave: 'Разница',
      calcNoPass: 'На таком объёме абонемент не нужен — почасовая оплата выгоднее.',
      servicesTitle: 'Отдельные услуги',
      svcDemo: 'Запись демо', svcDemoNote: 'Со звукорежиссёром, любая комната',
      svcMix: 'Сведение трека', svcMixNote: 'До трёх правок включено',
      svcSticks: 'Барабанные палочки', svcSticksNote: 'Пара, на смену',
      svcCable: 'Кабель или стойка', svcCableNote: 'Аренда на смену',
      perHour: 'zł/час', perTrack: 'zł/трек', perItem: 'zł/шт'
    },

    about: {
      title: 'О базе',
      p1: 'Мы трое играли в разных группах Вроцлава и лет десять искали, где репетировать без «сделайте потише». В 2021-м нашли подвал старого цеха на Фабричной: бетон, сырость и ни одного соседа в радиусе трёхсот метров.',
      p2: 'Год обшивали своими руками — минвата, гипс, ковролин с распродажи. Комбики и барабаны собирали по объявлениям, что-то везли из Германии на прицепе. Первая группа пришла репетировать раньше, чем мы доделали дверь.',
      p3: 'Сейчас комнат четыре, а мы всё ещё сами настраиваем барабаны и сами открываем в три ночи. Сайт появился по одной причине: переписка в директе перестала помещаться в голову, и мы начали терять ваши заявки.',
      foundersTitle: 'Кто здесь',
      f1: 'Марек', f1role: 'бас, ремонт всего',
      f2: 'Владек', f2role: 'барабаны, расписание',
      f3: 'Ася', f3role: 'звук, студия',
      photoPlaceholder: 'Портрет',
      rulesTitle: 'Правила базы',
      rules: [
        'Своё оборудование — пожалуйста. Чужое без спроса не трогаем.',
        'Курим только во дворе: в комнатах нет вытяжки, дым остаётся в поролоне.',
        'Разлитое на аппарат оплачивает тот, кто разлил. Напитки ставим на пол, не на комбик.',
        'Слот заканчивается вовремя. За пять минут до конца сворачиваемся — следующие уже в коридоре.',
        'Порванный пластик или струну не прячем, а говорим. Это расходники, за них не ругают.'
      ],
      contactsTitle: 'Контакты',
      phoneLabel: 'Телефон', emailLabel: 'Почта', addressLabel: 'Адрес', hoursLabel: 'Часы работы',
      formTitle: 'Задать вопрос',
      formSub: 'Если вопрос не про бронь конкретного слота — напишите здесь.',
      formMessage: 'Вопрос', formMessagePlaceholder: 'Что хотите узнать',
      formSubmit: 'Отправить',
      formSent: 'Вопрос отправлен. Ответим в рабочее время.',
      formErrMessage: 'Напишите вопрос — пустое сообщение мы не поймём'
    },

    booked: {
      title: 'Заявка принята',
      sub: 'Мы перезвоним в течение часа. Ночью — утром.',
      numberLabel: 'Номер брони',
      whatLabel: 'Что забронировано',
      reminderTitle: 'Не потеряйте вход',
      reminder: 'Вход со двора. Чёрная дверь без вывески, слева от ворот. Если стоите перед фасадом с окнами — обойдите здание.',
      cancelTitle: 'Планы изменились?',
      cancel: 'Позвоните до начала слота — отменим без вопросов. Отмена больше чем за 3 часа ничего не стоит.',
      home: 'На главную',
      more: 'Забронировать ещё',
      lost: 'Данные брони не найдены. Возможно, страница открыта напрямую.'
    },

    notfound: {
      code: '404',
      title: 'Такой комнаты у нас нет',
      text: 'Страница потерялась где-то между цехом и подвалом. Бывает.',
      home: 'На главную',
      rooms: 'К комнатам'
    },

    common: {
      loading: 'Загружаем расписание…',
      loadingShort: 'Загружаем…',
      errorTitle: 'Не удалось загрузить данные',
      errorText: 'Похоже, пропала связь. Попробуйте ещё раз — это не займёт много времени.',
      retry: 'Повторить',
      zl: 'zł',
      demoNotice: 'Демонстрационная работа. Занятость, адрес и телефон — заглушки, заявки никуда не отправляются. Фотографии — свободные снимки других студий с Wikimedia Commons.',
      photoCredits: 'Авторы фото',
      skipToContent: 'Перейти к содержимому',
      rulesLink: 'Правила базы',
      privacy: 'Обработка данных'
    },

    credits: {
      title: 'Авторы фотографий',
      intro: 'Своих снимков у базы пока нет, поэтому на сайте стоят свободные фотографии настоящих репетиционных и студий с Wikimedia Commons. Каждая используется по лицензии, указанной рядом с ней.',
      edits: 'Изменения во всех кадрах: кадрирование, уменьшение размера, перевод в монохром с тёплой тонировкой и виньетка — чтобы снимки из разных мест читались как одна база.',
      author: 'Автор', license: 'Лицензия', open: 'Оригинал на Commons',
      room: 'Комната {letter} · {name}', studio: 'Студия записи · баннер на главной'
    },

    days: { short: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'], long: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'] },
    months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
  },

  /* ======================================================================== */
  pl: {
    _meta: { name: 'PL', htmlLang: 'pl', dir: 'ltr' },
    _plural: {
      rooms: ['pokój', 'pokoje', 'pokoi'],
      hours: ['godzina', 'godziny', 'godzin'],
      free:  ['wolny', 'wolne', 'wolnych']
    },

    nav: {
      rooms: 'Pokoje', pricing: 'Cennik', studio: 'Studio', contacts: 'Kontakt',
      book: 'Rezerwuj', menu: 'Menu', close: 'Zamknij', lang: 'Język',
      main: 'Nawigacja główna'
    },

    brand: { name: 'GUL', mark: 'G', tagline: 'Sala prób i studio · Wrocław' },

    footer: { nav: 'Sekcje', contacts: 'Kontakt', hours: 'Godziny otwarcia', rights: 'Wszelkie prawa zastrzeżone' },

    pages: {
      homeTitle: 'GUL — sala prób i studio nagrań we Wrocławiu',
      homeDesc: 'Cztery sale prób w piwnicy starej fabryki we Wrocławiu. Perkusja Tama, comba, mikser. Od 30 zł za godzinę, w nocy 25% taniej. Rezerwacja online bez pisania wiadomości.',
      roomsTitle: 'Pokoje — GUL, sala prób we Wrocławiu',
      roomsDesc: 'Cztery sale prób od 12 do 42 m². Filtr po sprzęcie, powierzchni, cenie i porze dnia.',
      roomDesc: 'Sprzęt, cena i grafik pokoju na tydzień do przodu. Wybierz wolne godziny po kolei i zarezerwuj w minutę.',
      pricingTitle: 'Cennik i karnety — GUL',
      pricingDesc: 'Wynajem godzinowy: dzień, wieczór, noc i weekend. Karnety na 8, 16 i 32 godziny. Licznik opłacalności.',
      aboutTitle: 'O bazie i kontakt — GUL, Wrocław',
      aboutDesc: 'Jak powstała sala prób GUL, zasady bazy, adres i telefon. Wejście od podwórza, czarne drzwi bez szyldu.',
      bookedTitle: 'Zgłoszenie przyjęte — GUL',
      notfoundTitle: 'Nie znaleziono strony — GUL',
      creditsTitle: 'Autorzy zdjęć — GUL'
    },

    hero: {
      h1: 'Piwnica, gdzie można głośno',
      sub: '4 pokoje, perkusja Tama, uczciwe 40 zł za godzinę w dzień. Wejście od podwórza, czarne drzwi bez szyldu.',
      ctaRooms: 'Zobacz pokoje',
      ctaNearest: 'Najbliższy wolny termin',
      statusLabel: 'Teraz',
      statusFree: 'wolne {n} z {total}',
      statusNone: 'wszystkie pokoje zajęte',
      statusClosed: 'baza zamknięta do 10:00'
    },

    nearest: {
      title: 'Najbliższe wolne terminy',
      sub: 'Kliknij termin — panel rezerwacji otworzy się z już wybraną godziną.',
      empty: 'Na dziś nie ma wolnych godzin. Sprawdź jutro w grafiku pokoju.',
      today: 'dziś', tomorrow: 'jutro'
    },

    roomsBlock: {
      title: 'Wybierz, gdzie hałasować',
      sub: 'Cztery pokoje pod różny skład i różny budżet.',
      all: 'Wszystkie pokoje i filtry',
      from: 'od', perHour: 'zł/godz.',
      area: 'm²', capacity: 'do {n} os.',
      choose: 'Wybierz godzinę'
    },

    gear: {
      title: 'Co już stoi w pokojach',
      sub: 'Swojego sprzętu wozić nie musisz. Wszystko nastrojone i sprawne — sprawdzamy przed każdą zmianą.',
      drums: 'Perkusja Tama', drumsNote: 'Naciągi wymieniamy co dwa miesiące',
      combos: 'Comba Marshall i Ampeg', combosNote: 'Gitara i bas w trzech pokojach',
      mixer: 'Mikser Behringer, 16 kanałów', mixerNote: 'Pokój C, pełne podłączenie',
      monitors: 'Monitory wokalne', monitorsNote: 'Do czterech punktów w dużym pokoju',
      mics: 'Mikrofony Shure', micsNote: 'Ze statywami i kablami',
      keys: 'Klawisze Yamaha', keysNote: 'Plus interfejs i słuchawki'
    },

    pricingBlock: {
      title: 'Ceny bez gwiazdek',
      hour: 'Godzina', hourNote: 'W dzień, od 10:00 do 17:00',
      night: 'Noc', nightNote: 'Od 23:00 do 06:00, minus 25%',
      pass: 'Karnet', passNote: '16 godzin miesięcznie, oszczędność 160 zł',
      more: 'Cały cennik'
    },

    night: {
      title: 'O 23:00 cena spada. Sąsiadów nie mamy.',
      text: 'Piwnica jest w wolnostojącej hali starej fabryki. Najbliższe mieszkania są za ogrodzeniem, trzysta metrów dalej. Nocna zmiana gra na pełnej głośności i kosztuje o ćwierć mniej niż dzienna.',
      cta: 'Zajmij nocny termin'
    },

    studio: {
      title: 'Studio nagrań',
      text: 'Nagrać demo, zmiksować kawałek, zarejestrować próbę na dwa mikrofony. Pracujemy z tym, co gracie, a nie z tym, co „teraz modne”.',
      cta: 'Nagraj demo',
      price: '120 zł/godz. z realizatorem',
      photoAlt: 'Reżyserka studia: duży mikser, monitory i okno na salę nagrań'
    },

    reviews: {
      title: 'Co mówią zespoły',
      items: [
        { text: 'Przyjechaliśmy z Poznania na jeden wieczór, zarezerwowaliśmy w 10 minut z telefonu w pociągu. Perkusja nastrojona, wszystko działa.', author: 'Marek', band: 'zespół „Śluda”' },
        { text: 'Próbujemy tu drugi rok na karnecie. Pokój C to jedyne miejsce w mieście, gdzie mieści się nasz sześcioosobowy skład.', author: 'Ania', band: '„Piąte Piętro”' },
        { text: 'Nagraliśmy demo w jedną noc. Realizator nie próbował zrobić z nas kogoś innego.', author: 'Dima', band: 'projekt solowy' }
      ],
      prev: 'Poprzednia opinia', next: 'Następna opinia'
    },

    faq: {
      title: 'Pytania',
      items: [
        { q: 'Można przyjść z własnym combem?', a: 'Tak i bez dopłaty. Miejsce w pokoju jest, gniazdek starczy. Jeśli sprzętu jest dużo — uprzedź przy rezerwacji, zostawimy pięć minut na wniesienie.' },
        { q: 'Czy jest parking?', a: 'Na podwórzu są trzy miejsca, nie rezerwujemy ich — kto pierwszy, ten lepszy. Po 18:00 wolno wzdłuż ogrodzenia fabryki, za darmo i minutę spacerem.' },
        { q: 'Co z hałasem w nocy?', a: 'Nic. Piwnica jest w wolnostojącej hali, budynków mieszkalnych obok nie ma. W nocy gramy na pełnej głośności, bez limitu decybeli.' },
        { q: 'Spóźnienie albo odwołanie — co robić?', a: 'Zadzwonić. Odwołanie wcześniej niż 3 godziny przed — bez konsekwencji, termin po prostu się zwalnia. Spóźnienie nie przedłuża rezerwacji: następny zespół już stoi na korytarzu.' },
        { q: 'Jak płacić?', a: 'Na miejscu, gotówką albo kartą. Płatności online nie ma i nie planujemy — tak jest prościej i dla was, i dla nas.' }
      ]
    },

    map: {
      title: 'Jak dojechać',
      note: 'Wejście od podwórza. Czarne drzwi bez szyldu, po lewej od bramy. Jeśli stoisz przed elewacją z oknami — obejdź budynek.',
      placeholder: 'Tu będzie mapa',
      photoPlaceholder: 'Zdjęcie wejścia',
      hoursTitle: 'Godziny otwarcia',
      hoursValue: 'Codziennie, 10:00 — 06:00'
    },

    catalog: {
      title: 'Pokoje',
      count: '{n} {rooms}',
      filters: 'Filtry',
      area: 'Powierzchnia', areaS: 'do 20 m²', areaM: '20–35 m²', areaL: '35+ m²',
      gear: 'Sprzęt', gearDrums: 'Perkusja', gearBass: 'Combo basowe', gearMics: 'Mikrofony', gearMixer: 'Mikser', gearKeys: 'Klawisze',
      price: 'Cena za godzinę', priceTo: 'do {n} zł',
      time: 'Pora', timeDay: 'Dzień', timeEvening: 'Wieczór', timeNight: 'Noc',
      onlyFree: 'Tylko wolne dziś',
      sort: 'Sortowanie', sortPrice: 'Po cenie', sortArea: 'Po powierzchni', sortPopular: 'Po popularności',
      reset: 'Wyczyść wszystko', resetOne: 'Usuń filtr',
      activeFilters: 'Aktywne filtry',
      emptyTitle: 'Pod takie filtry nie ma pokoi',
      emptyText: 'Spróbuj zdjąć jeden warunek — na przykład wymóg perkusji albo limit ceny.',
      emptyCta: 'Wyczyść filtry',
      freeToday: 'Wolne dziś',
      busyUntil: 'Zajęte do {time}',
      busyAllDay: 'Dziś zajęte w całości'
    },

    room: {
      back: 'Wszystkie pokoje',
      specs: 'Parametry',
      areaLabel: 'Powierzchnia', ceilingLabel: 'Sufit', soundLabel: 'Wygłuszenie', capacityLabel: 'Pojemność',
      soundValue: 'Pełne wygłuszenie', capacityValue: 'do {n} os.', meters: 'm',
      photoBy: 'Zdjęcie',
      slotsTaken: 'Zanim wybraliście, te godziny ktoś zajął. Wybierzcie inny termin — grafik się odświeżył.',
      equipment: 'Co stoi w pokoju',
      schedule: 'Grafik na tydzień',
      scheduleHint: 'Wybieraj godziny po kolei — rezerwacja idzie jednym blokiem. Żeby zacząć od nowa, kliknij dowolną wolną godzinę obok.',
      legendFree: 'Wolne', legendBusy: 'Zajęte', legendPicked: 'Wybrane', legendClosed: 'Zamknięte',
      dayPickerLabel: 'Dzień',
      rules: 'Zasady pokoju',
      others: 'Inne pokoje',
      priceFrom: 'Cena', perHour: 'zł/godz.',
      tariffDay: 'Dzień', tariffEvening: 'Wieczór +30%', tariffNight: 'Noc −25%'
    },

    booking: {
      title: 'Rezerwacja',
      empty: 'Wybierz godziny w grafiku — suma policzy się sama.',
      selected: 'Wybrano {n} {hours}',
      duration: 'Czas trwania',
      total: 'Razem',
      when: 'Kiedy',
      room: 'Pokój',
      name: 'Jak masz na imię', namePlaceholder: 'Imię',
      phone: 'Telefon', phonePlaceholder: '+48 600 000 000',
      band: 'Nazwa zespołu', bandPlaceholder: 'Opcjonalnie',
      comment: 'Komentarz', commentPlaceholder: 'Co przywieziecie, o której podjedziecie',
      sticks: 'Potrzebne pałki perkusyjne (+5 zł)',
      consent: 'Zgadzam się na przetwarzanie danych w celu potwierdzenia rezerwacji',
      submit: 'Rezerwuj',
      submitting: 'Wysyłamy…',
      note: 'Oddzwonimy w ciągu godziny. W nocy — rano.',
      errName: 'Napisz imię — inaczej nie będziemy wiedzieć, kogo witać',
      errPhone: 'Podaj telefon, inaczej nie potwierdzimy',
      errPhoneFormat: 'Wygląda na literówkę w numerze. Sprawdź cyfry',
      errConsent: 'Bez zgody nie możemy zapisać zgłoszenia',
      errSlots: 'Najpierw wybierz godziny w grafiku',
      errSend: 'Zgłoszenie nie poszło. Sprawdź połączenie i spróbuj jeszcze raz'
    },

    pricing: {
      title: 'Cennik i karnety',
      sub: 'Jedna stawka za godzinę pokoju. Bez dopłat za drugiego gitarzystę czy za światło.',
      tableTitle: 'Wynajem godzinowy',
      colTariff: 'Taryfa', colTime: 'Godziny', colCoef: 'Współczynnik', colRange: 'Cena za godzinę',
      rowDay: 'Dzienna', rowDayTime: '10:00 — 17:00',
      rowEvening: 'Wieczorna', rowEveningTime: '17:00 — 23:00',
      rowNight: 'Nocna', rowNightTime: '23:00 — 06:00',
      rowWeekend: 'Weekend', rowWeekendTime: 'Sob. i niedz., godziny dzienne',
      base: 'bazowa',
      tableNote: 'Widełki zależą od pokoju: „Klitka” — 30 zł, „Duża” — 85 zł za godzinę.',
      passesTitle: 'Karnety',
      passesSub: 'Godziny ważne miesiąc, do wykorzystania w dowolnym pokoju i o dowolnej porze.',
      passHours: '{n} {hours} miesięcznie',
      passPopular: 'Biorą najczęściej',
      passSave: 'Oszczędność {n} zł',
      passRate: '{n} zł za godzinę',
      passCta: 'Kup karnet',
      calcTitle: 'Licznik opłacalności',
      calcSub: 'Przesuń suwak — pokażemy, od którego momentu karnet jest tańszy niż płacenie za godziny.',
      calcLabel: 'Godzin miesięcznie',
      calcHourly: 'Za godziny',
      calcPass: 'Z karnetem',
      calcBest: 'Pasujący karnet',
      calcSave: 'Różnica',
      calcNoPass: 'Przy takim wymiarze karnet się nie opłaca — taniej płacić za godziny.',
      servicesTitle: 'Usługi osobno',
      svcDemo: 'Nagranie demo', svcDemoNote: 'Z realizatorem, dowolny pokój',
      svcMix: 'Miks kawałka', svcMixNote: 'Do trzech poprawek w cenie',
      svcSticks: 'Pałki perkusyjne', svcSticksNote: 'Para, na zmianę',
      svcCable: 'Kabel albo statyw', svcCableNote: 'Wynajem na zmianę',
      perHour: 'zł/godz.', perTrack: 'zł/kawałek', perItem: 'zł/szt.'
    },

    about: {
      title: 'O bazie',
      p1: 'Cała trójka grała w różnych wrocławskich zespołach i przez jakieś dziesięć lat szukaliśmy miejsca na próby bez „ciszej, proszę”. W 2021 znaleźliśmy piwnicę starej hali na Fabrycznej: beton, wilgoć i ani jednego sąsiada w promieniu trzystu metrów.',
      p2: 'Rok wygłuszaliśmy własnymi rękami — wełna, płyta, wykładzina z wyprzedaży. Comba i perkusję zbieraliśmy z ogłoszeń, część przywieźliśmy z Niemiec na przyczepie. Pierwszy zespół przyszedł na próbę, zanim skończyliśmy drzwi.',
      p3: 'Dziś pokoi są cztery, a my nadal sami stroimy perkusję i sami otwieramy o trzeciej w nocy. Strona powstała z jednego powodu: korespondencja na Instagramie przestała mieścić się w głowie i zaczęliśmy gubić wasze zgłoszenia.',
      foundersTitle: 'Kto tu jest',
      f1: 'Marek', f1role: 'bas, naprawa wszystkiego',
      f2: 'Władek', f2role: 'perkusja, grafik',
      f3: 'Asia', f3role: 'dźwięk, studio',
      photoPlaceholder: 'Portret',
      rulesTitle: 'Zasady bazy',
      rules: [
        'Własny sprzęt — proszę bardzo. Cudzego bez pytania nie ruszamy.',
        'Palimy tylko na podwórzu: w pokojach nie ma wentylacji, dym zostaje w gąbce.',
        'Rozlane na sprzęt płaci ten, kto rozlał. Napoje stawiamy na podłodze, nie na combie.',
        'Termin kończy się punktualnie. Pięć minut przed końcem zwijamy się — następni już są na korytarzu.',
        'Zerwanego naciągu czy struny nie chowamy, tylko mówimy. To materiały eksploatacyjne, nikt za to nie krzyczy.'
      ],
      contactsTitle: 'Kontakt',
      phoneLabel: 'Telefon', emailLabel: 'E-mail', addressLabel: 'Adres', hoursLabel: 'Godziny otwarcia',
      formTitle: 'Zadaj pytanie',
      formSub: 'Jeśli pytanie nie dotyczy konkretnego terminu — napisz tutaj.',
      formMessage: 'Pytanie', formMessagePlaceholder: 'Co chcesz wiedzieć',
      formSubmit: 'Wyślij',
      formSent: 'Pytanie wysłane. Odpowiemy w godzinach pracy.',
      formErrMessage: 'Napisz pytanie — pustej wiadomości nie zrozumiemy'
    },

    booked: {
      title: 'Zgłoszenie przyjęte',
      sub: 'Oddzwonimy w ciągu godziny. W nocy — rano.',
      numberLabel: 'Numer rezerwacji',
      whatLabel: 'Co zarezerwowano',
      reminderTitle: 'Nie zgub wejścia',
      reminder: 'Wejście od podwórza. Czarne drzwi bez szyldu, po lewej od bramy. Jeśli stoisz przed elewacją z oknami — obejdź budynek.',
      cancelTitle: 'Plany się zmieniły?',
      cancel: 'Zadzwoń przed początkiem terminu — odwołamy bez pytań. Odwołanie wcześniej niż 3 godziny przed nic nie kosztuje.',
      home: 'Na stronę główną',
      more: 'Zarezerwuj jeszcze',
      lost: 'Nie znaleziono danych rezerwacji. Możliwe, że strona została otwarta bezpośrednio.'
    },

    notfound: {
      code: '404',
      title: 'Takiego pokoju nie mamy',
      text: 'Strona zgubiła się gdzieś między halą a piwnicą. Zdarza się.',
      home: 'Na stronę główną',
      rooms: 'Do pokoi'
    },

    common: {
      loading: 'Ładujemy grafik…',
      loadingShort: 'Ładujemy…',
      errorTitle: 'Nie udało się wczytać danych',
      errorText: 'Wygląda na to, że zniknęło połączenie. Spróbuj jeszcze raz — to chwila.',
      retry: 'Spróbuj ponownie',
      zl: 'zł',
      demoNotice: 'Praca demonstracyjna. Obłożenie, adres i telefon są zastępcze, zgłoszenia nigdzie nie trafiają. Zdjęcia to wolne fotografie innych studiów z Wikimedia Commons.',
      photoCredits: 'Autorzy zdjęć',
      skipToContent: 'Przejdź do treści',
      rulesLink: 'Zasady bazy',
      privacy: 'Przetwarzanie danych'
    },

    credits: {
      title: 'Autorzy zdjęć',
      intro: 'Baza nie ma jeszcze własnych zdjęć, dlatego na stronie są wolne fotografie prawdziwych sal prób i studiów z Wikimedia Commons. Każde jest użyte na licencji podanej obok.',
      edits: 'Zmiany we wszystkich kadrach: kadrowanie, zmniejszenie rozmiaru, konwersja do monochromu z ciepłym tonowaniem i winieta — żeby zdjęcia z różnych miejsc wyglądały jak jedna baza.',
      author: 'Autor', license: 'Licencja', open: 'Oryginał w Commons',
      room: 'Pokój {letter} · {name}', studio: 'Studio nagrań · baner na stronie głównej'
    },

    days: { short: ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'], long: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'] },
    months: ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia']
  },

  /* ======================================================================== */
  en: {
    _meta: { name: 'EN', htmlLang: 'en', dir: 'ltr' },
    _plural: {
      rooms: ['room', 'rooms'],
      hours: ['hour', 'hours'],
      free:  ['free', 'free']
    },

    nav: {
      rooms: 'Rooms', pricing: 'Pricing', studio: 'Studio', contacts: 'Contact',
      book: 'Book', menu: 'Menu', close: 'Close', lang: 'Language',
      main: 'Main navigation'
    },

    brand: { name: 'GUL', mark: 'G', tagline: 'Rehearsal rooms and studio · Wrocław' },

    footer: { nav: 'Sections', contacts: 'Contact', hours: 'Opening hours', rights: 'All rights reserved' },

    pages: {
      homeTitle: 'GUL — rehearsal rooms and recording studio in Wrocław',
      homeDesc: 'Four rehearsal rooms in the basement of an old factory in Wrocław. Tama drums, combos, mixer. From 30 zł an hour, 25% cheaper at night. Book online, no messaging.',
      roomsTitle: 'Rooms — GUL, rehearsal base in Wrocław',
      roomsDesc: 'Four rehearsal rooms from 12 to 42 m². Filter by equipment, area, price and time of day.',
      roomDesc: 'Equipment, price and a week of availability. Pick consecutive free hours and book in a minute.',
      pricingTitle: 'Pricing and passes — GUL',
      pricingDesc: 'Hourly rates: day, evening, night and weekend. Passes for 8, 16 and 32 hours. Worth-it calculator.',
      aboutTitle: 'About and contact — GUL, Wrocław',
      aboutDesc: 'How the GUL rehearsal base started, house rules, address and phone. Entrance from the yard, black door with no sign.',
      bookedTitle: 'Request received — GUL',
      notfoundTitle: 'Page not found — GUL',
      creditsTitle: 'Photo credits — GUL'
    },

    hero: {
      h1: 'A basement where loud is fine',
      sub: '4 rooms, Tama drums, an honest 40 zł an hour by day. Entrance from the yard, black door, no sign.',
      ctaRooms: 'See the rooms',
      ctaNearest: 'Nearest free slot',
      statusLabel: 'Right now',
      statusFree: '{n} of {total} free',
      statusNone: 'all rooms taken',
      statusClosed: 'closed until 10:00'
    },

    nearest: {
      title: 'Nearest free slots',
      sub: 'Tap a slot — the booking panel opens with the time already picked.',
      empty: 'Nothing free left today. Check tomorrow in the room schedule.',
      today: 'today', tomorrow: 'tomorrow'
    },

    roomsBlock: {
      title: 'Pick where to make noise',
      sub: 'Four rooms for different line-ups and different budgets.',
      all: 'All rooms and filters',
      from: 'from', perHour: 'zł/hour',
      area: 'm²', capacity: 'up to {n} people',
      choose: 'Pick a time'
    },

    gear: {
      title: 'What is already in the rooms',
      sub: 'You do not have to bring your own. Everything is tuned and working — we check it before every shift.',
      drums: 'Tama drum kit', drumsNote: 'Heads replaced every two months',
      combos: 'Marshall and Ampeg combos', combosNote: 'Guitar and bass in three rooms',
      mixer: 'Behringer 16-channel mixer', mixerNote: 'Room C, fully patched',
      monitors: 'Vocal monitors', monitorsNote: 'Up to four points in the big room',
      mics: 'Shure microphones', micsNote: 'With stands and cables',
      keys: 'Yamaha keyboard', keysNote: 'Plus interface and headphones'
    },

    pricingBlock: {
      title: 'Prices with no asterisks',
      hour: 'Hour', hourNote: 'Daytime, 10:00 to 17:00',
      night: 'Night', nightNote: '23:00 to 06:00, minus 25%',
      pass: 'Pass', passNote: '16 hours a month, saves 160 zł',
      more: 'Full pricing'
    },

    night: {
      title: 'At 23:00 the price drops. We have no neighbours.',
      text: 'The basement sits in a free-standing hall of an old factory. The nearest flats are behind the fence, three hundred metres away. The night shift runs at full volume and costs a quarter less than daytime.',
      cta: 'Take a night slot'
    },

    studio: {
      title: 'Recording studio',
      text: 'Cut a demo, mix a track, capture a live rehearsal on two mics. We work with what you play, not with what is currently in fashion.',
      cta: 'Record a demo',
      price: '120 zł/hour with an engineer',
      photoAlt: 'Studio control room with a large desk, monitors and a window into the live room'
    },

    reviews: {
      title: 'What bands say',
      items: [
        { text: 'Came in from Poznań for one evening, booked in 10 minutes from a phone on the train. Drums tuned, everything working.', author: 'Mark', band: 'band “Sluda”' },
        { text: 'We have rehearsed here for two years on a pass. Room C is the only place in town that fits our six-piece.', author: 'Ania', band: '“Fifth Floor”' },
        { text: 'Recorded a demo in one night. The engineer did not try to turn us into somebody else.', author: 'Dima', band: 'solo project' }
      ],
      prev: 'Previous review', next: 'Next review'
    },

    faq: {
      title: 'Questions',
      items: [
        { q: 'Can I bring my own combo?', a: 'Yes, at no extra cost. There is room and there are sockets. If you are bringing a lot of gear, mention it when booking and we will leave five minutes for loading in.' },
        { q: 'Is there parking?', a: 'Three spots in the yard, first come first served — we do not reserve them. After 18:00 the stretch along the factory fence is free and a minute away on foot.' },
        { q: 'What about noise at night?', a: 'Nothing to worry about. The basement is in a free-standing hall with no residential buildings nearby. At night we play at full volume with no decibel limit.' },
        { q: 'Running late or need to cancel?', a: 'Call us. Cancelling more than 3 hours ahead costs nothing, the slot simply frees up. Being late does not extend your slot — the next band is already in the corridor.' },
        { q: 'How do I pay?', a: 'On site, cash or card. There is no online payment and we are not planning one — it is simpler for everybody.' }
      ]
    },

    map: {
      title: 'How to get here',
      note: 'Entrance from the yard. Black door with no sign, to the left of the gate. If you are standing at the facade with windows, walk around the building.',
      placeholder: 'Map goes here',
      photoPlaceholder: 'Photo of the entrance',
      hoursTitle: 'Opening hours',
      hoursValue: 'Every day, 10:00 — 06:00'
    },

    catalog: {
      title: 'Rooms',
      count: '{n} {rooms}',
      filters: 'Filters',
      area: 'Area', areaS: 'up to 20 m²', areaM: '20–35 m²', areaL: '35+ m²',
      gear: 'Equipment', gearDrums: 'Drums', gearBass: 'Bass combo', gearMics: 'Microphones', gearMixer: 'Mixer', gearKeys: 'Keyboard',
      price: 'Price per hour', priceTo: 'up to {n} zł',
      time: 'Time of day', timeDay: 'Day', timeEvening: 'Evening', timeNight: 'Night',
      onlyFree: 'Only free today',
      sort: 'Sort', sortPrice: 'By price', sortArea: 'By area', sortPopular: 'By popularity',
      reset: 'Clear all', resetOne: 'Remove filter',
      activeFilters: 'Active filters',
      emptyTitle: 'No rooms match these filters',
      emptyText: 'Try dropping one condition — the drums requirement or the price limit, for example.',
      emptyCta: 'Clear filters',
      freeToday: 'Free today',
      busyUntil: 'Busy until {time}',
      busyAllDay: 'Fully booked today'
    },

    room: {
      back: 'All rooms',
      specs: 'Specs',
      areaLabel: 'Area', ceilingLabel: 'Ceiling', soundLabel: 'Soundproofing', capacityLabel: 'Capacity',
      soundValue: 'Fully treated', capacityValue: 'up to {n} people', meters: 'm',
      photoBy: 'Photo',
      slotsTaken: 'Someone took those hours while you were choosing. Pick another time — the schedule has refreshed.',
      equipment: 'What is in the room',
      schedule: 'This week',
      scheduleHint: 'Pick consecutive hours — a booking goes as one block. To start over, tap any free hour away from your selection.',
      legendFree: 'Free', legendBusy: 'Busy', legendPicked: 'Picked', legendClosed: 'Closed',
      dayPickerLabel: 'Day',
      rules: 'Room rules',
      others: 'Other rooms',
      priceFrom: 'Price', perHour: 'zł/hour',
      tariffDay: 'Day', tariffEvening: 'Evening +30%', tariffNight: 'Night −25%'
    },

    booking: {
      title: 'Booking',
      empty: 'Pick hours in the schedule — the total adds up by itself.',
      selected: '{n} {hours} picked',
      duration: 'Duration',
      total: 'Total',
      when: 'When',
      room: 'Room',
      name: 'Your name', namePlaceholder: 'Name',
      phone: 'Phone', phonePlaceholder: '+48 600 000 000',
      band: 'Band name', bandPlaceholder: 'Optional',
      comment: 'Comment', commentPlaceholder: 'What you are bringing, when you will arrive',
      sticks: 'I need drumsticks (+5 zł)',
      consent: 'I agree to my data being processed to confirm the booking',
      submit: 'Book it',
      submitting: 'Sending…',
      note: 'We will call back within the hour. At night — in the morning.',
      errName: 'Give us a name — otherwise we will not know who to expect',
      errPhone: 'Enter a phone number, otherwise we cannot confirm',
      errPhoneFormat: 'That number looks like a typo. Check the digits',
      errConsent: 'Without consent we cannot store the request',
      errSlots: 'Pick your hours in the schedule first',
      errSend: 'The request did not go through. Check your connection and try again'
    },

    pricing: {
      title: 'Pricing and passes',
      sub: 'One rate per room hour. No hidden charges for a second guitarist or for the lights.',
      tableTitle: 'Hourly rate',
      colTariff: 'Tariff', colTime: 'Hours', colCoef: 'Multiplier', colRange: 'Price per hour',
      rowDay: 'Day', rowDayTime: '10:00 — 17:00',
      rowEvening: 'Evening', rowEveningTime: '17:00 — 23:00',
      rowNight: 'Night', rowNightTime: '23:00 — 06:00',
      rowWeekend: 'Weekend', rowWeekendTime: 'Sat and Sun, daytime hours',
      base: 'base',
      tableNote: 'The range depends on the room: “Closet” is 30 zł, “Big” is 85 zł an hour.',
      passesTitle: 'Passes',
      passesSub: 'Hours are valid for a month and can be spent in any room at any time.',
      passHours: '{n} {hours} a month',
      passPopular: 'Most people take this',
      passSave: 'Saves {n} zł',
      passRate: '{n} zł per hour',
      passCta: 'Buy a pass',
      calcTitle: 'Worth-it calculator',
      calcSub: 'Move the slider — we will show where a pass gets cheaper than paying by the hour.',
      calcLabel: 'Hours per month',
      calcHourly: 'By the hour',
      calcPass: 'With a pass',
      calcBest: 'Matching pass',
      calcSave: 'Difference',
      calcNoPass: 'At this volume a pass is not worth it — paying by the hour is cheaper.',
      servicesTitle: 'Separate services',
      svcDemo: 'Demo recording', svcDemoNote: 'With an engineer, any room',
      svcMix: 'Track mixing', svcMixNote: 'Up to three revisions included',
      svcSticks: 'Drumsticks', svcSticksNote: 'A pair, per shift',
      svcCable: 'Cable or stand', svcCableNote: 'Rented per shift',
      perHour: 'zł/hour', perTrack: 'zł/track', perItem: 'zł/item'
    },

    about: {
      title: 'About the base',
      p1: 'The three of us played in different Wrocław bands and spent about ten years looking for somewhere to rehearse without being asked to turn it down. In 2021 we found the basement of an old factory hall on Fabryczna: concrete, damp, and not a single neighbour within three hundred metres.',
      p2: 'We spent a year treating it by hand — mineral wool, plasterboard, carpet from a clearance sale. Combos and drums came from classified ads, some of it towed in from Germany on a trailer. The first band turned up to rehearse before we had finished the door.',
      p3: 'There are four rooms now, and we still tune the drums ourselves and still open up at three in the morning. This site exists for one reason: the Instagram messages stopped fitting in our heads and we started losing your requests.',
      foundersTitle: 'Who is here',
      f1: 'Marek', f1role: 'bass, fixing everything',
      f2: 'Wladek', f2role: 'drums, the schedule',
      f3: 'Asia', f3role: 'sound, the studio',
      photoPlaceholder: 'Portrait',
      rulesTitle: 'House rules',
      rules: [
        'Your own gear is welcome. Nobody else’s gets touched without asking.',
        'Smoking in the yard only — the rooms have no extraction and smoke stays in the foam.',
        'Whoever spills it on the gear pays for it. Drinks go on the floor, not on the combo.',
        'Slots end on time. We wrap up five minutes before the hour — the next band is already in the corridor.',
        'A broken head or string gets mentioned, not hidden. They are consumables, nobody gets shouted at.'
      ],
      contactsTitle: 'Contact',
      phoneLabel: 'Phone', emailLabel: 'Email', addressLabel: 'Address', hoursLabel: 'Opening hours',
      formTitle: 'Ask a question',
      formSub: 'If it is not about a specific slot, write here.',
      formMessage: 'Question', formMessagePlaceholder: 'What would you like to know',
      formSubmit: 'Send',
      formSent: 'Question sent. We will answer during working hours.',
      formErrMessage: 'Write your question — we cannot read an empty message'
    },

    booked: {
      title: 'Request received',
      sub: 'We will call back within the hour. At night — in the morning.',
      numberLabel: 'Booking number',
      whatLabel: 'What you booked',
      reminderTitle: 'Do not lose the entrance',
      reminder: 'Entrance from the yard. Black door with no sign, to the left of the gate. If you are standing at the facade with windows, walk around the building.',
      cancelTitle: 'Plans changed?',
      cancel: 'Call before the slot starts and we will cancel, no questions. More than 3 hours ahead costs nothing.',
      home: 'Home',
      more: 'Book another slot',
      lost: 'No booking data found. The page may have been opened directly.'
    },

    notfound: {
      code: '404',
      title: 'We do not have that room',
      text: 'This page got lost somewhere between the hall and the basement. It happens.',
      home: 'Home',
      rooms: 'To the rooms'
    },

    common: {
      loading: 'Loading the schedule…',
      loadingShort: 'Loading…',
      errorTitle: 'Could not load the data',
      errorText: 'Looks like the connection dropped. Try again — it only takes a moment.',
      retry: 'Try again',
      zl: 'zł',
      demoNotice: 'Demo build. Availability, address and phone are placeholders, and requests are not sent anywhere. Photos are freely licensed pictures of other studios from Wikimedia Commons.',
      photoCredits: 'Photo credits',
      skipToContent: 'Skip to content',
      rulesLink: 'House rules',
      privacy: 'Data processing'
    },

    credits: {
      title: 'Photo credits',
      intro: 'The base has no photos of its own yet, so the site uses freely licensed pictures of real rehearsal rooms and studios from Wikimedia Commons. Each one is used under the licence listed next to it.',
      edits: 'Changes to every frame: cropped, resized, converted to warm-toned monochrome and vignetted, so pictures from different places read as one base.',
      author: 'Author', license: 'Licence', open: 'Original on Commons',
      room: 'Room {letter} · {name}', studio: 'Recording studio · home page banner'
    },

    days: { short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  }
};


/* ============================================================================
   ДВИЖОК
   ============================================================================ */
window.I18N = (function () {
  'use strict';

  var SUPPORTED = ['ru', 'pl', 'en'];
  var STORAGE_KEY = 'gul.lang';
  var current = 'ru';
  var listeners = [];

  /* --- определение языка ------------------------------------------------- */
  function detect() {
    var fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl && SUPPORTED.indexOf(fromUrl) !== -1) {
      /* Язык из адреса запоминаем: человек пришёл по ссылке «сайт по-польски»,
         и на второй странице он должен остаться польским, а не откатиться
         к сохранённому или языку браузера. */
      try { localStorage.setItem(STORAGE_KEY, fromUrl); } catch (e) { /* приватный режим */ }
      return fromUrl;
    }

    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) { /* приватный режим — просто идём дальше */ }

    var nav = (navigator.language || 'ru').slice(0, 2).toLowerCase();
    if (SUPPORTED.indexOf(nav) !== -1) return nav;
    // украиноязычному и белорусскоязычному посетителю русский ближе английского
    if (nav === 'uk' || nav === 'be') return 'ru';
    return 'ru';
  }

  /* --- доступ к значению по ключу «a.b.c» -------------------------------- */
  function raw(key, lang) {
    var dict = window.GUL_I18N[lang || current];
    var parts = key.split('.');
    var value = dict;
    for (var i = 0; i < parts.length; i++) {
      if (value == null) return null;
      value = value[parts[i]];
    }
    return value === undefined ? null : value;
  }

  /* --- славянская форма множественного числа ----------------------------- */
  function pluralIndex(n, lang) {
    if (lang === 'en') return n === 1 ? 0 : 1;
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return 0;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 1;
    return 2;
  }

  function plural(n, formsKey) {
    var forms = window.GUL_I18N[current]._plural[formsKey];
    if (!forms) return '';
    return forms[Math.min(pluralIndex(n, current), forms.length - 1)];
  }

  /* --- перевод с подстановкой {n}, {total}, {hours} ---------------------- */
  function t(key, vars) {
    var value = raw(key);
    if (value === null) {
      // Ключ потерялся — отдаём его же, чтобы дыра была видна, а не молчала
      return key;
    }
    if (typeof value !== 'string') return value;
    if (!vars) return value;

    return value.replace(/\{(\w+)\}/g, function (match, name) {
      if (name === 'rooms' || name === 'hours' || name === 'free') {
        return plural(Number(vars.n) || 0, name);
      }
      return vars[name] !== undefined ? vars[name] : match;
    });
  }

  /* --- применение переводов к разметке ----------------------------------- */
  function apply(root) {
    var scope = root || document;

    scope.querySelectorAll('[data-i18n]').forEach(function (el) {
      var value = t(el.getAttribute('data-i18n'));
      if (typeof value === 'string') el.textContent = value;
    });

    // data-i18n-attr="placeholder:booking.namePlaceholder;aria-label:nav.menu"
    scope.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length !== 2) return;
        var value = t(bits[1].trim());
        if (typeof value === 'string') el.setAttribute(bits[0].trim(), value);
      });
    });

    // <html lang> — нужен и скринридерам, и переносам слов
    document.documentElement.lang = window.GUL_I18N[current]._meta.htmlLang;
  }

  function set(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    current = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* не критично */ }
    apply();
    listeners.forEach(function (fn) { fn(lang); });
  }

  function onChange(fn) { listeners.push(fn); }

  /* --- локализованные данные комнаты ------------------------------------- */
  function pick(field) {
    if (!field) return '';
    return field[current] || field.ru || '';
  }

  /* --- дата в человеческом виде ------------------------------------------ */
  function formatDate(date, style) {
    var dict = window.GUL_I18N[current];
    if (style === 'weekdayShort') return dict.days.short[date.getDay()];
    if (style === 'weekdayLong') return dict.days.long[date.getDay()];
    if (style === 'dayMonth') {
      if (current === 'en') return dict.months[date.getMonth()] + ' ' + date.getDate();
      return date.getDate() + ' ' + dict.months[date.getMonth()];
    }
    return date.getDate() + '.' + String(date.getMonth() + 1).padStart(2, '0');
  }

  current = detect();

  return {
    t: t, apply: apply, set: set, onChange: onChange, pick: pick,
    plural: plural, formatDate: formatDate,
    get lang() { return current; },
    supported: SUPPORTED
  };
})();
