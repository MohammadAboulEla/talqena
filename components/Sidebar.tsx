import React from 'react';
import { Category, AiModel } from '../types';
import { Terminal, BookOpen, Briefcase, Code, PenTool, LayoutGrid, MoreHorizontal, Image as ImageIcon } from 'lucide-react';

interface SidebarProps {
  selectedCategory: Category | 'All';
  onSelectCategory: (c: Category | 'All') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onSelectCategory }) => {
  
  const categoriesWithIcons = [
    { name: 'All Prompts', value: 'All', icon: <LayoutGrid size={18} /> },
    { name: Category.CODING, value: Category.CODING, icon: <Code size={18} /> },
    { name: Category.WRITING, value: Category.WRITING, icon: <PenTool size={18} /> },
    { name: Category.ART, value: Category.ART, icon: <ImageIcon size={18} /> },
    { name: Category.BUSINESS, value: Category.BUSINESS, icon: <Briefcase size={18} /> },
    { name: Category.EDUCATION, value: Category.EDUCATION, icon: <BookOpen size={18} /> },
    { name: Category.DATA, value: Category.DATA, icon: <Terminal size={18} /> },
    { name: Category.OTHER, value: Category.OTHER, icon: <MoreHorizontal size={18} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen fixed left-0 top-0 overflow-y-auto hidden md:block">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
           <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-purple-600 rounded-lg flex items-center justify-center">
             <span className="text-white font-bold text-lg">T</span>
           </div>
           <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Talqena</h1>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">Library</p>
          {categoriesWithIcons.map((item) => (
            <button
              key={item.value}
              onClick={() => onSelectCategory(item.value as Category | 'All')}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${selectedCategory === item.value 
                  ? 'bg-accent-600/10 text-accent-400 border border-accent-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
              `}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <h3 className="text-xs font-semibold text-white mb-2">Pro Tip</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
                Use the "Enhance" button when creating prompts to let Gemini optimize your phrasing for better results.
            </p>
        </div>
      </div>
    </aside>
  );
};