import React from 'react';
import { Button } from './Button';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'danger'
}) => {
    const iconColor = variant === 'danger' ? 'text-red-500' : variant === 'warning' ? 'text-yellow-500' : 'text-blue-500';
    const iconBg = variant === 'danger' ? 'bg-red-500/10' : variant === 'warning' ? 'bg-yellow-500/10' : 'bg-blue-500/10';

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b border-theme-border flex justify-between items-start">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${iconBg} ${iconColor}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-theme-text mb-1">
                                {title}
                            </h2>
                            <p className="text-sm text-theme-text-dim">
                                {message}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-theme-text-dim hover:text-theme-text transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Footer */}
                <div className="p-6 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onCancel}>
                        {cancelText}
                    </Button>
                    <Button variant="danger" onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};
