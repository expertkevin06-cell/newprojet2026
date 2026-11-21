// Hash SHA-256 du mot de passe "Kevin83600"
// (Le mot de passe en clair n'est pas visible dans le code)
const ADMIN_PASSWORD_HASH = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"; // <-- ATTENTION : ceci est un exemple, voir explication ci-dessous

// Fonction pour calculer le hash SHA-256 d'une chaîne
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function checkPassword() {
  const input = document.getElementById('passwordInput').value;
  const errorMsg = document.getElementById('errorMsg');
  
  // Calculer le hash du mot de passe saisi
  const inputHash = await sha256(input);
  
  // Comparer avec le hash attendu
  if (inputHash === ADMIN_PASSWORD_HASH) {
    // Succès
    document.getElementById('lockScreen').style.display = 'none';
    document.getElementById('appContent').style.display = 'block';
    sessionStorage.setItem('isUnlocked', 'true');
    // Afficher le bouton admin (optionnel)
    document.getElementById('adminBtn').classList.remove('hidden');
  } else {
    // Échec
    errorMsg.style.display = 'block';
    document.getElementById('passwordInput').value = '';
  }
}

// Vérifier si déjà déverrouillé
if (sessionStorage.getItem('isUnlocked') === 'true') {
  document.getElementById('lockScreen').style.display = 'none';
  document.getElementById('appContent').style.display = 'block';
  document.getElementById('adminBtn').classList.remove('hidden');
}
