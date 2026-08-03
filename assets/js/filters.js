// filters.js - Lógica pura de filtrado de datos
const FilterService = {
  filterTalents(talents, { searchText, category, region }) {
    return talents.filter(talent => {
      // 1. Filtro por categoría
      const matchCategory = !category || talent.categoria === category;

      // 2. Filtro por Comunidad Autónoma
      const matchRegion = !region || talent.comunidad === region;

      // 3. Filtro por Búsqueda de Texto (Nombre, Bio, Herramientas, Roles, Ciudad)
      const query = searchText.toLowerCase().trim();
      const matchText = !query || 
        talent.nombre.toLowerCase().includes(query) ||
        talent.bio.toLowerCase().includes(query) ||
        talent.ciudad.toLowerCase().includes(query) ||
        talent.roles.some(r => r.toLowerCase().includes(query)) ||
        talent.herramientas.some(h => h.toLowerCase().includes(query));

      return matchCategory && matchRegion && matchText;
    });
  }
};
