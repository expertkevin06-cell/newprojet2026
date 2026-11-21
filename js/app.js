// Le mot de passe exigé pour entrer
const ADMIN_PASSWORD = "Kevin83600";

function checkPassword() {
  const input = document.getElementById('passwordInput').value;
  const errorMsg = document.getElementById('errorMsg');
  
  // Vérification directe
  if (input === ADMIN_PASSWORD) {
    // Succès : on cache l'écran de verrouillage et on montre l'app
    document.getElementById('lockScreen').style.display = 'none';
    document.getElementById('appContent').style.display = 'block';
    
    // Mémoriser que l'utilisateur est connecté pour cette session
    sessionStorage.setItem('isUnlocked', 'true');
  } else {
    // Échec : on affiche l'erreur et on vide le champ
    errorMsg.style.display = 'block';
    document.getElementById('passwordInput').value = '';
  }
}

// Vérifier si l'utilisateur a déjà entré le mot de passe lors de cette session
document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('isUnlocked') === 'true') {
    document.getElementById('lockScreen').style.display = 'none';
    document.getElementById('appContent').style.display = 'block';
  }
});
