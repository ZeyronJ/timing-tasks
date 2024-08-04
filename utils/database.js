import * as SQLite from 'expo-sqlite';

export const openDatabase = () => {
  return SQLite.openDatabaseSync('tasks.db', { useNewConnection: true });
};

export const createTable = (db) => {
  // Eliminar tabla de tareas
  // db.execSync('DROP TABLE IF EXISTS tasks');
  // db.execSync('DROP TABLE IF EXISTS pages');
  // db.execSync('DROP TABLE IF EXISTS config');
  db.execSync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page INTEGER NOT NULL,
      title TEXT NOT NULL,
      duration INTEGER NOT NULL,
      rest INTEGER NOT NULL,
      startTime TEXT NOT NULL DEFAULT 'No especificado',
      endTime TEXT NOT NULL DEFAULT 'No especificado',
      fixed INTEGER NOT NULL DEFAULT 0,
      disabled INTEGER NOT NULL DEFAULT 0
    )
  `);
  // db.execSync(`
  //   CREATE TABLE IF NOT EXISTS pages (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT)
  // `);
  db.execSync(`
    CREATE TABLE IF NOT EXISTS config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startDay INTEGER NOT NULL DEFAULT 0,
    temporizador INTEGER NOT NULL DEFAULT 0,
    colorScheme TEXT NOT NULL DEFAULT 'light',
    selectedPage INTEGER NOT NULL DEFAULT 1
    )`);
};

export const saveScheme = (db, colorScheme) => {
  db.execSync(`UPDATE config SET colorScheme = '${colorScheme}' WHERE id = 1`);
};
