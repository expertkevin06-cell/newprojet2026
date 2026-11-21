document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById('passwordStatus');
  const input = document.getElementById('newPassword');
  const saveBtn = document.getElementById('savePasswordBtn');

  // Vérifier si un mot de passe existe déjà
  const existing = localStorage.getItem('adminPassword');
  if (existing) {
    statusEl.textContent = '✅ Un mot de passe est déjà défini.';
  } else {
    statusEl.textContent = '⚠️ Aucun mot de passe défini. Définissez-en un maintenant.';
  }

  saveBtn.addEventListener('click', () => {
    const pwd = input.value.trim();
    if (pwd.length < 4) {
      alert('Le mot de passe doit contenir au moins 4 caractères.');
      return;
    }
    // ATTENTION : Stockage en clair, uniquement pour démonstration.
    // En production, utilisez un hachage côté serveur ou au moins un hachage côté client.
    localStorage.setItem('adminPassword', pwd);
    statusEl.textContent = '✅ Mot de passe enregistré.';
    input.value = '';
  });
});
