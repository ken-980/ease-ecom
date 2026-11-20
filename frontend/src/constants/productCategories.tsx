// src/constants/productCategories.ts
import type { SelectOption } from '../components/ui/FormSelect';

export const PRODUCT_CATEGORIES = [
  { label: 'Perfume', value: 'perfume' },
  { label: 'Deodorant', value: 'deodorant' },
  { label: 'Spray', value: 'spray' },
] as const satisfies readonly SelectOption[];

// Automatically derives: 'perfume' | 'deodorant' | 'spray'
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]['value'];



