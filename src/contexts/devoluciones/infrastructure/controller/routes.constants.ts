export const DEVOLUCIONES_ROUTES = {
  BASE: 'api/returns',
  BY_ID: 'api/returns/:id',
  APPROVE: 'api/returns/:id/approve',
  REJECT: 'api/returns/:id/reject',
  RECEIVE: 'api/returns/:id/receive',
  ISSUE_REFUND: 'api/returns/:id/refund',
} as const;
