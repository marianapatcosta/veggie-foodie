export const GET_ITEM_BY_ID_STATEMENT = (collection, itemId) =>
  `SELECT * FROM ${collection} WHERE id = ${itemId};`

export const INSERT_ITEM_STATEMENT = (collection, fields) =>
  `INSERT INTO ${collection} (${fields.join(', ')}) VALUES(${'?, '
    .repeat(fields.length)
    .slice(0, -2)});`

export const EDIT_ITEM_STATEMENT = (collection, fields, itemId) =>
  `UPDATE ${collection} SET ${fields.map(field => `${field} = ?`).join(', ')} WHERE id = ${itemId};`

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

const MEALS_METADATA = {
  SAVE_SUCCESS: 'meals.meal',
  FIELDS: ['title', 'description', 'imageUrl', 'location', 'date'],
  ORDER_BY_STORAGE: 'meals-order-by',
  ORDER_STORAGE: 'meals-order',
  ORDER_BY_DEFAULT: 'created'
}

const RECIPES_METADATA = {
  SAVE_SUCCESS: 'meals.meal',
  FIELDS: ['title', 'description', 'imageUrl', 'location', 'date'],
  ORDER_BY_STORAGE: 'recipes-order-by',
  ORDER_STORAGE: 'recipes-order',
  ORDER_BY_DEFAULT: 'created'
}

const PRODUCTS_METADATA = {
  SAVE_SUCCESS: 'meals.meal',
  FIELDS: ['title', 'description', 'imageUrl', 'location', 'date'],
  ORDER_BY_STORAGE: 'products-order-by',
  ORDER_STORAGE: 'products-order',
  ORDER_BY_DEFAULT: 'created'
}

export const CRUD_METADATA = {
  meals: MEALS_METADATA,
  recipes: RECIPES_METADATA,
  products: PRODUCTS_METADATA
}
