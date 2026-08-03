let profilesData = [];

// 1. Cargar datos desde el JSON local
async function loadProfiles() {
  try {
    const res = await fetch('./profiles.json');
    profilesData = await res.json();
    renderProfiles(profilesData);
  } catch (error) {
    console.error("Error cargando perfiles:", error);
  }
}

// 2. Pintar tarjetas en el HTML
function renderProfiles(profiles) {
  const container = document.getElementById('grid-profiles');
  container.innerHTML = '';

  if (profiles.length === 0) {
    container.innerHTML = '<p>No se encontraron resultados.</p>';
    return;
  }

  profiles.forEach(profile => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${profile.fotoUrl}" alt="${profile.nombreArtistico}">
      <h3>${profile.nombreArtistico}</h3>
      <p class="badge">${profile.categoria}</p>
      <p>${profile.comunidadAutonoma}</p>
      <a href="${profile.portfolioUrl}" target="_blank">Ver Portfolio</a>
    `;
    container.appendChild(card);
  });
}

// 3. Filtrar en tiempo real
function filterProfiles() {
  const text = document.getElementById('search-input').value.toLowerCase();
  const ccaa = document.getElementById('ccaa-filter').value;

  const filtered = profilesData.filter(p => {
    const matchesText = p.nombreArtistico.toLowerCase().includes(text) || p.bio.toLowerCase().includes(text);
    const matchesCCAA = ccaa === '' || p.comunidadAutonoma === ccaa;
    return matchesText && matchesCCAA;
  });

  renderProfiles(filtered);
}

// Eventos
document.getElementById('search-input').addEventListener('input', filterProfiles);
document.getElementById('ccaa-filter').addEventListener('change', filterProfiles);

// Inicializar
document.addEventListener('DOMContentLoaded', loadProfiles);
