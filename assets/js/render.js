// render.js - Encargado de manipular la interfaz y el DOM
const RenderService = {
  gridElement: null,
  counterElement: null,
  modalElement: null,
  modalBodyElement: null,

  init() {
    this.gridElement = document.getElementById("talents-grid");
    this.counterElement = document.getElementById("results-counter");
    this.modalElement = document.getElementById("profile-modal");
    this.modalBodyElement = document.getElementById("modal-body");
    
    // Cerrar modal al hacer clic en el backdrop
    this.modalElement.addEventListener("click", (e) => {
      if (e.target === this.modalElement) this.closeModal();
    });
  },

  renderGrid(talents) {
    this.gridElement.innerHTML = "";
    this.counterElement.textContent = `Mostrando ${talents.length} perfiles`;

    if (talents.length === 0) {
      this.gridElement.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          No se han encontrado perfiles que coincidan con los filtros seleccionados.
        </div>
      `;
      return;
    }

    talents.forEach(talent => {
      const card = document.createElement("article");
      card.className = "card";
      card.onclick = () => this.openModal(talent);

      const toolsHTML = talent.herramientas.slice(0, 3)
        .map(h => `<span class="tag-mini">${h}</span>`).join("");

      card.innerHTML = `
        <img src="${talent.fotoUrl}" alt="${talent.nombre}" class="card-img" loading="lazy">
        <div class="card-body">
          <div class="card-header">
            <h3 class="card-title">${talent.nombre}</h3>
            <span class="card-pronouns">${talent.pronombre}</span>
          </div>
          <p class="card-location">📍 ${talent.ciudad} (${talent.comunidad})</p>
          <span class="card-category">${talent.categoria}</span>
          <p class="card-bio">${talent.bio}</p>
          <div class="card-tags">
            ${toolsHTML}
          </div>
        </div>
      `;

      this.gridElement.appendChild(card);
    });
  },

  openModal(talent) {
    const toolsFull = talent.herramientas.map(h => `<span class="tag-mini">${h}</span>`).join(" ");
    const rolesFull = talent.roles.join(", ");

    this.modalBodyElement.innerHTML = `
      <button class="modal-close" onclick="RenderService.closeModal()">&times;</button>
      <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px;">
        <img src="${talent.fotoUrl}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">
        <div>
          <h2>${talent.nombre}</h2>
          <p style="color: var(--accent);">${talent.pronombre}</p>
          <p style="color: var(--text-muted); font-size: 0.9rem;">📍 ${talent.ciudad}, ${talent.comunidad}</p>
        </div>
      </div>

      <p style="margin-bottom: 12px;"><strong style="color: #a5b4fc;">Categoría:</strong> ${talent.categoria}</p>
      <p style="margin-bottom: 12px;"><strong>Especialidades:</strong> ${rolesFull}</p>
      
      <p style="margin-bottom: 16px; font-size: 0.95rem; line-height: 1.5;">${talent.bio}</p>

      <div style="margin-bottom: 20px;">
        <strong style="display: block; margin-bottom: 6px;">Herramientas / Software:</strong>
        ${toolsFull}
      </div>

      <div style="display: flex; gap: 12px; margin-top: 24px;">
        ${talent.web ? `<a href="${talent.web}" target="_blank" class="btn btn-primary" style="font-size: 0.85rem;">Ver Portfolio / Web</a>` : ''}
        ${talent.contacto ? `<a href="mailto:${talent.contacto}" class="btn" style="background: var(--border-color); color: white; font-size: 0.85rem;">Contactar</a>` : ''}
      </div>
    `;

    this.modalElement.showModal();
  },

  closeModal() {
    this.modalElement.close();
  }
};
