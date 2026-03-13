// Controla los dropdowns del header (user/language) y sincroniza el estado del burger
function dropdown() {
  const header = document.querySelector('.header');
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdownMenu = toggle.nextElementSibling;

      if (dropdownMenu) {
        dropdownMenu.classList.toggle('show');
      }
    });
  });

  if (!header) return;

  const groups = Array.from(header.querySelectorAll('.header__group'));
  const groupTriggers = Array.from(header.querySelectorAll('.header__group-trigger'));
  const dropdownButtons = Array.from(header.querySelectorAll('.header__dropdown-toggle, .header__user-toggle'));
  const userGroup = header.querySelector('.header__group--user');
  const burgerBtn = header.querySelector('.header__burger');
  const burgerToggle = header.querySelector('.burger-menu-toggle');
  const userToggleButton = header.querySelector('.header__user-toggle');
  const userCloseIcon = userGroup ? userGroup.querySelector('.header__icon-close') : null;
  const burgerLangGroup = header.querySelector('.nav-burger__group--language');
  const burgerLangTrigger = burgerLangGroup ? burgerLangGroup.querySelector('.nav-burger__group-trigger') : null;
  const mobileMenuQuery = window.matchMedia('(max-width: 767px)');

  // Actualiza aria-expanded en los button de un group
  const setExpanded = (group, expanded) => {
    const buttons = group.querySelectorAll('.header__dropdown-toggle, .header__user-toggle');
    buttons.forEach((button) => {
      button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  };

  // Cierra los menús de desktop, excepto el group indicado
  const closeDesktopMenus = (exceptGroup) => {
    groups.forEach((group) => {
      if (group !== exceptGroup) {
        group.classList.remove('is-open');
        setExpanded(group, false);
      }
    });
  };

  // Abre o cierra un group y mantiene el resto en estado consistente
  const toggleGroup = (group) => {
    if (!group) return;

    const willOpen = !group.classList.contains('is-open');
    closeDesktopMenus(group);

    group.classList.toggle('is-open', willOpen);
    setExpanded(group, willOpen);

    if (willOpen && burgerToggle) {
      burgerToggle.checked = false;
    }

    updateBurgerIcon();
  };

  // Sincroniza icono/label del burger y bloquea scroll en mobile cuando hay menú abierto
  const updateBurgerIcon = () => {
    const userMenuOpen = !!(userGroup && userGroup.classList.contains('is-open'));
    const burgerMenuOpen = !!(burgerToggle && burgerToggle.checked);
    const shouldLockScroll = mobileMenuQuery.matches && (userMenuOpen || burgerMenuOpen);

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

    document.body.classList.toggle('not-scroll', shouldLockScroll);
  };

  // Cierra el selector de idioma dentro del menú burger
  const closeBurgerLangMenu = () => {
    if (!burgerLangGroup || !burgerLangTrigger) return;

    burgerLangGroup.classList.remove('is-open');
    burgerLangTrigger.setAttribute('aria-expanded', 'false');
  };

  dropdownButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const group = button.closest('.header__group');
      toggleGroup(group);
    });
  });

  groupTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      if (e.target.closest('.header__icon-close')) return;

      e.preventDefault();
      e.stopPropagation();

      const group = trigger.closest('.header__group');
      toggleGroup(group);
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
        closeBurgerLangMenu();
      } else if (burgerToggle && burgerToggle.checked) {
        burgerToggle.checked = false;
        closeBurgerLangMenu();
      } else if (burgerToggle) {
        closeDesktopMenus();
        burgerToggle.checked = true;
        closeBurgerLangMenu();
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

  if (burgerLangTrigger && burgerLangGroup) {
    burgerLangTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const willOpen = !burgerLangGroup.classList.contains('is-open');
      burgerLangGroup.classList.toggle('is-open', willOpen);
      burgerLangTrigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  }

  if (burgerToggle) {
    burgerToggle.addEventListener('change', updateBurgerIcon);
  }

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      closeDesktopMenus();
      closeBurgerLangMenu();
      updateBurgerIcon();
      return;
    }

    if (burgerToggle && burgerToggle.checked && e.target.closest('.nav-burger__item')) {
      burgerToggle.checked = false;
      closeBurgerLangMenu();
      updateBurgerIcon();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDesktopMenus();
      if (burgerToggle) burgerToggle.checked = false;
      closeBurgerLangMenu();
      updateBurgerIcon();
    }
  });

  window.addEventListener('resize', updateBurgerIcon);
  updateBurgerIcon();
}


document.addEventListener('DOMContentLoaded', () => {
  dropdown();
});


