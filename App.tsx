import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { PromptCard } from './components/PromptCard';
import { PromptForm } from './components/PromptForm';
import { Button } from './components/Button';
import { Prompt, Category, AiModel, PromptFilter } from './types';
import { getPrompts, savePrompts } from './services/storage';
import { Search, Plus, SlidersHorizontal, Star, Menu } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [filters, setFilters] = useState<PromptFilter>({
    search: '',
    category: 'All',
    model: 'All',
    favoritesOnly: false
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load Data
  useEffect(() => {
    const loaded = getPrompts();
    setPrompts(loaded);
  }, []);

  // Save Data
  useEffect(() => {
    if (prompts.length > 0) {
      savePrompts(prompts);
    }
  }, [prompts]);

  // Handlers
  const handleSave = (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    let newPrompts;

    if (editingPrompt) {
      // Update
      newPrompts = prompts.map(p => p.id === editingPrompt.id ? {
        ...p,
        ...data,
        updatedAt: now
      } : p);
    } else {
      // Create
      const newPrompt: Prompt = {
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        ...data
      };
      newPrompts = [newPrompt, ...prompts];
    }

    setPrompts(newPrompts);
    setIsFormOpen(false);
    setEditingPrompt(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      const newPrompts = prompts.filter(p => p.id !== id);
      setPrompts(newPrompts);
      if (newPrompts.length === 0) localStorage.removeItem('talqena_prompts_v1'); // clean up if empty
      else savePrompts(newPrompts);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setPrompts(prompts.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const openCreate = () => {
    setEditingPrompt(null);
    setIsFormOpen(true);
  };

  const openEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsFormOpen(true);
  };

  // Filtering Logic
  const filteredPrompts = useMemo(() => {
    return prompts.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.content.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(filters.search.toLowerCase()));
      const matchesCategory = filters.category === 'All' || p.category === filters.category;
      const matchesFavorite = !filters.favoritesOnly || p.isFavorite;

      return matchesSearch && matchesCategory && matchesFavorite;
    });
  }, [prompts, filters]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">

      {/* Sidebar */}
      <div className={`fixed inset-0 z-40 bg-slate-950/90 md:hidden transition-opacity ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)}></div>
      <div className={`md:block fixed z-50 md:z-0 h-full transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <Sidebar
          selectedCategory={filters.category}
          onSelectCategory={(c) => {
            setFilters({ ...filters, category: c });
            setMobileMenuOpen(false);
          }}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} p-4 md:p-8 min-h-screen flex flex-col`}>

        {/* Top Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-400 hover:text-white"><Menu /></button>
            <h1 className="text-xl font-bold">Talqena</h1>
          </div>

          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search prompts, tags, or content..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={openCreate} icon={<Plus size={18} />}>
              New Prompt
            </Button>
            <button
              onClick={() => setFilters(f => ({ ...f, favoritesOnly: !f.favoritesOnly }))}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${filters.favoritesOnly ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
            >
              <Star size={18} fill={filters.favoritesOnly ? "currentColor" : "none"} />
              <span className="hidden sm:inline">Favorites</span>
            </button>


          </div>
        </header>

        {/* Stats / Info */}
        <div className="mb-6 flex items-center text-sm text-slate-500 gap-4">
          <span>{filteredPrompts.length} Prompts found</span>
          {filters.category !== 'All' && <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-slate-500"></div> Category: {filters.category}</span>}
        </div>

        {/* Grid */}
        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20">
            {filteredPrompts.map(prompt => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onEdit={openEdit}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onCopy={handleCopy}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 mt-20">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-1">No prompts found</h3>
            <p className="max-w-xs">Try adjusting your search or filters, or add a new prompt to get started.</p>
            <div className="mt-6">
              <Button onClick={openCreate} variant="secondary">Create Prompt</Button>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {isFormOpen && (
        <PromptForm
          initialData={editingPrompt || undefined}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default App;