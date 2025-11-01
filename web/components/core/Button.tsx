// src/components/Button.tsx
import React from 'react';

// --- 1. Define Types (Updated) ---

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

// Define the component's props, extending standard button props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  // NEW: Optional loading state
  isLoading?: boolean;
}

// --- 2. Spinner Component ---

/**
 * Minimal Tailwind CSS spinner.
 */
const Spinner: React.FC = () => (
  <svg
    className="animate-spin h-5 w-5 mr-3 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);


// --- 3. Define Base Styles and Logic ---

const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:ring-indigo-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-400',
  ghost: 'bg-transparent text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 focus:ring-indigo-500 border border-transparent',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

// --- 4. The Button Component (Updated) ---

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false, // Default to not loading
  className = '',
  ...rest
}) => {
  // Disable the button if it is in a loading state
  const isDisabled = rest.disabled || isLoading;

  // Combine all the relevant Tailwind classes
  const classes = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : 'w-auto',
    className,
  ].join(' ');

  return (
    <button
      className={classes}
      disabled={isDisabled}
      {...rest}
    >
      {/* Show the spinner and hide the children content when loading */}
      {isLoading ? (
        <>
          <Spinner />
          {/* Optional: Show a "Loading..." message, or just the spinner */}
          <span>Loading...</span>
        </>
      ) : (
        // Show the children content when not loading
        children
      )}
    </button>
  );
};

export default Button;