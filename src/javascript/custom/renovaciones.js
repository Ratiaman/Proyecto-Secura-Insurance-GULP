// Ruta al JSON 
const RENOVACIONES_JSON = 'locale/clientes.json';

// Ordena el array de datos por el campo indicado (ascendente simple)
function ordenarRenovacionesPorCampo(data, campo) {
  return data.slice().sort((a, b) => {
    // Ordenar poliza numéricamente
    if (campo === 'poliza') {
      const numA = parseInt(a[campo], 10);
      const numB = parseInt(b[campo], 10);
      return numA - numB;
    }
    // Ordenar importe de mayor a menor
    if (campo === 'importe') {
      // Quitar puntos de miles y cambiar coma decimal a punto
      const parseImporte = (str) => {
        if (typeof str !== 'string') str = String(str);
        str = str.replace(/\s/g, '');
        str = str.replace(/\.(?=\d{3}(\.|,|$))/g, ''); // quita puntos de miles
        str = str.replace(/,/g, '.'); // cambia coma decimal a punto
        return parseFloat(str);
      };
      const numA = parseImporte(a[campo]);
      const numB = parseImporte(b[campo]);
      return numB - numA;
    }
    // Ordenar fechas correctamente (YYYY-MM-DD o DD/MM/YYYY)
    if (campo === 'contrato' || campo === 'vencimiento') {
      // Detectar formato y convertir a objeto Date
      const parseFecha = (str) => {
        if (/\d{4}-\d{2}-\d{2}/.test(str)) {
          return new Date(str);
        } else if (/\d{2}\/\d{2}\/\d{4}/.test(str)) {
          const [d, m, y] = str.split('/').map(Number);
          return new Date(y, m - 1, d);
        } else {
          return new Date(str);
        }
      };
      const dateA = parseFecha(a[campo]);
      const dateB = parseFecha(b[campo]);
      return dateA - dateB;
    }
    // Ordenar texto ascendente
    if (a[campo] < b[campo]) return -1;
    if (a[campo] > b[campo]) return 1;
    return 0;
  });
}

// Renderiza las filas de la tabla de renovaciones según los datos y el número de filas a mostrar
function renderTablaRenovaciones(data, filasVisibles, paginaActual = 1) {
  const tbody = document.querySelector('.tabla-renovaciones__body');
  if (!tbody) return;
  tbody.innerHTML = '';
  const statusClass = {
    'pagada': 'badge-estado--pagada',
    'vencido': 'badge-estado--vencido',
    'pendiente': 'badge-estado--pendiente'
  };
  const statusIcon = {
    'pagada': 'icon-check',
    'vencido': 'icon-close',
    'pendiente': 'icon-clock'
  };
  const start = (paginaActual - 1) * filasVisibles;
  const end = start + filasVisibles;
  data.slice(start, end).forEach(item => {
    const estadoKey = (item.estado || '').toLowerCase();
    const estadoClass = statusClass[estadoKey] || statusClass['pendiente'];
    const iconClass = statusIcon[estadoKey] || statusIcon['pendiente'];
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

// Muestra solo el número de filas seleccionadas en la tabla de renovaciones y permite ordenar
function initRenovacionesFilas(data) {
  const filasSelect = document.querySelector('.renovaciones-paginacion__filas-dropdown');
  const ordenSelect = document.querySelector('.renovaciones-options__orden-select');
  const paginasSpan = document.querySelector('.renovaciones-paginacion__paginas');
  const btnFirst = document.querySelector('.renovaciones-paginacion__boton--skip-left');
  const btnPrev = document.querySelector('.renovaciones-paginacion__boton--left');
  const btnNext = document.querySelector('.renovaciones-paginacion__boton--right');
  const btnLast = document.querySelector('.renovaciones-paginacion__boton--skip-right');
  if (!filasSelect) return;
  const MIN_FILAS = 1;
  const MAX_FILAS = 10;
  let campoOrden = ordenSelect ? ordenSelect.value : null;
  let dataOrdenada = campoOrden ? ordenarRenovacionesPorCampo(data, campoOrden) : data;
  let paginaActual = 1;

  function getFilasVisibles() {
    const valorNumerico = Number.parseInt(filasSelect.value, 10);
    return Number.isNaN(valorNumerico)
      ? MAX_FILAS
      : Math.min(Math.max(valorNumerico, MIN_FILAS), MAX_FILAS);
  }

  function getTotalPaginas() {
    return Math.ceil(dataOrdenada.length / getFilasVisibles());
  }

  function updateTablaYPaginacion() {
    const filasVisibles = getFilasVisibles();
    const totalPaginas = getTotalPaginas();
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;
    if (paginaActual < 1) paginaActual = 1;
    renderTablaRenovaciones(dataOrdenada, filasVisibles, paginaActual);
    if (paginasSpan) {
      if (filasVisibles === 1) {
        const actual = Math.min((paginaActual - 1) * filasVisibles + 1, dataOrdenada.length);
        paginasSpan.textContent = `${actual} de ${dataOrdenada.length}`;
      } else {
        paginasSpan.textContent = `${paginaActual} de ${totalPaginas} páginas`;
      }
    }
  }

  // Inicializo el select en 10 filas
  filasSelect.value = String(MAX_FILAS);
  updateTablaYPaginacion();

  filasSelect.addEventListener('change', () => {
    paginaActual = 1;
    updateTablaYPaginacion();
  });

  if (ordenSelect) {
    ordenSelect.addEventListener('change', () => {
      campoOrden = ordenSelect.value;
      dataOrdenada = ordenarRenovacionesPorCampo(data, campoOrden);
      paginaActual = 1;
      updateTablaYPaginacion();
    });
  }

  if (btnFirst) {
    btnFirst.addEventListener('click', () => {
      paginaActual = 1;
      updateTablaYPaginacion();
    });
  }
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      paginaActual = Math.max(1, paginaActual - 1);
      updateTablaYPaginacion();
    });
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      paginaActual = Math.min(getTotalPaginas(), paginaActual + 1);
      updateTablaYPaginacion();
    });
  }
  if (btnLast) {
    btnLast.addEventListener('click', () => {
      paginaActual = getTotalPaginas();
      updateTablaYPaginacion();
    });
  }
}

// Abre y cierra el panel lateral de filtros con animación
// --- Filtros aplicados: etiquetas ---
function initRenovacionesFiltrosAplicados() {
  const filterMenuPanel = document.querySelector('.filter-menu');
  const filterForm = filterMenuPanel ? filterMenuPanel.querySelector('.filter-menu__form') : null;
  const btnAplicarFiltros = filterMenuPanel ? filterMenuPanel.querySelector('.filter-menu__bottom__boton-aplicar') : null;
  const filtersAppliedContainer = document.querySelector('.renovaciones-options__filters-applied');
  if (!filterForm || !btnAplicarFiltros || !filtersAppliedContainer) return;

  function crearEtiquetaFiltro({ key, value }) {
    if (!value || value === '' || value === 'Todas las pólizas' || value === 'Todos los estados') return null;
    const div = document.createElement('div');
    div.className = 'filter-selected';
    div.dataset.filterKey = key;
    div.title = value;
    div.innerHTML = `<span class="filter-selected__label">${value}</span><button class="filter-selected__close" type="button" aria-label="Quitar filtro"><i class="icon-close"></i></button>`;
    // Forzar icono blanco
    const closeIcon = div.querySelector('.icon-close');
    if (closeIcon) closeIcon.style.color = '#fff';
    div.querySelector('.filter-selected__close').addEventListener('click', () => {
      limpiarFiltro(key);
      div.remove();
      actualizarEtiquetas();
    });
    return div;
  }

  // Limpia el filtro correspondiente sin disparar eventos manuales
  function limpiarFiltro(key) {
    if (key === 'poliza') {
      const select = filterForm.querySelector('.filter-menu__select-numero');
      if (select) select.selectedIndex = 0;
    } else if (key === 'riesgo') {
      const input = filterForm.querySelector('.filter-menu__input-riesgo');
      if (input) input.value = '';
    } else if (key === 'fecha') {
      const inputInicio = filterForm.querySelector('.filter-menu__input-fecha-inicio');
      const inputFin = filterForm.querySelector('.filter-menu__input-fecha-fin');
      if (inputInicio) inputInicio.value = '';
      if (inputFin) inputFin.value = '';
    }
  }

  // Vuelve a crear las etiquetas según el estado actual del formulario
  function actualizarEtiquetas() {
    filtersAppliedContainer.innerHTML = '';
    const poliza = filterForm.querySelector('.filter-menu__select-numero')?.value;
    const riesgo = filterForm.querySelector('.filter-menu__input-riesgo')?.value;
    const fechaInicio = filterForm.querySelector('.filter-menu__input-fecha-inicio')?.value;
    const fechaFin = filterForm.querySelector('.filter-menu__input-fecha-fin')?.value;
    const etiquetas = [
      crearEtiquetaFiltro({ key: 'poliza', value: poliza }),
      crearEtiquetaFiltro({ key: 'riesgo', value: riesgo }),
      crearEtiquetaFiltro({ key: 'fecha', value: (fechaInicio && fechaFin) ? `${fechaInicio} al ${fechaFin}` : (fechaInicio || fechaFin) })
    ];
    etiquetas.forEach(et => { if (et) filtersAppliedContainer.appendChild(et); });
  }

  btnAplicarFiltros.addEventListener('click', (event) => {
    event.preventDefault();
    actualizarEtiquetas();
  });
}

// --- Menú lateral de filtros ---
function initRenovacionesFiltroMenu() {
  const filterTriggerButtons = document.querySelectorAll('.renovaciones-options__filtros');
  const filterMenuPanel = document.querySelector('.filter-menu');
  const filterCloseButton = filterMenuPanel ? filterMenuPanel.querySelector('.filter-menu__header__icon') : null;
  const filterForm = filterMenuPanel ? filterMenuPanel.querySelector('.filter-menu__form') : null;
  const btnBorrarFiltros = filterMenuPanel ? filterMenuPanel.querySelector('.filter-menu__bottom__boton-borrar') : null;
  if (!filterMenuPanel || !filterTriggerButtons.length) return;

  function resetFiltrosForm() {
    if (!filterForm) return;
    const selects = filterForm.querySelectorAll('select');
    selects.forEach(sel => {
      sel.selectedIndex = 0;
      sel.dispatchEvent(new Event('change'));
    });
    const inputs = filterForm.querySelectorAll('input[type="text"]');
    inputs.forEach(inp => {
      inp.value = '';
      inp.dispatchEvent(new Event('input'));
    });
  }

  if (btnBorrarFiltros) {
    btnBorrarFiltros.addEventListener('click', (event) => {
      event.preventDefault();
      resetFiltrosForm();
    });
  }

  let isTransitioning = false;
  const openMenu = () => {
    if (isTransitioning) return;
    filterMenuPanel.classList.add('is-open');
    filterMenuPanel.setAttribute('aria-hidden', 'false');
    filterTriggerButtons.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
    document.body.classList.add('not-scroll');
  };
  const closeMenu = () => {
    if (isTransitioning) return;
    isTransitioning = true;
    filterMenuPanel.classList.remove('is-open');
    filterMenuPanel.setAttribute('aria-hidden', 'true');
    filterTriggerButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
    document.body.classList.remove('not-scroll');
    const onTransitionEnd = (e) => {
      if (e.propertyName === 'transform') {
        isTransitioning = false;
        filterMenuPanel.removeEventListener('transitionend', onTransitionEnd);
      }
    };
    filterMenuPanel.addEventListener('transitionend', onTransitionEnd);
  };
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
  if (filterCloseButton) {
    filterCloseButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
    });
  }
  document.addEventListener('click', (event) => {
    const clickedInsideMenu = filterMenuPanel.contains(event.target);
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
      initRenovacionesFiltrosAplicados();
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRenovaciones);
} else {
  initRenovaciones();
}
