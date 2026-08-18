import { forwardRef, type SelectHTMLAttributes } from "react";

interface SeletorProps extends SelectHTMLAttributes<HTMLSelectElement> {
  rotulo: string;
  erro?: string;
}

export const Seletor = forwardRef<HTMLSelectElement, SeletorProps>(
  ({ rotulo, erro, id, className = "", children, ...props }, ref) => {
    const seletorId = id ?? rotulo.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={seletorId} className="text-sm font-medium text-text">
          {rotulo}
        </label>
        <select
          ref={ref}
          id={seletorId}
          className={`rounded-lg border bg-white px-3.5 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-soft ${
            erro ? "border-red-300" : "border-border"
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        {erro && <span className="text-xs text-red-600">{erro}</span>}
      </div>
    );
  }
);

Seletor.displayName = "Seletor";
