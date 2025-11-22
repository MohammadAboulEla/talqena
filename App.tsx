import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { PromptCard } from './components/PromptCard';
import { PromptForm } from './components/PromptForm';
import { BulkUploadDialog, BulkUploadOptions } from './components/BulkUploadDialog';
import { ConfirmDialog } from './components/ConfirmDialog';
import { SettingsDialog } from './components/SettingsDialog';
import { Toast } from './components/Toast';
import { Button } from './components/Button';
import { Prompt, PromptFilter } from './types';
import { getPrompts, savePrompts } from './services/storage';
import { imageStorage } from './services/imageStorage';
import { Search, Plus, SlidersHorizontal, Star, Menu, X, Upload } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [filters, setFilters] = useState<PromptFilter>({
    search: '',
    category: 'All',
    favoritesOnly: false,
    tag: undefined
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  // Load Data and Images
  useEffect(() => {
    const loadData = async () => {
      const loaded = getPrompts();

      // Load images from IndexedDB and create Object URLs
      const promptsWithImages = await Promise.all(
        loaded.map(async (prompt) => {
          if (prompt.imageUrl) {
            try {
              const blob = await imageStorage.getImage(prompt.id);
              if (blob) {
                const objectUrl = imageStorage.createObjectURL(blob);
                return { ...prompt, imageUrl: objectUrl };
              }
            } catch (error) {
              console.error(`Failed to load image for prompt ${prompt.id}`, error);
            }
          }
          return prompt;
        })
      );

      setPrompts(promptsWithImages);
    };

    loadData();

    // Cleanup Object URLs on unmount
    return () => {
      prompts.forEach(p => {
        if (p.imageUrl) {
          imageStorage.revokeObjectURL(p.imageUrl);
        }
      });
    };
  }, []);

  // Save Data
  useEffect(() => {
    if (prompts.length > 0) {
      savePrompts(prompts);
    }
  }, [prompts]);

  // Handlers
  const handleSave = async (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>, tempImageId?: string) => {
    const now = Date.now();
    let newPrompts;
    let promptId: string;

    if (editingPrompt) {
      // Update
      promptId = editingPrompt.id;

      // If image changed, handle the image in IndexedDB
      if (data.imageUrl && data.imageUrl !== editingPrompt.imageUrl) {
        // New image uploaded, need to move from temp to permanent ID
        const tempId = `temp_${data.imageUrl.split('/').pop()}`;
        try {
          const blob = await imageStorage.getImage(tempId);
          if (blob) {
            await imageStorage.saveImage(promptId, blob);
            await imageStorage.deleteImage(tempId);
          }
        } catch (error) {
          console.error('Error updating image:', error);
        }
      } else if (!data.imageUrl && editingPrompt.imageUrl) {
        // Image was removed
        await imageStorage.deleteImage(promptId);
      }

      newPrompts = prompts.map(p => p.id === editingPrompt.id ? {
        ...p,
        ...data,
        updatedAt: now
      } : p);
    } else {
      // Create
      promptId = crypto.randomUUID();

      // If there's an image, move it from temp to permanent ID
      if (data.imageUrl && tempImageId) {
        try {
          const blob = await imageStorage.getImage(tempImageId);
          if (blob) {
            await imageStorage.saveImage(promptId, blob);
            await imageStorage.deleteImage(tempImageId);
          }
        } catch (error) {
          console.error('Error saving image:', error);
        }
      }

      const newPrompt: Prompt = {
        id: promptId,
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
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;

    // Delete associated image from IndexedDB
    try {
      await imageStorage.deleteImage(deleteConfirmId);
    } catch (error) {
      console.error('Error deleting image:', error);
    }

    const newPrompts = prompts.filter(p => p.id !== deleteConfirmId);
    setPrompts(newPrompts);
    if (newPrompts.length === 0) localStorage.removeItem('talqena_prompts_v1'); // clean up if empty
    else savePrompts(newPrompts);

    setDeleteConfirmId(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleToggleFavorite = (id: string) => {
    setPrompts(prompts.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage('Prompt copied to clipboard!');
  };

  const openCreate = () => {
    setEditingPrompt(null);
    setIsFormOpen(true);
  };

  const openEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsFormOpen(true);
  };

  const handleBulkUploadFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the file and open the options dialog
    setPendingFile(file);
    setIsBulkUploadDialogOpen(true);

    // Reset input
    e.target.value = '';
  };

  const handleBulkUploadConfirm = async (options: BulkUploadOptions) => {
    if (!pendingFile) return;

    try {
      const text = await pendingFile.text();
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

      if (lines.length === 0) {
        alert('No prompts found in file.');
        setIsBulkUploadDialogOpen(false);
        setPendingFile(null);
        return;
      }

      const now = Date.now();
      const newPrompts: Prompt[] = lines.map((line, index) => ({
        id: crypto.randomUUID(),
        title: `Imported Prompt ${index + 1}`,
        content: line,
        description: options.description,
        category: options.category,
        tags: options.tags,
        createdAt: now + index,
        updatedAt: now + index,
        isFavorite: false
      }));

      setPrompts([...newPrompts, ...prompts]);
      // alert(`Successfully imported ${newPrompts.length} prompts!`);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Failed to read file. Please try again.');
    }

    // Close dialog and reset
    setIsBulkUploadDialogOpen(false);
    setPendingFile(null);
  };

  const handleBulkUploadCancel = () => {
    setIsBulkUploadDialogOpen(false);
    setPendingFile(null);
  };

  const handleDeleteAllPrompts = () => {
    setIsSettingsOpen(false);
    setShowDeleteAllConfirm(true);
  };

  const confirmDeleteAll = async () => {
    // Delete all images from IndexedDB
    try {
      const allImageIds = await imageStorage.getAllImageIds();
      for (const id of allImageIds) {
        await imageStorage.deleteImage(id);
      }
    } catch (error) {
      console.error('Error deleting images:', error);
    }

    setPrompts([]);
    localStorage.removeItem('talqena_prompts_v1');
    setShowDeleteAllConfirm(false);
    setToastMessage('All prompts deleted successfully');
  };

  const cancelDeleteAll = () => {
    setShowDeleteAllConfirm(false);
  };

  // Filtering Logic
  const filteredPrompts = useMemo(() => {
    return prompts.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.content.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(filters.search.toLowerCase()));
      const matchesCategory = filters.category === 'All' || p.category === filters.category;
      const matchesFavorite = !filters.favoritesOnly || p.isFavorite;
      const matchesTag = !filters.tag || p.tags.includes(filters.tag);

      return matchesSearch && matchesCategory && matchesFavorite && matchesTag;
    });
  }, [prompts, filters]);

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex font-sans">

      {/* Sidebar */}
      <div className={`md:block fixed z-50 md:z-0 h-full`}>
        <Sidebar
          selectedCategory={filters.category}
          onSelectCategory={(c) => {
            setFilters({ ...filters, category: c });
          }}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onNewPrompt={openCreate}
        />
      </div>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} p-4 md:p-8 min-h-screen flex flex-col`}>

        {/* Top Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-xl mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text-dim" size={18} />
            <input
              type="text"
              placeholder="Search"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full bg-theme-element border border-theme-border rounded-xl py-2.5 pl-10 pr-4 text-theme-text focus:ring-2 focus:ring-theme-accent focus:border-transparent outline-none transition-all placeholder-theme-text-dim"
            />
          </div>

          <div className="flex items-center gap-4">

            <button
              onClick={openCreate}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
            >
              <Plus size={18} className="stroke-[3]" />
              <span>New Prompt</span>
            </button>

            <input
              type="file"
              accept=".txt"
              onChange={handleBulkUploadFileSelect}
              className="hidden"
              id="bulk-upload-input"
            />
            <button
              onClick={() => document.getElementById('bulk-upload-input')?.click()}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-theme-element border border-theme-border text-theme-text hover:bg-theme-border transition-colors"
              title="Bulk Upload from TXT"
            >
              <Upload size={18} />
              <span>Bulk Upload</span>
            </button>

            <button
              onClick={() => setFilters(f => ({ ...f, favoritesOnly: !f.favoritesOnly }))}
              className={`p-2 rounded-lg transition-colors ${filters.favoritesOnly ? 'text-yellow-400 bg-yellow-400/10' : 'text-theme-text-dim hover:text-theme-text hover:bg-theme-element'}`}
              title="Toggle Favorites"
            >
              <Star size={20} fill={filters.favoritesOnly ? "currentColor" : "none"} />
            </button>

            <div className="h-8 w-px bg-theme-border mx-1 hidden md:block"></div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-theme-text-dim hover:text-theme-text hover:bg-theme-element rounded-lg transition-colors relative"
              title="Settings"
            >
              <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full border-2 border-theme-bg"></div>
              <SlidersHorizontal size={20} />
            </button>

            <button className="p-2 text-theme-text-dim hover:text-theme-text hover:bg-theme-element rounded-lg transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-black font-bold text-xs">
                M
              </div>
            </button>

          </div>
        </header>

        {/* Stats / Info */}
        <div className="mb-6 flex items-center text-sm text-slate-500 gap-4">
          <span>{filteredPrompts.length} Prompts found</span>
          <span>{filteredPrompts.length} Prompts found</span>
          {filters.category !== 'All' && <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-slate-500"></div> Category: {filters.category}</span>}
          {filters.tag && (
            <button
              onClick={() => setFilters({ ...filters, tag: undefined })}
              className="flex items-center gap-1 px-2 py-0.5 bg-theme-accent/10 text-theme-accent rounded-full hover:bg-theme-accent/20 transition-colors"
            >
              Tag: #{filters.tag} <X size={12} />
            </button>
          )}
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
                onSelectTag={(tag) => setFilters({ ...filters, tag })}
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

      {/* Modals */}
      {isFormOpen && (
        <PromptForm
          initialData={editingPrompt || undefined}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
          availableTags={Array.from(new Set(prompts.flatMap(p => p.tags)))}
        />
      )}

      {isBulkUploadDialogOpen && (
        <BulkUploadDialog
          onConfirm={handleBulkUploadConfirm}
          onCancel={handleBulkUploadCancel}
          availableTags={Array.from(new Set(prompts.flatMap(p => p.tags)))}
        />
      )}

      {deleteConfirmId && (
        <ConfirmDialog
          title="Delete Prompt"
          message="Are you sure you want to delete this prompt? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          variant="danger"
        />
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      {isSettingsOpen && (
        <SettingsDialog
          onClose={() => setIsSettingsOpen(false)}
          onDeleteAllPrompts={handleDeleteAllPrompts}
          promptCount={prompts.length}
        />
      )}

      {showDeleteAllConfirm && (
        <ConfirmDialog
          title="Delete All Prompts"
          message={`Are you sure you want to delete all ${prompts.length} prompts? This action cannot be undone.`}
          confirmText="Delete All"
          cancelText="Cancel"
          onConfirm={confirmDeleteAll}
          onCancel={cancelDeleteAll}
          variant="danger"
        />
      )}
    </div>
  );
};

export default App;