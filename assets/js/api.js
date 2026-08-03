// api.js - Módulo de obtención de datos (Local / Sheets / API)
const ApiService = {
  async fetchTalents() {
    // Por ahora durante la prueba local devuelve el MOCK_DATA
    // En la siguiente fase, aquí conectaremos con Google Sheets o el JSON exportado
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_TALENTS);
      }, 200);
    });
  }
};
