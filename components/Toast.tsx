
import React from 'react';
import { ToastType } from '../contexts/ToastContext';

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

const ICONS: Record<ToastType, React.ReactNode> = {
    success: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    error: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    info: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

const BG_COLORS: Record<ToastType, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
    const [isExiting, setIsExiting] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
        }, 4000); // Auto-dismiss after 4 seconds

        return () => clearTimeout(timer);
    }, []);

    React.useEffect(() => {
        if (isExiting) {
            const timer = setTimeout(onDismiss, 300); // Duration of the exit animation
            return () => clearTimeout(timer);
        }
    }, [isExiting, onDismiss]);

    const handleDismissClick = () => {
        setIsExiting(true);
    };

    const baseClasses = 'w-full max-w-sm p-4 rounded-lg shadow-lg text-white flex items-center space-x-3 transition-all duration-300 transform';
    const animationClasses = isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100';

    return (
        <div className={`${baseClasses} ${BG_COLORS[type]} ${animationClasses}`}>
            <div>{ICONS[type]}</div>
            <p className="flex-grow font-medium">{message}</p>
            <button onClick={handleDismissClick} className="p-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default Toast;