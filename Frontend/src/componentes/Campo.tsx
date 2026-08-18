import { forwardRef, type InputHTMLAttributes } from "react";

interface CampoProps extends InputHTMLAttributes<HTMLInputElement> {
  rotulo: string;
  erro?: string;
}

export const Campo = forwardRef<HTMLInputElement, CampoProps>(
  ({ rotulo, erro, id, className = "", ...props }, ref) => {
    const campoId = id ?? rotulo.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={campoId} className="text-sm font-medium text-text">
          {rotulo}
        </label>
        <input
          ref={ref}
          id={campoId}
          className={`rounded-lg border px-3.5 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary-soft ${
            erro ? "border-red-300" : "border-border"
          } ${className}`}
          {...props}
        />
        {erro && <span className="text-xs text-red-600">{erro}</span>}
      </div>
    );
  }
);

Campo.displayName = "Campo";
