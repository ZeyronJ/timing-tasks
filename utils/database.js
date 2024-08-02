import * as SQLite from 'expo-sqlite';

export const openDatabase = () => {
  return SQLite.openDatabaseSync('tasks.db', { useNewConnection: true });
};

export const createTable = (db) => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      duration INTEGER NOT NULL,
      rest INTEGER NOT NULL,
      startTime TEXT NOT NULL DEFAULT 'No especificado',
      endTime TEXT NOT NULL DEFAULT 'No especificado',
      fixed INTEGER NOT NULL DEFAULT 0  
    )
  `);
};
