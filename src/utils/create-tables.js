export const CREATE_TABLES = `
    CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    imageUrl TEXT,
    location TEXT,
    date DATE,
    created INTEGER DEFAULT (strftime('%s', 'now'))
  );
`
