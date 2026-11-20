// src/constants/productOptions.ts
import type { SelectOption } from '../components/ui/FormSelect';

export const TARGET_GENDERS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Unisex', value: 'unisex' }, // Remove if you strictly want Male/Female only
] as const satisfies readonly SelectOption[];

// Automatically derives: 'male' | 'female' | 'unisex'
export type TargetGender = (typeof TARGET_GENDERS)[number]['value'];