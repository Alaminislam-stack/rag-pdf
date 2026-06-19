import React, { useEffect } from 'react';
import { X, Inbox } from 'lucide-react';
import { Button } from './UIControls';

// ============================================================================
// STYLED FLOATING MODAL
// ============================================================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'md'
}) => {
  // Prevent body overflow when modal is loaded
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const widths = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay with blur effect */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
      />
      
      {/* Modal Card body */}
      <div className={`w-full overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-2xl z-20 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 ${widths[maxWidth]}`}>
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <h3 className="font-bold text-base md:text-lg text-slate-800 dark:text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content body with custom scrolling */}
        <div className="p-6 overflow-y-auto flex-1 text-sm text-slate-655 font-medium leading-relaxed">
          {children}
        </div>

        {/* Bottom Footer actions */}
        {footer && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/30 flex justify-end gap-2.5 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// FLEXIBLE DROPDOWN SELECTOR MENU
// ============================================================================
interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right'
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleOutsideClick = () => setIsOpen(false);
    if (isOpen) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1.5 w-48 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-705 shadow-xl p-1 z-30 flex flex-col gap-0.5 animate-in fade-in duration-150`}>
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`w-full text-left rounded-lg text-xs font-semibold px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer ${
                item.danger 
                  ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20' 
                  : 'text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
              }`}
            >
              {item.icon && <div className="shrink-0">{item.icon}</div>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SHIMMERING SKELETON PLACEHOLDER
// ============================================================================
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text'
}) => {
  const types = {
    text: 'h-3 w-5/6 rounded',
    rect: 'h-24 w-full rounded-2xl',
    circle: 'h-10 w-10 rounded-full shrink-0'
  };

  return (
    <div className={`animate-pulse bg-slate-200/80 dark:bg-slate-800 ${types[variant]} ${className}`} />
  );
};

// ============================================================================
// PREMIUM ELEGANT EMPTY STATE WIDGET
// ============================================================================
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <Inbox className="h-10 w-10 text-slate-300" />,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/40 w-full">
      <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-750">
        {icon}
      </div>
      <h3 className="text-sm md:text-base font-bold text-slate-800 dark:text-white leading-snug">{title}</h3>
      <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm leading-normal">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm" className="mt-4">
          {actionText}
        </Button>
      )}
    </div>
  );
};
