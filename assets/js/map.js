/* Карта проезда.
   ============================================================================
   Готовый кадр с openstreetmap.org (iframe) не подошёл: в его нижней полосе
   стоит чужая просьба о пожертвовании, и на сайте базы ей не место. Поэтому
   карта собирается здесь сама — библиотекой Leaflet, которая лежит в
   assets/vendor. Со стороны подгружаются только сами плитки карты.

   Подпись «© OpenStreetMap» убирать нельзя: это условие лицензии данных.
   Убрана только реклама и служебные ссылки самого сайта osm.org.

   Плитки грузятся не сразу, а когда человек долистал до блока: до этого
   момента ни одного запроса наружу не уходит. */
(function () {
  'use strict';

  var TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  function build(box) {
    if (box.dataset.ready) { return; }
    box.dataset.ready = '1';

    var lat = parseFloat(box.getAttribute('data-lat'));
    var lon = parseFloat(box.getAttribute('data-lon'));
    var zoom = parseInt(box.getAttribute('data-zoom'), 10) || 16;

    /* Библиотека не загрузилась или координаты битые — оставляем то, что
       уже лежит внутри блока: адрес и ссылку на карту. Пустой рамки на
       месте карты человек не должен увидеть никогда. */
    if (isNaN(lat) || isNaN(lon) || typeof L === 'undefined') { return; }

    /* Запасной текст убираем только теперь, когда карта точно строится */
    box.innerHTML = '';

    var map = L.map(box, {
      center: [lat, lon],
      zoom: zoom,
      /* Колесо мыши масштабирует карту только после клика по ней. Иначе
         человек, прокручивающий страницу, застревает в карте. */
      scrollWheelZoom: false
    });

    map.attributionControl.setPrefix('');

    L.tileLayer(TILES, {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
    }).addTo(map);

    /* Метка — кружок фирменного цвета, а не стандартная синяя булавка:
       плитки вывернуты в тёмное, и обычная булавка выглядела бы чужой. */
    L.circleMarker([lat, lon], {
      radius: 9,
      color: '#0b0b0b',
      weight: 3,
      fillColor: '#d8f34a',
      fillOpacity: 1
    }).addTo(map);

    map.on('focus', function () { map.scrollWheelZoom.enable(); });
    map.on('blur', function () { map.scrollWheelZoom.disable(); });
  }

  function start() {
    var boxes = document.querySelectorAll('[data-map]');
    if (!boxes.length) { return; }

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(boxes, build);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          build(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px' });

    Array.prototype.forEach.call(boxes, function (box) { io.observe(box); });
  }

  document.addEventListener('DOMContentLoaded', start);
}());
