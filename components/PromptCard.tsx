import React from 'react';
import { Prompt, Category } from '../types';
import { Badge } from './Badge';
import { Copy, Star, Edit2, Trash2, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCopy: (text: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ 
  prompt, 
  onEdit, 
  onDelete, 
  onToggleFavorite,
  onCopy
}) => {
  
  const getCategoryColor = (cat: Category) => {
    switch(cat) {
      case Category.CODING: return 'blue';
      case Category.ART: return 'purple';
      case Category.WRITING: return 'green';
      case Category.BUSINESS: return 'orange';
      default: return 'gray';
    }
  };

  return (
    <div className="group relative bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-accent-500/50 hover:bg-slate-800 transition-all duration-300 flex flex-col h-full shadow-lg">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0 pr-4">
           <div className="flex items-center gap-2 mb-1">
              <Badge color={getCategoryColor(prompt.category)}>{prompt.category}</Badge>
              <span className="text-xs text-slate-500 font-mono">{prompt.model}</span>
           </div>
           <h3 className="text-lg font-semibold text-white truncate group-hover:text-accent-400 transition-colors">
             {prompt.title}
           </h3>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(prompt.id); }}
          className={`p-1.5 rounded-lg transition-colors ${prompt.isFavorite ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-500 hover:bg-slate-700 hover:text-slate-300'}`}
        >
          <Star size={18} fill={prompt.isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Image Preview (if exists) */}
      {prompt.imageUrl && (
        <div className="mb-4 w-full h-32 overflow-hidden rounded-lg border border-slate-700/50 bg-slate-900/50 relative">
           <img src={prompt.imageUrl} alt="Prompt example" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
           <div className="absolute top-2 right-2 bg-black/60 rounded p-1">
             <ImageIcon size={12} className="text-white" />
           </div>
        </div>
      )}

      {/* Description or truncated content */}
      <div className="flex-grow">
        <p className="text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed">
          {prompt.description || prompt.content}
        </p>
      </div>

      {/* Tags */}
      {prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {prompt.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-700">#{tag}</span>
          ))}
          {prompt.tags.length > 3 && <span className="text-[10px] text-slate-500">+{prompt.tags.length - 3}</span>}
        </div>
      )}

      {/* Actions Footer */}
      <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between mt-auto">
        <div className="flex gap-2">
          <button 
            onClick={() => onCopy(prompt.content)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="Copy Prompt"
          >
            <Copy size={16} />
          </button>
          <button 
            onClick={() => onEdit(prompt)}
            className="p-2 text-slate-400 hover:text-accent-400 hover:bg-slate-700 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
        </div>
        
        <button 
          onClick={() => onDelete(prompt.id)}
          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};