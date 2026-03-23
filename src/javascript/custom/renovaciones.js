// renovaciones.js
// Funciones exclusivas para renovaciones.html

// Muestra solo el número de filas seleccionadas en la tabla de renovaciones
function initRenovacionesFilas() {
  // Selecciono el dropdown de filas y las filas de la tabla
  const filasSelect = document.querySelector('.renovaciones-paginacion__filas-dropdown');
  const filasTabla = document.querySelectorAll('.tabla-renovaciones__body .tabla-renovaciones__row');

  // Si no estamos en la vista de renovaciones, no hago nada
  if (!filasSelect || !filasTabla.length) return;

  const MIN_FILAS = 1; // Mínimo de filas permitidas
  const MAX_FILAS = 10; // Máximo de filas permitidas

  // Función interna para mostrar solo las filas seleccionadas
  const aplicarFilasVisibles = (valorSeleccionado) => {
    // Convierto el valor del select a número
    const valorNumerico = Number.parseInt(valorSeleccionado, 10);
    const filasVisibles = Number.isNaN(valorNumerico)
      ? MAX_FILAS
      : Math.min(Math.max(valorNumerico, MIN_FILAS), MAX_FILAS);

    // Muestro u oculto cada fila según el índice
    filasTabla.forEach((fila, indice) => {
      fila.style.display = indice < filasVisibles ? '' : 'none';
    });
  };

  // Inicializo el select en 10 filas
  filasSelect.value = String(MAX_FILAS);
  aplicarFilasVisibles(MAX_FILAS);

  // Cambio el número de filas visibles cuando el usuario selecciona otra opción
  filasSelect.addEventListener('change', (event) => {
    aplicarFilasVisibles(event.target.value);
  });
}

// Abre y cierra el panel lateral de filtros con animación
function initRenovacionesFiltroMenu() {
  // Botón que abre el panel de filtros
  const filterTriggerButton = document.querySelector('.renovaciones-options__filtros');
  // Panel lateral de filtros
  const filterMenuPanel = document.querySelector('.filter-menu');
  // Botón de cerrar dentro del panel
  const filterCloseButton = filterMenuPanel ? filterMenuPanel.querySelector('.filter-menu__header__icon') : null;

  // Si no hay panel o botón, no hago nada
  if (!filterTriggerButton || !filterMenuPanel) return;

  let isTransitioning = false; // Controla si está animando

  // Abre el panel de filtros
  const openMenu = () => {
    if (isTransitioning) return; // Evita doble animación
    filterMenuPanel.classList.add('is-open'); // Activa la clase de animación
    filterMenuPanel.setAttribute('aria-hidden', 'false'); // Accesibilidad
    filterTriggerButton.setAttribute('aria-expanded', 'true'); // Accesibilidad
    document.body.classList.add('not-scroll'); // Evita scroll en el body
  };

  // Cierra el panel de filtros
  const closeMenu = () => {
    if (isTransitioning) return; // Evita doble animación
    isTransitioning = true; // Marca que está animando
    filterMenuPanel.classList.remove('is-open'); // Quita la clase de animación
    filterMenuPanel.setAttribute('aria-hidden', 'true'); // Accesibilidad
    filterTriggerButton.setAttribute('aria-expanded', 'false'); // Accesibilidad
    document.body.classList.remove('not-scroll'); // Permite scroll de nuevo
    // Espera a que termine la transición CSS para permitir otra acción
    const onTransitionEnd = (e) => {
      if (e.propertyName === 'transform') {
        isTransitioning = false;
        filterMenuPanel.removeEventListener('transitionend', onTransitionEnd);
      }
    };
    filterMenuPanel.addEventListener('transitionend', onTransitionEnd);
  };

  // Click en el botón de filtros: abre o cierra el panel
  filterTriggerButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (filterMenuPanel.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Click en el botón de cerrar dentro del panel
  if (filterCloseButton) {
    filterCloseButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
    });
  }

  // Cierra el panel si se hace click fuera de él
  document.addEventListener('click', (event) => {
    const clickedInsideMenu = filterMenuPanel.contains(event.target);
    const clickedTrigger = filterTriggerButton.contains(event.target);
    if (!clickedInsideMenu && !clickedTrigger && filterMenuPanel.classList.contains('is-open')) {
      closeMenu();
    }
  });

}

// Inicializa todas las funciones JS específicas de renovaciones.html
function initRenovaciones() {
  // Inicializa el control de filas de la tabla
  initRenovacionesFilas();
  // Inicializa el panel lateral de filtros
  initRenovacionesFiltroMenu();
}

;
