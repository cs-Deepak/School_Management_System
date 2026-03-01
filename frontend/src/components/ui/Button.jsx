import React from "react";
import { cn } from "../../utils/cn";

const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  icon: Icon,
  ...props
}) => {
  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm active:transform active:scale-95",
    secondary:
      "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 active:bg-gray-100",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200",
    danger:
      "bg-red-600 text-white hover:bg-red-700 shadow-sm active:transform active:scale-95",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs h-10 sm:h-9",
    md: "px-6 py-3 text-sm h-14 sm:h-11",
    lg: "px-8 py-4 text-base h-16 sm:h-14",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        variants[variant],
        sizes[size],
        (disabled || loading) &&
          "opacity-60 cursor-not-allowed pointer-events-none",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
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
      ) : (
        Icon && <Icon size={size === "sm" ? 16 : 18} />
      )}
      {children}
    </button>
  );
};

export default Button;
