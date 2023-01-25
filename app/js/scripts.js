document.addEventListener("DOMContentLoaded", function(event) { 
    slider();
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

