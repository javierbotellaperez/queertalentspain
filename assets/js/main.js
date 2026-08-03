document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("talents-grid");

  function renderCards(list) {
    container.innerHTML = "";
    list.forEach(talent => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <img src="${talent.fotoUrl}" alt="${talent.nombre}">
        <h3>${talent.nombre}</h3>
        <p style="color: #666; font-size: 14px;">${talent.pronombre} • ${talent.ciudad} (${talent.comunidad})</p>
        <span class="tag">${talent.categoria}</span>
        <p style="margin-top: 12px; font-size: 14px;">${talent.bio}</p>
      `;
      container.appendChild(card);
    });
  }

  renderCards(MOCK_TALENTS);
});