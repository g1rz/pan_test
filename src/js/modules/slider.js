import Swiper, { Navigation, Pagination } from 'swiper';

export default function slider() {
    let slider = new Swiper('.s-slider', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        navigation: {
            nextEl: '.s-slider-nav--next',
            prevEl: '.s-slider-nav--prev',
        },
        pagination: {
            el: '.s-slider-dots',
        },
        modules: [Navigation, Pagination],
    });

    console.log(slider);
}
