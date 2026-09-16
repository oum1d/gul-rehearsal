/* ============================================================================
   ГУЛ — данные комнат, тарифов и занятости
   ----------------------------------------------------------------------------
   ВНИМАНИЕ. Это единственный источник данных сайта. Правится только здесь.

   Почему .js, а не .json:
   при открытии сайта двойным кликом (протокол file://) браузеры блокируют
   fetch() локальных файлов политикой CORS — rooms.json просто не загрузится.
   Внутри этого файла лежит обычный JSON, обёрнутый одной строкой присваивания.
   Чтобы перейти на настоящий rooms.json при заливке на хостинг — удалите
   строку `window.GUL_DATA =` и последнюю `;`, переименуйте файл в .json
   и включите режим fetch в assets/js/api.js (там это одна константа).

   МОДЕЛЬ ВРЕМЕНИ
   База работает с 10:00 до 06:00 следующих суток. Чтобы ночные часы не
   «перепрыгивали» через полночь в отдельную дату, слоты пронумерованы
   сквозным индексом от 10 до 29:
       10..23  →  10:00 .. 23:00 текущих суток
       24..29  →  00:00 .. 05:00 следующих суток
   Такой «операционный день» позволяет считать смежность слотов простым
   сложением, включая переход через полночь.

   ТАРИФНЫЕ ОКНА (индексы слотов)
       10..16  день    ×1.00   (10:00–17:00)
       17..22  вечер   ×1.30   (17:00–23:00)
       23..29  ночь    ×0.75   (23:00–06:00)
   В выходные дневные слоты считаются по вечернему коэффициенту.
   ============================================================================ */

window.GUL_DATA = {

  /* --- Расписание работы ------------------------------------------------- */
  schedule: {
    firstSlot: 10,        // 10:00 — открытие
    lastSlot: 29,         // 05:00 следующих суток — последний час брони
    daysAhead: 14,        // горизонт бронирования
    tariffs: {
      day:     { from: 10, to: 16, coef: 1.00 },
      evening: { from: 17, to: 22, coef: 1.30 },
      night:   { from: 23, to: 29, coef: 0.75 }
    },
    // В субботу и воскресенье дневные часы идут по вечернему коэффициенту.
    // ДОПУЩЕНИЕ: в брифе строка «Выходные» есть, коэффициент не задан.
    weekendDayCoef: 1.30
  },

  /* --- Комнаты ------------------------------------------------------------
     ФОТОГРАФИИ — ВРЕМЕННЫЕ. Своих снимков у базы пока нет, поэтому стоят
     свободные фотографии с Wikimedia Commons: настоящие репетиционные и
     студии, а не сгенерированные картинки. Авторы и лицензии — в поле
     photoCredits ниже и на странице credits.html.

     Серия собрана так, чтобы читаться как одно здание: «Малая» и
     «Барабанная» — две комнаты одного подвала, «Большая», «Каморка» и
     студия — один студийный комплекс. Все кадры одинаково переведены в
     тёплый монохром (настройки — tools/photos.json → grade).

     Правило обложки: первый кадр всегда показывает комнату целиком,
     а не крупный план аппарата — по карточке человек выбирает помещение.

     photos — кадры галереи, первый идёт обложкой в карточку комнаты.
     file — база имени: на сайте лежат file-lg.jpg (галерея) и file-sm.jpg
     (карточки и миниатюры). Готовит их tools/prepare-photos.ps1.
     Если photos пустой, карточка рисует типографическую заглушку.
     ---------------------------------------------------------------------- */
  rooms: [
    {
      id: 'a',
      letter: 'A',
      price: 40,
      area: 16,
      capacity: 4,
      ceiling: 2.6,
      popularity: 76,
      photos: [
        { file: 'a-1', alt: { ru: 'Комната A: комбики у дальней стены, ковёр, стойки микрофонов', pl: 'Pokój A: comba pod tylną ścianą, dywan, statywy mikrofonowe', en: 'Room A: combos against the back wall, a rug and mic stands' } },
        { file: 'a-2', alt: { ru: 'Кабинет Marshall и рэк с усилителем, микрофон у динамика', pl: 'Kolumna Marshall i rack ze wzmacniaczem, mikrofon przy głośniku', en: 'Marshall cabinet and amp rack with a mic at the speaker' } },
        { file: 'a-3', alt: { ru: 'Ручки гитарного комбика крупным планом', pl: 'Pokrętła comba gitarowego z bliska', en: 'Guitar combo knobs up close' } },
        { file: 'a-4', alt: { ru: 'Гитарные усилители и процессоры в рэке', pl: 'Wzmacniacze i procesory gitarowe w racku', en: 'Guitar amps and processors in a rack' } }
      ],
      tags: ['bass', 'mics'],
      name: { ru: 'Малая',  pl: 'Mała',  en: 'Small' },
      equipment: {
        ru: ['Гитарный комбик Marshall', 'Басовый комбик Ampeg', '2 микрофона Shure SM58', '2 стойки, кабели'],
        pl: ['Combo gitarowe Marshall', 'Combo basowe Ampeg', '2 mikrofony Shure SM58', '2 statywy, kable'],
        en: ['Marshall guitar combo', 'Ampeg bass combo', '2× Shure SM58 microphones', '2 stands, cables']
      },
      about: {
        ru: 'Комната для дуэта или репетиции без ударных. Плотная обшивка, сухой звук, ничего лишнего.',
        pl: 'Pokój dla duetu albo próby bez perkusji. Gęste wygłuszenie, suchy dźwięk, nic zbędnego.',
        en: 'A room for a duo or a rehearsal without drums. Dense soundproofing, dry sound, nothing extra.'
      }
    },
    {
      id: 'b',
      letter: 'B',
      price: 60,
      area: 28,
      capacity: 5,
      ceiling: 2.8,
      popularity: 95,
      photos: [
        { file: 'b-1', alt: { ru: 'Комната B: барабанная установка, комбик и ковёр в подвале', pl: 'Pokój B: perkusja, combo i dywan w piwnicy', en: 'Room B: drum kit, an amp and a rug in the basement' } },
        { file: 'b-2', alt: { ru: 'Барабанная установка, вид сверху', pl: 'Perkusja, widok z góry', en: 'Drum kit seen from above' } },
        { file: 'b-3', alt: { ru: 'Томы и тарелки крупным планом', pl: 'Tomy i talerze z bliska', en: 'Toms and cymbals up close' } },
        { file: 'b-4', alt: { ru: 'Тарелки и микрофон над установкой', pl: 'Talerze i mikrofon nad perkusją', en: 'Cymbals and a microphone over the kit' } }
      ],
      tags: ['drums', 'monitors', 'mics'],
      name: { ru: 'Барабанная', pl: 'Perkusyjna', en: 'Drum Room' },
      equipment: {
        ru: ['Барабаны Tama Imperialstar', 'Тарелки Zildjian', '2 гитарных комбика', 'Вокальный монитор', '2 микрофона'],
        pl: ['Perkusja Tama Imperialstar', 'Talerze Zildjian', '2 comba gitarowe', 'Monitor wokalny', '2 mikrofony'],
        en: ['Tama Imperialstar drum kit', 'Zildjian cymbals', '2 guitar combos', 'Vocal monitor', '2 microphones']
      },
      about: {
        ru: 'Самая занятая комната базы. Барабаны настроены, пластики меняем раз в два месяца. Свои палочки или берите наши.',
        pl: 'Najbardziej obłożony pokój bazy. Perkusja nastrojona, naciągi wymieniamy co dwa miesiące. Pałki własne albo nasze.',
        en: 'The busiest room in the base. Drums are tuned, heads replaced every two months. Bring your sticks or take ours.'
      }
    },
    {
      id: 'c',
      letter: 'C',
      price: 85,
      area: 42,
      capacity: 8,
      ceiling: 3.2,
      popularity: 88,
      photos: [
        { file: 'c-1', alt: { ru: 'Комната C: большой зал с подиумом под барабаны и стойками микрофонов', pl: 'Pokój C: duża sala z podestem na perkusję i statywami mikrofonów', en: 'Room C: large hall with a drum riser and microphone stands' } },
        { file: 'c-2', alt: { ru: 'Барабаны на подиуме между акустическими щитами', pl: 'Perkusja na podeście między panelami akustycznymi', en: 'Drums on a riser between acoustic panels' } },
        { file: 'c-3', alt: { ru: 'Большой микшерный пульт в аппаратной', pl: 'Duży mikser w reżyserce', en: 'Large mixing desk in the control room' } },
        { file: 'c-4', alt: { ru: 'Катушечный магнитофон в аппаратной', pl: 'Magnetofon szpulowy w reżyserce', en: 'Reel-to-reel tape machine in the control room' } }
      ],
      tags: ['drums', 'bass', 'mics', 'mixer', 'monitors'],
      name: { ru: 'Большая', pl: 'Duża', en: 'Big' },
      equipment: {
        ru: ['Полный бэклайн', 'Барабаны Tama + подзвучка', 'Пульт Behringer, 16 каналов', '4 вокальных монитора', '4 микрофона, стойки'],
        pl: ['Pełny backline', 'Perkusja Tama z nagłośnieniem', 'Mikser Behringer, 16 kanałów', '4 monitory wokalne', '4 mikrofony, statywy'],
        en: ['Full backline', 'Tama drums, miked up', 'Behringer 16-channel mixer', '4 vocal monitors', '4 microphones, stands']
      },
      about: {
        ru: 'Единственная комната в городе, где помещается состав из шести человек и никто не бьётся локтями. Годится под предконцертный прогон.',
        pl: 'Jedyny pokój w mieście, gdzie mieści się sześcioosobowy skład i nikt nie obija się łokciami. Nadaje się na próbę przed koncertem.',
        en: 'The only room in town where a six-piece band fits without elbowing each other. Works for a pre-gig run-through.'
      }
    },
    {
      id: 'd',
      letter: 'D',
      price: 30,
      area: 12,
      capacity: 2,
      ceiling: 2.4,
      popularity: 54,
      photos: [
        { file: 'd-1', alt: { ru: 'Комната D: электропиано у стены с фотографиями', pl: 'Pokój D: pianino elektryczne pod ścianą ze zdjęciami', en: 'Room D: electric piano by a wall of photos' } },
        { file: 'd-2', alt: { ru: 'Небольшая аппаратная: мониторы, пульт и кресло', pl: 'Mała reżyserka: monitory, mikser i fotel', en: 'Small control room with monitors, a desk and a chair' } },
        { file: 'd-3', alt: { ru: 'Орган Hammond и кабинет Leslie', pl: 'Organy Hammond i kolumna Leslie', en: 'Hammond organ and Leslie cabinet' } },
        { file: 'd-4', alt: { ru: 'Второй орган Hammond с кабинетом Leslie', pl: 'Drugie organy Hammond z kolumną Leslie', en: 'A second Hammond organ with its Leslie cabinet' } }
      ],
      tags: ['keys'],
      name: { ru: 'Каморка', pl: 'Klitka', en: 'Closet' },
      equipment: {
        ru: ['Клавиши Yamaha', 'Аудиоинтерфейс Focusrite', 'Наушники, 2 пары', 'Стол, свет'],
        pl: ['Klawisze Yamaha', 'Interfejs audio Focusrite', 'Słuchawki, 2 pary', 'Biurko, światło'],
        en: ['Yamaha keyboard', 'Focusrite audio interface', 'Headphones, 2 pairs', 'Desk, lamp']
      },
      about: {
        ru: 'Тихая комната под клавиши, аранжировку и работу в наушниках. Сюда же садятся писать партии перед сессией в студии.',
        pl: 'Cichy pokój na klawisze, aranżacje i pracę w słuchawkach. Tu też pisze się partie przed sesją w studiu.',
        en: 'A quiet room for keys, arranging and headphone work. Also where parts get written before a studio session.'
      }
    }
  ],

  /* --- Авторы фотографий --------------------------------------------------
     Все снимки — с Wikimedia Commons. CC BY требует указывать автора,
     лицензию и что изменено: подпись стоит под каждым кадром, полный
     список — на странице credits.html и в CREDITS.md.

     БЛОК МЕЖДУ МЕТКАМИ ПИШЕТ tools/prepare-photos.ps1 — руками не править,
     изменения затрутся при следующем запуске. Источник — credits.json.
     Когда появятся собственные фото базы, скрипт оставит блок пустым,
     и подписи авторов исчезнут сами.
     ---------------------------------------------------------------------- */
  // photoCredits:begin
  photoCredits: {
    "a-1": { author: "Gerold Schneider", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Music_practice_room_2,_Air_raid_shelter,_Stuttgart,_2013_(photo_by_Gerold_Schneider).jpg" },
    "a-2": { author: "Shixart1985", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Guitar_amp_equipment_setup_in_a_music_studio_with_amplifiers_and_microphones.jpg" },
    "a-3": { author: "Shixart1985", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Details_of_a_guitar_amplifier_showcasing_knobs_and_settings_in_a_cozy_music_studio_environment.jpg" },
    "a-4": { author: "Shixart1985", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Several_pieces_of_guitar_equipment.jpg" },
    "b-1": { author: "Gerold Schneider", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Music_practice_room_1,_Air_raid_shelter,_Stuttgart,_2013_(photo_by_Gerold_Schneider).jpg" },
    "b-2": { author: "Shixart1985", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Drums_in_the_studio_from_above.jpg" },
    "b-3": { author: "Shixart1985", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Drum_set_takes_center_stage_in_a_well-lit_studio_filled_with_musical_energy.jpg" },
    "b-4": { author: "Shixart1985", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Drum_set_ready_for_practice_in_a_music_studio_with_microphone_and_cymbals.jpg" },
    "c-1": { author: "Steve Knight", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Studio_2_drum_room_-_a_favorite_of_Cozy_Powell_(53719506547).jpg" },
    "c-2": { author: "Steve Knight", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Studio_1_Coach_house_drum_room_-_used_for_%22Heaven_%26_Hell%22_by_Black_Sabbath_(53720747914).jpg" },
    "c-3": { author: "Steve Knight", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Studio_2_48-track_desk_(53720747939).jpg" },
    "c-4": { author: "Steve Knight", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Active_2%22_tape_machine_in_Studio_2_(53720843350).jpg" },
    "d-1": { author: "Steve Knight", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Rhodes_electric_piano_(53719506642).jpg" },
    "d-2": { author: "Steve Knight", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Studio_2_control_room_(53720619853).jpg" },
    "d-3": { author: "Steve Knight", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:A_second_Hammond_and_Leslie_in_the_C,_Rockfieldoach_House_studio_(53720620008).jpg" },
    "d-4": { author: "Steve Knight", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Hammond_organ_and_Leslie_speaker_Studio_2_(53720407971).jpg" },
    "studio": { author: "Steve Knight", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Coach_House_control_room_(53720408036).jpg" }
  },
  // photoCredits:end

  /* --- Занятость ----------------------------------------------------------
     ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ. В боевой версии это место занимает запрос к
     базе данных.

     Занятость не прописана руками, а генерируется в api.js и меняется
     каждые windowHours часов (00:00, 02:00, 04:00 … по местному времени).
     Генератор детерминированный: он раскладывает брони по «зерну» из номера
     окна, комнаты и даты. Поэтому в пределах одного окна главная, каталог и
     страница комнаты показывают одно и то же — и у всех посетителей тоже.
     Настоящий Math.random() на каждой загрузке дал бы «свободно» в каталоге
     и «занято» в той же клетке на странице комнаты.

     load        — насколько комната востребована: вероятность, что на
                   свободном часе начинается бронь. «Барабанная» — самая
                   занятая, «Каморка» — самая тихая.
     timeWeight  — множитель по времени суток: вечером групп больше всего.
     lateNight   — после 02:00 бронь начинается реже, чем в начале ночи.
     weekend     — в субботу и воскресенье днём и вечером людей больше.
     blockHours  — длина брони в часах и её вероятность: чаще всего берут
                   два часа подряд, а не один.

     Проверка: ?occ=5 в адресе фиксирует окно с номером 5 — расписание
     перестаёт меняться, удобно для скриншотов и сравнения.
     ---------------------------------------------------------------------- */
  demoOccupancy: {
    windowHours: 2,
    load: { a: 0.25, b: 0.40, c: 0.30, d: 0.16 },
    timeWeight: { day: 0.55, evening: 1.45, night: 0.80 },
    lateNight: { from: 26, coef: 0.5 },
    weekend: 1.20,
    blockHours: [
      { hours: 1, chance: 0.25 },
      { hours: 2, chance: 0.50 },
      { hours: 3, chance: 0.25 }
    ]
  },

  /* --- Абонементы ---------------------------------------------------------
     16 ч = 640 zł и «экономия 160 zł» — цифры клиента. Экономия считается
     от средней почасовой ставки 50 zł. Тарифы на 8 и 32 часа выведены из
     той же логики и помечены как допущение.
     ---------------------------------------------------------------------- */
  passes: [
    { id: 'p8',  hours: 8,  price: 360,  popular: false },
    { id: 'p16', hours: 16, price: 640,  popular: true  },
    { id: 'p32', hours: 32, price: 1120, popular: false }
  ],
  passBaseRate: 50,

  /* --- Дополнительные услуги — ДОПУЩЕНИЕ, цены черновые ------------------ */
  services: [
    { id: 'demo',  price: 120, unit: 'hour'  },
    { id: 'mix',   price: 250, unit: 'track' },
    { id: 'sticks', price: 5,  unit: 'item'  },
    { id: 'cable', price: 10,  unit: 'item'  }
  ],

  /* --- Контакты — ЗАГЛУШКИ, заменить на реальные ------------------------- */
  contacts: {
    phone: '+48 500 000 000',
    phoneHref: '+48500000000',
    email: 'hello@gul.example',
    instagram: 'gul.wroclaw',
    instagramUrl: 'https://instagram.com/',
    address: { ru: 'ул. Фабрична 12, Вроцлав', pl: 'ul. Fabryczna 12, Wrocław', en: '12 Fabryczna St., Wrocław' },
    hoursShort: '10:00 — 06:00'
  }
};
