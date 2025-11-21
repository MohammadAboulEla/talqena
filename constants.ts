import { Category, AiModel } from './types';

export const CATEGORIES = Object.values(Category);
export const MODELS = Object.values(AiModel);

export const DEFAULT_PROMPT_TEMPLATE = {
  title: '',
  content: '',
  description: '',
  category: Category.OTHER,
  model: AiModel.GEMINI_2_5_FLASH,
  tags: [],
  isFavorite: false
};

// Limits for local storage safety
export const MAX_IMAGE_SIZE_BYTES = 500 * 1024; // 500KB limit for images