document.addEventListener('DOMContentLoaded', () => {
  const moduleSelect = document.getElementById('moduleSelect');
  const moduleFrame = document.getElementById('moduleFrame');
  const adminBtn = document.getElementById('adminBtn');

  // Mapping des modules
  const modules = {
    diagnostic: 'https://expertkevin06-cell.github.io/auto-diagnostic/',
    bykevin: 'https://expertkevin06-cell.github.io/bykevin/',
    aide: 'https://expertkevin06-cell.github.io/mon-aide-technique/',
    incendie: 'https://expertkevin06-cell.github.io/etude-incendie-by-kevin/',
    legal: 'https://auto-legal-by-kevin' // Attention : ce lien peut nécessiter un suffixe
  };

  // Commutation des modules
  moduleSelect.addEventListener('change', (e) => {
    const url = modules[e.target.value];
    if (url) {
      moduleFrame.src = url;
    }
  });

  // Affichage du bouton administrateur (simulation)
  // Dans le code réel, vérifiez si un mot de passe a déjà été défini
  const adminPassword = localStorage.getItem('adminPassword');
  if (!adminPassword) {
    // Première connexion : afficher le bouton pour définir le mot de passe
    adminBtn.classList.remove('hidden');
    adminBtn.textContent = 'Définir le mot de passe admin';
  } else {
    adminBtn.classList.remove('hidden');
    adminBtn.textContent = 'Mode Admin';
  }

  adminBtn.addEventListener('click', () => {
    // Rediriger vers la page de gestion admin (ou afficher une modale)
    window.location.href = 'admin.html';
  });
});
