import React, { useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'success',
    duration = 3000,
    onClose
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle size={20} className="text-green-500" />,
        error: <AlertCircle size={20} className="text-red-500" />,
        info: <Info size={20} className="text-blue-500" />
    };

    const bgColors = {
        success: 'bg-green-500/10 border-green-500/20',
        error: 'bg-red-500/10 border-red-500/20',
        info: 'bg-blue-500/10 border-blue-500/20'
    };

    return (
        // Position: Change 'top-6' (vertical offset) and 'right-6' (horizontal offset)
        // Examples: top-4, top-8, top-12 for vertical | right-4, right-8, right-12 for horizontal
        <div className="fixed top-24 right-6 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${bgColors[type]} bg-theme-card backdrop-blur-sm shadow-2xl min-w-[300px] max-w-md`}>
                {icons[type]}
                <p className="flex-1 text-sm text-theme-text font-medium">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="text-theme-text-dim hover:text-theme-text transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};
