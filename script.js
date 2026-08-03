let profilesData = [];

async function loadProfiles() {
  try {
    const res = await fetch('./profiles.json');
    profilesData = await res.json();
    renderProfiles(profilesData);
  } catch (error) {
    console.error("Error cargando perfiles:", error);
  }
}

function renderProfiles(profiles) {
  const container = document.getElementById('grid-profiles');
  container.innerHTML = '';

  if (profiles.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 3rem 1rem;">No se encontraron perfiles que coincidan con los criterios de búsqueda.</p>';
    return;
  }

  profiles.forEach(profile => {
    const card = document.createElement('article');
    card.className = 'card';
    
    // Generar badges de puestos
    let puestosBadges = profile.puestos
      ? profile.puestos.map(p => `<span class="badge">${p}</span>`).join('')
      : `<span class="badge">${profile.sector}</span>`;

    if (profile.disponibleRemoto) {
      puestosBadges += `<span class="badge badge--remote">💻 Remoto</span>`;
    }

    card.innerHTML = `
      <div class="card__header">
        <img class="card__avatar" src="${profile.fotoUrl}" alt="${profile.nombreArtistico}">
        <div class="card__info">
          <h3>${profile.nombreArtistico}</h3>
          <span class="card__location">📍 ${profile.comunidadAutonoma}</span>
        </div>
      </div>
      <div class="card__badges">
        ${puestosBadges}
      </div>
      <p class="card__bio">${profile.bio}</p>
      <div class="card__footer">
        <a href="${profile.portfolioUrl}" target="_blank" rel="noopener" class="card__link">Ver Portfolio →</a>
      </div>
    `;
    container.appendChild(card);
  });
}

function filterProfiles() {
  const text = document.getElementById('search-input').value.toLowerCase();
  const sector = document.getElementById('sector-filter').value;
  const role = document.getElementById('role-filter').value;
  const ccaa = document.getElementById('ccaa-filter').value;
  const remoteOnly = document.getElementById('remote-filter').value;

  const filtered = profilesData.filter(p => {
    const matchesText = p.nombreArtistico.toLowerCase().includes(text) || 
                        p.bio.toLowerCase().includes(text) ||
                        (p.puestos && p.puestos.some(r => r.toLowerCase().includes(text)));
    
    const matchesSector = sector === '' || p.sector === sector;
    
    // Filtrado por profesión específica / subcategoría
    const matchesRole = role === '' || (p.puestos && p.puestos.includes(role));
    
    const matchesCCAA = ccaa === '' || p.comunidadAutonoma === ccaa;
    const matchesRemote = remoteOnly === '' || (remoteOnly === 'true' && p.disponibleRemoto === true);

    return matchesText && matchesSector && matchesRole && matchesCCAA && matchesRemote;
  });

  renderProfiles(filtered);
}

// Escuchadores de eventos
document.getElementById('search-input').addEventListener('input', filterProfiles);
document.getElementById('sector-filter').addEventListener('change', filterProfiles);
document.getElementById('role-filter').addEventListener('change', filterProfiles);
document.getElementById('ccaa-filter').addEventListener('change', filterProfiles);
document.getElementById('remote-filter').addEventListener('change', filterProfiles);

document.addEventListener('DOMContentLoaded', loadProfiles);
