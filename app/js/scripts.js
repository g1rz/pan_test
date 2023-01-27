document.addEventListener("DOMContentLoaded", function(event) { 
    slider();
    let selector = new SelectorItem('.selector');

    let progressbar = new ProgressbarItem('.progressbar-wrap');
    
    moreBlock();

    toTop();

    yandexMap();
});

function slider() {
    let slider = new Swiper(".s-slider", {
        slidesPerView: "auto",
        spaceBetween: 30,
        navigation: {
            nextEl: ".s-slider-nav--next",
            prevEl: ".s-slider-nav--prev",
        },
        pagination: {
            el: ".s-slider-dots",
        },
    });
}

class SelectorItem {
    constructor(selector) {
        // this.options = Object.assign(defaultOptions, options);
        this.selector = selector;
        this.selectorItem = document.querySelector(selector);

        if (this.selectorItem) {
            this.input = this.selectorItem.querySelector('.selector__input');
            this.head = this.selectorItem.querySelector('.selector__head');
            this.listItems = this.selectorItem.querySelectorAll('.selector__list-item');
        } else {
            console.error(`Селектор ${selector} не найден!`);
            return
        }

        // this.init();
        this.events();
    }

    // init() {
    //     console.log(this.selectorItem);
    // }

    events() {
        this.selectorItem.addEventListener('click', (e) => {
            this.selectorItem.classList.toggle('active');
        });

        this.listItems.forEach((el => {
            el.addEventListener('click', (e) => {
                let text = e.target.textContent ;

                this.input.val = text;
                this.head.textContent  = text;
            });
        }));

        document.addEventListener('click', (e) => {
            const path = e.path || (e.composedPath && e.composedPath());
            if (!path.includes(this.selectorItem)) {
                this.selectorItem.classList.remove('active');
            }
        });
    }
}

class ProgressbarItem {

    constructor(selector) {
        this.selector = selector;
        this.progressbarItem = document.querySelector(selector);

        if (this.progressbarItem) {
            this.btn = this.progressbarItem.querySelector('.progressbar-btn');
            this.line = this.progressbarItem.querySelector('.progressbar__inner');
            this.addWidth = +this.btn.getAttribute('data-add');
        } else {
            console.error(`Селектор ${selector} не найден!`);
            return
        }

        this.events()
    }

    events() {
        const $progressbarBtn = document.querySelector('.progressbar-btn');
        const $prograssbarLine = document.querySelector('.progressbar__inner');
        this.btn.addEventListener('click', e => {
            
            let width = this.line.style.width;
            width = +width.replace(/%/g, '');
            let newWidth = width + this.addWidth;

            newWidth = newWidth > 100 ? 100 : newWidth;

            this.line.style.width = newWidth + '%';
            this.line.textContent = newWidth + ' %';
        });
    }
    
}

function moreBlock() {
    const $list = document.querySelectorAll('.more-block');

    $list.forEach(el => {
        const $button = el.querySelector('.more-block__toggle');
        el.addEventListener('click', function() {
            this.classList.toggle('active');
            $button.classList.toggle('active');
        });
    });
}

function toTop() {
    function trackScroll() {
      let scrolled = window.pageYOffset;
      let coords = document.documentElement.clientHeight;
  
      if (scrolled > coords) {
        goTopBtn.classList.add('active');
      }
      if (scrolled < coords) {
        goTopBtn.classList.remove('active');
      }
    }
  
    function backToTop() {
      if (window.pageYOffset > 0) {
        window.scrollBy(0, -80);
        setTimeout(backToTop, 0);
      }
    }
  
    let goTopBtn = document.querySelector('.top');
  
    window.addEventListener('scroll', trackScroll);
    goTopBtn.addEventListener('click', backToTop);
}
  

function yandexMap() {
    ymaps.ready(init);
    function init(){
        // Создание карты.
        var myMap = new ymaps.Map("map", {
          
            center: [59.930399, 30.350732],
         
            zoom: 16,
            controls: []
        });

      
        var MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="popover">' +
                '<div class="popover__arrow"></div>' +
                '<div class="popover-inner">' +
                '$[[options.contentLayout observeSize minWidth=235 maxWidth=235]]' +
                '</div>' +
                '</div>', {
                
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

                    if(!this._isElement(this._$element)) {
                        return;
                    }
                    this.applyElementOffset();
                    this.events.fire('shapechange');
                },

               
                applyElementOffset: function () {
                    this._$element.style.top = -(this._$element.offsetHeight) + 'px';
                    this._$element.style.left = 0;
                },

              
                onCloseClick: function (e) {
                    e.preventDefault();

                    this.events.fire('userclose');
                },

                getShape: function () {
                    if(!this._isElement(this._$element)) {
                        return MyBalloonLayout.superclass.getShape.call(this);
                    }

                    var position = this._$element.getBoundingClientRect()//.position();

                    return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                        [position.left, position.top], [
                            position.left + this._$element.offsetWidth,
                            position.top + this._$element.offsetHeight + this._$element.querySelector('.arrow').offsetHeight
                        ]
                    ]));
                },

                
                _isElement: function (element) {
                    return element && element && element.querySelector('.arrow');
                }
            }),


        MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<p class="popover__title">$[properties.balloonHeader]</p>' +
            '<div class="popover__content">$[properties.balloonContent]</div>' +
            '<div class="popover__footer">$[properties.balloonFooter]</div>'
        );


        var myPlacemark = window.myPlacemark = new ymaps.Placemark([59.928194, 30.346644], {
            // Чтобы балун и хинт открывались на метке, необходимо задать ей определенные свойства.
            balloonHeader: "Наш адрес",
            balloonContent: "Санкт-Петербург, Владимирский проспект, 23, лит. А, офис 701",
            balloonFooter: '<a class="link" href="#">Схема проезда</a>',
        }, {
            balloonShadow: false,
            balloonLayout: MyBalloonLayout,
            balloonContentLayout: MyBalloonContentLayout,
            balloonPanelMaxMapArea: 0
        });

        myMap.geoObjects.add(myPlacemark);
        myPlacemark.balloon.open();
    
    }
}


  