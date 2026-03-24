
// Funciones exclusivas para renovaciones.html

// Ruta al JSON 
const RENOVACIONES_JSON = 'locale/clientes.json';

// Renderiza las filas de la tabla de renovaciones según los datos y el número de filas a mostrar
function renderTablaRenovaciones(data, filasVisibles) {
  const tbody = document.querySelector('.tabla-renovaciones__body');
  if (!tbody) return;
  tbody.innerHTML = '';
  data.slice(0, filasVisibles).forEach(item => {
    const estadoClass =
      item.estado === 'Pagada' ? 'badge-estado--pagada' :
      item.estado === 'Vencido' ? 'badge-estado--vencido' :
      'badge-estado--pendiente';
    const iconClass =
      item.estado === 'Pagada' ? 'icon-check' :
      item.estado === 'Vencido' ? 'icon-close' :
      'icon-clock';
    tbody.insertAdjacentHTML('beforeend', `
      <tr class="tabla-renovaciones__row">
        <td class="tabla-renovaciones__cell" data-label="No. de póliza">${item.poliza}</td>
        <td class="tabla-renovaciones__cell" data-label="Nombre del riesgo">${item.riesgo}</td>
        <td class="tabla-renovaciones__cell" data-label="Fecha de contrato">${item.contrato}</td>
        <td class="tabla-renovaciones__cell" data-label="Fecha de vencimiento">${item.vencimiento}</td>
        <td class="tabla-renovaciones__cell tabla-renovaciones__cell--importe" data-label="Importe">${item.importe}</td>
        <td class="tabla-renovaciones__cell" data-label="Estado">
          <span class="badge-estado ${estadoClass}"><i class="${iconClass}"></i> ${item.estado}</span>
        </td>
      </tr>
    `);
  });
}

// Muestra solo el número de filas seleccionadas en la tabla de renovaciones
function initRenovacionesFilas(data) {
  const filasSelect = document.querySelector('.renovaciones-paginacion__filas-dropdown');
  if (!filasSelect) return;
  const MIN_FILAS = 1;
  const MAX_FILAS = 10;
  // Inicializo el select en 10 filas
  filasSelect.value = String(MAX_FILAS);
  renderTablaRenovaciones(data, MAX_FILAS);
  filasSelect.addEventListener('change', (event) => {
    const valorNumerico = Number.parseInt(event.target.value, 10);
    const filasVisibles = Number.isNaN(valorNumerico)
      ? MAX_FILAS
      : Math.min(Math.max(valorNumerico, MIN_FILAS), MAX_FILAS);
    renderTablaRenovaciones(data, filasVisibles);
  });
}

// Abre y cierra el panel lateral de filtros con animación
function initRenovacionesFiltroMenu() {
  // Botones que abren el panel de filtros (desktop y mobile)
  const filterTriggerButtons = document.querySelectorAll('.renovaciones-options__filtros');
  // Panel lateral de filtros
  const filterMenuPanel = document.querySelector('.filter-menu');
  // Botón de cerrar dentro del panel
  const filterCloseButton = filterMenuPanel ? filterMenuPanel.querySelector('.filter-menu__header__icon') : null;

  // Si no hay panel o botón, no hago nada
  if (!filterMenuPanel || !filterTriggerButtons.length) return;

  let isTransitioning = false; // Controla si está animando

  // Abre el panel de filtros
  const openMenu = () => {
    if (isTransitioning) return; // Evita doble animación
    filterMenuPanel.classList.add('is-open'); // Activa la clase de animación
    filterMenuPanel.setAttribute('aria-hidden', 'false'); // Accesibilidad
    filterTriggerButtons.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
    document.body.classList.add('not-scroll'); // Evita scroll en el body
  };

  // Cierra el panel de filtros
  const closeMenu = () => {
    if (isTransitioning) return; // Evita doble animación
    isTransitioning = true; // Marca que está animando
    filterMenuPanel.classList.remove('is-open'); // Quita la clase de animación
    filterMenuPanel.setAttribute('aria-hidden', 'true'); // Accesibilidad
    filterTriggerButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
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

  // Click en los botones de filtros: abre o cierra el panel
  filterTriggerButtons.forEach(btn => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (filterMenuPanel.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
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
    // Verifica si el click fue en alguno de los botones trigger
    const clickedTrigger = Array.from(filterTriggerButtons).some(btn => btn.contains(event.target));
    if (!clickedInsideMenu && !clickedTrigger && filterMenuPanel.classList.contains('is-open')) {
      closeMenu();
    }
  });

}

// Inicializa todas las funciones JS específicas de renovaciones.html
function initRenovaciones() {
  fetch(RENOVACIONES_JSON)
    .then(res => res.json())
    .then(data => {
      initRenovacionesFilas(data);
      initRenovacionesFiltroMenu();
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRenovaciones);
} else {
  initRenovaciones();
}
