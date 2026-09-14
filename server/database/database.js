const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'app.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

function getDb() {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  return db;
}

function initializeDatabase() {
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  const db = getDb();

  try {
    db.exec(schema);

    const hasSource = db.prepare(
      "SELECT COUNT(*) AS cnt FROM pragma_table_info('shipments') WHERE name = 'source'"
    ).get();
    if (hasSource.cnt === 0) {
      db.exec("ALTER TABLE shipments ADD COLUMN source TEXT NOT NULL DEFAULT ''");
      console.log('Migrated: added source column to shipments table.');
    }

    console.log('Database initialized successfully at:', DB_PATH);
  } catch (error) {
    console.error('Error initializing database:', error.message);
    throw error;
  } finally {
    db.close();
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = { getDb, initializeDatabase, DB_PATH };
