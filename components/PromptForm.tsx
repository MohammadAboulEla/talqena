import React, { useState, useEffect } from 'react';
import { Prompt, Category, AiModel } from '../types';
import { CATEGORIES, MODELS, MAX_IMAGE_SIZE_BYTES } from '../constants';
import { Button } from './Button';
import { fileToBase64 } from '../services/storage';
import { enhancePromptContent } from '../services/gemini';
import { X, Upload, Wand2, Image as ImageIcon, Trash } from 'lucide-react';

interface PromptFormProps {
  initialData?: Partial<Prompt>;
  onSave: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const PromptForm: React.FC<PromptFormProps> = ({ initialData, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState<Category>(initialData?.category || Category.OTHER);
  const [model, setModel] = useState<AiModel>(initialData?.model || AiModel.GEMINI_2_5_FLASH);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialData?.imageUrl);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      alert(`Image too large. Please choose an image under ${MAX_IMAGE_SIZE_BYTES / 1024}KB.`);
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setImageUrl(base64);
    } catch (error) {
      console.error("Error processing image", error);
      alert("Failed to process image.");
    }
  };

  const handleEnhance = async () => {
    if (!content.trim()) return;
    setIsEnhancing(true);
    try {
      const improved = await enhancePromptContent(content);
      setContent(improved);
    } catch (e) {
      alert("Could not enhance prompt. Check API Key or connection.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      content,
      description,
      category,
      model,
      tags,
      imageUrl,
      isFavorite: initialData?.isFavorite || false
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-6 border-b border-theme-border flex justify-between items-center sticky top-0 bg-theme-card rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-theme-text">
            {initialData?.id ? 'Edit Prompt' : 'New Prompt'}
          </h2>
          <button onClick={onCancel} className="text-theme-text-dim hover:text-theme-text transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">

          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-theme-text-dim">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Python Script Debugger"
                className="w-full bg-theme-element border border-theme-border rounded-lg px-4 py-2.5 text-theme-text focus:ring-2 focus:ring-theme-accent focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-theme-text-dim">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full bg-theme-element border border-theme-border rounded-lg px-4 py-2.5 text-theme-text focus:ring-2 focus:ring-theme-accent outline-none appearance-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-theme-text-dim">Prompt Content</label>
              <button
                type="button"
                onClick={handleEnhance}
                disabled={isEnhancing || !content}
                className="flex items-center text-xs text-theme-accent hover:text-accent-300 disabled:opacity-50 transition-colors"
              >
                <Wand2 size={14} className={`mr-1 ${isEnhancing ? 'animate-spin' : ''}`} />
                {isEnhancing ? 'Enhancing...' : 'Enhance with Gemini'}
              </button>
            </div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Type your prompt here..."
              className="w-full h-40 bg-theme-element border border-theme-border rounded-lg px-4 py-3 text-theme-text focus:ring-2 focus:ring-theme-accent outline-none font-mono text-sm leading-relaxed resize-y"
              required
            />
          </div>

          {/* Description (Optional) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-theme-text-dim">Description / Usage Notes (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief context on how to use this..."
              className="w-full bg-theme-element border border-theme-border rounded-lg px-4 py-2.5 text-theme-text focus:ring-2 focus:ring-theme-accent outline-none"
            />
          </div>

          {/* Model & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-theme-text-dim">Tested With Model</label>
              <select
                value={model}
                onChange={e => setModel(e.target.value as AiModel)}
                className="w-full bg-theme-element border border-theme-border rounded-lg px-4 py-2.5 text-theme-text focus:ring-2 focus:ring-theme-accent outline-none"
              >
                {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-theme-text-dim">Tags (Press Enter)</label>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag..."
                className="w-full bg-theme-element border border-theme-border rounded-lg px-4 py-2.5 text-theme-text focus:ring-2 focus:ring-theme-accent outline-none"
              />
              <div className="flex flex-wrap gap-2 mt-2 min-h-[24px]">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center bg-theme-element border border-theme-border text-theme-text-dim px-2 py-1 rounded-md text-xs">
                    #{tag}
                    <button onClick={() => removeTag(tag)} className="ml-1 text-theme-text-dim hover:text-theme-text"><X size={12} /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-theme-text-dim">Example Image (Optional)</label>
            {!imageUrl ? (
              <div className="border-2 border-dashed border-theme-border rounded-xl p-6 flex flex-col items-center justify-center hover:border-theme-accent hover:bg-theme-element/50 transition-all group cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="text-theme-text-dim group-hover:text-theme-accent mb-2 transition-colors" size={24} />
                <p className="text-sm text-theme-text-dim group-hover:text-theme-text">Click to upload example (max 500KB)</p>
              </div>
            ) : (
              <div className="relative w-full h-48 bg-theme-bg rounded-xl border border-theme-border overflow-hidden group">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="danger" onClick={() => setImageUrl(undefined)} icon={<Trash size={14} />}>Remove Image</Button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-theme-border flex justify-end gap-3 bg-theme-card rounded-b-2xl sticky bottom-0">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Save Prompt</Button>
        </div>
      </div>
    </div>
  );
};