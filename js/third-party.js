// Gestion des accès tiers (stockage local)
// Structure : { "nom": { "status": "granted|revoked", "date": "..." } }

const THIRD_PARTY_KEY = 'thirdPartyAccess';

function getAccessList() {
  return JSON.parse(localStorage.getItem(THIRD_PARTY_KEY) || '{}');
}

function grantAccess(name) {
  const list = getAccessList();
  list[name] = { status: 'granted', date: new Date().toISOString() };
  localStorage.setItem(THIRD_PARTY_KEY, JSON.stringify(list));
  renderAccessList();
}

function revokeAccess(name) {
  const list = getAccessList();
  if (list[name]) {
    list[name].status = 'revoked';
    list[name].date = new Date().toISOString();
    localStorage.setItem(THIRD_PARTY_KEY, JSON.stringify(list));
  }
  renderAccessList();
}

function renderAccessList() {
  const container = document.getElementById('accessList');
  if (!container) return;

  const list = getAccessList();
  container.innerHTML = '';

  Object.entries(list).forEach(([name, data]) => {
    const div = document.createElement('div');
    div.className = `access-item ${data.status}`;
    div.innerHTML = `
      <span>${name} — ${data.status === 'granted' ? '✅ Autorisé' : '❌ Révoqué'}</span>
      <button onclick="revokeAccess('${name}')">Révoquer</button>
    `;
    container.appendChild(div);
  });
}

// Ajout d'un nouvel accès
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addAccessBtn');
  const input = document.getElementById('thirdPartyName');
  if (addBtn && input) {
    addBtn.addEventListener('click', () => {
      if (input.value.trim()) {
        grantAccess(input.value.trim());
        input.value = '';
      }
    });
  }
  renderAccessList();
});
