// mobile user menu close toggle
(function(){
  const userToggle = document.getElementById('user-menu-toggle');
  const burgerBtn = document.querySelector('.header__burger');

  if (!userToggle || !burgerBtn) return;

  const burgerToggle = document.getElementById('burger-menu-toggle');

  const updateBurgerIcon = () => {
    // close icon when either menu is open
    if (userToggle.checked || (burgerToggle && burgerToggle.checked)) {
      burgerBtn.classList.add('is-close');
      burgerBtn.setAttribute('aria-label', 'Cerrar menú');
    } else {
      burgerBtn.classList.remove('is-close');
      burgerBtn.setAttribute('aria-label', 'Abrir navegación mobile');
    }

    // hide user icon when burger menu is open
    const userIcon = document.querySelector('.js-user-icon');
    if (userIcon) {
      userIcon.style.display = (burgerToggle && burgerToggle.checked) ? 'none' : '';
    }
  };

  // click handler: close when open, ignore otherwise
  burgerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation && e.stopImmediatePropagation();

    const langToggle = document.getElementById('lang-menu-toggle');

    if (userToggle.checked) {
      // close the user menu
      userToggle.checked = false;
      updateBurgerIcon();
    } else if (burgerToggle && burgerToggle.checked) {
      // close the burger navigation
      burgerToggle.checked = false;
      updateBurgerIcon();
    } else {
      // open burger navigation
      if (langToggle) langToggle.checked = false;
      if (userToggle) userToggle.checked = false;
      if (burgerToggle) burgerToggle.checked = true;
      updateBurgerIcon();
    }
  });

  userToggle.addEventListener('change', updateBurgerIcon);
  if (burgerToggle) {
    burgerToggle.addEventListener('change', updateBurgerIcon);
  }
  window.addEventListener('resize', updateBurgerIcon);

  // close burger nav when an item is clicked
  document.addEventListener('click', (e) => {
    if (burgerToggle && burgerToggle.checked && e.target.closest('.nav-burger__item')) {
      burgerToggle.checked = false;
      updateBurgerIcon();
    }
  });

  // initialize on load
  updateBurgerIcon();
})();
