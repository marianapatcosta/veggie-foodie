export const DATABASE_NAME = 'veggie-foodie'

export const CREATE_TABLES = `
    CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY NOT NULL,
    title TEXT UNIQUE NOT NULL,
    description TEXT,
    imageUrl TEXT,
    location TEXT,
    date DATE,
    created INTEGER DEFAULT (strftime('%s', 'now'))
  );

  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY NOT NULL,
    title TEXT UNIQUE NOT NULL,
    imageUrl TEXT,
    ingredients TEXT,
    preparation TEXT,
    source TEXT,
    created INTEGER DEFAULT (strftime('%s', 'now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY NOT NULL,
    title TEXT UNIQUE NOT NULL,
    description TEXT,
    imageUrl TEXT,
    store TEXT,
    date DATE,
    created INTEGER DEFAULT (strftime('%s', 'now'))
  );
`

export const GET_ITEM_BY_ID_STATEMENT = (collection, itemId) =>
  `SELECT * FROM ${collection} WHERE id = ${itemId};`

export const INSERT_ITEM_STATEMENT = (collection, fields) =>
  `INSERT INTO ${collection} (${fields.join(', ')}) VALUES(${'?, '
    .repeat(fields.length)
    .slice(0, -2)});`

export const EDIT_ITEM_STATEMENT = (collection, fields, itemId) =>
  `UPDATE ${collection} SET ${fields
    .map(field => `${field} = ?`)
    .join(', ')} WHERE id = ${itemId};`

export const DELETE_BY_ID_STATEMENT = (collection, itemId) =>
  `DELETE FROM ${collection} WHERE id = ${itemId};`

export const COUNT_STATEMENT = collection =>
  `SELECT COUNT(*) FROM ${collection};`

export const COUNT_STATEMENT_SEARCH = (collection, keyword) =>
  `SELECT COUNT(*) FROM ${collection} WHERE title LIKE "%${keyword}%";`

export const GET_ITEMS_STATEMENT = (
  collection,
  orderBy,
  order,
  numberOfMealsToLoad,
  firstItemToFetch
) =>
  `SELECT * FROM ${collection} ORDER BY ${orderBy} ${order} LIMIT ${numberOfMealsToLoad}${
    firstItemToFetch ? ` OFFSET ${firstItemToFetch}` : ''
  };`

export const GET_ITEMS_STATEMENT_SEARCH = (
  collection,
  orderBy,
  order,
  numberOfMealsToLoad,
  keyword,
  firstItemToFetch
) =>
  `SELECT * FROM ${collection} WHERE title LIKE "%${keyword}%" ORDER BY ${orderBy} ${order} LIMIT ${numberOfMealsToLoad} ${
    firstItemToFetch ? ` OFFSET ${firstItemToFetch}` : ''
  };`
