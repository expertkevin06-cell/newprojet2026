const THIRD_PARTY_KEY = 'thirdPartyAccess';

function getAccessList() {
  return JSON.parse(localStorage.getItem(THIRD_PARTY_KEY) || '{}');
}
function saveAccessList(list) {
  localStorage.setItem(THIRD_PARTY_KEY, JSON.stringify(list));
}

function grantAccess(name) {
  const list = getAccessList();
  list[name] = { status: 'granted', date: new Date().toISOString() };
  saveAccessList(list);
  renderAccessList();
}

function revokeAccess(name) {
  const list = getAccessList();
  if (list[name]) {
    list[name].status = 'revoked';
    list[name].date = new Date().toISOString();
    saveAccessList(list);
  }
  renderAccessList();
}

function deleteAccess(name) {
  const list = getAccessList();
  delete list[name];
  saveAccessList(list);
  renderAccessList();
}

function renderAccessList() {
  const container = document.getElementById('accessList');
  if (!container) return;

  const list = getAccessList();
  container.innerHTML = '';

  const entries = Object.entries(list);
  if (!entries.length) {
    container.innerHTML = '<p style="color:#94a3b8;font-size:0.9rem;">Aucun accès tiers enregistré.</p>';
    return;
  }

  entries.forEach(([name, data]) => {
    const div = document.createElement('div');
    div.className = `access-item ${data.status}`;
    div.innerHTML = `
      <span>${name} — ${data.status === 'granted' ? '✅ Autorisé' : '❌ Révoqué'}</span>
      <span>
        <button class="btn btn-danger" data-action="revoke" data-name="${name}">Révoquer</button>
        <button class="btn btn-primary" data-action="delete" data-name="${name}" style="margin-left:4px;">Supprimer</button>
      </span>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('button[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      if (btn.dataset.action === 'revoke') revokeAccess(name);
      if (btn.dataset.action === 'delete') deleteAccess(name);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addAccessBtn');
  const input  = document.getElementById('thirdPartyName');
  if (addBtn && input) {
    addBtn.addEventListener('click', () => {
      const name = input.value.trim();
      if (!name) return;
      grantAccess(name);
      input.value = '';
    });
  }
  renderAccessList();
});
