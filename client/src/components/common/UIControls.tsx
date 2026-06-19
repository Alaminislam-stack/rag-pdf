import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

// ============================================================================
// SLEEK REUSABLE BUTTON
// ============================================================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-bold font-sans rounded-xl transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50 shrink-0 cursor-pointer';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-150 dark:shadow-none',
    secondary: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/30 dark:text-indigo-300',
    outline: 'border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-350',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-100 dark:shadow-none',
    ghost: 'hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-white'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs md:text-sm px-4.5 py-2.5 gap-2',
    lg: 'text-sm md:text-base px-6 py-3 gap-2.5'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-current" />
      ) : null}
      {children}
    </button>
  );
};

// ============================================================================
// STYLED FORM INPUT
// ============================================================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 text-slate-400 dark:text-slate-500">
            {icon}
          </div>
        )}
        <input
          className={`w-full text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-600 ${
            icon ? 'pl-10' : 'pl-3.5'
          } ${error ? 'border-rose-500 focus:ring-rose-500/20' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-[11px] font-semibold text-rose-500">
          {error}
        </span>
      )}
    </div>
  );
};

// ============================================================================
// INTERACTIVE PREMIUM CARD
// ============================================================================
interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverElevation?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  description,
  headerAction,
  footer,
  className = '',
  onClick,
  hoverElevation = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-white dark:bg-slate-900 border border-slate-150/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col ${
        hoverElevation ? 'hover:shadow-md hover:-translate-y-0.5 hover:border-slate-250 transition-all duration-200 cursor-pointer' : ''
      } ${className}`}
    >
      {/* Card Header section if text exists */}
      {(title || description || headerAction) && (
        <div className="p-4.5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 shrink-0">
          <div className="flex flex-col">
            {title && <h3 className="font-bold text-sm md:text-base text-slate-800 dark:text-white leading-snug">{title}</h3>}
            {description && <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{description}</p>}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      {/* Main content layer */}
      <div className="p-4.5 flex-1 select-text text-sm">
        {children}
      </div>

      {/* Optional Card Footer */}
      {footer && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 shrink-0">
          {footer}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// DATA TABLES CONTAINER
// ============================================================================
interface TableColumn<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T>({
  columns,
  data,
  emptyMessage = 'No matching information found',
  onRowClick
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto border border-slate-150 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 scrollbar-thin">
      <table className="w-full text-left border-collapse table-auto">
        <thead>
          <tr className="border-b border-slate-150 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/35">
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={`p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-12 text-center text-sm font-semibold text-slate-400 leading-snug">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr 
                key={rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors text-xs md:text-sm font-medium ${
                  onRowClick ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer' : ''
                }`}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`p-4 text-slate-700 dark:text-slate-300 leading-normal ${col.className || ''}`}>
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// STYLED REUSABLE PAGINATION
// ============================================================================
interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (p: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPage,
  onPageChange
}) => {
  if (totalPage <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-xs text-slate-400 font-bold">
        Page {currentPage} of {totalPage}
      </span>
      <div className="flex gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8.5 w-8.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center justify-center disabled:opacity-40 select-none cursor-pointer text-slate-600 dark:text-slate-400 transition-transform active:scale-90"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPage }).map((_, idx) => {
          const pageNum = idx + 1;
          const isSelected = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`h-8.5 w-8.5 rounded-lg text-xs font-bold select-none cursor-pointer transition-colors ${
                isSelected 
                  ? 'bg-indigo-600 text-white' 
                  : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(Math.min(totalPage, currentPage + 1))}
          disabled={currentPage === totalPage}
          className="h-8.5 w-8.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center justify-center disabled:opacity-40 select-none cursor-pointer text-slate-600 dark:text-slate-400 transition-transform active:scale-90"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// LOADING SPINNER INDICATORS
// ============================================================================
export const Loader: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 
        className="animate-spin text-indigo-600 dark:text-indigo-400 shrink-0" 
        style={{ width: size, height: size }}
      />
    </div>
  );
};
