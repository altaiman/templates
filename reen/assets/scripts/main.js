'use strict';

var variables = {
    header: document.querySelector('.scroll'),
    headerHeight: parseInt(getComputedStyle(document.querySelector('.header__bottom')).height),
    logotype: document.querySelector('.logotype-header'),
    banner: document.querySelector('.banner'),
    bannerList: document.querySelector('.banner__items'),
    bannerPag: document.querySelector('.banner__paginator_form'),
    carousel: document.querySelector('.carousel__list'),
    carouselPag: document.querySelector('.carousel__paginator_form'),
    transitionSpeed: 300,
    timerSpeed: 2500
};

/* FIXED HEADER */

function headerFixed() {
    if (window.outerWidth < 760) {
        variables.header.classList.remove('fixed');
        return;
    }

    if (window.pageYOffset >= 75) {
        variables.header.classList.add('fixed');
        variables.logotype.style.transform = 'scale(.5)';
    } else {
        variables.logotype.style.transform = '';
        variables.header.classList.remove('fixed');
    }
    if (window.pageYOffset >= variables.headerHeight) {
        variables.header.style.boxShadow = '0 5px 10px 5px rgba(0,0,0,0.1)';
    } else {
        variables.header.style.boxShadow = '';
    }
}

window.addEventListener('scroll', headerFixed);
window.addEventListener('touchstart', headerFixed);

/* BANNER */

var timer = setInterval(function () {
    variables.banner.dispatchEvent(new Event('click'));
}, variables.timerSpeed);

function select(id) {
    document.getElementById(id).checked = true;
    variables.bannerList.style.right = 100 * Number(id.substr(-1)) + '%';
}

function sliderMove(e) {

    clearInterval(timer);

    var eventMove, eventStop, currentPos;

    switch (e.type) {
        case 'mousedown':
            eventMove = 'mousemove';
            eventStop = 'mouseup';
            currentPos = e.pageX;
            break;
        case 'touchstart':
            eventMove = 'touchmove';
            eventStop = 'touchend';
            currentPos =  e.touches[0].pageX;
            break;
    }

    var movement;
    var bannerWidth = parseInt(getComputedStyle(this).width);
    var bannerPos = parseInt(getComputedStyle(variables.bannerList).right) / bannerWidth * 100;

    var move = function (e) {
        var newPos = e.pageX || e.touches[0].pageX;

        if (e.type === 'mousemove') {
            e.preventDefault();
        }

        movement = Math.round((currentPos - newPos) * 100 / bannerWidth);

        var newBannerPos = bannerPos + movement + '%';


        variables.bannerList.style.right = newBannerPos;
    };

    var stop = function () {
        var id;
        bannerPos = Math.round(bannerPos / 100);

        if (movement > 30 && bannerPos < variables.bannerList.childElementCount - 1) {
            id = 'slide' + (bannerPos + 1);
            select(id);
        }
        else if (movement < -30 && bannerPos > 0) {
            id = 'slide' + (bannerPos - 1);
            select(id);
        }
        else {
            id = 'slide' + bannerPos;
            select(id);
        }

        document.removeEventListener(eventMove, move);
        document.removeEventListener(eventStop, stop);

        timer = setInterval(function () {
            variables.banner.dispatchEvent(new Event('click'));
        }, variables.timerSpeed);
    };

    document.addEventListener(eventMove, move);
    document.addEventListener(eventStop, stop);
}

variables.banner.addEventListener('click', function (e) {

    var target = e.target;

    if (target.tagName !== 'BUTTON' ) {
        target = target.parentElement;
    }

    if (target.tagName === 'BODY') {
        target = document.querySelector('.btn-next')
    }

    var bannersCount = variables.bannerList.childElementCount;
    var bannerActive = variables.banner.querySelector(':checked');
    var bannerId = Number(bannerActive.id.substr(-1));

    switch (target.className) {
        case 'btn-next':
            bannerId += 1;
            if (bannerId >= bannersCount) {
                bannerId = 0;
            }
            select('slide' + bannerId);
            break;
        case 'btn-prev':
            bannerId -= 1;
            if (bannerId < 0) {
                bannerId = bannersCount - 1;
            }
            select('slide' + bannerId);
            break;
        default:
            return;
    }
});

variables.bannerPag.addEventListener('click', function (e) {
    var target = e.target;

    if (target.tagName !== 'LABEL') {
        return;
    }

    select(target.getAttribute('for'));
});

variables.banner.addEventListener('mousedown', sliderMove);
variables.banner.addEventListener('touchstart', sliderMove);



/* CAROUSEL */

function addPage(id) {
    var fragment = document.createDocumentFragment();

    var radio = document.createElement('INPUT');
    radio.type = 'radio';
    radio.name = 'carousel';
    radio.id = id;
    radio.classList.add('paginator-rad');
    fragment.appendChild(radio);

    var label = document.createElement('LABEL');
    label.setAttribute('for', id);
    label.classList.add('paginator-rad-x');
    fragment.appendChild(label);

    return fragment
}

function pageChange(e) {
    var target = e.target;

    if (!target) {
        target = e;
    }

    if (target.tagName != 'INPUT') {
        return
    }

    var page = target.id.substr(-1);

    // timeout for find checked element
    setTimeout(function () {
        target.checked = true;

        variables.carousel.style.opacity = 0;

        setTimeout(function () {
            variables.carousel.style.bottom = page * 100 + '%';
            variables.carousel.style.opacity = '';
        }, variables.transitionSpeed);

    }, 1);
}

function dynamicPaginator() {
    var carouselHeight = parseInt(getComputedStyle(document.querySelector('.carousel__list')).height);
    var carouselPages = variables.carouselPag.querySelectorAll('.paginator-rad');
    var carouselPagesCount = carouselPages.length;

    if (carouselHeight / carouselPagesCount > 185) {
        variables.carouselPag.appendChild(addPage('page' + carouselPagesCount));
    }

    if (carouselHeight / carouselPagesCount < 185) {
        var page =  document.querySelector('#page' + (carouselPagesCount - 1));

        variables.carouselPag.removeChild(page.nextElementSibling);
        variables.carouselPag.removeChild(page);

        if (page.checked) {
            pageChange(carouselPages[carouselPagesCount - 2]);
        }
    }
}


dynamicPaginator();
window.addEventListener('resize', dynamicPaginator);
variables.carouselPag.addEventListener('click', pageChange);