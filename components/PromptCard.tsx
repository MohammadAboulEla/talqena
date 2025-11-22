import React from 'react';
import { Prompt, Category } from '../types';
import { Badge } from './Badge';
import { Copy, Star, Edit2, Trash2, Image as ImageIcon, ExternalLink, ArrowBigUp, MessageSquare } from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCopy: (text: string) => void;
  onSelectTag: (tag: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onEdit,
  onDelete,
  onToggleFavorite,
  onCopy,
  onSelectTag
}) => {

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case Category.CODING: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case Category.ART: return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case Category.WRITING: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case Category.BUSINESS: return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="group relative bg-theme-card border border-theme-border rounded-xl p-5 hover:border-theme-accent/50 hover:bg-theme-card transition-all duration-300 flex flex-col h-full shadow-lg">

      {/* Header Image/Gradient */}
      <div className={`-mx-5 -mt-5 mb-4 rounded-t-xl relative overflow-hidden ${prompt.imageUrl ? 'h-32' : 'h-14 bg-gradient-to-br'} ${!prompt.imageUrl ? getGradient(prompt.category) : ''}`}>
        {prompt.imageUrl && (
          <img src={prompt.imageUrl} alt={prompt.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        )}
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(prompt.id); }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${prompt.isFavorite ? 'bg-yellow-400/20 text-yellow-400' : 'bg-black/30 text-white hover:bg-black/50'}`}
          >
            <Star size={16} fill={prompt.isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${getCategoryColor(prompt.category)} border`}>
            {prompt.category}
          </span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-theme-text mb-2 line-clamp-1 group-hover:text-theme-accent transition-colors">{prompt.title}</h3>

      <p className={`text-theme-text-dim text-sm mb-4 flex-grow leading-relaxed ${prompt.imageUrl ? 'line-clamp-2' : 'line-clamp-6'}`}>
        {prompt.description || prompt.content}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {prompt.tags.slice(0, 3).map(tag => (
          <button
            key={tag}
            onClick={(e) => { e.stopPropagation(); onSelectTag(tag); }}
            className="text-xs text-theme-text-dim bg-theme-element px-2 py-1 rounded-md border border-theme-border hover:border-theme-accent hover:text-theme-text transition-colors"
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-theme-border flex items-center justify-between mt-auto">
        <div className="flex items-center gap-4 text-theme-text-dim">
          {/* Stats removed per user request */}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => onCopy(prompt.content)} className="p-1.5 text-theme-text-dim hover:text-theme-text hover:bg-theme-border rounded-lg transition-colors" title="Copy">
            <Copy size={16} />
          </button>
          <button onClick={() => onEdit(prompt)} className="p-1.5 text-theme-text-dim hover:text-theme-text hover:bg-theme-border rounded-lg transition-colors" title="Edit">
            <Edit2 size={16} />
          </button>
          <button onClick={() => onDelete(prompt.id)} className="p-1.5 text-theme-text-dim hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper for gradients
const getGradient = (cat: Category) => {
  switch (cat) {
    case Category.CODING: return 'from-blue-600 to-cyan-500';
    case Category.ART: return 'from-purple-600 to-pink-500';
    case Category.WRITING: return 'from-emerald-600 to-teal-500';
    case Category.BUSINESS: return 'from-orange-600 to-amber-500';
    default: return 'from-slate-700 to-slate-600';
  }
};