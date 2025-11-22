import React from 'react';
import { Button } from './Button';
import { X, Trash2, AlertTriangle } from 'lucide-react';

interface SettingsDialogProps {
    onClose: () => void;
    onDeleteAllPrompts: () => void;
    promptCount: number;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
    onClose,
    onDeleteAllPrompts,
    promptCount
}) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b border-theme-border flex justify-between items-center">
                    <h2 className="text-xl font-bold text-theme-text">
                        Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-theme-text-dim hover:text-theme-text transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Danger Zone */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-theme-text flex items-center gap-2">
                            <AlertTriangle size={16} className="text-red-500" />
                            Danger Zone
                        </h3>

                        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-theme-text mb-1">
                                        Delete All Prompts
                                    </h4>
                                    <p className="text-xs text-theme-text-dim">
                                        Permanently delete all {promptCount} prompts. This action cannot be undone.
                                    </p>
                                </div>
                                <Button
                                    variant="danger"
                                    onClick={onDeleteAllPrompts}
                                    icon={<Trash2 size={14} />}
                                >
                                    Delete All
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Future settings can be added here */}

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-theme-border flex justify-end">
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};
