/* globals smoothScroll */

'use strict';

document.addEventListener('DOMContentLoaded', function() {

    document.addEventListener('scroll', function () {
        var skillsBannerTop = document.querySelector('.banner--skills').getBoundingClientRect().top;
        Array.prototype.forEach.call(document.querySelectorAll('.nav__item'), function (item) { item.classList.remove('nav__item--active');});
        if (skillsBannerTop < document.querySelector('.header').offsetHeight + 1 && skillsBannerTop > -514) {
            document.querySelector('#skills-nav').classList.add('nav__item--active');
        }
    });

    smoothScroll.init({
        selectorHeader: '.header'
    });
});
