import { Prompt } from '../types';

const STORAGE_KEY = 'talqena_prompts_v1';

export const getPrompts = (): Prompt[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load prompts", error);
    return [];
  }
};

export const savePrompts = (prompts: Prompt[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
  } catch (error) {
    console.error("Failed to save prompts. Storage might be full.", error);
    alert("Failed to save! Your browser storage might be full, especially if using many images.");
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};