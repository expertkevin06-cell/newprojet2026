document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById('passwordStatus');
  const input    = document.getElementById('newPassword');
  const confirm  = document.getElementById('confirmPassword');
  const saveBtn  = document.getElementById('savePasswordBtn');
  const resetBtn = document.getElementById('resetPasswordBtn');

  const RECORD_KEY = 'adminPasswordRecord';
  const LOCK_KEY   = 'adminLockUntil';
  const ATTEMPT_KEY = 'adminAttempts';

  function refreshStatus() {
    const record = localStorage.getItem(RECORD_KEY);
    if (record) {
      statusEl.textContent = '✅ Un mot de passe administrateur est défini.';
      statusEl.className = 'ok';
    } else {
      statusEl.textContent = '⚠️ Aucun mot de passe défini. Définissez-en un maintenant (aucune valeur par défaut).';
      statusEl.className = 'warn';
    }
  }
  refreshStatus();

  saveBtn.addEventListener('click', async () => {
    const pwd = input.value.trim();
    const pwd2 = confirm.value.trim();
    if (pwd.length < 8) {
      statusEl.textContent = 'Le mot de passe doit contenir au moins 8 caractères.';
      statusEl.className = 'err';
      return;
    }
    if (pwd !== pwd2) {
      statusEl.textContent = 'Les deux mots de passe ne correspondent pas.';
      statusEl.className = 'err';
      return;
    }
    statusEl.textContent = 'Calcul du hash…';
    statusEl.className = '';
    const record = await createPasswordRecord(pwd);
    localStorage.setItem(RECORD_KEY, record);
    localStorage.removeItem(ATTEMPT_KEY);
    input.value = '';
    confirm.value = '';
    refreshStatus();
  });

  resetBtn.addEventListener('click', () => {
    if (!confirm('Supprimer le mot de passe administrateur existant ?')) return;
    localStorage.removeItem(RECORD_KEY);
    localStorage.removeItem(LOCK_KEY);
    localStorage.removeItem(ATTEMPT_KEY);
    refreshStatus();
  });
});
