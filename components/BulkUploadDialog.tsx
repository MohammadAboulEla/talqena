import React, { useState } from 'react';
import { Category, AiModel } from '../types';
import { CATEGORIES, MODELS } from '../constants';
import { Button } from './Button';
import { X } from 'lucide-react';

interface BulkUploadDialogProps {
    onConfirm: (options: BulkUploadOptions) => void;
    onCancel: () => void;
    availableTags: string[];
}

export interface BulkUploadOptions {
    category: Category;
    model: AiModel;
    tags: string[];
    description: string;
}

export const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({ onConfirm, onCancel, availableTags }) => {
    const [category, setCategory] = useState<Category>(Category.OTHER);
    const [model, setModel] = useState<AiModel>(AiModel.GEMINI_2_5_FLASH);
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [description, setDescription] = useState('');
    const [selectedTagIndex, setSelectedTagIndex] = useState(-1);

    // Filter available tags based on input
    const filteredTags = React.useMemo(() => {
        if (!tagInput.trim()) return [];
        return availableTags.filter(t =>
            t.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(t)
        );
    }, [tagInput, availableTags, tags]);

    React.useEffect(() => {
        setSelectedTagIndex(-1);
    }, [tagInput]);

    const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedTagIndex >= 0 && filteredTags[selectedTagIndex]) {
                addTag(filteredTags[selectedTagIndex]);
            } else if (tagInput.trim()) {
                addTag(tagInput.trim());
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedTagIndex(prev => Math.min(prev + 1, filteredTags.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedTagIndex(prev => Math.max(prev - 1, -1));
        }
    };

    const addTag = (tag: string) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
        setTagInput('');
        setSelectedTagIndex(-1);
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleConfirm = () => {
        // Auto-save pending tag if user didn't press Enter
        const finalTags = [...tags];
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            finalTags.push(tagInput.trim());
        }

        onConfirm({
            category,
            model,
            tags: finalTags,
            description
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-theme-border flex justify-between items-center sticky top-0 bg-theme-card rounded-t-2xl z-10">
                    <h2 className="text-2xl font-bold text-theme-text">
                        Bulk Upload Options
                    </h2>
                    <button onClick={onCancel} className="text-theme-text-dim hover:text-theme-text transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">

                    <div className="bg-theme-element/50 border border-theme-border rounded-lg p-4 mb-4">
                        <p className="text-sm text-theme-text-dim">
                            Configure the default settings for all prompts that will be imported from the text file.
                            Each line in the file will become a separate prompt with these settings.
                        </p>
                    </div>

                    {/* Category & Model */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    {/* Description (Optional) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-theme-text-dim">Description / Usage Notes (Optional)</label>
                        <input
                            type="text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Brief context on how to use these prompts..."
                            className="w-full bg-theme-element border border-theme-border rounded-lg px-4 py-2.5 text-theme-text focus:ring-2 focus:ring-theme-accent outline-none"
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-theme-text-dim">Tags (Press Enter)</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={handleTagInputKeyDown}
                                placeholder="Add tag..."
                                autoComplete="off"
                                className="w-full bg-theme-element border border-theme-border rounded-lg px-4 py-2.5 text-theme-text focus:ring-2 focus:ring-theme-accent outline-none"
                            />
                            {tagInput && filteredTags.length > 0 && (
                                <div className="absolute z-[100] w-full mt-1 bg-theme-element border border-theme-border rounded-lg shadow-xl shadow-black/50 max-h-40 overflow-y-auto">
                                    {filteredTags.map((tag, index) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => addTag(tag)}
                                            className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 group ${index === selectedTagIndex
                                                ? 'bg-theme-accent text-white'
                                                : 'text-theme-text hover:bg-theme-accent hover:text-white'
                                                }`}
                                        >
                                            <span className={`text-theme-text-dim ${index === selectedTagIndex ? 'text-white/70' : 'group-hover:text-white/70'}`}>#</span>
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
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

                {/* Footer */}
                <div className="p-6 border-t border-theme-border flex justify-end gap-3 bg-theme-card rounded-b-2xl sticky bottom-0">
                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button variant="primary" onClick={handleConfirm}>Continue Upload</Button>
                </div>
            </div>
        </div>
    );
};
