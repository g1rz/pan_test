export default function yandexMap() {
    ymaps.ready(init);
    function init() {
        // Создание карты.
        var myMap = new ymaps.Map('map', {
            center: [59.930399, 30.350732],

            zoom: 16,
            controls: ['zoomControl'],
        });

        var MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
                '<div class="popover">' +
                    '<div class="popover__arrow"></div>' +
                    '<div class="popover-inner">' +
                    '$[[options.contentLayout observeSize minWidth=235 maxWidth=235]]' +
                    '</div>' +
                    '</div>',
                {
                    build: function () {
                        this.constructor.superclass.build.call(this);
                        this._$element = document.querySelector('.popover');
                        this.applyElementOffset();
                    },

                    clear: function () {
                        this.constructor.superclass.clear.call(this);
                    },

                    onSublayoutSizeChange: function () {
                        MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

                        if (!this._isElement(this._$element)) {
                            return;
                        }
                        this.applyElementOffset();
                        this.events.fire('shapechange');
                    },

                    applyElementOffset: function () {
                        this._$element.style.top = -this._$element.offsetHeight + 'px';
                        this._$element.style.left = 0;
                    },

                    onCloseClick: function (e) {
                        e.preventDefault();

                        this.events.fire('userclose');
                    },

                    getShape: function () {
                        if (!this._isElement(this._$element)) {
                            return MyBalloonLayout.superclass.getShape.call(this);
                        }

                        var position = this._$element.getBoundingClientRect(); //.position();

                        return new ymaps.shape.Rectangle(
                            new ymaps.geometry.pixel.Rectangle([
                                [position.left, position.top],
                                [
                                    position.left + this._$element.offsetWidth,
                                    position.top +
                                        this._$element.offsetHeight +
                                        this._$element.querySelector('.arrow').offsetHeight,
                                ],
                            ]),
                        );
                    },

                    _isElement: function (element) {
                        return element && element && element.querySelector('.arrow');
                    },
                },
            ),
            MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                '<p class="popover__title">$[properties.balloonHeader]</p>' +
                    '<div class="popover__content">$[properties.balloonContent]</div>' +
                    '<div class="popover__footer">$[properties.balloonFooter]</div>',
            );

        var myPlacemark = (window.myPlacemark = new ymaps.Placemark(
            [59.928194, 30.346644],
            {
                // Чтобы балун и хинт открывались на метке, необходимо задать ей определенные свойства.
                balloonHeader: 'Наш адрес',
                balloonContent: 'Санкт-Петербург, Владимирский проспект, 23, лит. А, офис 701',
                balloonFooter: '<a class="link" href="#">Схема проезда</a>',
            },
            {
                balloonShadow: false,
                balloonLayout: MyBalloonLayout,
                balloonContentLayout: MyBalloonContentLayout,
                balloonPanelMaxMapArea: 0,
            },
        ));

        myMap.geoObjects.add(myPlacemark);
        myPlacemark.balloon.open();

        myMap.behaviors.disable('scrollZoom');
    }
}
