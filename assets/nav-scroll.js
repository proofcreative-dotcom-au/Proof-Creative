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

  // close the mobile burger menu when a nav link inside it is clicked
  document.addEventListener('click', (e) => {
    const link = e.target.closest && e.target.closest('details[data-burger] a');
    if (link) {
      const d = link.closest('details[data-burger]');
      if (d) d.removeAttribute('open');
    }
  });
})();