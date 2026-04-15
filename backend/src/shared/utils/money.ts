export const toCents = (value: number): number => Math.round(value * 100);

export const fromCents = (valueInCents: number): number => valueInCents / 100;

export const roundCurrency = (value: number): number => Number(value.toFixed(2));

