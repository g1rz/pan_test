import slider from './modules/slider.js';
import SelectorItem from './modules/SelectorItem.js';
import ProgressbarItem from './modules/ProgressbarItem.js';
import moreBlock from './modules/moreBlock.js';
import toTop from './modules/toTop.js';
import yandexMap from './modules/yandexMap.js';

document.addEventListener('DOMContentLoaded', function (event) {
    slider();
    let selector = new SelectorItem('.selector');

    let progressbar = new ProgressbarItem('.progressbar-wrap');

    moreBlock();

    toTop();

    yandexMap();
});
