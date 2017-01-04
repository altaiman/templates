'use strict'

var nav = document.querySelector('.list'),
    content = document.querySelector('.content'),
    skills = {
        html: '100%',
        css: '88%',
        js: '52%',
        php: '69%',
        sql: '35%'
    };

nav.addEventListener('click', function (e) {
    e.preventDefault();

    var target = e.target;
    if (target.tagName === 'IMG') target = target.nextElementSibling;

    if (target.tagName != 'A') return;

    var span = nav.querySelector('.active span'),
        activeContent = content.querySelector('.active'),
        link = document.createElement('a'),
        newspan = document.createElement('span');

    link.classList.add('list__item-link');
    link.setAttribute('href', '#' + activeContent.id);
    link.innerText = span.innerText;
    span.previousElementSibling.src = span.previousElementSibling.src.slice(0, -11) + '.png';
    span.parentElement.classList.remove('active');
    span.outerHTML = link.outerHTML;
    newspan.classList.add('list__item-link');
    newspan.innerText = target.innerText;
    target.previousElementSibling.src = target.previousElementSibling.src.slice(0, -4) + '-active.png';
    target.parentElement.classList.add('active');
    target.outerHTML = newspan.outerHTML;
    activeContent.classList.remove('active');
    document.querySelector('#' + target.href.split('#')[target.href.split('#').length - 1]).classList.add('active');

    activeContent = content.querySelector('.active');
    if (activeContent.id === 'content__resume') {
        var skillBars = activeContent.querySelectorAll('.resume__skill-bar');
        var progressBars = activeContent.querySelectorAll('.bar-progress');

        for (var i = 0; i < skillBars.length; i++) {
            progressBars[i].style.paddingRight = skills[skillBars[i].dataset.skill];
        }
    }
});