export const isArray = (arr: unknown[]): boolean => Array.isArray(arr);

export const isEmptyArray = (arr: unknown[]): boolean =>
  isArray(arr) && arr.length === 0;

export const isNonEmptyArray = (arr: unknown[]): boolean =>
  isArray(arr) && arr.length > 0;

export const createArray = (length: number): unknown[] =>
  Array.from({ length });
