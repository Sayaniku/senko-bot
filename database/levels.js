const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, '..', 'levels.db'));

// Création des tables si elles n'existent pas
db.prepare(`
  CREATE TABLE IF NOT EXISTS levels (
    userId TEXT,
    guildId TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 0,
    PRIMARY KEY (userId, guildId)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS level_settings (
    guildId TEXT PRIMARY KEY,
    enabled INTEGER DEFAULT 1,
    disabledChannels TEXT DEFAULT '[]'
  )
`).run();

/** Fonctions NIVEAUX **/

function getLevel(userId, guildId) {
  return db.prepare(`SELECT * FROM levels WHERE userId = ? AND guildId = ?`).get(userId, guildId);
}

function setLevel(userId, guildId, xp, level) {
  db.prepare(
    `INSERT INTO levels (userId, guildId, xp, level)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(userId, guildId) DO UPDATE SET xp=excluded.xp, level=excluded.level`
  ).run(userId, guildId, xp, level);
}

function createLevel(userId, guildId, xp) {
  db.prepare(`INSERT INTO levels (userId, guildId, xp, level) VALUES (?, ?, ?, 0)`).run(userId, guildId, xp);
}

// *** AJOUTE CETTE FONCTION ***
function getAllLevels(guildId) {
  return db.prepare('SELECT userId, level, xp FROM levels WHERE guildId = ?').all(guildId);
}

/** Fonctions REGLAGES **/

function getSettings(guildId) {
  const row = db.prepare(`SELECT * FROM level_settings WHERE guildId = ?`).get(guildId);
  if (!row) return { enabled: true, disabledChannels: [] };
  return {
    enabled: !!row.enabled,
    disabledChannels: JSON.parse(row.disabledChannels),
  };
}

function setEnabled(guildId, enabled) {
  db.prepare(
    `INSERT INTO level_settings (guildId, enabled, disabledChannels)
     VALUES (?, ?, ?)
     ON CONFLICT(guildId) DO UPDATE SET enabled=excluded.enabled`
  ).run(guildId, enabled ? 1 : 0, '[]');
}

function disableChannel(guildId, channelId) {
  const settings = getSettings(guildId);
  if (!settings.disabledChannels.includes(channelId)) settings.disabledChannels.push(channelId);
  db.prepare(
    `INSERT INTO level_settings (guildId, enabled, disabledChannels)
     VALUES (?, ?, ?)
     ON CONFLICT(guildId) DO UPDATE SET disabledChannels=excluded.disabledChannels`
  ).run(guildId, settings.enabled ? 1 : 0, JSON.stringify(settings.disabledChannels));
}

function enableChannel(guildId, channelId) {
  const settings = getSettings(guildId);
  const filtered = settings.disabledChannels.filter((id) => id !== channelId);
  db.prepare(
    `INSERT INTO level_settings (guildId, enabled, disabledChannels)
     VALUES (?, ?, ?)
     ON CONFLICT(guildId) DO UPDATE SET disabledChannels=excluded.disabledChannels`
  ).run(guildId, settings.enabled ? 1 : 0, JSON.stringify(filtered));
}

module.exports = {
  getLevel, setLevel, createLevel,
  getAllLevels, // <-- AJOUTE CETTE LIGNE
  getSettings, setEnabled, disableChannel, enableChannel,
};