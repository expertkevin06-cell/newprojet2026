CREATE TABLE IF NOT EXISTS admin_devices (
  installation_id TEXT PRIMARY KEY,
  added_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS authorized_devices (
  installation_id TEXT PRIMARY KEY,
  added_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS access_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  installation_id TEXT NOT NULL,
  requested_at TEXT DEFAULT (datetime('now')),
  status TEXT DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS invitations (
  token TEXT PRIMARY KEY,
  created_at TEXT DEFAULT (datetime('now')),
  used_at TEXT,
  expires_at TEXT
);
