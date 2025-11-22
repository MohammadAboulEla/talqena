export enum Category {
  CODING = 'Coding',
  WRITING = 'Creative Writing',
  ART = 'Art Generation',
  BUSINESS = 'Business',
  EDUCATION = 'Education',
  DATA = 'Data Analysis',
  OTHER = 'Other'
}

export enum AiModel {
  GEMINI_2_5_FLASH = 'Gemini 2.5 Flash',
  GEMINI_3_PRO = 'Gemini 3.0 Pro',
  GPT_4 = 'GPT-4',
  CLAUDE_3_5 = 'Claude 3.5 Sonnet',
  MISTRAL = 'Mistral Large',
  MIDJOURNEY = 'Midjourney',
  OTHER = 'Other'
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  category: Category;
  model: AiModel;
  tags: string[];
  imageUrl?: string; // Base64 string
  createdAt: number;
  updatedAt: number;
  isFavorite: boolean;
}

export type PromptFilter = {
  search: string;
  category: Category | 'All';
  model: AiModel | 'All';
  favoritesOnly: boolean;
  tag?: string;
};