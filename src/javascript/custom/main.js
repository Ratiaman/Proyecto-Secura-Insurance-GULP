// Header dropdowns: user/language via arrow buttons + burger state sync
function dropdown() {
  const header = document.querySelector('.header');
  if (!header) return;

  const groups = Array.from(header.querySelectorAll('.header__group'));
  const dropdownButtons = Array.from(header.querySelectorAll('.header__dropdown-toggle, .header__user-toggle'));
  const userGroup = header.querySelector('.header__group--user');
  const burgerBtn = header.querySelector('.header__burger');
  const burgerToggle = document.getElementById('burger-menu-toggle');
  const userToggleButton = header.querySelector('.header__user-toggle');
  const userCloseIcon = userGroup ? userGroup.querySelector('.header__icon-close') : null;

  const setExpanded = (group, expanded) => {
    const buttons = group.querySelectorAll('.header__dropdown-toggle, .header__user-toggle');
    buttons.forEach((button) => {
      button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  };

  const closeDesktopMenus = (exceptGroup) => {
    groups.forEach((group) => {
      if (group !== exceptGroup) {
        group.classList.remove('is-open');
        setExpanded(group, false);
      }
    });
  };

  const updateBurgerIcon = () => {
    const userMenuOpen = !!(userGroup && userGroup.classList.contains('is-open'));
    const burgerMenuOpen = !!(burgerToggle && burgerToggle.checked);

    if (burgerBtn) {
      if (userMenuOpen || burgerMenuOpen) {
        burgerBtn.classList.add('is-close');
        burgerBtn.setAttribute('aria-label', 'Cerrar menú');
      } else {
        burgerBtn.classList.remove('is-close');
        burgerBtn.setAttribute('aria-label', 'Abrir navegación mobile');
      }
    }

    if (userToggleButton) {
      userToggleButton.style.display = burgerMenuOpen ? 'none' : '';
    }
  };

  dropdownButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const group = button.closest('.header__group');
      if (!group) return;

      const willOpen = !group.classList.contains('is-open');
      closeDesktopMenus(group);

      group.classList.toggle('is-open', willOpen);
      setExpanded(group, willOpen);

      if (willOpen && burgerToggle) {
        burgerToggle.checked = false;
      }

      updateBurgerIcon();
    });
  });

  if (burgerBtn) {
    burgerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const userMenuOpen = !!(userGroup && userGroup.classList.contains('is-open'));

      if (userMenuOpen && userGroup) {
        userGroup.classList.remove('is-open');
        setExpanded(userGroup, false);
      } else if (burgerToggle && burgerToggle.checked) {
        burgerToggle.checked = false;
      } else if (burgerToggle) {
        closeDesktopMenus();
        burgerToggle.checked = true;
      }

      updateBurgerIcon();
    });
  }

  if (userCloseIcon && userGroup) {
    userCloseIcon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      userGroup.classList.remove('is-open');
      setExpanded(userGroup, false);
      updateBurgerIcon();
    });
  }

  if (burgerToggle) {
    burgerToggle.addEventListener('change', updateBurgerIcon);
  }

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      closeDesktopMenus();
      updateBurgerIcon();
      return;
    }

    if (burgerToggle && burgerToggle.checked && e.target.closest('.nav-burger__item')) {
      burgerToggle.checked = false;
      updateBurgerIcon();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDesktopMenus();
      if (burgerToggle) burgerToggle.checked = false;
      updateBurgerIcon();
    }
  });

  window.addEventListener('resize', updateBurgerIcon);
  updateBurgerIcon();
}

dropdown();
