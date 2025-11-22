export enum Category {
  CODING = 'Coding',
  WRITING = 'Creative Writing',
  ART = 'Art Generation',
  BUSINESS = 'Business',
  EDUCATION = 'Education',
  DATA = 'Data Analysis',
  OTHER = 'Other'
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  category: Category;
  tags: string[];
  imageUrl?: string; // Base64 string
  createdAt: number;
  updatedAt: number;
  isFavorite: boolean;
}

export type PromptFilter = {
  search: string;
  category: Category | 'All';
  favoritesOnly: boolean;
  tag?: string;
};