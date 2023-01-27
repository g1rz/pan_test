document.addEventListener("DOMContentLoaded", function(event) { 
    slider();
    let selector = new SelectorItem('.selector');

    let progressbar = new ProgressbarItem('.progressbar-wrap');
    
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