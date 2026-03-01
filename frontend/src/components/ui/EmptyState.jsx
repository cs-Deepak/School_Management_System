import React from "react";
import { Inbox } from "lucide-react";
import Button from "./Button";
import { cn } from "../../utils/cn";

const EmptyState = ({
  icon: Icon = Inbox,
  title = "No data found",
  description = "There are no records to display at the moment.",
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in-95 duration-500",
        className,
      )}
    >
      <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner">
        <Icon size={48} className="opacity-20" />
      </div>
      <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-400 font-medium max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <Button
          onClick={onAction}
          className="rounded-2xl px-8 shadow-lg shadow-indigo-100"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
