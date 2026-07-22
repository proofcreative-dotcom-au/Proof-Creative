(() => {
  'use strict';
  let last = window.scrollY;
  const navHeight = () => {
    const nav = document.querySelector('[data-site-nav]');
    return nav ? nav.offsetHeight : 76;
  };
  const update = () => {
    const y = window.scrollY;
    const goingDown = y > last && y > navHeight() + 10;
    if (goingDown) document.body.setAttribute('data-nav-hidden', '');
    else document.body.removeAttribute('data-nav-hidden');
    // floating (overlay) nav: solid white once past the hero top, transparent at the top
    if (y > navHeight()) document.body.setAttribute('data-nav-solid', '');
    else document.body.removeAttribute('data-nav-solid');
    last = y;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
