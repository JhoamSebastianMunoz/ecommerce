export const CARRITO_ROUTES = {
  BASE: 'api/cart',
  BY_ID: 'api/cart/:cartId',
  ITEMS: 'api/cart/:cartId/items',
  ITEM_BY_PRODUCT: 'api/cart/:cartId/items/:productId',
} as const;
