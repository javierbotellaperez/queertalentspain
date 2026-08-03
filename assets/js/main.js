// main.js - Orquestador principal de la aplicación
document.addEventListener("DOMContentLoaded", async () => {
  RenderService.init();

  // 1. Cargar datos
  const allTalents = await ApiService.fetchTalents();

  // 2. Render inicial
  RenderService.renderGrid(allTalents);

  // 3. Capturar elementos de filtro
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("filter-category");
  const regionSelect = document.getElementById("filter-region");

  // 4. Función de actualización por filtros
  function handleFilterChange() {
    const filters = {
      searchText: searchInput.value,
      category: categorySelect.value,
      region: regionSelect.value
    };

    const filteredTalents = FilterService.filterTalents(allTalents, filters);
    RenderService.renderGrid(filteredTalents);
  }

  // 5. Asignar Event Listeners
  searchInput.addEventListener("input", handleFilterChange);
  categorySelect.addEventListener("change", handleFilterChange);
  regionSelect.addEventListener("change", handleFilterChange);
});
