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
                        className="block text-left text-sm font-medium text-slate-700 mb-2"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={`
                        ${width} px-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 
                        focus:outline-none focus:ring-4 transition-all duration-200
                        ${error
                            ? 'border-error ring-error/20 focus:border-error focus:ring-error/20'
                            : 'border-slate-300 focus:border-primary-600 focus:ring-primary-600/20'
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
