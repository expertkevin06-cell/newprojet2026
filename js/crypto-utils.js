// Utilitaires de hachage PBKDF2 pour le mot de passe admin.
// Aucune valeur par défaut : si aucun hash n'existe, l'utilisateur doit en définir un.

const PBKDF2_ITERATIONS = 600000; // recommandation OWASP
const SALT_BYTES = 16;
const KEY_BITS = 256;

function toBase64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}
function fromBase64(str) {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

async function pbkdf2Hash(password, salt) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: PBKDF2_ITERATIONS },
    key,
    KEY_BITS
  );
  return new Uint8Array(bits);
}

// Retourne "sel_base64:hash_base64"
async function createPasswordRecord(password) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await pbkdf2Hash(password, salt);
  return `${toBase64(salt)}:${toBase64(hash)}`;
}

async function verifyPassword(password, record) {
  if (!record || !record.includes(":")) return false;
  const [saltB64, hashB64] = record.split(":");
  const salt = fromBase64(saltB64);
  const expected = fromBase64(hashB64);
  const actual = await pbkdf2Hash(password, salt);
  if (actual.length !== expected.length) return false;
  // comparaison à temps constant
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
  return diff === 0;
}
