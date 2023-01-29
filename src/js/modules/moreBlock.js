export default function moreBlock() {
    const $list = document.querySelectorAll('.more-block');

    $list.forEach((el) => {
        const $button = el.querySelector('.more-block__toggle');
        el.addEventListener('click', function () {
            this.classList.toggle('active');
            $button.classList.toggle('active');
        });
    });
}
