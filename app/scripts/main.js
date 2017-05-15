/* globals smoothScroll */

'use strict';

document.addEventListener('DOMContentLoaded', function() {

    document.addEventListener('scroll', function () {
        var skillsBannerTop = document.querySelector('.banner--skills').getBoundingClientRect().top,
            projectsBannerTop = document.querySelector('.banner--projects').getBoundingClientRect().top;
        Array.prototype.forEach.call(document.querySelectorAll('.nav__item'), function (item) { item.classList.remove('nav__item--active');});

        if (projectsBannerTop < document.querySelector('.header').offsetHeight + 2) {
            document.querySelector('#projects-nav').classList.add('nav__item--active');
        }
        else if (skillsBannerTop < document.querySelector('.header').offsetHeight + 1) {
            document.querySelector('#skills-nav').classList.add('nav__item--active');
        }
    });

    smoothScroll.init({
        selectorHeader: '.header'
    });
});
