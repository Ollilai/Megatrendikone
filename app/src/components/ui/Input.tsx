import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, fullWidth, id, ...props }, ref) => {
        const width = fullWidth ? 'w-full' : '';

        return (
            <div className={`${width} mb-4`}>
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-left text-sm font-medium text-slate-300 mb-2"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={`
                        ${width} px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 
                        focus:outline-none focus:ring-4 transition-all duration-200
                        ${error
                            ? 'border-error ring-error/20 focus:border-error focus:ring-error/20'
                            : 'border-slate-600 focus:border-primary-500 focus:ring-primary-500/20'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${className}
                    `}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    {...props}
                />
                {error && (
                    <p
                        id={`${id}-error`}
                        className="text-error text-sm mt-1 animate-slide-up"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
