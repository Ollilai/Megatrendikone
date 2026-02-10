import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
    fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', isLoading, fullWidth, children, disabled, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            primary: 'bg-gradient-to-r from-[#324e1d] to-[#3b75af] hover:from-[#3d6223] hover:to-[#5a8bc4] text-white shadow-lg hover:shadow-glow-green transform hover:-translate-y-0.5',
            secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-900 border border-slate-300 hover:border-slate-400',
            outline: 'border-2 border-slate-300 hover:border-primary-600 text-slate-600 hover:text-slate-900 bg-transparent',
            ghost: 'bg-transparent hover:bg-slate-200/50 text-slate-600 hover:text-slate-900',
        };

        const sizes = 'px-6 py-3 text-base';
        const width = fullWidth ? 'w-full' : '';

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes} ${width} ${className}`}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Ladataan...</span>
                    </div>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';
