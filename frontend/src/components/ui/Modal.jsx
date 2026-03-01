import React from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "lg",
  noFooter = false,
}) => {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-[4px] animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative w-full bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-500",
          maxWidthClasses[maxWidth],
        )}
      >
        {/* Mobile Pull Indicator */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-50 bg-gray-50/20 rounded-t-[2.5rem]">
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {children}
        </div>

        {/* Footer */}
        {!noFooter && footer && (
          <div className="p-6 sm:p-8 border-t border-gray-50 flex flex-col sm:flex-row justify-end gap-3 bg-gray-50/20 rounded-b-[2.5rem] pb-10 sm:pb-8">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
