export const PAGOS_ROUTES = {
  BASE: 'api/payments',
  BY_ID: 'api/payments/:id',
  AUTHORIZE: 'api/payments/:id/authorize',
  CAPTURE: 'api/payments/:id/capture',
  REFUND: 'api/payments/:id/refund',
} as const;
