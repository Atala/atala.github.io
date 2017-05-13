'use strict';

document.addEventListener('scroll', function () {
    var skillsBannerTop = document.querySelector('.banner--skills').getBoundingClientRect().top;
    Array.prototype.forEach.call(document.querySelectorAll('.nav__item'), function (item) { item.classList.remove('nav__item--active');});
    if (skillsBannerTop < 55 && skillsBannerTop > -514) {
        document.querySelector('#skills-nav').classList.add('nav__item--active');
    }
});

