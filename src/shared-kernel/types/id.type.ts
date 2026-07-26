export type UUID = string & { readonly __brand: unique symbol };

export const UUID = (value: string): UUID => value as UUID;

export type CorrelationId = string & { readonly __brand: unique symbol };

export const CorrelationId = (value: string): CorrelationId =>
  value as CorrelationId;
