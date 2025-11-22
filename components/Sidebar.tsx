import React from 'react';
import { Category, AiModel } from '../types';
import { Terminal, BookOpen, Briefcase, Code, PenTool, LayoutGrid, MoreHorizontal, Image as ImageIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface SidebarProps {
  selectedCategory: Category | 'All';
  onSelectCategory: (c: Category | 'All') => void;
  collapsed: boolean;
  onToggle: () => void;
  onNewPrompt: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onSelectCategory, collapsed, onToggle, onNewPrompt }) => {

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
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-theme-bg border-r border-theme-border h-full transition-all duration-300 relative flex flex-col z-20`}>
      <div className="flex-1">
        <div className={`flex flex-col gap-4 py-4 ${collapsed ? 'items-center' : 'px-4'} `}>

          {/* Logo Area */}
          <div className={`flex items-center gap-3 mb-2 ${collapsed ? 'justify-center' : 'px-2'}`}>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
              {/* Placeholder for logo, using 'T' for now but styled like daily.dev logo */}
              <span className="text-black font-black text-xl">T</span>
            </div>
            {!collapsed && <h1 className="text-xl font-bold text-theme-text whitespace-nowrap">Talqena</h1>}
          </div>

          {/* Navigation */}
          <div className="space-y-1 w-full px-1">
            {categoriesWithIcons.map((item) => (
              <button
                key={item.value}
                onClick={() => onSelectCategory(item.value as Category | 'All')}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${selectedCategory === item.value
                    ? 'bg-theme-element text-theme-text'
                    : 'text-theme-text-dim hover:bg-theme-element hover:text-theme-text'}
                  ${collapsed ? 'justify-center px-0 w-8 h-8 mx-auto' : ''}
                `}
                title={collapsed ? item.name : undefined}
              >
                {React.cloneElement(item.icon as React.ReactElement<any>, {
                  size: 20,
                  className: selectedCategory === item.value ? "text-theme-text" : "text-theme-text-dim group-hover:text-theme-text"
                })}
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-theme-border w-full my-2"></div>

          {/* Extra Actions (Mocking the 'Feed settings', 'Shortcuts' from image) */}
          <div className="space-y-1 w-full">
            <button
              onClick={onNewPrompt}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-theme-text-dim hover:bg-theme-element hover:text-theme-text transition-all duration-200 ${collapsed ? 'justify-center px-0 w-10 h-10 mx-auto' : ''}`}
              title="New Prompt"
            >
              <div className="w-5 h-5 border-2 border-gray-500 rounded-md flex items-center justify-center text-[10px] font-bold">
                <Plus size={12} />
              </div>
              {!collapsed && <span className="font-medium">New Prompt</span>}
            </button>
          </div>

        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-14 w-6 h-6 bg-theme-element border border-theme-border rounded-full flex items-center justify-center text-theme-text-dim hover:text-theme-text transition-colors hidden md:flex z-50 shadow-sm"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};