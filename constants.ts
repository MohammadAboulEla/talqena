import { Category } from './types';

export const CATEGORIES = Object.values(Category);

export const DEFAULT_PROMPT_TEMPLATE = {
  title: '',
  content: '',
  description: '',
  category: Category.OTHER,
  tags: [],
  isFavorite: false
};

// Limits for local storage safety
export const MAX_IMAGE_SIZE_BYTES = 500 * 1024; // 500KB limit for images