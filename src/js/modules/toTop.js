export default function toTop() {
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
