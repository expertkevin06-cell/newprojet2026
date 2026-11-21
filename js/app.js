document.addEventListener('DOMContentLoaded', () => {
  const moduleSelect = document.getElementById('moduleSelect');
  const moduleFrame  = document.getElementById('moduleFrame');
  const techBaseSelect = document.getElementById('techBaseSelect');
  const techContent  = document.getElementById('techContent');
  const adminBtn     = document.getElementById('adminBtn');

  // ---------- Modules (iframe) ----------
  const modules = {
    diagnostic: 'https://expertkevin06-cell.github.io/auto-diagnostic/',
    bykevin:    'https://expertkevin06-cell.github.io/bykevin/',
    aide:       'https://expertkevin06-cell.github.io/mon-aide-technique/',
    incendie:   'https://expertkevin06-cell.github.io/etude-incendie-by-kevin/',
    tech2026:   'https://expertkevin06-cell.github.io/2026tech/',
    autolegal:  'https://auto-legal-by-kevin.lovable.app/'
  };

  moduleSelect.addEventListener('change', (e) => {
    const url = modules[e.target.value];
    if (url) moduleFrame.src = url;
  });

  // ---------- Bases techniques véhicules ----------
  // Remplacez le contenu de chaque entrée par vos données réelles.
  const techBases = {
    moteur: {
      title: "Moteur / Injection",
      content: "Codes défaut, procédures de diagnostic, schémas d'injection. À compléter avec vos données réelles."
    },
    freinage: {
      title: "Freinage / ABS",
      content: "Valeurs de référence, procédures de purge, codes ABS. À compléter."
    },
    electricite: {
      title: "Électricité / Calculateurs",
      content: "Schémas électriques, affectation des broches, protocoles CAN. À compléter."
    },
    carrosserie: {
      title: "Carrosserie / Structure",
      content: "Points de soudure, tolérances de mesure, procédures de redressage. À compléter."
    },
    legal: {
      title: "Cadre juridique véhicule",
      content: "Qualification juridique, articles applicables, démarches et délais (via Auto-Legal). À compléter."
    }
  };

  techBaseSelect.addEventListener('change', (e) => {
    const base = techBases[e.target.value];
    if (!base) { techContent.innerHTML = ''; return; }
    techContent.innerHTML = `<h3>${base.title}</h3><p>${base.content}</p>`;
  });

  // ---------- Bouton admin ----------
  const record = localStorage.getItem('adminPasswordRecord');
  adminBtn.classList.remove('hidden');
  adminBtn.textContent = record ? 'Mode Admin' : 'Définir le mot de passe admin';
  adminBtn.addEventListener('click', () => {
    window.location.href = 'admin.html';
  });
});
