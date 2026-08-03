// ==========================================================================
// QUEER TALENT SPAIN — LÓGICA DE NAVEGACIÓN Y FILTRADO
// ==========================================================================

let profilesData = [];

/**
 * Normaliza cadenas de texto eliminando tildes y diacríticos
 * Ejemplo: "Dirección" -> "direccion"
 */
function removeAccents(str) {
  if (!str) return "";
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/**
 * Carga los datos desde el archivo profiles.json
 */
async function loadProfiles() {
  try {
    const res = await fetch('./profiles.json');
    profilesData = await res.json();
    renderProfiles(profilesData);
  } catch (error) {
    console.error("Error al cargar los perfiles:", error);
  }
}

/**
 * Renderiza las tarjetas de perfil en el DOM
 */
function renderProfiles(profiles) {
  const container = document.getElementById('grid-profiles');
  container.innerHTML = '';

  if (profiles.length === 0) {
    container.innerHTML = `
      <p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 3rem 1rem; font-weight: 600;">
        No se encontraron perfiles que coincidan con los criterios de búsqueda.
      </p>
    `;
    return;
  }

  profiles.forEach(profile => {
    const card = document.createElement('article');
    card.className = 'card';
    
    // Generar badges de puestos / roles
    let puestosBadges = profile.puestos
      ? profile.puestos.map(p => `<span class="badge">${p}</span>`).join('')
      : `<span class="badge">${profile.sector}</span>`;

    // Badge de disponibilidad en remoto
    if (profile.disponibleRemoto) {
      puestosBadges += `<span class="badge badge--remote">💻 Remoto</span>`;
    }

    // Formatear pronombres si existen
    const pronombresHTML = profile.pronombres && profile.pronombres.trim() !== '' 
      ? `<span class="card__pronouns">(${profile.pronombres})</span>` 
      : '';

    // Generar enlace de Instagram si está disponible
    let instagramHTML = '';
    if (profile.redes && profile.redes.instagram && profile.redes.instagram.trim() !== '' && profile.redes.instagram !== '_') {
      const handleClean = profile.redes.instagram.replace('@', '').trim();
      instagramHTML = `
        <a href="https://instagram.com/${handleClean}" target="_blank" rel="noopener noreferrer" class="card__social-link" title="Instagram de ${profile.nombreArtistico}">
          <i class="fa-brands fa-instagram"></i>
        </a>
      `;
    }

    card.innerHTML = `
      <div class="card__header">
        <img class="card__avatar" src="${profile.fotoUrl}" alt="${profile.nombreArtistico}">
        <div class="card__info">
          <h3>${profile.nombreArtistico} ${pronombresHTML}</h3>
          <span class="card__location">📍 ${profile.comunidadAutonoma}</span>
        </div>
      </div>
      <div class="card__badges">
        ${puestosBadges}
      </div>
      <p class="card__bio">${profile.bio}</p>
      <div class="card__footer">
        <div class="card__socials">
          ${instagramHTML}
        </div>
        <a href="${profile.portfolioUrl}" target="_blank" rel="noopener noreferrer" class="card__link">Ver Portfolio →</a>
      </div>
    `;
    container.appendChild(card);
  });
}

/**
 * Aplica los filtros en tiempo real (insensible a tildes)
 */
function filterProfiles() {
  const rawSearchText = document.getElementById('search-input').value;
  const text = removeAccents(rawSearchText);
  
  const role = document.getElementById('role-filter').value;
  const ccaa = document.getElementById('ccaa-filter').value;
  const isRemoteOnly = document.getElementById('remote-filter').checked;

  const filtered = profilesData.filter(p => {
    // Normalización para búsqueda insensible a tildes y mayúsculas
    const nameClean = removeAccents(p.nombreArtistico);
    const bioClean = removeAccents(p.bio);
    const rolesClean = p.puestos ? p.puestos.map(r => removeAccents(r)) : [];

    const matchesText = text === '' || 
                        nameClean.includes(text) || 
                        bioClean.includes(text) ||
                        rolesClean.some(r => r.includes(text));
    
    const matchesRole = role === '' || (p.puestos && p.puestos.includes(role));
    const matchesCCAA = ccaa === '' || p.comunidadAutonoma === ccaa;
    const matchesRemote = !isRemoteOnly || p.disponibleRemoto === true;

    return matchesText && matchesRole && matchesCCAA && matchesRemote;
  });

  renderProfiles(filtered);
}

// Escuchadores de eventos
document.getElementById('search-input').addEventListener('input', filterProfiles);
document.getElementById('role-filter').addEventListener('change', filterProfiles);
document.getElementById('ccaa-filter').addEventListener('change', filterProfiles);
document.getElementById('remote-filter').addEventListener('change', filterProfiles);

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', loadProfiles);
