export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    // --- ADMIN : générer un lien d'invitation pour un tiers ---
    // Vous seul appelez cette route avec le mot de passe admin
    if (url.pathname === '/admin/invite' && method === 'POST') {
      const { password } = await request.json();
      if (password !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ ok: false }), { status: 401 });
      }

      const token = crypto.randomUUID();
      const expires = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();

      await env.DB.prepare(
        'INSERT INTO invitations (token, expires_at) VALUES (?, ?)'
      ).bind(token, expires).run();

      // Retourne le lien complet que vous copierez dans votre mail
      return new Response(JSON.stringify({
        ok: true,
        link: `${url.origin}/invite/${token}`
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // --- TIERS : accès via le lien d'invitation reçu par mail ---
    if (url.pathname.startsWith('/invite/') && method === 'GET') {
      const token = url.pathname.split('/invite/')[1];

      const inv = await env.DB.prepare(
        'SELECT * FROM invitations WHERE token = ? AND used_at IS NULL AND expires_at > datetime("now")'
      ).bind(token).first();

      if (!inv) {
        return new Response('Lien invalide ou expiré.', { status: 403 });
      }

      // Marquer le token comme utilisé (usage unique)
      await env.DB.prepare(
        'UPDATE invitations SET used_at = datetime("now") WHERE token = ?'
      ).bind(token).run();

      // Rediriger vers la page de demande d'accès (ou vers l'APK avec un flag)
      return Response.redirect(`${url.origin}/request-page`, 302);
    }

    // --- Vérification admin : mot de passe + installationId admin ---
    if (url.pathname === '/admin/verify' && method === 'POST') {
      const { password, installationId } = await request.json();

      if (password !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ ok: false, reason: 'invalid_password' }), { status: 401 });
      }

      const isAdmin = await env.DB.prepare(
        'SELECT 1 FROM admin_devices WHERE installation_id = ?'
      ).bind(installationId).first();

      if (!isAdmin) {
        return new Response(JSON.stringify({ ok: false, reason: 'not_admin_device' }), { status: 403 });
      }

      const token = crypto.randomUUID();
      return new Response(JSON.stringify({ ok: true, token }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // --- Vérifier l'accès d'un appareil (tiers ou admin) ---
    if (url.pathname === '/check-access' && method === 'POST') {
      const { installationId } = await request.json();
      if (!installationId) {
        return new Response(JSON.stringify({ error: 'Missing installationId' }), { status: 400 });
      }

      const authorized = await env.DB.prepare(
        'SELECT 1 FROM authorized_devices WHERE installation_id = ?'
      ).bind(installationId).first();

      const isAdmin = await env.DB.prepare(
        'SELECT 1 FROM admin_devices WHERE installation_id = ?'
      ).bind(installationId).first();

      return new Response(JSON.stringify({
        authorized: !!authorized,
        isAdmin: !!isAdmin
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // --- Demande d'accès (tiers) ---
    if (url.pathname === '/request-access' && method === 'POST') {
      const { installationId } = await request.json();
      if (!installationId) {
        return new Response(JSON.stringify({ error: 'Missing installationId' }), { status: 400 });
      }

      const existing = await env.DB.prepare(
        "SELECT id FROM access_requests WHERE installation_id = ? AND status = 'pending'"
      ).bind(installationId).first();

      if (!existing) {
        await env.DB.prepare(
          'INSERT INTO access_requests (installation_id) VALUES (?)'
        ).bind(installationId).run();
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // --- Admin : lister les demandes en attente ---
    if (url.pathname === '/admin/list' && method === 'GET') {
      const requests = await env.DB.prepare(
        "SELECT * FROM access_requests WHERE status = 'pending'"
      ).all();
      return new Response(JSON.stringify({ requests: requests.results }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // --- Admin : approuver une demande ---
    if (url.pathname === '/admin/approve' && method === 'POST') {
      const { installationId } = await request.json();
      await env.DB.prepare(
        'INSERT OR REPLACE INTO authorized_devices (installation_id) VALUES (?)'
      ).bind(installationId).run();
      await env.DB.prepare(
        "UPDATE access_requests SET status = 'approved' WHERE installation_id = ?"
      ).bind(installationId).run();
      return new Response(JSON.stringify({ ok: true }));
    }

    // --- Page de demande d'accès pour les tiers invités ---
    if (url.pathname === '/request-page') {
      return new Response(`
        <!DOCTYPE html>
        <html><head><meta charset="utf-8"><title>Demande d'accès</title>
        <style>body{font-family:sans-serif;background:#0f172a;color:#e2e8f0;padding:2rem;text-align:center;}</style>
        </head><body>
        <h2>Demander un accès</h2>
        <p>Cet appareil n'est pas encore autorisé.</p>
        <button onclick="requestAccess()" style="padding:0.8rem 1.5rem;background:#3b82f6;color:white;border:none;border-radius:8px;">Envoyer la demande</button>
        <script>
          let id = localStorage.getItem('installationId');
          if (!id) { id = crypto.randomUUID(); localStorage.setItem('installationId', id); }
          async function requestAccess() {
            await fetch('/request-access', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({installationId:id}) });
            alert('Demande envoyée.');
          }
        </script>
        </body></html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    return new Response('Not found', { status: 404 });
  }
};
