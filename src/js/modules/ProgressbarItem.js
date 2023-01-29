export default class ProgressbarItem {
    constructor(selector) {
        this.selector = selector;
        this.progressbarItem = document.querySelector(selector);

        if (this.progressbarItem) {
            this.btn = this.progressbarItem.querySelector('.progressbar-btn');
            this.line = this.progressbarItem.querySelector('.progressbar__inner');
            this.addWidth = +this.btn.getAttribute('data-add');
        } else {
            console.error(`Селектор ${selector} не найден!`);
            return;
        }

        this.events();
    }

    events() {
        const $progressbarBtn = document.querySelector('.progressbar-btn');
        const $prograssbarLine = document.querySelector('.progressbar__inner');
        this.btn.addEventListener('click', (e) => {
            let width = this.line.style.width;
            width = +width.replace(/%/g, '');
            let newWidth = width + this.addWidth;

            newWidth = newWidth > 100 ? 100 : newWidth;

            this.line.style.width = newWidth + '%';
            this.line.textContent = newWidth + ' %';
        });
    }
}
