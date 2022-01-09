function burgerMenu(icon) {
    icon.classList.toggle("change");
}
$(document).ready(function () {
    $('.owl-carousel_1').owlCarousel({
        loop: true,
        margin: 24,
        nav: true,
        navText: ['', ' '],

        responsive: {
            0: {
                items: 1.2
            },

            1000: {
                items: 3
            }
        }
    });

    if ($(window).width() < 992) {
        $('.owl-carousel_2').owlCarousel({
            loop: true,
            margin: 24,
            nav: true,
            navText: ['', ' '],

            responsive: {
                0: {
                    items: 1
                },

                1000: {
                    items: 3
                }
            }
        })
    } else {
        $('.owl-carousel_2').owlCarousel('destroy')
    }
});


