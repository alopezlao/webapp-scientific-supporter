const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const Database = require('better-sqlite3')

let db = null

function nowIso() {
  return new Date().toISOString()
}

function hashPassword(password, salt) {
  const useSalt = salt || crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, useSalt, 100000, 64, 'sha512').toString('hex')
  return { hash, salt: useSalt }
}

function verifyPassword(password, hash, salt) {
  const input = hashPassword(password, salt)
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(input.hash, 'hex'))
}

function mapUser(row) {
  if (!row) return null
  return {
    id: row.id,
    email: row.email,
    name: row.name || undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function initLocalDb(dbPath) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'active',
      start_date TEXT,
      end_date TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS datasets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      data_type TEXT,
      file_size INTEGER,
      file_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT,
      tags TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS publications (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      journal TEXT,
      doi TEXT,
      published_date TEXT,
      url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `)
}

function requireDb() {
  if (!db) throw new Error('Local database not initialized')
  return db
}

function tableExists(table) {
  return ['projects', 'datasets', 'notes', 'publications'].includes(table)
}

function listRecords(table, page = 1, perPage = 50) {
  if (!tableExists(table)) throw new Error(`Unsupported table: ${table}`)
  const safePage = Math.max(1, page)
  const safePerPage = Math.max(1, perPage)
  const offset = (safePage - 1) * safePerPage
  const database = requireDb()
  const items = database
    .prepare(`SELECT * FROM ${table} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .all(safePerPage, offset)
  const totalRow = database.prepare(`SELECT COUNT(*) as total FROM ${table}`).get()
  return { items, total: totalRow?.total || 0 }
}

function getRecord(table, id) {
  if (!tableExists(table)) throw new Error(`Unsupported table: ${table}`)
  const database = requireDb()
  return database.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id) || null
}

function createRecord(table, data) {
  if (!tableExists(table)) throw new Error(`Unsupported table: ${table}`)
  const database = requireDb()
  const id = data.id || crypto.randomUUID()
  const timestamp = nowIso()
  const payload = {
    ...data,
    id,
    created_at: timestamp,
    updated_at: timestamp,
  }
  const entries = Object.entries(payload).filter(([, value]) => value !== undefined)
  const columns = entries.map(([key]) => key).join(', ')
  const placeholders = entries.map(() => '?').join(', ')
  const values = entries.map(([, value]) => value)
  database.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`).run(...values)
  return getRecord(table, id)
}

function updateRecord(table, id, data) {
  if (!tableExists(table)) throw new Error(`Unsupported table: ${table}`)
  const database = requireDb()
  const payload = { ...data, updated_at: nowIso() }
  const entries = Object.entries(payload).filter(([, value]) => value !== undefined)
  const assignments = entries.map(([key]) => `${key} = ?`).join(', ')
  const values = entries.map(([, value]) => value)
  database.prepare(`UPDATE ${table} SET ${assignments} WHERE id = ?`).run(...values, id)
  return getRecord(table, id)
}

function deleteRecord(table, id) {
  if (!tableExists(table)) throw new Error(`Unsupported table: ${table}`)
  const existing = getRecord(table, id)
  if (!existing) return null
  const database = requireDb()
  database.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id)
  return existing
}

function signUp({ email, password, name }) {
  const database = requireDb()
  const normalizedEmail = String(email || '').trim().toLowerCase()
  if (!normalizedEmail || !password) throw new Error('Email y contrasena son obligatorios')
  const exists = database.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail)
  if (exists) throw new Error('Ya existe una cuenta con ese correo')
  const id = crypto.randomUUID()
  const timestamp = nowIso()
  const { hash, salt } = hashPassword(password)
  database
    .prepare(
      'INSERT INTO users (id, email, name, password_hash, password_salt, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    .run(id, normalizedEmail, name || null, hash, salt, timestamp, timestamp)
  return mapUser(database.prepare('SELECT * FROM users WHERE id = ?').get(id))
}

function login({ email, password }) {
  const database = requireDb()
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const row = database.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail)
  if (!row || !verifyPassword(password || '', row.password_hash, row.password_salt)) {
    throw new Error('Credenciales invalidas')
  }
  return mapUser(row)
}

function upsertGoogleUser({ email, name, avatar }) {
  const database = requireDb()
  const normalizedEmail = String(email || '').trim().toLowerCase()
  if (!normalizedEmail) throw new Error('Email de Google invalido')
  const existing = database.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail)
  const timestamp = nowIso()
  if (existing) {
    database
      .prepare('UPDATE users SET name = ?, updated_at = ? WHERE email = ?')
      .run(name || existing.name || null, timestamp, normalizedEmail)
    return mapUser(database.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail))
  }
  const id = crypto.randomUUID()
  const pseudoSecret = crypto.randomBytes(32).toString('hex')
  const { hash, salt } = hashPassword(pseudoSecret)
  database
    .prepare(
      'INSERT INTO users (id, email, name, password_hash, password_salt, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    .run(id, normalizedEmail, name || null, hash, salt, timestamp, timestamp)
  return mapUser(database.prepare('SELECT * FROM users WHERE id = ?').get(id))
}

module.exports = {
  initLocalDb,
  listRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  signUp,
  login,
  upsertGoogleUser,
}

